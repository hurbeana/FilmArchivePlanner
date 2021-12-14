import { createAction, props } from '@ngrx/store';
import { Contact } from '../models/contact';
import { CreateUpdateContactDto } from '../models/create.contact';
import { ContactsPaginationState } from '../../app.state';

/* whenever this action is called, the 'getContacts$' effect in contacts.effects.ts  is executed */
export const getContacts = createAction(
  '[Contact List] Get Contacts',
  props<{
    page: number;
    limit: number;
    orderBy?: string;
    sortOrder?: string;
    searchString?: string;
  }>(),
);
export const getContactsSuccess = createAction(
  '[Contacts List] Loaded Contacts Success',
  props<{ pagination: ContactsPaginationState }>(),
);

/* whenever this action is called, the 'createContact$' effect in contacts.effects.ts  is executed */
export const createContact = createAction(
  '[Contact List] Create Contact',
  props<{ contact: CreateUpdateContactDto }>(),
);
export const createContactSuccess = createAction(
  '[Contact List] Created Contact Success',
  props<{ contact: Contact }>(),
);

export const setSelectedContact = createAction(
  '[Contact List] Set Selected Contact',
  props<{ selectedContact: Contact }>(),
);

export const updateContact = createAction(
  '[Contact List] Update Contact',
  props<{
    contact: CreateUpdateContactDto;
    id: number;
  }>(),
);
export const updateContactSuccess = createAction(
  '[Contact List] Update Contact Success',
  props<{
    contact: Contact;
  }>(),
);

export const deleteContact = createAction(
  '[Contact List] Remove Contact',
  props<{
    contactToDelete: Contact;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const deleteContactSuccess = createAction(
  '[Contact List] Remove Contact Success',
  props<{
    contactToDelete: Contact;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
