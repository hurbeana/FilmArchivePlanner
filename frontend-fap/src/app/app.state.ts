import {Movie} from "./movies/models/movie";

/* The state of the application*/
export interface AppState {
  movies: Movie[],
  selectedMovie: Movie|null,
  searchTerm: string
}
