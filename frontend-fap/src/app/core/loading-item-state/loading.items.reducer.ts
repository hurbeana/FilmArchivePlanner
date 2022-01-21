import { createReducer, on } from '@ngrx/store';
import * as LoadingItemsActions from './loading.items.actions';
import { LoadingItemsState } from '../../app.state';
import { isDirector, isMovie } from '../models/loading-item';

export const initialState: LoadingItemsState = {
  items: [],
};

export const loadingItemsReducer = createReducer(
  initialState,
  on(LoadingItemsActions.getLoadingItems, (state, { items }) => ({
    ...state,
    items,
  })),
  on(LoadingItemsActions.createLoadingItem, (state, { loadingItem }) => ({
    ...state,
    items: [...state.items, loadingItem],
  })),

  on(
    LoadingItemsActions.deleteLoadingItem,
    (state, { loadingItemToDelete }) => ({
      ...state,
      items: [
        ...state.items.filter(
          (item) => item.title !== loadingItemToDelete.title,
        ),
      ],
    }),
  ),
);
