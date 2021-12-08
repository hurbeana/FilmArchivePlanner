import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactsState } from '../../app.state';

//feature "contacts" has to exist in app.state.ts
export const contacts = createFeatureSelector<ContactsState>('contacts');

export const pagination = createFeatureSelector<ContactsState>('pagination');

export const selectedContact =
  createFeatureSelector<ContactsState>('selectedContact');

export const selectContacts = createSelector(
  pagination,
  (state: ContactsState) => {
    return state.pagination.items;
  }
);

export const selectSelectedContact = createSelector(
  selectedContact,
  (state: ContactsState) => {
    return state.selectedContact;
  }
);

export const selectTotalItems = createSelector(
  pagination,
  (state: ContactsState) => {
    return state.pagination.meta.totalItems;
  }
);
export const selectItemCount = createSelector(
  pagination,
  (state: ContactsState) => {
    return state.pagination.meta.itemCount;
  }
);
export const selectItemsPerPage = createSelector(
  pagination,
  (state: ContactsState) => {
    return state.pagination.meta.itemsPerPage;
  }
);
export const selectTotalPages = createSelector(
  pagination,
  (state: ContactsState) => {
    return state.pagination.meta.totalPages;
  }
);
export const selectCurrentPage = createSelector(
  pagination,
  (state: ContactsState) => {
    return state.pagination.meta.currentPage;
  }
);
