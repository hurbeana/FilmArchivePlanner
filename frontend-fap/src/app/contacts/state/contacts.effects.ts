import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ContactService } from '../services/contact.service';
import * as ContactActions from './contacts.actions';
import { MessageService } from '../../core/services/message.service';

@Injectable()
export class ContactEffects {
  constructor(
    private actions$: Actions,
    private contactsService: ContactService,
    private messageService: MessageService,
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
              ContactActions.getContactsSuccess({ pagination: pagination }),
            ),
            catchError(() => EMPTY), // TODO: error handling
          ),
      ),
    ),
  );

  getContactByIdAndSetAsSelectedContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.getContactByIdAndSetAsSelectedContact),
      switchMap(({ id }) =>
        this.contactsService.getContact(id).pipe(
          map((contact) =>
            ContactActions.getContactByIdAndSetAsSelectedContactSuccess({
              contact: contact,
            }),
          ),
          catchError(() => EMPTY), // TODO: error handling
        ),
      ),
    ),
  );

  /* is called, whenever an action of type 'createContact' is called */
  createContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.createContact),
      mergeMap(
        ({ contactToCreate, page, limit, orderBy, sortOrder, searchString }) =>
          this.contactsService.createContact(contactToCreate).pipe(
            map((createdContact) =>
              ContactActions.createContactSuccess({
                createdContact: createdContact,
                page: page,
                limit: limit,
                orderBy: orderBy,
                sortOrder: sortOrder,
                searchString: searchString,
              }),
            ),
            tap((_) =>
              this.messageService.showSuccessSnackBar(
                'Contact created successfully',
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
  updateContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.updateContact),
      switchMap(({ contact, id }) =>
        this.contactsService.updateContact(contact, id).pipe(
          map((contact) =>
            ContactActions.updateContactSuccess({
              contact,
            }),
          ),
          tap((_) =>
            this.messageService.showSuccessSnackBar(
              'Contact updated successfully',
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

  /* is called, whenever an action of type 'createContact' is called */
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
              }),
            ),
            tap((_) =>
              this.messageService.showSuccessSnackBar(
                'Contact deleted successfully',
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
      ofType(ContactActions.createContactSuccess),
      mergeMap(
        ({ createdContact, page, limit, orderBy, sortOrder, searchString }) =>
          this.contactsService
            .getContacts(page, limit, orderBy, sortOrder, searchString)
            .pipe(
              map((pagination) =>
                ContactActions.getContactsSuccess({ pagination: pagination }),
              ),
              catchError(() => EMPTY), // TODO: error handling
            ),
      ),
    ),
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
                ContactActions.getContactsSuccess({ pagination: pagination }),
              ),
              catchError(() => EMPTY), // TODO: error handling
            ),
      ),
    ),
  );
}
