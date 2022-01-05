import { createReducer, on } from '@ngrx/store';
import * as MovieActions from './movies.actions';
import { MoviesState } from '../../app.state';
import { advancedSearchState } from './movies.selectors';

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
  advancedSearchState: {
    query: '',
    selectedTagIDs: [],
    negativeTagIDs: [],
    exactYear: -1,
    fromYear: -1,
    toYear: -1,
    exactLength: -1,
    fromLength: -1,
    toLength: -1,
    hasDialogue: 0,
    hasSubtitles: 0,
    isStudentFilm: 0,
    hasDCP: 0,
    selectedDirectorIDs: [],
    selectedContactIDs: [],
  },
};

export const moviesReducer = createReducer(
  initialState,
  on(MovieActions.getMovies, (state) => state),
  on(MovieActions.getMoviesSuccess, (state, { pagination }) => ({
    ...state,
    pagination: {
      ...pagination,
      items: [...pagination.items],
      meta: { ...pagination.meta },
    },
    selectedMovie: null,
  })),
  on(MovieActions.getMovie, (state) => state),
  on(MovieActions.getMovieSuccess, (state, { movie }) => ({
    ...state,
    detailsMovie: movie,
  })),
  on(MovieActions.getMovieByIdAndSetAsSelectedMovie, (state) => state),
  on(
    MovieActions.getMovieByIdAndSetAsSelectedMovieSuccess,
    (state, { movie }) => ({
      ...state,
      selectedMovie: movie,
    }),
  ),
  on(MovieActions.setSelectedMovie, (state, { selectedMovie }) => ({
    ...state,
    selectedMovie: selectedMovie,
  })),
  on(MovieActions.setAdvancedSearchState, (state, { advancedSearchState }) => ({
    ...state,
    advancedSearchState,
  })),
  on(MovieActions.createMovie, (state) => state),
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
