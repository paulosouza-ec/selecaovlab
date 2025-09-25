import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'movies',
  loadChildren: () => import('./features/movies/movies.routes').then(m => m.MOVIE_ROUTES),
  canActivate: [authGuard] // Protegendo a rota

  },
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full'
  }
];