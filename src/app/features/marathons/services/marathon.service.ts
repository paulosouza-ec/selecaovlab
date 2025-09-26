import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marathon, CreateMarathonRequest, UpdateMarathonRequest } from '../types/marathon.type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarathonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/marathons`;

  getMarathons(): Observable<Marathon[]> {
    return this.http.get<Marathon[]>(this.apiUrl);
  }

  getMarathon(id: string): Observable<Marathon> {
    return this.http.get<Marathon>(`${this.apiUrl}/${id}`);
  }

  createMarathon(marathon: CreateMarathonRequest): Observable<Marathon> {
    return this.http.post<Marathon>(this.apiUrl, marathon);
  }

  updateMarathon(id: string, marathon: UpdateMarathonRequest): Observable<Marathon> {
    return this.http.put<Marathon>(`${this.apiUrl}/${id}`, marathon);
  }

  deleteMarathon(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
