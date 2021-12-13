import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TagService } from '../services/tag.service';
import * as TagActions from './tags.actions';
import { checkIfTagIsInUse } from './tags.actions';
import { MovieService } from '../../movies/services/movie.service';

@Injectable()
export class TagEffects {
  constructor(
    private actions$: Actions,
    private tagsService: TagService,
    private moviesService: MovieService
  ) {}

  /* is called, whenever an action of type 'getTags' is called */
  getTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.getTags),
      switchMap(({ page, limit, orderBy, sortOrder, searchString }) =>
        this.tagsService
          .getTags(page, limit, orderBy, sortOrder, searchString)
          .pipe(
            map((pagination) =>
              TagActions.getTagsSuccess({ pagination: pagination })
            ),
            catchError(() => EMPTY) // TODO: error handling
          )
      )
    )
  );

  /* is called, whenever an action of type 'createTag' is called */
  createTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.createTag),
      switchMap(({ tag }) =>
        this.tagsService.createTag(tag).pipe(
          map((tag) => TagActions.createTagSuccess({ tag })),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );

  checkIfTagIsInUse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.checkIfTagIsInUse),
      switchMap(({ tag }) =>
        this.tagsService.checkIfTagIsInUse(tag).pipe(
          map((isInUse: Boolean) =>
            TagActions.checkIfTagIsInUseSuccess({ isInUse })
          ),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );

  /* is called, whenever an action of type 'createTag' is called */
  updateTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.updateTag),
      switchMap(({ tag, id }) =>
        this.tagsService.updateTag(tag, id).pipe(
          map((tag) => TagActions.updateTagSuccess({ tag })),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );

  /* is called, whenever an action of type 'createMovie' is called */
  deleteTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.deleteTag),
      mergeMap(
        ({ tagToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.tagsService.deleteTag(tagToDelete).pipe(
            map(() =>
              TagActions.deleteTagSuccess({
                tagToDelete: tagToDelete,
                page: page,
                limit: limit,
                orderBy: orderBy,
                sortOrder: sortOrder,
                searchString: searchString,
              })
            ),
            catchError(() => EMPTY) // TODO: error handling
          )
      )
    )
  );

  reloadAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.deleteTagSuccess),
      mergeMap(
        ({ tagToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.tagsService
            .getTags(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                TagActions.getTagsSuccess({ pagination: pagination })
              ),
              catchError(() => EMPTY) // TODO: error handling
            )
      )
    )
  );
}
