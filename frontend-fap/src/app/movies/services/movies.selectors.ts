import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Movie} from "../models/movie";

export const selectMovies = createFeatureSelector<ReadonlyArray<Movie>>('movies');

export const selectMovieCollection = createSelector(
  selectMovies,
  (movies) => {
    return movies; //TODO: implement filter logic here?
  }
);

export const selectItemById =
  (id: number) => createSelector(selectMovies, (allItems) => {
  if (allItems) {
    return allItems.find(item => item.id === id);
  } else {
    return {};
  }
});

