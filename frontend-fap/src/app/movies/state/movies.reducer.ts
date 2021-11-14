import {createReducer, on} from '@ngrx/store';
import * as MovieActions from './movies.actions';
import {AppState} from "../../app.state";


export const initialState: AppState = {
  movies: [],
  selectedMovie: null,
  searchTerm: ""
};

export const moviesReducer = createReducer(
  initialState,
  on(MovieActions.loadMovies, (state) => (state)),
  on(MovieActions.loadedMoviesSuccess, (state, {movies}) => ({...state, movies: [...state.movies, ...movies]})),
  on(MovieActions.createMovie, (state) => (state)),
  on(MovieActions.createdMovieSuccess, (state, {movie}) => ({...state, movies: [...state.movies, movie]})),
  on(MovieActions.setSelectedMovie, (state, {selectedMovie}) => ({...state, selectedMovie})),
  //on(MovieActions.setSearchTerm, (state, action) => ({...state, searchTerm: action.searchTerm})),
);
