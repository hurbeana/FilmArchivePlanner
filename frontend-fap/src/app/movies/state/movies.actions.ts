import {createAction, props} from '@ngrx/store';
import {Movie} from "../models/movie";
import {CreateUpdateMovieDto} from "../models/create.movie";

export const createMovie = createAction(
  '[Movie List] Add Movie',
  props<{ movie: CreateUpdateMovieDto }>()
);

export const removeMovie = createAction(
  '[Movie List] Remove Movie',
  props<{ movieId: number }>()
);

export const retrievedMovieList = createAction(
  '[Movie List] Get Movies');

export const retrieveMoviesSuccessful = createAction(
  '[Movies List] Movies Loaded Success',
  props<{ movies: ReadonlyArray<Movie> }>()
);

export const createMovieSuccess = createAction(
  '[Movie List] Update Photo Success',
  props<{ movie: Movie }>()
);

