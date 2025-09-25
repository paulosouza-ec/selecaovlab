import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../../types/movie.type';

// Tipagem para os dados que vêm da API (o backend usa 'id' como string)
export interface SavedMarathonFromApi {
  id: string;
  name: string;
  movies: Movie[];
  totalMinutes: number;
  createdAt: string; // Vem como string ISO
}

// Tipagem para os dados enviados para a API
export interface CreateMarathonDto {
  name: string;
  movies: Movie[];
  totalMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class MarathonApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/marathons';

  getMarathons(): Observable<SavedMarathonFromApi[]> {
    return this.http.get<SavedMarathonFromApi[]>(this.apiUrl);
  }

  createMarathon(data: CreateMarathonDto): Observable<SavedMarathonFromApi> {
    return this.http.post<SavedMarathonFromApi>(this.apiUrl, data);
  }

  deleteMarathon(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}