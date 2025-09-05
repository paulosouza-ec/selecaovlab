import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../types/movie.type';

export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  _internal?: unknown;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
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
}
