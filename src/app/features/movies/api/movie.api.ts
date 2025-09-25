import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenreResponse, Movie, MovieResponse } from '../types/movie.type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private http = inject(HttpClient);
  private readonly apiKey = environment.apiKey ?? '';
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  getPopularMovies(page = 1): Observable<MovieResponse> {
    console.log('API Key:', this.apiKey ? 'Configurada' : 'NÃO CONFIGURADA');
    if (!this.apiKey || this.apiKey === 'your_tmdb_api_key_here') {
      console.error('❌ API Key do TMDB não configurada!');
      console.error('📝 Para configurar:');
      console.error('1. Acesse: https://www.themoviedb.org/settings/api');
      console.error('2. Crie uma conta gratuita');
      console.error('3. Gere uma API key');
      console.error('4. Substitua "your_tmdb_api_key_here" no arquivo src/environments/environment.ts');
    }
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`);
  }

  searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`);
  }

  getGenres(): Observable<GenreResponse> {
    return this.http.get<GenreResponse>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}`);
  }

  discoverMovies(params: {
    page?: number;
    query?: string;
    with_genres?: string; // comma-separated ids
    primary_release_year?: string;
    sort_by?: string; // e.g. 'popularity.desc'
  } = {}): Observable<MovieResponse> {
    const search = new URLSearchParams({
      api_key: this.apiKey ?? '',
      page: String(params.page ?? 1),
      with_genres: params.with_genres ?? '',
      primary_release_year: params.primary_release_year ?? '',
      sort_by: params.sort_by ?? '',
      include_adult: 'false',
      include_video: 'false',
      language: 'en-US'
    });
    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie?${search.toString()}`);
  }

  getMovieDetails(movieId: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}`);
  }

  searchPerson(query: string): Observable<{ results: { id: number; name: string; known_for_department?: string; }[] }> {
    return this.http.get<{ results: { id: number; name: string; known_for_department?: string; }[] }>(`${this.apiUrl}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
  }

  getPersonMovieCredits(personId: number): Observable<{ cast: Movie[]; crew: (Movie & { job?: string })[] }> {
    return this.http.get<{ cast: Movie[]; crew: (Movie & { job?: string })[] }>(`${this.apiUrl}/person/${personId}/movie_credits?api_key=${this.apiKey}`);
  }
}
