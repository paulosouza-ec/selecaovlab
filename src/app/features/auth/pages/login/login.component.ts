import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(): void {
    this.error = null;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.error = 'Credenciais inválidas. Por favor, tente novamente.';
        console.error('Login failed', err);
      }
    });
  }
}