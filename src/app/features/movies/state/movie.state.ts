import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Genre, Movie } from '../types/movie.type';
import { SavedMarathon } from '../services/storage/marathon-storage.service';

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
  marathon: Movie[];
  marathonTotalMinutes: number;
  generatorMovies: Movie[];
  savedMarathons: SavedMarathon[]; 
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
  marathon: [],
  marathonTotalMinutes: 0,
  generatorMovies: [],
  savedMarathons: [],
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

  private computeMarathonTotalMinutes(marathon: Movie[]): number {
    return marathon.reduce((acc, m) => acc + (m.runtime ?? 0), 0);
  }

  addToMarathon(movie: Movie) {
    const current = this.getState();
    if (current.marathon.some(m => m.id === movie.id)) {
      return;
    }
    const marathon = [...current.marathon, movie];
    const marathonTotalMinutes = this.computeMarathonTotalMinutes(marathon);
    this.setState({ marathon, marathonTotalMinutes });
  }
  removeFromMarathon(movieId: number) {
    const current = this.getState();
    const marathon = current.marathon.filter(m => m.id !== movieId);
    const marathonTotalMinutes = this.computeMarathonTotalMinutes(marathon);
    this.setState({ marathon, marathonTotalMinutes });
  }

  setGeneratorMovies(movies: Movie[]) {
    this.setState({ generatorMovies: movies });
  }

  setSavedMarathons(savedMarathons: SavedMarathon[]) {
    this.setState({ savedMarathons });
  }

}
