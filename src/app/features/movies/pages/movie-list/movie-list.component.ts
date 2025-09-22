import { Component, OnInit, inject } from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { CarouselItem, CarouselComponent } from '@shared/components/carousel/carousel.component';
import { Genre } from '../../types/movie.type';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AsyncPipe, MovieCardComponent, ReactiveFormsModule, CarouselComponent]
})
export class MovieListComponent implements OnInit {
  facade = inject(MovieFacade);
  searchControl = new FormControl('');
  genreControl = new FormControl('');
  yearControl = new FormControl('');
  sortControl = new FormControl<'release_date' | 'vote_average' | 'title' | 'runtime' | 'popularity'>('popularity');
  generatorTypeControl = new FormControl<'actor' | 'director' | 'any'>('any');
  generatorNameControl = new FormControl('');

  genres: Genre[] = [];
  resultsItems: CarouselItem[] = [];
  marathonItems: CarouselItem[] = [];
  marathonTotalText = '0h 0m';
  generatorItems: CarouselItem[] = [];
  
  // Advanced statistics
  marathonStats = {
    totalMovies: 0,
    totalDuration: 0,
    averageRating: 0,
    genres: new Map<string, number>(),
    decades: new Map<string, number>(),
    topGenre: '',
    averageRuntime: 0
  };
  
  isLoading = false;
  showStats = false;

  ngOnInit() {
    this.facade.loadGenres();
    this.bindControls();
    this.facade.discover();
    this.facade.movies$.subscribe(state => {
      this.isLoading = state.loading;
      this.genres = state.genres;
      if (state.movies.length > 0) {
        const genreMap = new Map(state.genres.map(g => [g.id, g.name] as const));
        this.resultsItems = state.movies.map(movie => ({
          id: movie.id,
          title: movie.title,
          imgSrc: movie.poster_path,
          link: `/movie/${movie.id}`,
          rating: (movie.vote_average / 10) * 100,
          vote: movie.vote_average,
          genres: (movie.genre_ids || []).map(id => genreMap.get(id)).filter(Boolean) as string[]
        }));
      } else {
        this.resultsItems = [];
      }

      // Build marathon items and total text
      if (state.marathon.length > 0) {
        const genreMap = new Map(state.genres.map(g => [g.id, g.name] as const));
        this.marathonItems = state.marathon.map(movie => ({
          id: movie.id,
          title: movie.title,
          imgSrc: movie.poster_path,
          link: `/movie/${movie.id}`,
          rating: (movie.vote_average / 10) * 100,
          vote: movie.vote_average,
          genres: (movie.genre_ids || []).map(id => genreMap.get(id)).filter(Boolean) as string[]
        }));
      } else {
        this.marathonItems = [];
      }

      const total = state.marathonTotalMinutes || 0;
      const hours = Math.floor(total / 60);
      const minutes = total % 60;
      this.marathonTotalText = `${hours}h ${minutes}m`;

      // Calculate advanced statistics
      this.calculateMarathonStats(state.marathon, state.genres);

      // generator results
      if (state.generatorMovies.length > 0) {
        const genreMap = new Map(state.genres.map(g => [g.id, g.name] as const));
        this.generatorItems = state.generatorMovies.map(movie => ({
          id: movie.id,
          title: movie.title,
          imgSrc: movie.poster_path,
          link: `/movie/${movie.id}`,
          rating: (movie.vote_average / 10) * 100,
          vote: movie.vote_average,
          genres: (movie.genre_ids || []).map(id => genreMap.get(id)).filter(Boolean) as string[]
        }));
      } else {
        this.generatorItems = [];
      }
    });
  }

  private bindControls() {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(name => {
      this.facade.setFilters({ name: name ?? '' });
      if (name && name.trim().length > 0) {
        this.facade.searchMovies(name);
      } else {
        this.facade.discover();
      }
    });

    this.genreControl.valueChanges.pipe(startWith('')).subscribe(genreId => {
      const ids = genreId ? [Number(genreId)] : [];
      this.facade.setFilters({ genreIds: ids });
      this.facade.discover();
    });

    this.yearControl.valueChanges.pipe(startWith('')).subscribe(year => {
      this.facade.setFilters({ year: year ?? '' });
      this.facade.discover();
    });

    this.sortControl.valueChanges.pipe(startWith(this.sortControl.value)).subscribe(sort => {
      this.facade.setSort((sort as any) ?? 'popularity');
      this.facade.discover();
    });

    this.generatorTypeControl.valueChanges.pipe(startWith('any')).subscribe(() => {
      const type = (this.generatorTypeControl.value as any) || 'any';
      const name = this.generatorNameControl.value || '';
      this.facade.generateByPerson(name, type);
    });

    this.generatorNameControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(name => {
      const type = (this.generatorTypeControl.value as any) || 'any';
      this.facade.generateByPerson(name || '', type);
    });
  }

  onAddToMarathon(itemId: number) {
    const s = this.facade.getState();
    const movie = s.movies.find(m => m.id === itemId) || s.generatorMovies.find(m => m.id === itemId);
    if (movie) {
      this.facade.addMovieToMarathon(movie);
    }
  }

  onRemoveFromMarathon(itemId: number) {
    this.facade.removeMovieFromMarathon(itemId);
  }

  private calculateMarathonStats(marathon: any[], genres: Genre[]) {
    if (marathon.length === 0) {
      this.marathonStats = {
        totalMovies: 0,
        totalDuration: 0,
        averageRating: 0,
        genres: new Map(),
        decades: new Map(),
        topGenre: '',
        averageRuntime: 0
      };
      return;
    }

    const genreMap = new Map(genres.map(g => [g.id, g.name]));
    const genreCount = new Map<string, number>();
    const decadeCount = new Map<string, number>();
    
    let totalRating = 0;
    let totalRuntime = 0;

    marathon.forEach(movie => {
      // Count genres
      movie.genre_ids?.forEach((id: number) => {
        const genreName = genreMap.get(id);
        if (genreName) {
          genreCount.set(genreName, (genreCount.get(genreName) || 0) + 1);
        }
      });

      // Count decades
      if (movie.release_date) {
        const year = parseInt(movie.release_date.substring(0, 4));
        const decade = `${Math.floor(year / 10) * 10}s`;
        decadeCount.set(decade, (decadeCount.get(decade) || 0) + 1);
      }

      totalRating += movie.vote_average || 0;
      totalRuntime += movie.runtime || 0;
    });

    const topGenre = Array.from(genreCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    this.marathonStats = {
      totalMovies: marathon.length,
      totalDuration: totalRuntime,
      averageRating: totalRating / marathon.length,
      genres: genreCount,
      decades: decadeCount,
      topGenre,
      averageRuntime: totalRuntime / marathon.length
    };
  }

  toggleStats() {
    this.showStats = !this.showStats;
  }

  getGenrePercentage(genre: string): number {
    const count = this.marathonStats.genres.get(genre) || 0;
    return (count / this.marathonStats.totalMovies) * 100;
  }

  getDecadePercentage(decade: string): number {
    const count = this.marathonStats.decades.get(decade) || 0;
    return (count / this.marathonStats.totalMovies) * 100;
  }
}
