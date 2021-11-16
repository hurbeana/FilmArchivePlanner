import {createAction, props} from '@ngrx/store';
import {Movie} from "../models/movie";
import {CreateUpdateMovieDto} from "../models/create.movie";
import {PaginationState} from "../../app.state";

/* whenever this action is called, the 'getMovies$' effect in movies.effects.ts  is executed */
export const getMovies = createAction('[Movie List] Get Movies', props<{search: string, page: number, limit: number}>());
export const gotMoviesSuccess = createAction('[Movies List] Loaded Movies Success', props<{ pagination: PaginationState }>());

/* whenever this action is called, the 'createMovie$' effect in movies.effects.ts  is executed */
export const createMovie = createAction('[Movie List] Create Movie', props<{ movie: CreateUpdateMovieDto }>());
export const createdMovieSuccess = createAction('[Movie List] Created Movie Success', props<{ movie: Movie }>());

export const setSelectedMovie = createAction('[Movie List] Set Selected Movie', props<{ selectedMovie: Movie }>());

export const removeMovie = createAction('[Movie List] Remove Movie', props<{ movieId: number }>());



