import { createAction, props } from '@ngrx/store';
import { Festival } from '../models/festival';
import { CreateUpdateFestivalDto } from '../models/create.festival';
import { FestivalsPaginationState } from '../../app.state';

/* whenever this action is called, the 'getFestivals$' effect in festivals.effects.ts  is executed */
export const getFestivals = createAction(
  '[Festival List] Get Festivals',
  props<{
    page: number;
    limit: number;
    orderBy?: string;
    sortOrder?: string;
    searchString?: string;
  }>(),
);
export const getFestivalsSuccess = createAction(
  '[Festivals List] Loaded Festivals Success',
  props<{ pagination: FestivalsPaginationState }>(),
);

/* whenever this action is called, the 'createFestival$' effect in festivals.effects.ts  is executed */
export const createFestival = createAction(
  '[Festival List] Create Festival',
  props<{ festival: CreateUpdateFestivalDto }>(),
);
export const createFestivalSuccess = createAction(
  '[Festival List] Created Festival Success',
  props<{ festival: Festival }>(),
);

export const setSelectedFestival = createAction(
  '[Festival List] Set Selected Festival',
  props<{ selectedFestival: Festival }>(),
);

export const updateFestival = createAction(
  '[Festival List] Update Festival',
  props<{
    festival: CreateUpdateFestivalDto;
    id: number;
  }>(),
);
export const updateFestivalSuccess = createAction(
  '[Festival List] Update Festival Success',
  props<{
    festival: Festival;
  }>(),
);

export const deleteFestival = createAction(
  '[Festival List] Remove Festival',
  props<{
    festivalToDelete: Festival;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const deleteFestivalSuccess = createAction(
  '[Festival List] Remove Festival Success',
  props<{
    festivalToDelete: Festival;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
