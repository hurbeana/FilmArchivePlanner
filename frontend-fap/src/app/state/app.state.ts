import {Movie} from "../models/movie";

export interface AppState {
  movies: ReadonlyArray<Movie>;
  //collection: ReadonlyArray<number>;
}
