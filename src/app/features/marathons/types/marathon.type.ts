export interface Marathon {
  id: string;
  name: string;
  movies: any[];
  totalMinutes: number;
  createdAt: string;
  userId: string;
}

export interface CreateMarathonRequest {
  name: string;
  movies: any[];
  totalMinutes: number;
}

export interface UpdateMarathonRequest {
  name?: string;
  movies?: any[];
  totalMinutes?: number;
}
