import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {MovieService} from "../services/movie.service";
import * as MovieActions from "./movies.actions";

@Injectable()
export class MovieEffects {

  constructor(
    private actions$: Actions,
    private moviesService: MovieService,
  ) {}

  /* is called, whenever an action of type 'getMovies' is called */
  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType(MovieActions.loadMovies),
    mergeMap(() => this.moviesService.getMovies()
        .pipe(
          map(movies => (MovieActions.loadedMoviesSuccess({movies}))),
          catchError(() => EMPTY) // TODO: error handling
        ))
    )
  );


  /* is called, whenever an action of type 'createMovie' is called */
  createMovie$ = createEffect(() => this.actions$.pipe(
      ofType(MovieActions.createMovie),
      switchMap(({movie}) => this.moviesService.createMovie(movie)
        .pipe(
          map(movie => MovieActions.createdMovieSuccess({movie})),
          catchError(() => EMPTY) // TODO: error handling
        ))
    )
  );
}
