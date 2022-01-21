import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { MovieService } from '../services/movie.service';
import * as MovieActions from './movies.actions';
import * as LoadingItemsActions from '../../core/loading-item-state/loading.items.actions';

import { MessageService } from '../../core/services/message.service';

@Injectable()
export class MovieEffects {
  constructor(
    private actions$: Actions,
    private moviesService: MovieService,
    private messageService: MessageService,
  ) {}

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

  getMoviesAdvanced$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.getMoviesAdvanced),
      switchMap(
        ({
          page,
          limit,
          orderBy,
          sortOrder,
          searchString,
          selectedTagIDs,
          negativeTagIDs,
          exactYear,
          fromYear,
          toYear,
          exactLength,
          fromLength,
          toLength,
          hasDialogue,
          hasSubtitles,
          isStudentFilm,
          hasDCP,
          selectedDirectorIDs,
          selectedContactIDs,
        }) =>
          this.moviesService
            .getMoviesAdvanced(
              page,
              limit,
              orderBy,
              sortOrder,
              searchString,
              selectedTagIDs,
              negativeTagIDs,
              exactYear,
              fromYear,
              toYear,
              exactLength,
              fromLength,
              toLength,
              hasDialogue,
              hasSubtitles,
              isStudentFilm,
              hasDCP,
              selectedDirectorIDs,
              selectedContactIDs,
            )
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

  getMovieByIdAndSetAsSelectedMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.getMovieByIdAndSetAsSelectedMovie),
      switchMap(({ id }) =>
        this.moviesService.getMovie(id).pipe(
          map((movie) =>
            MovieActions.getMovieByIdAndSetAsSelectedMovieSuccess({
              movie: movie,
            }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createMovie' is called */
  createMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.createMovie),
      mergeMap(({ movieToCreate, searchOptions }) =>
        this.moviesService.createMovie(movieToCreate).pipe(
          map((createdMovie) =>
            MovieActions.createMovieSuccess({
              movie: createdMovie,
              searchOptions: searchOptions,
            }),
          ),
          tap((_) =>
            this.messageService.showSuccessSnackBar(
              'Movie created successfully',
            ),
          ),
          catchError((error) =>
            of(
              MovieActions.createMovieFailed({
                movie: movieToCreate,
                errormessage: this.messageService.getErrorMessage(error),
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
                movie: movie,
                errormessage: this.messageService.getErrorMessage(error),
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
            tap((_) =>
              this.messageService.showSuccessSnackBar(
                'Movie deleted successfully',
              ),
            ),
            catchError((err) => {
              this.messageService.showErrorSnackBar(err);
              return EMPTY;
            }),
          ),
      ),
    ),
  );

  /* needed? edit view routes anyway and reload is triggered */
  reloadAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.createMovieSuccess),
      mergeMap(({ movie, searchOptions }) =>
        this.moviesService
          .getMovies(
            searchOptions.page,
            searchOptions.limit,
            searchOptions.orderBy,
            searchOptions.sortOrder,
            searchOptions.searchString,
          )
          .pipe(
            map((pagination) =>
              MovieActions.getMoviesSuccess({ pagination: pagination }),
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

  deleteLoadingItemMovieSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MovieActions.createMovieSuccess,
        MovieActions.createMovieFailed,
        MovieActions.updatedMovieSuccess,
        MovieActions.updateMovieFailed,
      ),
      map((result) =>
        LoadingItemsActions.deleteLoadingItem({
          loadingItemToDelete: {
            title: result.movie.originalTitle,
          },
        }),
      ),
    ),
  );
}
