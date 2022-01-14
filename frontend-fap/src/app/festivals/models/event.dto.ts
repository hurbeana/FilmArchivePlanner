import { Movie } from '../../movies/models/movie';

export interface FestivalEventDTO {
  id?: number;
  title: string;
  startDate: string;
  endDate: string;
  eventLocation: string;
  type: string;
  movie?: Movie;
  description?: string;
  festival?: number;
}
