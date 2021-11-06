import {createReducer, on} from '@ngrx/store';

import {createMovieSuccess, retrieveMoviesSuccessful} from './movies.actions';
import {Movie} from "../models/movie";

export const initialState: ReadonlyArray<Movie> = [];

export const moviesReducer = createReducer(
  initialState,
  on(retrieveMoviesSuccessful, (state, { movies} ) => [...movies]),
  on(createMovieSuccess, (state,{movie}) => [...state,movie])
);
