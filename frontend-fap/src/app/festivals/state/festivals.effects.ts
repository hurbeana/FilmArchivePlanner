import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { FestivalService } from '../services/festival.service';
import * as FestivalActions from './festivals.actions';
import { MessageService } from '../../core/services/message.service';
import { EventService } from '../services/event.service';

@Injectable()
export class FestivalEffects {
  constructor(
    private actions$: Actions,
    private festivalsService: FestivalService,
    private messageService: MessageService,
    private eventService: EventService,
  ) {}

  getFestival$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.getFestival),
      switchMap(({ id }) =>
        this.festivalsService.getFestival(id).pipe(
          map((festival) =>
            FestivalActions.getFestivalSuccess({ festival: festival }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'getFestivals' is called */
  getFestivals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.getFestivals),
      switchMap(({ page, limit, orderBy, sortOrder, searchString }) =>
        this.festivalsService
          .getFestivals(page, limit, orderBy, sortOrder, searchString)
          .pipe(
            map((pagination) =>
              FestivalActions.getFestivalsSuccess({ pagination: pagination }),
            ),
            catchError(() => EMPTY), // TODO: error handling
          ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createFestival' is called */
  createFestival$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.createFestival),
      switchMap(
        ({ festivalToCreate, page, limit, orderBy, sortOrder, searchString }) =>
          this.festivalsService.createFestival(festivalToCreate).pipe(
            map((festival) =>
              FestivalActions.createFestivalSuccess({
                createdFestival: festival,
                page: page,
                limit: limit,
                orderBy: orderBy,
                sortOrder: sortOrder,
                searchString: searchString,
              }),
            ),
            tap((_) =>
              this.messageService.showSuccessSnackBar(
                'Festival created successfully',
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

  /* is called, whenever an action of type 'createTag' is called */
  updateFestival$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.updateFestival),
      switchMap(
        ({ id, newFestival, page, limit, orderBy, sortOrder, searchString }) =>
          this.festivalsService.updateFestival(id, newFestival).pipe(
            map((festival) =>
              FestivalActions.updateFestivalSuccess({
                updatedFestival: festival,
                page: page,
                limit: limit,
                orderBy: orderBy,
                sortOrder: sortOrder,
                searchString: searchString,
              }),
            ),
            tap((_) =>
              this.messageService.showSuccessSnackBar(
                'Festival updated successfully',
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

  /* is called, whenever an action of type 'createMovie' is called */
  deleteFestival$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.deleteFestival),
      mergeMap(
        ({ festivalToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.festivalsService.deleteFestival(festivalToDelete).pipe(
            map(() =>
              FestivalActions.deleteFestivalSuccess({
                deletedFestival: festivalToDelete,
                page: page,
                limit: limit,
                orderBy: orderBy,
                sortOrder: sortOrder,
                searchString: searchString,
              }),
            ),
            tap((_) =>
              this.messageService.showSuccessSnackBar(
                'Festival deleted successfully',
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
      ofType(FestivalActions.createFestivalSuccess),
      mergeMap(
        ({ createdFestival, page, limit, orderBy, sortOrder, searchString }) =>
          this.festivalsService
            .getFestivals(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                FestivalActions.getFestivalsSuccess({ pagination: pagination }),
              ),
              catchError(() => EMPTY), // TODO: error handling
            ),
      ),
    ),
  );

  reloadAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.updateFestivalSuccess),
      mergeMap(
        ({ updatedFestival, page, limit, orderBy, sortOrder, searchString }) =>
          this.festivalsService
            .getFestivals(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                FestivalActions.getFestivalsSuccess({ pagination: pagination }),
              ),
              catchError(() => EMPTY), // TODO: error handling
            ),
      ),
    ),
  );

  reloadAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.deleteFestivalSuccess),
      mergeMap(
        ({ deletedFestival, page, limit, orderBy, sortOrder, searchString }) =>
          this.festivalsService
            .getFestivals(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                FestivalActions.getFestivalsSuccess({ pagination: pagination }),
              ),
              catchError(() => EMPTY), // TODO: error handling
            ),
      ),
    ),
  );

  /* Festival Events */
  /* is called, whenever an action of type 'createFestivalEvent' is called */
  createFestivalEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.createFestivalEvent),
      switchMap(({ festivalEvent }) =>
        this.eventService.createFestivalEvent(festivalEvent).pipe(
          map((festivalEvent) =>
            FestivalActions.createFestivalEventSuccess({ festivalEvent }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'updateFestivalEvent' is called */
  updateFestivalEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.updateFestivalEvent),
      switchMap(({ festivalEvent }) =>
        this.eventService.updateFestivalEvent(festivalEvent).pipe(
          map((festivalEvent) =>
            FestivalActions.updateFestivalEventSuccess({ festivalEvent }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'deleteFestivalEvent' is called */
  deleteFestivalEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.deleteFestivalEvent),
      mergeMap(({ festivalEventToDelete }) =>
        this.eventService.deleteFestivalEvent(festivalEventToDelete).pipe(
          map(() =>
            FestivalActions.deleteFestivalEventSuccess({
              festivalEventToDelete: festivalEventToDelete,
            }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );
}
