import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Movie} from "../models/movie";

export const selectMovies = createFeatureSelector<ReadonlyArray<Movie>>('movies');

export const selectCollectionState = createFeatureSelector<ReadonlyArray<number>>('collection');

export const selectMovieCollection = createSelector(
  selectMovies,
  selectCollectionState,
  (movies, collection) => {
    return collection.map((id) => movies.find((movie) => movie.id === id)); // not in use currently, used for retrieving slices of stored data
  }
);
