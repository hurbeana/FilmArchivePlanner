import { Movie } from '../../movies/models/movie';

export interface FestivalEvent {
  id?: number;
  title: string;
  startDate: Date;
  endDate: Date;
  eventLocation: string;
  type: string;
  movie?: Movie;
  description?: string;
  festival?: number;
}
