import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DirectorsState} from "../../app.state";

//feature "directors" has to exist in app.state.ts
export const directors = createFeatureSelector<DirectorsState>('directors');

export const pagination = createFeatureSelector<DirectorsState>('pagination');

export const selectDirectors = createSelector(pagination, (state : DirectorsState) => { return state.pagination.items});
export const selectTotalItems = createSelector(pagination, (state : DirectorsState) => { return state.pagination.meta.totalItems});
export const selectItemCount = createSelector(pagination, (state : DirectorsState) => { return state.pagination.meta.itemCount});
export const selectItemsPerPage = createSelector(pagination, (state : DirectorsState) => { return state.pagination.meta.itemsPerPage});
export const selectTotalPages = createSelector(pagination, (state : DirectorsState) => { return state.pagination.meta.totalPages});
export const selectCurrentPage = createSelector(pagination, (state : DirectorsState) => { return state.pagination.meta.currentPage});
