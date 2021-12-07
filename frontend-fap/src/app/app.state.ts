import { Movie } from './movies/models/movie';
import { Director } from './directors/models/director';
import { Contact } from './contacts/models/contact';

/* The state of the application*/
export interface PaginationState {
  // TODO rename to MoviesPaginationState
  items: Movie[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface DirectorsPaginationState {
  items: Director[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ContactsPaginationState {
  items: Contact[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface AppState {
  // TODO rename to MoviesState
  pagination: PaginationState; // TODO rename to moviesPagination : MoviesPaginationState
  selectedMovie?: Movie;
  detailsMovie?: Movie; // movie which is loaded by id for fullscreen detailsview
  searchTerm: string;
}

export interface DirectorsState {
  pagination: DirectorsPaginationState;
  selectedDirector?: Director | null;
  searchTerm: string;
}

export interface ContactsState {
  pagination: ContactsPaginationState;
  selectedContact?: Contact | null;
  searchTerm: string;
}
