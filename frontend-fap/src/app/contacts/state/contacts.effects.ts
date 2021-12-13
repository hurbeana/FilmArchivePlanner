import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { ContactService } from '../services/contact.service';
import * as ContactActions from './contacts.actions';

@Injectable()
export class ContactEffects {
  constructor(
    private actions$: Actions,
    private contactsService: ContactService
  ) {}

  /* is called, whenever an action of type 'getContacts' is called */
  getContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.getContacts),
      switchMap(({ page, limit, orderBy, sortOrder, searchString }) =>
        this.contactsService
          .getContacts(page, limit, orderBy, sortOrder, searchString)
          .pipe(
            map((pagination) =>
              ContactActions.getContactsSuccess({ pagination: pagination })
            ),
            catchError(() => EMPTY) // TODO: error handling
          )
      )
    )
  );

  /* is called, whenever an action of type 'createContact' is called */
  createContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.createContact),
      switchMap(({ contact }) =>
        this.contactsService.createContact(contact).pipe(
          map((contact) => ContactActions.createContactSuccess({ contact })),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );

  /* is called, whenever an action of type 'createTag' is called */
  updateContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.updateContact),
      switchMap(({ contact, id }) =>
        this.contactsService.updateContact(contact, id).pipe(
          map((contact) => ContactActions.updateContactSuccess({ contact })),
          catchError(() => EMPTY) // TODO: error handling
        )
      )
    )
  );

  /* is called, whenever an action of type 'createMovie' is called */
  deleteContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.deleteContact),
      mergeMap(
        ({ contactToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.contactsService.deleteContact(contactToDelete).pipe(
            map(() =>
              ContactActions.deleteContactSuccess({
                contactToDelete: contactToDelete,
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
      ofType(ContactActions.deleteContactSuccess),
      mergeMap(
        ({ contactToDelete, page, limit, orderBy, sortOrder, searchString }) =>
          this.contactsService
            .getContacts(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                ContactActions.getContactsSuccess({ pagination: pagination })
              ),
              catchError(() => EMPTY) // TODO: error handling
            )
      )
    )
  );
}
