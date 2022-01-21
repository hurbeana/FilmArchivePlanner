import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { DirectorService } from '../services/director.service';
import * as DirectorActions from './directors.actions';
import { MessageService } from '../../core/services/message.service';
import * as LoadingItemsActions from '../../core/loading-item-state/loading.items.actions';

@Injectable()
export class DirectorEffects {
  constructor(
    private actions$: Actions,
    private directorsService: DirectorService,
    private messageService: MessageService,
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
                errormessage: this.messageService.getErrorMessage(error),
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
      switchMap(({ director, page, limit, orderBy, sortOrder, searchString }) =>
        this.directorsService.createDirector(director).pipe(
          map((createdDirector) =>
            DirectorActions.createDirectorSuccess({
              director: createdDirector,
              page: page,
              limit: limit,
              orderBy: orderBy,
              sortOrder: sortOrder,
              searchString: searchString,
            }),
          ),
          catchError((error) =>
            of(
              DirectorActions.createDirectorFailed({
                director: director,
                errormessage: this.messageService.getErrorMessage(error),
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
      switchMap(
        ({ id, director, page, limit, orderBy, sortOrder, searchString }) =>
          this.directorsService.updateDirector(id, director).pipe(
            map((updatedDirector) =>
              DirectorActions.updateDirectorSuccess({
                director: updatedDirector,
                page: page,
                limit: limit,
                orderBy: orderBy,
                sortOrder: sortOrder,
                searchString: searchString,
              }),
            ),
            catchError((error) =>
              of(
                DirectorActions.updateDirectorFailed({
                  director: director,
                  errormessage: this.messageService.getErrorMessage(error),
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
      mergeMap(({ director, page, limit, orderBy, sortOrder, searchString }) =>
        this.directorsService.deleteDirector(director).pipe(
          map(() =>
            DirectorActions.deleteDirectorSuccess({
              deletedDirector: director,
              page: page,
              limit: limit,
              orderBy: orderBy,
              sortOrder: sortOrder,
              searchString: searchString,
            }),
          ),
          tap((_) =>
            this.messageService.showSuccessSnackBar(
              'Director deleted successfully',
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

  reloadAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.createDirectorSuccess),
      mergeMap(({ director, page, limit, orderBy, sortOrder, searchString }) =>
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

  reloadAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.updateDirectorSuccess),
      mergeMap(({ director, page, limit, orderBy, sortOrder, searchString }) =>
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

  reloadAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DirectorActions.deleteDirectorSuccess),
      mergeMap(
        ({ deletedDirector, page, limit, orderBy, sortOrder, searchString }) =>
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

  deleteLoadingItemDirectorSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DirectorActions.createDirectorSuccess,
        DirectorActions.createDirectorFailed,
        DirectorActions.updateDirectorSuccess,
        DirectorActions.updateDirectorFailed,
      ),
      map((result) =>
        LoadingItemsActions.deleteLoadingItem({
          loadingItemToDelete: {
            title: result.director.firstName + ' ' + result.director.lastName,
          },
        }),
      ),
    ),
  );
}
