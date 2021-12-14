import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { MovieService } from '../services/movie.service';
import * as MovieActions from './movies.actions';

@Injectable()
export class MovieEffects {
  constructor(private actions$: Actions, private moviesService: MovieService) {}

  /* is called, whenever an action of type 'getMovies' is called */
  getMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.getMovies),
      switchMap(({ page, limit, orderBy, sortOrder, searchString }) =>
        this.moviesService
          .getMovies(page, limit, orderBy, sortOrder, searchString)
          .pipe(
            map((pagination) =>
              MovieActions.getMoviesSuccess({ pagination: pagination }),
            ),
            catchError(() => EMPTY), // TODO: error handling
          ),
      ),
    ),
  );

  getMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.getMovie),
      switchMap(({ id }) =>
        this.moviesService.getMovie(id).pipe(
          map((movie) => MovieActions.getMovieSuccess({ movie: movie })),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createMovie' is called */
  createMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.createMovie),
      switchMap(({ movie }) =>
        this.moviesService.createMovie(movie).pipe(
          map((movie) => MovieActions.createdMovieSuccess({ movie })),
          catchError((error) =>
            of(
              MovieActions.createMovieFailed({
                errormessage: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.updateMovie),
      switchMap(({ id, movie }) =>
        this.moviesService.updateMovie(id, movie).pipe(
          map((movie) => MovieActions.updatedMovieSuccess({ movie })),
          catchError((error) =>
            of(
              MovieActions.updateMovieFailed({
                errormessage: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'deleteMovie' is called */
  deleteMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.deleteMovie),
      mergeMap(
        ({ movieToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.moviesService.deleteMovie(movieToDelete).pipe(
            map(() =>
              MovieActions.deleteMovieSuccess({
                movieToDelete: movieToDelete,
                page,
                limit,
                orderBy,
                sortOrder,
                searchString,
              }),
            ),
            catchError(() => EMPTY), // TODO: error handling
          ),
      ),
    ),
  );

  reloadAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.deleteMovieSuccess),
      mergeMap(
        ({ movieToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.moviesService
            .getMovies(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                MovieActions.getMoviesSuccess({ pagination: pagination }),
              ),
              catchError(() => EMPTY), // TODO: error handling
            ),
      ),
    ),
  );

  /*
   * Returns User friendly error message
   * TODO
   * */
  getErrorMessage(error: any): string {
    console.log(error);
    if (((error.status / 100) | 0) === 4) {
      // validation error
      return [].concat(error?.error?.message).join(', ');
      return 'No Error Details!';
    } else if (((error.status / 100) | 0) === 5) {
      // other error
      return 'Error with Server Connection!';
    } else {
      return 'Some other Error occurred!';
    }
  }
}
