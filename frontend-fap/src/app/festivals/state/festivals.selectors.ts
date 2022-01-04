import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FestivalsState } from '../../app.state';

//feature "festivals" has to exist in app.state.ts
export const festivals = createFeatureSelector<FestivalsState>('festivals');

export const pagination = createFeatureSelector<FestivalsState>('pagination');

export const selectedFestival =
  createFeatureSelector<FestivalsState>('selectedFestival');

export const selectFestivals = createSelector(
  pagination,
  (state: FestivalsState) => {
    return state.pagination.items;
  },
);

export const selectSelectedFestival = createSelector(
  selectedFestival,
  (state: FestivalsState) => {
    return state.selectedFestival;
  },
);

export const selectTotalItems = createSelector(
  pagination,
  (state: FestivalsState) => {
    return state.pagination.meta.totalItems;
  },
);
export const selectItemCount = createSelector(
  pagination,
  (state: FestivalsState) => {
    return state.pagination.meta.itemCount;
  },
);
export const selectItemsPerPage = createSelector(
  pagination,
  (state: FestivalsState) => {
    return state.pagination.meta.itemsPerPage;
  },
);
export const selectTotalPages = createSelector(
  pagination,
  (state: FestivalsState) => {
    return state.pagination.meta.totalPages;
  },
);
export const selectCurrentPage = createSelector(
  pagination,
  (state: FestivalsState) => {
    return state.pagination.meta.currentPage;
  },
);
