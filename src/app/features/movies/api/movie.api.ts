import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenreResponse, MovieResponse } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private http = inject(HttpClient);
  private readonly apiKey = process.env["NG_APP_API_KEY"];
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  getPopularMovies(page = 1): Observable<MovieResponse> {
    console.log(this.apiKey)
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
}
