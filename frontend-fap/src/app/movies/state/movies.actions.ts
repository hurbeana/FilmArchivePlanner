import { createAction, props } from '@ngrx/store';
import { Movie } from '../models/movie';
import { CreateUpdateMovieDto } from '../models/create.movie';
import { AdvancedSearchState, MoviesPaginationState } from '../../app.state';

/* whenever this action is called, the 'getMovies$' effect in movies.effects.ts  is executed */
export const getMovies = createAction(
  '[Movie List] Get Movies',
  props<{
    page: number;
    limit: number;
    orderBy?: string;
    sortOrder?: string;
    searchString?: string;
  }>(),
);
export const getMoviesAdvanced = createAction(
  '[Movie List] Get Movies via Advanced Search',
  props<{
    page: number;
    limit: number;
    orderBy?: string;
    sortOrder?: string;
    searchString: string;
    selectedTagIDs: number[];
    negativeTagIDs: number[];
    exactYear: number;
    fromYear: number;
    toYear: number;
    exactLength: number;
    fromLength: number;
    toLength: number;
    hasDialogue: number;
    hasSubtitles: number;
    isStudentFilm: number;
    hasDCP: number;
    selectedDirectorIDs: number[];
    selectedContactIDs: number[];
  }>(),
);
export const getMoviesSuccess = createAction(
  '[Movies List] Loaded Movies Success',
  props<{ pagination: MoviesPaginationState }>(),
);

export const getMovie = createAction(
  '[Movie List] Get Movie',
  props<{ id: number }>(),
);
export const getMovieSuccess = createAction(
  '[Movies List] Loaded Movie Success',
  props<{ movie: Movie }>(),
);

export const getMovieByIdAndSetAsSelectedMovie = createAction(
  '[Movie List] Get Movie By ID and set as selected Movie',
  props<{ id: number }>(),
);
export const getMovieByIdAndSetAsSelectedMovieSuccess = createAction(
  '[Movies List] Get Movie By ID and set as selected Movie Success',
  props<{ movie: Movie }>(),
);

/* whenever this action is called, the 'createMovie$' effect in movies.effects.ts  is executed */
export const createMovie = createAction(
  '[Movie List] Create Movie',
  props<{ movieToCreate: CreateUpdateMovieDto; searchOptions: any }>(),
);
export const createMovieSuccess = createAction(
  '[Movie List] Created Movie Success',
  props<{ movie: Movie; searchOptions: any }>(),
);
export const createMovieFailed = createAction(
  '[Movie List] Created Movie Failed',
  props<{ movie: CreateUpdateMovieDto; errormessage: string }>(),
);
export const updateMovie = createAction(
  '[Movie List] Update Movie',
  props<{
    id: number;
    movie: CreateUpdateMovieDto;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const updateMovieSuccess = createAction(
  '[Movie List] Updated Movie Success',
  props<{
    movie: Movie;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const updateMovieFailed = createAction(
  '[Movie List] Update Movie Failed',
  props<{ movie: CreateUpdateMovieDto; errormessage: string }>(),
);
export const setSelectedMovie = createAction(
  '[Movie List] Set Selected Movie',
  props<{ selectedMovie: Movie | null }>(),
);

export const setAdvancedSearchState = createAction(
  '[Movie List] Set Advanced Search Params',
  props<{ advancedSearchState: AdvancedSearchState }>(),
);

export const deleteMovie = createAction(
  '[Movie List] Delete Movie',
  props<{
    movieToDelete: Movie;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const deleteMovieSuccess = createAction(
  '[Movie List] Delete Movie Success',
  props<{
    movieToDelete: Movie;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
