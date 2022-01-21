import { createAction, props } from '@ngrx/store';
import { Festival } from '../models/festival';
import { CreateUpdateFestivalDto } from '../models/create.festival';
import { FestivalsPaginationState } from '../../app.state';
import { Movie } from '../../movies/models/movie';
import { FestivalEvent } from '../models/event';

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

export const getFestival = createAction(
  '[Festival List] Get Festival',
  props<{ id: number }>(),
);
export const getFestivalSuccess = createAction(
  '[Festivals List] Loaded Festival Success',
  props<{ festival: Festival }>(),
);

/* whenever this action is called, the 'createFestival$' effect in festivals.effects.ts  is executed */
export const createFestival = createAction(
  '[Festival List] Create Festival',
  props<{
    festivalToCreate: CreateUpdateFestivalDto;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const createFestivalSuccess = createAction(
  '[Festival List] Created Festival Success',
  props<{
    createdFestival: Festival;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);

export const setSelectedFestival = createAction(
  '[Festival List] Set Selected Festival',
  props<{ selectedFestival: Festival | null }>(),
);

export const updateFestival = createAction(
  '[Festival List] Update Festival',
  props<{
    id: number;
    newFestival: CreateUpdateFestivalDto;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const updateFestivalSuccess = createAction(
  '[Festival List] Update Festival Success',
  props<{
    updatedFestival: Festival;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
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
    deletedFestival: Festival;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);

/* Events of festival*/
export const createFestivalEvent = createAction(
  '[FestivalEvent List] Create FestivalEvent',
  props<{ festivalEvent: FestivalEvent }>(),
);
export const createFestivalEventSuccess = createAction(
  '[FestivalEvent List] Created FestivalEvent Success',
  props<{ festivalEvent: FestivalEvent }>(),
);
export const updateFestivalEvent = createAction(
  '[FestivalEvent List] Update FestivalEvent',
  props<{
    festivalEvent: FestivalEvent;
  }>(),
);
export const updateFestivalEventSuccess = createAction(
  '[FestivalEvent List] Update FestivalEvent Success',
  props<{
    festivalEvent: FestivalEvent;
  }>(),
);
export const deleteFestivalEvent = createAction(
  '[FestivalEvent List] Remove FestivalEvent',
  props<{
    festivalEventToDelete: FestivalEvent;
  }>(),
);
export const deleteFestivalEventSuccess = createAction(
  '[FestivalEvent List] Remove FestivalEvent Success',
  props<{
    festivalEventToDelete: FestivalEvent;
  }>(),
);
