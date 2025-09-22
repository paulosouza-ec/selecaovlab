import { Injectable, inject } from '@angular/core';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieFacade {
  private api = inject(MovieApiService);
  private state = inject(MovieStateService);

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
}
