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
      switchMap(({ director }) =>
        this.directorsService.createDirector(director).pipe(
          map((director) =>
            DirectorActions.createDirectorSuccess({ director }),
          ),
          catchError((error) =>
            of(
              DirectorActions.createDirectorFailed({
                director,
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
                director,
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

  deleteLoadinItemDirectorSucess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DirectorActions.createDirectorSuccess,
        DirectorActions.createDirectorFailed,
        DirectorActions.updateDirectorSuccess,
        DirectorActions.updateDirectorFailed,
      ),
      map((director) =>
        LoadingItemsActions.deleteLoadingItem({
          loadingItemToDelete: {
            title:
              director.director.firstName + ' ' + director.director.lastName,
          },
        }),
      ),
    ),
  );
}
