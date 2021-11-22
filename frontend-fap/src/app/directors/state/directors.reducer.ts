import {createReducer, on} from '@ngrx/store';
import * as DirectorActions from './directors.actions';
import {DirectorsState} from "../../app.state";

export const initialState: DirectorsState = {
  pagination: {
    items: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 16,
      totalPages: 0,
      currentPage: 1
    }},
  selectedDirector: null,
  searchTerm: ""
};


export const directorsReducer = createReducer(
  initialState,
  on(DirectorActions.getDirectors, (state) => (state)),
  on(DirectorActions.getDirectorsSuccess, (state, {pagination}) => ({
      ...state,
      pagination: {
        items: [...pagination.items],
        meta : {...pagination.meta}
      }
    })
  ),
  on(DirectorActions.createDirector, (state) => (state)),
  on(DirectorActions.createDirectorSuccess, (state, {director}) =>({
      ...state,
      pagination: {
        ...state.pagination,
        items: state.pagination.items.length === state.pagination.meta.itemsPerPage ? [...state.pagination.items]: [...state.pagination.items, director],
        meta: {
          ...state.pagination.meta,
          totalItems: state.pagination.meta.totalItems+1,
          totalPages: state.pagination.items.length === state.pagination.meta.itemsPerPage ? state.pagination.meta.totalPages+1 : state.pagination.meta.totalPages,
        }

      }
    })
  ),
  on(DirectorActions.setSelectedDirector, (state, {selectedDirector}) => ({
      ...state,
    selectedDirector: selectedDirector
    })
  ),



  on(DirectorActions.deleteDirectorSuccess, (state, {directorToDelete}) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [...state.pagination.items.filter(item => item.id !== directorToDelete.id)],
      meta: {
        ...state.pagination.meta,
        totalItems: state.pagination.meta.totalItems === 0 ? 0 : state.pagination.meta.totalItems-1,
        totalPages: state.pagination.items.length === state.pagination.meta.itemsPerPage ? state.pagination.meta.totalPages+1 : state.pagination.meta.totalPages,
        currentPage: state.pagination.items.length === 1 ? state.pagination.meta.currentPage-1 : state.pagination.meta.currentPage
      }
    }
  }))

);
