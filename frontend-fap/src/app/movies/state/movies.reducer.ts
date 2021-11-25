import { createReducer, on } from '@ngrx/store';
import * as MovieActions from './movies.actions';
import { AppState } from '../../app.state';

export const initialState: AppState = {
  pagination: {
    items: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 16,
      totalPages: 0,
      currentPage: 1,
    },
  },
  searchTerm: '',
};

export const moviesReducer = createReducer(
  initialState,
  on(MovieActions.getMovies, (state) => state),
  on(MovieActions.gotMoviesSuccess, (state, { pagination }) => ({
    ...state,
    pagination: pagination,
  })),
  on(MovieActions.getMovie, (state) => state),
  on(MovieActions.gotMovieSuccess, (state, { movie }) => ({
    ...state,
    detailsMovie: movie,
  })),
  on(MovieActions.createMovie, (state) => state),
  on(MovieActions.setSelectedMovie, (state, { selectedMovie }) => ({
    ...state,
    selectedMovie,
  }))
);
