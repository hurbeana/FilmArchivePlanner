import { createReducer, on } from '@ngrx/store';
import * as ContactActions from './contacts.actions';
import { ContactsState } from '../../app.state';

export const initialState: ContactsState = {
  pagination: {
    items: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 16,
      totalPages: 0,
      currentPage: 1,
    },
    searchString: '',
    orderBy: '',
    sortOrder: '',
  },
};

export const contactsReducer = createReducer(
  initialState,
  on(ContactActions.getContacts, (state) => state),
  on(ContactActions.getContactsSuccess, (state, { pagination }) => ({
    ...state,
    pagination: {
      ...pagination,
      items: [...pagination.items],
      meta: { ...pagination.meta },
    },
    selectedContact: null,
  })),
  on(ContactActions.getContactByIdAndSetAsSelectedContact, (state) => state),
  on(
    ContactActions.getContactByIdAndSetAsSelectedContactSuccess,
    (state, { contact }) => ({
      ...state,
      selectedContact: contact,
    }),
  ),
  on(ContactActions.createContact, (state) => state),
  on(ContactActions.createContactSuccess, (state) => state),
  on(ContactActions.setSelectedContact, (state, { selectedContact }) => ({
    ...state,
    selectedContact: selectedContact,
  })),

  on(ContactActions.updateContactSuccess, (state, { contact }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [
        ...state.pagination.items.map((stateContact) =>
          stateContact.id === contact.id ? contact : stateContact,
        ),
      ],
    },
    selectedContact: contact,
  })),

  on(ContactActions.deleteContactSuccess, (state) => state),
);
