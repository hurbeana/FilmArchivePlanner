import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TagsState } from '../../app.state';

/* feature selector */
/* corresponds to "StoreModule.forRoot({ tagsState: tagsReducer })" */
const tagsState = createFeatureSelector<TagsState>('tagsState');

/* helper selectors */
const paginationState = createSelector(tagsState, (s: TagsState) => {
  return s.pagination;
});
const metaState = createSelector(paginationState, (p: any) => {
  return p.meta;
});

/* selectedTag */
export const selectSelectedTag = createSelector(tagsState, (s: TagsState) => {
  return s.selectedTag;
});

/* pagination */
export const selectTags = createSelector(paginationState, (p: any) => {
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
