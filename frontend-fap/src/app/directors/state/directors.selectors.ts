import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DirectorsState } from '../../app.state';

/* feature selector */
/* corresponds to "StoreModule.forRoot({ directorsState: directorsReducer })" */
export const directorsState =
  createFeatureSelector<DirectorsState>('directorsState');

/* helper selectors */
const paginationState = createSelector(directorsState, (s: DirectorsState) => {
  return s.pagination;
});
const metaState = createSelector(paginationState, (p: any) => {
  return p.meta;
});

/* selectedDirector */
export const selectSelectedDirector = createSelector(
  directorsState,
  (s: DirectorsState) => {
    return s.selectedDirector;
  },
);
/* detailsDirector */
export const selectDetailsDirector = createSelector(
  directorsState,
  (s: DirectorsState) => {
    return s.detailsDirector;
  },
);

/* pagination */
export const selectDirectors = createSelector(paginationState, (p: any) => {
  return p.items;
});
export const selectOrderBy = createSelector(paginationState, (p: any) => {
  return p.orderBy;
});
export const selectSortOrder = createSelector(paginationState, (p: any) => {
  return p.sortOrder;
});
export const selectSearchString = createSelector(paginationState, (p: any) => {
  return p.searchString;
});

/* meta */
/* meta */
export const selectTotalItems = createSelector(metaState, (m: any) => {
  return m.totalItems;
});
export const selectItemCount = createSelector(metaState, (m: any) => {
  return m.itemCount;
});
export const selectItemsPerPage = createSelector(metaState, (m: any) => {
  return m.itemsPerPage;
});
export const selectTotalPages = createSelector(metaState, (m: any) => {
  return m.totalPages;
});
export const selectCurrentPage = createSelector(metaState, (m: any) => {
  return m.currentPage;
});
