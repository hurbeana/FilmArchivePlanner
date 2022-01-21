import { createAction, props } from '@ngrx/store';
import { Director } from '../models/director';
import { CreateUpdateDirectorDto } from '../models/create.director';
import { DirectorsPaginationState } from '../../app.state';

/*getting single director by id*/
export const getDirector = createAction(
  '[Director List] Get Director',
  props<{ id: number }>(),
);
export const getDirectorSuccess = createAction(
  '[Director List] Loaded Director Success',
  props<{ director: Director }>(),
);
export const getDirectorFailed = createAction(
  '[Director List] Loaded Director Failed',
  props<{ errormessage: string }>(),
);
/* whenever this action is called, the 'getDirectors$' effect in directors.effects.ts  is executed */
export const getDirectors = createAction(
  '[Director List] Get Directors',
  props<{
    page: number;
    limit: number;
    orderBy?: string;
    sortOrder?: string;
    searchString?: string;
  }>(),
);
export const getDirectorsSuccess = createAction(
  '[Directors List] Loaded Directors Success',
  props<{ pagination: DirectorsPaginationState }>(),
);

/* whenever this action is called, the 'createDirector$' effect in directors.effects.ts  is executed */
export const createDirector = createAction(
  '[Director List] Create Director',
  props<{ director: CreateUpdateDirectorDto }>(),
);
export const createDirectorSuccess = createAction(
  '[Director List] Created Director Success',
  props<{ director: Director }>(),
);
export const createDirectorFailed = createAction(
  '[Director List] Created Director Failed',
  props<{ director: CreateUpdateDirectorDto; errormessage: string }>(),
);

/*update director by id*/
export const updateDirector = createAction(
  '[Director List] Update Director',
  props<{ id: number; director: CreateUpdateDirectorDto }>(),
);
export const updateDirectorSuccess = createAction(
  '[Director List] Updated Director Success',
  props<{ director: Director }>(),
);
export const updateDirectorFailed = createAction(
  '[Director List] Update Director Failed',
  props<{ director: CreateUpdateDirectorDto; errormessage: string }>(),
);

/* set select director*/
export const setSelectedDirector = createAction(
  '[Director List] Set Selected Director',
  props<{ selectedDirector: Director | null }>(),
);

/* delete director */
export const deleteDirector = createAction(
  '[Director List] Remove Director',
  props<{
    directorToDelete: Director;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const deleteDirectorSuccess = createAction(
  '[Director List] Remove Director Success',
  props<{
    directorToDelete: Director;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
