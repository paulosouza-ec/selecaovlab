import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarathonService } from '../../services/marathon.service';
import { Marathon } from '../../types/marathon.type';

@Component({
  selector: 'app-my-marathons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-marathons.component.html',
  styleUrl: './my-marathons.component.scss'
})
export class MyMarathonsComponent implements OnInit {
  private marathonService = inject(MarathonService);
  
  marathons: Marathon[] = [];
  loading = false;
  error: string | null = null;
  
  // Expor Array para o template
  Array = Array;
  
  // Para edição
  editingMarathon: Marathon | null = null;
  editName = '';
  editMovies: any[] = [];
  
  // Para confirmação de exclusão
  deletingMarathon: Marathon | null = null;

  ngOnInit() {
    this.loadMarathons();
  }

  loadMarathons() {
    this.loading = true;
    this.error = null;
    
    this.marathonService.getMarathons().subscribe({
      next: (marathons) => {
        this.marathons = marathons;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar maratonas';
        this.loading = false;
        console.error('Erro ao carregar maratonas:', error);
      }
    });
  }

  startEdit(marathon: Marathon) {
    this.editingMarathon = marathon;
    this.editName = marathon.name;
    this.editMovies = Array.isArray(marathon.movies) ? [...marathon.movies] : [];
  }

  cancelEdit() {
    this.editingMarathon = null;
    this.editName = '';
    this.editMovies = [];
  }

  saveEdit() {
    if (!this.editingMarathon || !this.editName.trim()) {
      return;
    }

    const updatedMarathon = {
      ...this.editingMarathon,
      name: this.editName.trim(),
      movies: this.editMovies,
      totalMinutes: this.calculateTotalMinutes(this.editMovies)
    };

    this.marathonService.updateMarathon(this.editingMarathon.id, updatedMarathon).subscribe({
      next: () => {
        this.loadMarathons();
        this.cancelEdit();
      },
      error: (error) => {
        this.error = 'Erro ao atualizar maratona';
        console.error('Erro ao atualizar maratona:', error);
      }
    });
  }

  confirmDelete(marathon: Marathon) {
    this.deletingMarathon = marathon;
  }

  cancelDelete() {
    this.deletingMarathon = null;
  }

  deleteMarathon() {
    if (!this.deletingMarathon) return;

    this.marathonService.deleteMarathon(this.deletingMarathon.id).subscribe({
      next: () => {
        this.loadMarathons();
        this.cancelDelete();
      },
      error: (error) => {
        this.error = 'Erro ao excluir maratona';
        console.error('Erro ao excluir maratona:', error);
      }
    });
  }

  removeMovieFromEdit(index: number) {
    this.editMovies.splice(index, 1);
  }

  private calculateTotalMinutes(movies: any[]): number {
    return movies.reduce((total, movie) => total + (movie.runtime || 0), 0);
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}
