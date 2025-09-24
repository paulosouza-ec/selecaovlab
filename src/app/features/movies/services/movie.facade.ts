import { Injectable, inject } from '@angular/core';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Movie } from '../types/movie.type';
import { MarathonStorageService, SavedMarathon } from './storage/marathon-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MovieFacade {
  private api = inject(MovieApiService);
  private state = inject(MovieStateService);
  private storage = inject(MarathonStorageService);

  movies$ = this.state.movies$;
  getState = () => this.state.getState();

  loadPopularMovies(page = 1) {
    this.state.setLoading(true);
    this.api.getPopularMovies(page).pipe(
      tap(response => {
        this.state.setMovies(response.results);
        this.state.setPagination(response.page, response.total_pages);
        this.state.setLoading(false);
      }),
      catchError(err => {
        this.state.setError('Failed to load popular movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  searchMovies(query: string, page = 1) {
    this.state.setLoading(true);
    this.api.searchMovies(query, page).pipe(
      tap(response => {
        this.state.setMovies(response.results);
        this.state.setPagination(response.page, response.total_pages);
        this.state.setLoading(false);
      }),
      catchError(err => {
        this.state.setError('Failed to search movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  loadGenres() {
    this.api.getGenres().pipe(
      tap(res => this.state.setGenres(res.genres)),
      catchError(err => of(null))
    ).subscribe();
  }

  setFilters({ name, genreIds, year }: { name?: string; genreIds?: number[]; year?: string }) {
    this.state.setFilters({ name, genreIds, year });
  }

  setSort(sort: 'release_date' | 'vote_average' | 'title' | 'runtime' | 'popularity') {
    this.state.setSortBy(sort);
  }

  discover(page = 1) {
    const s = this.getState();
    const sortMap: Record<typeof s.sortBy, string> = {
      release_date: 'primary_release_date.desc',
      vote_average: 'vote_average.desc',
      title: 'original_title.asc',
      runtime: 'runtime.desc',
      popularity: 'popularity.desc'
    } as const;

    this.state.setLoading(true);
    this.api.discoverMovies({
      page,
      with_genres: s.filters.genreIds?.join(',') || undefined,
      primary_release_year: s.filters.year,
      sort_by: sortMap[s.sortBy]
    }).pipe(
      tap(response => {
        this.state.setMovies(response.results);
        this.state.setPagination(response.page, response.total_pages);
        this.state.setLoading(false);
      }),
      catchError(err => {
        this.state.setError('Failed to load discover results.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  addMovieToMarathon(movie: Movie) {
    if (movie.runtime != null) {
      this.state.addToMarathon(movie);
      return;
    }
    this.api.getMovieDetails(movie.id).pipe(
      tap(full => this.state.addToMarathon({ ...movie, runtime: full.runtime })),
      catchError(err => {
        this.state.addToMarathon({ ...movie, runtime: 0 });
        return of(null);
      })
    ).subscribe();
  }

  removeMovieFromMarathon(movieId: number) {
    this.state.removeFromMarathon(movieId);
  }

  generateByPerson(name: string, role: 'actor' | 'director' | 'any' = 'any') {
    if (!name || name.trim().length === 0) {
      this.state.setGeneratorMovies([]);
      return;
    }
    this.state.setLoading(true);
    this.api.searchPerson(name).pipe(
      tap(res => {
        const person = res.results[0];
        if (!person) {
          this.state.setGeneratorMovies([]);
          this.state.setLoading(false);
          return;
        }
        this.api.getPersonMovieCredits(person.id).pipe(
          tap(credits => {
            let movies = credits.cast;
            if (role === 'director') {
              movies = credits.crew.filter((m: any) => m && (m as any).job === 'Director');
            } else if (role === 'actor') {
              movies = credits.cast;
            } else {
              movies = [...credits.cast, ...credits.crew];
            }
            // Deduplicate by id
            const uniqueMap = new Map<number, Movie>();
            for (const m of movies) uniqueMap.set(m.id, m as Movie);
            this.state.setGeneratorMovies(Array.from(uniqueMap.values()));
            this.state.setLoading(false);
          }),
          catchError(err => {
            this.state.setGeneratorMovies([]);
            this.state.setLoading(false);
            return of(null);
          })
        ).subscribe();
      }),
      catchError(err => {
        this.state.setGeneratorMovies([]);
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  loadSavedMarathons() {
    const saved = this.storage.getSavedMarathons();
    this.state.setSavedMarathons(saved);
  }

  /**
   * Saves the current marathon list to localStorage with a given name.
   */
  saveCurrentMarathon(name: string) {
    const currentState = this.getState();
    const currentMarathon = currentState.marathon;

    if (currentMarathon.length === 0) {
      alert("Sua maratona está vazia!");
      return;
    }

    const newSavedMarathon: SavedMarathon = {
      id: String(Date.now()), 
      name,
      movies: currentMarathon,
      totalMinutes: currentState.marathonTotalMinutes,
      createdAt: new Date(),
    };

    this.storage.saveMarathon(newSavedMarathon);
    this.loadSavedMarathons(); 
  }

  deleteSavedMarathon(marathonId: string) {
    if (confirm('Tem certeza que deseja excluir esta maratona?')) {
      this.storage.deleteMarathon(marathonId);
      this.loadSavedMarathons(); 
    }
  }

  loadMarathonIntoCurrent(marathon: SavedMarathon) {
    this.state.setState({
      marathon: marathon.movies,
      marathonTotalMinutes: marathon.totalMinutes
    });
  }
  
}
