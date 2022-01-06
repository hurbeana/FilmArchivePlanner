import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FestivalsState, TagsState } from '../../app.state';

/* feature selector */
/* corresponds to "StoreModule.forRoot({ festivalsState: festivalsReducer })" */
export const festivalsState =
  createFeatureSelector<FestivalsState>('festivalsState');

/* helper selectors */
export const paginationState = createSelector(
  festivalsState,
  (s: FestivalsState) => {
    return s.pagination;
  },
);
const metaState = createSelector(paginationState, (p: any) => {
  return p.meta;
});

/* selectedFestival */
export const selectSelectedFestival = createSelector(
  festivalsState,
  (s: FestivalsState) => {
    return s.selectedFestival;
  },
);

/* pagination */
export const selectFestivals = createSelector(paginationState, (p: any) => {
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
