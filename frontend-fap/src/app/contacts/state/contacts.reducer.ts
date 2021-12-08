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
  },
  selectedContact: null,
  searchTerm: '',
};

export const contactsReducer = createReducer(
  initialState,
  on(ContactActions.getContacts, (state) => state),
  on(ContactActions.getContactsSuccess, (state, { pagination }) => ({
    ...state,
    pagination: {
      items: [...pagination.items],
      meta: { ...pagination.meta },
    },
  })),
  on(ContactActions.createContact, (state) => state),
  on(ContactActions.createContactSuccess, (state, { contact }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items:
        state.pagination.items.length === state.pagination.meta.itemsPerPage
          ? [...state.pagination.items]
          : [...state.pagination.items, contact],
      meta: {
        ...state.pagination.meta,
        totalItems: state.pagination.meta.totalItems + 1,
        totalPages:
          state.pagination.items.length === state.pagination.meta.itemsPerPage
            ? state.pagination.meta.totalPages + 1
            : state.pagination.meta.totalPages,
      },
    },
  })),
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
          stateContact.id === contact.id ? contact : stateContact
        ),
      ],
    },
    selectedContact: contact,
  })),

  on(ContactActions.deleteContactSuccess, (state, { contactToDelete }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [
        ...state.pagination.items.filter(
          (item) => item.id !== contactToDelete.id
        ),
      ],
      meta: {
        ...state.pagination.meta,
        totalItems:
          state.pagination.meta.totalItems === 0
            ? 0
            : state.pagination.meta.totalItems - 1,
        totalPages:
          state.pagination.items.length === state.pagination.meta.itemsPerPage
            ? state.pagination.meta.totalPages + 1
            : state.pagination.meta.totalPages,
        currentPage:
          state.pagination.items.length === 1
            ? state.pagination.meta.currentPage - 1
            : state.pagination.meta.currentPage,
      },
    },
  }))
);
