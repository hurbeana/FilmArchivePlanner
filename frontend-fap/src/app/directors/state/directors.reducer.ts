import { createReducer, on } from '@ngrx/store';
import * as DirectorActions from './directors.actions';
import { DirectorsState } from '../../app.state';

export const initialState: DirectorsState = {
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
  selectedDirector: null,
};

export const directorsReducer = createReducer(
  initialState,
  on(DirectorActions.getDirectors, (state) => state),
  on(DirectorActions.getDirectorsSuccess, (state, { pagination }) => ({
    ...state,
    pagination: {
      ...pagination,
      items: [...pagination.items],
      meta: { ...pagination.meta },
    },
    selectedDirector:
      pagination.items.filter(
        (item) => item.id == state?.selectedDirector?.id,
      )[0] ?? null,
  })),
  on(DirectorActions.getDirector, (state) => state),
  on(DirectorActions.getDirectorSuccess, (state, { director }) => ({
    ...state,
    detailsDirector: director,
  })),

  on(DirectorActions.setSelectedDirector, (state, { selectedDirector }) => ({
    ...state,
    selectedDirector: selectedDirector,
  })),
);
