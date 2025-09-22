import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Genre, Movie } from '../types/movie.type';

export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  genres: Genre[];
  filters: {
    name?: string;
    genreIds?: number[];
    year?: string;
  };
  sortBy: 'release_date' | 'vote_average' | 'title' | 'runtime' | 'popularity';
  _internal?: unknown;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  genres: [],
  filters: {},
  sortBy: 'popularity',
  _internal: undefined
};

@Injectable({
  providedIn: 'root'
})
export class MovieStateService {
  private readonly state = new BehaviorSubject<MovieState>(initialState);

  readonly movies$ = this.state.asObservable();

  getState() {
    return this.state.getValue();
  }

  setState(newState: Partial<MovieState>) {
    this.state.next({ ...this.getState(), ...newState });
  }

  setMovies(movies: Movie[]) {
    this.setState({ movies });
  }

  setLoading(loading: boolean) {
    this.setState({ loading });
  }

  setError(error: string | null) {
    this.setState({ error });
  }

  setPagination(page: number, totalPages: number) {
    this.setState({ page, totalPages });
  }

  setGenres(genres: Genre[]) {
    this.setState({ genres });
  }

  setFilters(filters: Partial<MovieState['filters']>) {
    this.setState({ filters: { ...this.getState().filters, ...filters } });
  }

  setSortBy(sortBy: MovieState['sortBy']) {
    this.setState({ sortBy });
  }
}
