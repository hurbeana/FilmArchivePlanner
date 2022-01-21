import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { MessageService } from '../../core/services/message.service';

@Injectable()
export class DirectorEffects {
  constructor(
    private actions$: Actions,
    private messageService: MessageService,
  ) {}
}
