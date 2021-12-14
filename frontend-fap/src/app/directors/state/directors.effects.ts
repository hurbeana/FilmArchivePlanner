import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { DirectorService } from '../services/director.service';
import * as DirectorActions from './directors.actions';

@Injectable()
export class DirectorEffects {
  constructor(
    private actions$: Actions,
    private directorsService: DirectorService,
  ) {}

  /* is called, whenever an action of type 'getDirectors' is called */
  getDirectors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.getDirectors),
      switchMap(({ page, limit, orderBy, sortOrder, searchString }) =>
        this.directorsService
          .getDirectors(page, limit, orderBy, sortOrder, searchString)
          .pipe(
            map((pagination) =>
              DirectorActions.getDirectorsSuccess({ pagination: pagination }),
            ),
            catchError(() => EMPTY), // TODO: error handling
          ),
      ),
    ),
  );

  getDirector$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.getDirector),
      switchMap(({ id }) =>
        this.directorsService.getDirector(id).pipe(
          map((director) => {
            console.log('loaded director:');
            console.log(director);
            return DirectorActions.getDirectorSuccess({ director: director });
          }),
          catchError((error) =>
            of(
              DirectorActions.getDirectorFailed({
                errormessage: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createDirector' is called */
  createDirector$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.createDirector),
      switchMap(({ director }) =>
        this.directorsService.createDirector(director).pipe(
          map((director) =>
            DirectorActions.createDirectorSuccess({ director }),
          ),
          catchError((error) =>
            of(
              DirectorActions.createDirectorFailed({
                errormessage: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateDirector$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.updateDirector),
      switchMap(({ id, director }) =>
        this.directorsService.updateDirector(id, director).pipe(
          map((directorUpdated) =>
            DirectorActions.updateDirectorSuccess({
              director: directorUpdated,
            }),
          ),
          catchError((error) =>
            of(
              DirectorActions.updateDirectorFailed({
                errormessage: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createDirector' is called */
  deleteDirector$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.deleteDirector),
      mergeMap(
        ({ directorToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.directorsService.deleteDirector(directorToDelete).pipe(
            map(() =>
              DirectorActions.deleteDirectorSuccess({
                directorToDelete: directorToDelete,
                page: page,
                limit: limit,
                orderBy: orderBy,
                sortOrder: sortOrder,
                searchString: searchString,
              }),
            ),
            catchError(() => EMPTY), // TODO: error handling
          ),
      ),
    ),
  );

  reloadAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.deleteDirectorSuccess),
      mergeMap(
        ({ directorToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.directorsService
            .getDirectors(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                DirectorActions.getDirectorsSuccess({ pagination: pagination }),
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
