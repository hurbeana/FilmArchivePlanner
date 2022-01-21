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

export const getContactByIdAndSetAsSelectedContact = createAction(
  '[Contacts List] Load Contact by ID and set as Selected Contact',
  props<{ id: number }>(),
);
export const getContactByIdAndSetAsSelectedContactSuccess = createAction(
  '[Contacts List] Load Contact by ID and set as Selected Contact Success',
  props<{ contact: Contact }>(),
);

/* whenever this action is called, the 'createContact$' effect in contacts.effects.ts  is executed */
export const createContact = createAction(
  '[Contact List] Create Contact',
  props<{
    contactToCreate: Contact;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const createContactSuccess = createAction(
  '[Contact List] Created Contact Success',
  props<{
    createdContact: Contact;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);

export const setSelectedContact = createAction(
  '[Contact List] Set Selected Contact',
  props<{ selectedContact: Contact | null }>(),
);

export const updateContact = createAction(
  '[Contact List] Update Contact',
  props<{
    id: number;
    newContact: CreateUpdateContactDto;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const updateContactSuccess = createAction(
  '[Contact List] Update Contact Success',
  props<{
    updatedContact: Contact;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
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
    deletedContact: Contact;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
