import { Injectable } from '@angular/core';
import { Movie } from '../../types/movie.type';

export interface SavedMarathon {
  id: string; // Using a timestamp for a unique ID
  name: string;
  movies: Movie[];
  totalMinutes: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MarathonStorageService {
  private readonly STORAGE_KEY = 'saved_marathons';

  getSavedMarathons(): SavedMarathon[] {
    try {
      const marathonsJson = localStorage.getItem(this.STORAGE_KEY);
      if (!marathonsJson) {
        return [];
      }
      return JSON.parse(marathonsJson) as SavedMarathon[];
    } catch (e) {
      console.error('Error reading marathons from localStorage', e);
      return [];
    }
  }

  saveMarathon(marathon: SavedMarathon): void {
    try {
      const marathons = this.getSavedMarathons();
      marathons.push(marathon);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(marathons));
    } catch (e) {
      console.error('Error saving marathon to localStorage', e);
    }
  }

  deleteMarathon(marathonId: string): void {
    try {
      let marathons = this.getSavedMarathons();
      marathons = marathons.filter(m => m.id !== marathonId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(marathons));
    } catch (e) {
      console.error('Error deleting marathon from localStorage', e);
    }
  }
}