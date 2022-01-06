import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { FestivalService } from '../services/festival.service';
import * as FestivalActions from './festivals.actions';

@Injectable()
export class FestivalEffects {
  constructor(
    private actions$: Actions,
    private festivalsService: FestivalService,
  ) {}

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
      switchMap(({ festival }) =>
        this.festivalsService.createFestival(festival).pipe(
          map((festival) =>
            FestivalActions.createFestivalSuccess({ festival }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createTag' is called */
  updateFestival$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FestivalActions.updateFestival),
      switchMap(({ festival, id }) =>
        this.festivalsService.updateFestival(festival, id).pipe(
          map((festival) =>
            FestivalActions.updateFestivalSuccess({ festival }),
          ),
          catchError(() => EMPTY), // TODO: error handling
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
                festivalToDelete: festivalToDelete,
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
      ofType(FestivalActions.deleteFestivalSuccess),
      mergeMap(
        ({ festivalToDelete, page, limit, orderBy, sortOrder, searchString }) =>
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
}