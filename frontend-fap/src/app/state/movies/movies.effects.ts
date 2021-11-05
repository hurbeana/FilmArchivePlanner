import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import {map, mergeMap, catchError, switchMap} from 'rxjs/operators';
import {MovieService} from "../../services/movie.service";
import {
  createMovie,
  createMovieSuccess,
  retrievedMovieList,
  retrieveMoviesSuccessful
} from "./movies.actions";

@Injectable()
export class MovieEffects {

  loadMovies$ = createEffect(() => this.actions$.pipe(
      ofType(retrievedMovieList),
    mergeMap(() => this.moviesService.getMovies() //TODO: replace with actual service
        .pipe(
          map(movies => (retrieveMoviesSuccessful({movies}))),
          catchError(() => EMPTY) // TODO: error handling
        ))
    )
  );

  createMovie$ = createEffect(() => this.actions$.pipe(
      ofType(createMovie),
      switchMap(({movie}) => this.moviesService.createMovie(movie) //TODO: replace with actual service
        .pipe(
          map(movie => createMovieSuccess({movie})),
          catchError(() => EMPTY) // TODO: error handling
        ))
    )
  );
  constructor(
    private actions$: Actions,
    private moviesService: MovieService,
    //private dummyMovieService: DummyMovieService, //TODO: remove
  ) {}
}
