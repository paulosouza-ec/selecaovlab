import { Injectable, inject } from '@angular/core';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Movie } from '../types/movie.type';
import { MarathonApiService } from './api/marathon.api.service';
import { SavedMarathon } from './storage/marathon-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MovieFacade {
  private api = inject(MovieApiService);
  private state = inject(MovieStateService);
  private marathonApi = inject(MarathonApiService);

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
    this.marathonApi.getMarathons().pipe(
      tap(marathonsFromApi => {
        const saved = marathonsFromApi.map(m => ({
            ...m,
            createdAt: new Date(m.createdAt) // Converte a string de data para um objeto Date
        }));
        this.state.setSavedMarathons(saved as SavedMarathon[]);
      }),
      catchError(err => {
        console.error('Failed to load saved marathons', err);
        this.state.setSavedMarathons([]); // Limpa em caso de erro
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Saves the current marathon list to localStorage with a given name.
   */
  saveCurrentMarathon(name: string) {
    const currentState = this.getState();
    const { marathon: movies, marathonTotalMinutes: totalMinutes } = currentState;

    if (movies.length === 0) {
      alert("Sua maratona está vazia!");
      return;
    }

    const newMarathonData = { name, movies, totalMinutes };

    this.marathonApi.createMarathon(newMarathonData).pipe(
      tap(() => {
        this.loadSavedMarathons(); // Recarrega a lista do backend
      }),
      catchError(err => {
        console.error('Failed to save marathon', err);
        alert('Ocorreu um erro ao salvar sua maratona. Tente novamente.');
        return of(null);
      })
    ).subscribe();
  }

  deleteSavedMarathon(marathonId: string) {
    if (confirm('Tem certeza que deseja excluir esta maratona?')) {
      this.marathonApi.deleteMarathon(marathonId).pipe(
        tap(() => {
          this.loadSavedMarathons(); // Recarrega a lista do backend
        }),
        catchError(err => {
          console.error('Failed to delete marathon', err);
          alert('Ocorreu um erro ao excluir sua maratona. Tente novamente.');
          return of(null);
        })
      ).subscribe();
    }
  }

  loadMarathonIntoCurrent(marathon: SavedMarathon) {
    this.state.setState({
      marathon: marathon.movies,
      marathonTotalMinutes: marathon.totalMinutes
    });
  }
  
}
