import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router'; // Adicione RouterModule
import { AuthService } from './features/auth/services/auth.service'; // Importe o AuthService
import { CommonModule } from '@angular/common'; // Importe CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule], // Adicione RouterModule e CommonModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Filmes';

  // Injete os serviços
  private authService = inject(AuthService);
  private router = inject(Router);

  // Getter para verificar o estado de login
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Método de logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}