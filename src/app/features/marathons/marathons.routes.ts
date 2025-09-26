import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const MARATHON_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/my-marathons/my-marathons.component').then(m => m.MyMarathonsComponent),
    canActivate: [authGuard]
  }
];
