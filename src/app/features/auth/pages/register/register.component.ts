import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // Usaremos um arquivo de estilo dedicado
})
export class RegisterComponent {
  email = '';
  password = '';
  error: string | null = null;
  success: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(): void {
    // Limpa mensagens anteriores
    this.error = null;
    this.success = null;

    this.authService.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = 'Cadastro realizado com sucesso! Redirecionando para o login...';
        // Redireciona para o login após 2 segundos para o usuário ver a mensagem
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        // Define uma mensagem de erro amigável para o usuário
        if (err.status === 400) {
            this.error = 'Este email já está em uso. Tente outro.';
        } else {
            this.error = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
        }
        console.error('Registration failed', err);
      }
    });
  }
}