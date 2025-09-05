import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';

export const MOVIE_ROUTES: Routes = [
  {
    path: '',
    component: MovieListComponent
  }
];
