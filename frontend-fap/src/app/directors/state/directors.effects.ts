import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {DirectorService} from "../services/director.service";
import * as DirectorActions from "./directors.actions";

@Injectable()
export class DirectorEffects {

  constructor(
    private actions$: Actions,
    private directorsService: DirectorService,
  ) {}

  /* is called, whenever an action of type 'getDirectors' is called */
  getDirectors$ = createEffect(() => this.actions$.pipe(
    ofType(DirectorActions.getDirectors),
    switchMap(({search, page, limit}) => this.directorsService.getDirectors(search, page, limit)
        .pipe(
          map(pagination => (DirectorActions.getDirectorsSuccess({pagination: pagination}))),
          catchError(() => EMPTY) // TODO: error handling
        ))
    )
  );

  /* is called, whenever an action of type 'createDirector' is called */
  createDirector$ = createEffect(() => this.actions$.pipe(
      ofType(DirectorActions.createDirector),
      switchMap(({director}) => this.directorsService.createDirector(director)
        .pipe(
          map(director => DirectorActions.createDirectorSuccess({director})),
          catchError(() => EMPTY) // TODO: error handling
        ))
    )
  );

  /* is called, whenever an action of type 'createMovie' is called */
  deleteDirector$ = createEffect(() => this.actions$.pipe(
      ofType(DirectorActions.deleteDirector),
      mergeMap(({directorToDelete, search, page, limit}) =>
        this.directorsService.deleteDirector(directorToDelete)
          .pipe(
            map(() => DirectorActions.deleteDirectorSuccess({directorToDelete: directorToDelete, search: search, page: page, limit: limit})),
            catchError(() => EMPTY) // TODO: error handling
          )
      )
    )
  );

  reloadAfterDelete$ = createEffect(() => this.actions$.pipe(
      ofType(DirectorActions.deleteDirectorSuccess),
      mergeMap(({directorToDelete, search, page, limit}) => this.directorsService.getDirectors(search, page, limit)
        .pipe(
          map(pagination => (DirectorActions.getDirectorsSuccess({pagination: pagination}))),
          catchError(() => EMPTY) // TODO: error handling
        ))
    )
  );


}
