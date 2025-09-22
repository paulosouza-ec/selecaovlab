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

  genres: Genre[] = [];
  resultsItems: CarouselItem[] = [];
  marathonItems: CarouselItem[] = [];
  marathonTotalText = '0h 0m';

  ngOnInit() {
    this.facade.loadGenres();
    this.bindControls();
    this.facade.discover();
    this.facade.movies$.subscribe(state => {
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
  }

  onAddToMarathon(itemId: number) {
    const s = this.facade.getState();
    const movie = s.movies.find(m => m.id === itemId);
    if (movie) {
      this.facade.addMovieToMarathon(movie);
    }
  }

  onRemoveFromMarathon(itemId: number) {
    this.facade.removeMovieFromMarathon(itemId);
  }
}
