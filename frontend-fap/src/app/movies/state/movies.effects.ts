import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { MovieService } from '../services/movie.service';
import * as MovieActions from './movies.actions';

@Injectable()
export class MovieEffects {
  constructor(private actions$: Actions, private moviesService: MovieService) { }

  /* is called, whenever an action of type 'getMovies' is called */
  getMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.getMovies),
      switchMap(({ search, page, limit }) =>
        this.moviesService.getMovies(search, page, limit).pipe(
          map((pagination) =>
            MovieActions.getMoviesSuccess({ pagination: pagination })
          ),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );

  getMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.getMovie),
      switchMap(({ id }) =>
        this.moviesService.getMovie(id).pipe(
          map((movie) => MovieActions.getMovieSuccess({ movie: movie })),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );

  /* is called, whenever an action of type 'createMovie' is called */
  createMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.createMovie),
      switchMap(({ movie }) =>
        this.moviesService.createMovie(movie).pipe(
          map((movie) => MovieActions.createdMovieSuccess({ movie })),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );


  /* is called, whenever an action of type 'deleteMovie' is called */
  deleteMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.deleteMovie),
      mergeMap(({ movieToDelete, search, page, limit }) =>
        this.moviesService.deleteMovie(movieToDelete)
          .pipe(
            map(() => MovieActions.deleteMovieSuccess({ movieToDelete: movieToDelete, search: search, page: page, limit: limit })),
            catchError(() => EMPTY) // TODO: error handling
          )
      )
    )
  );



  reloadAfterDelete$ = createEffect(() => this.actions$.pipe(
    ofType(MovieActions.deleteMovieSuccess),
    mergeMap(({ movieToDelete, search, page, limit }) => this.moviesService.getMovies(search, page, limit)
      .pipe(
        map(pagination => (MovieActions.getMoviesSuccess({ pagination: pagination }))),
        catchError(() => EMPTY) // TODO: error handling
      ))
  )
  );
}
