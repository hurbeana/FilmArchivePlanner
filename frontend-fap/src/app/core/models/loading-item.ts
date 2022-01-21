import { Director } from '../../directors/models/director';
import { Movie } from '../../movies/models/movie';

export interface LoadingItem {
  title: string;
}

export function isMovie(item: Movie | Director): item is Movie {
  return (item as Movie).originalTitle !== undefined;
}
export function isDirector(item: Movie | Director): item is Director {
  return (item as Director).lastName !== undefined;
}
