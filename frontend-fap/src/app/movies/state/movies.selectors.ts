import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from "../../app.state";

//feature "movies" has to exist in app.state.ts
export const movies = createFeatureSelector<AppState>('movies');

export const pagination = createFeatureSelector<AppState>('pagination');

export const selectMovies = createSelector(pagination, (state : AppState) => { return state.pagination.items});
export const selectTotalItems = createSelector(pagination, (state : AppState) => { return state.pagination.meta.totalItems});
export const selectItemCount = createSelector(pagination, (state : AppState) => { return state.pagination.meta.itemCount});
export const selectItemsPerPage = createSelector(pagination, (state : AppState) => { return state.pagination.meta.itemsPerPage});
export const selectTotalPages = createSelector(pagination, (state : AppState) => { return state.pagination.meta.totalPages});
export const selectCurrentPage = createSelector(pagination, (state : AppState) => { return state.pagination.meta.currentPage});
