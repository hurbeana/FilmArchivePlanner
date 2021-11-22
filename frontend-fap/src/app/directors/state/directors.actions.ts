import {createAction, props} from '@ngrx/store';
import {Director} from "../models/director";
import {CreateUpdateDirectorDto} from "../models/create.director";
import {DirectorsPaginationState} from "../../app.state";

/* whenever this action is called, the 'getDirectors$' effect in directors.effects.ts  is executed */
export const getDirectors = createAction('[Director List] Get Directors', props<{search: string, page: number, limit: number}>());
export const getDirectorsSuccess = createAction('[Directors List] Loaded Directors Success', props<{ pagination: DirectorsPaginationState }>());

/* whenever this action is called, the 'createDirector$' effect in directors.effects.ts  is executed */
export const createDirector = createAction('[Director List] Create Director', props<{ director: CreateUpdateDirectorDto }>());
export const createDirectorSuccess = createAction('[Director List] Created Director Success', props<{ director: Director }>());

export const setSelectedDirector = createAction('[Director List] Set Selected Director', props<{ selectedDirector: Director }>());

export const deleteDirector = createAction('[Director List] Remove Director', props<{ directorToDelete: Director, search: string, page: number, limit: number }>());
export const deleteDirectorSuccess = createAction('[Director List] Remove Director Success', props<{ directorToDelete: Director, search: string, page: number, limit: number }>());

