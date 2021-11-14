import {createAction, props} from '@ngrx/store';
import {Movie} from "../models/movie";
import {CreateUpdateMovieDto} from "../models/create.movie";

/* whenever this action is called, the 'loadMovies$' effect in movies.effects.ts  is executed */
export const loadMovies = createAction('[Movie List] Get Movies');
export const loadedMoviesSuccess = createAction('[Movies List] Loaded Movies Success', props<{ movies: Movie[] }>());

/* whenever this action is called, the 'createMovie$' effect in movies.effects.ts  is executed */
export const createMovie = createAction('[Movie List] Create Movie', props<{ movie: CreateUpdateMovieDto }>());
export const createdMovieSuccess = createAction('[Movie List] Created Movie Success', props<{ movie: Movie }>());

export const setSelectedMovie = createAction('[Movie List] Set Selected Movie', props<{ selectedMovie: Movie }>());

export const setSearchTerm = createAction('[Movie List] Set Search Term', props<{ searchTerm: string }>());

export const removeMovie = createAction('[Movie List] Remove Movie', props<{ movieId: number }>());



