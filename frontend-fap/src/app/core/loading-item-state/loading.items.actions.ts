import { createAction, props } from '@ngrx/store';
import { LoadingItem } from 'src/app/core/models/loading-item';

/* whenever this action is called, the 'getLoadingItems$' effect in LoadingItems.effects.ts  is executed */
export const getLoadingItems = createAction(
  '[LoadingItem List] Get LoadingItems',
  props<{ items: LoadingItem[] }>(),
);

/* whenever this action is called, the 'createLoadingItem$' effect in LoadingItems.effects.ts  is executed */
export const createLoadingItem = createAction(
  '[LoadingItem List] Create LoadingItem',
  props<{ loadingItem: LoadingItem }>(),
);

/* delete LoadingItem */
export const deleteLoadingItem = createAction(
  '[LoadingItem List] Remove LoadingItem',
  props<{
    loadingItemToDelete: LoadingItem;
  }>(),
);
