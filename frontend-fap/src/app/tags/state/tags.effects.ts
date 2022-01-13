import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { TagService } from '../services/tag.service';
import * as TagActions from './tags.actions';
import { MessageService } from '../../core/services/message.service';

@Injectable()
export class TagEffects {
  constructor(
    private actions$: Actions,
    private tagsService: TagService,
    private messageService: MessageService,
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
              TagActions.getTagsSuccess({ pagination: pagination }),
            ),
            catchError(() => EMPTY), // TODO: error handling
          ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createTag' is called */
  createTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.createTag),
      switchMap(({ tag }) =>
        this.tagsService.createTag(tag).pipe(
          map((tag) => TagActions.createTagSuccess({ tag })),
          tap((_) =>
            this.messageService.showSuccessSnackBar('Tag created successfully'),
          ),
          catchError((err) => {
            this.messageService.showErrorSnackBar(err);
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  checkIfTagIsInUse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.checkIfTagIsInUse),
      switchMap(({ tag }) =>
        this.tagsService.checkIfTagIsInUse(tag).pipe(
          map((isInUse: boolean) =>
            TagActions.checkIfTagIsInUseSuccess({ isInUse }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createTag' is called */
  updateTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagActions.updateTag),
      switchMap(({ tag, id }) =>
        this.tagsService.updateTag(tag, id).pipe(
          map((tag) => TagActions.updateTagSuccess({ tag })),
          tap((_) =>
            this.messageService.showSuccessSnackBar('Tag updated successfully'),
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
              }),
            ),
            tap((_) =>
              this.messageService.showSuccessSnackBar(
                'Tag deleted successfully',
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
      ofType(TagActions.deleteTagSuccess),
      mergeMap(
        ({ tagToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.tagsService
            .getTags(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                TagActions.getTagsSuccess({ pagination: pagination }),
              ),
              catchError(() => EMPTY), // TODO: error handling
            ),
      ),
    ),
  );
}
