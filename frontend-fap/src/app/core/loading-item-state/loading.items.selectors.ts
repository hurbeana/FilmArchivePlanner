import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoadingItemsState } from '../../app.state';

/* feature selector */
/* corresponds to "StoreModule.forRoot({ loadingItemsState: loadingItemsReducer })" */
export const loadingItemsState =
  createFeatureSelector<LoadingItemsState>('loadingItemsState');

/* helper selectors */
export const selectitemState = createSelector(
  loadingItemsState,
  (s: LoadingItemsState) => {
    return s.items;
  },
);
