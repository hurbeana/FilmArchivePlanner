import { createSelector, createFeatureSelector } from '@ngrx/store';
import {Movie} from "../models/movie";

export const selectMovies = createFeatureSelector<ReadonlyArray<Movie>>('movies');

export const selectMovieCollection = createSelector(
  selectMovies,
  (movies) => {
    return movies; //TODO: implement filter logic here?
  }
);

