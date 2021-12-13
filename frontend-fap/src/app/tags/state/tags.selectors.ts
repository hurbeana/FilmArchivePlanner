import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TagsState } from '../../app.state';

//feature "tags" has to exist in app.state.ts
export const tags = createFeatureSelector<TagsState>('tags');

export const pagination = createFeatureSelector<TagsState>('pagination');

export const selectedTag = createFeatureSelector<TagsState>('selectedTag');

export const selectTags = createSelector(pagination, (state: TagsState) => {
  return state.pagination.items;
});
export const selectSelectedTag = createSelector(
  selectedTag,
  (state: TagsState) => {
    return state.selectedTag;
  }
);
export const selectTotalItems = createSelector(
  pagination,
  (state: TagsState) => {
    return state.pagination.meta.totalItems;
  }
);
export const selectItemCount = createSelector(
  pagination,
  (state: TagsState) => {
    return state.pagination.meta.itemCount;
  }
);
export const selectItemsPerPage = createSelector(
  pagination,
  (state: TagsState) => {
    return state.pagination.meta.itemsPerPage;
  }
);
export const selectTotalPages = createSelector(
  pagination,
  (state: TagsState) => {
    return state.pagination.meta.totalPages;
  }
);
export const selectCurrentPage = createSelector(
  pagination,
  (state: TagsState) => {
    return state.pagination.meta.currentPage;
  }
);
export const selectOrderBy = createSelector(pagination, (state: TagsState) => {
  return state.pagination.orderBy;
});
export const selectSortOrder = createSelector(
  pagination,
  (state: TagsState) => {
    return state.pagination.sortOrder;
  }
);
export const selectSearchString = createSelector(
  pagination,
  (state: TagsState) => {
    return state.pagination.searchString;
  }
);
