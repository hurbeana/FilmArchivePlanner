import { createReducer, on } from '@ngrx/store';
import * as MovieActions from './movies.actions';
import { MoviesState } from '../../app.state';

export const initialState: MoviesState = {
  pagination: {
    items: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 16,
      totalPages: 0,
      currentPage: 1,
    },
    searchString: '',
    orderBy: '',
    sortOrder: '',
  },
  selectedMovie: null,
};

export const moviesReducer = createReducer(
  initialState,
  on(MovieActions.getMovies, (state) => state),
  on(MovieActions.getMoviesSuccess, (state, { pagination }) => ({
    ...state,
    pagination: pagination,
  })),
  on(MovieActions.getMovie, (state) => state),
  on(MovieActions.getMovieSuccess, (state, { movie }) => ({
    ...state,
    detailsMovie: movie,
  })),
  on(MovieActions.createMovie, (state) => state),
  on(MovieActions.setSelectedMovie, (state, { selectedMovie }) => ({
    ...state,
    selectedMovie: selectedMovie,
  })),

  on(MovieActions.deleteMovieSuccess, (state, { movieToDelete }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [
        ...state.pagination.items.filter(
          (item) => item.id !== movieToDelete.id,
        ),
      ],
      meta: {
        ...state.pagination.meta,
        totalItems:
          state.pagination.meta.totalItems === 0
            ? 0
            : state.pagination.meta.totalItems - 1,
        totalPages:
          state.pagination.items.length === state.pagination.meta.itemsPerPage
            ? state.pagination.meta.totalPages + 1
            : state.pagination.meta.totalPages,
        currentPage:
          state.pagination.items.length === 1
            ? state.pagination.meta.currentPage - 1
            : state.pagination.meta.currentPage,
      },
    },
  })),
);
