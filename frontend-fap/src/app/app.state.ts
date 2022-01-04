import { Movie } from './movies/models/movie';
import { Director } from './directors/models/director';
import { Contact } from './contacts/models/contact';
import { Tag } from './tags/models/tag';
import { Festival } from './festivals/models/festival';

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
  searchString: string;
  orderBy: string;
  sortOrder: string;
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
  searchString: string;
  orderBy: string;
  sortOrder: string;
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
  searchString: string;
  orderBy: string;
  sortOrder: string;
}

export interface TagsPaginationState {
  items: Tag[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  searchString: string;
  orderBy: string;
  sortOrder: string;
}

export interface FestivalsPaginationState {
  items: Festival[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  searchString: string;
  orderBy: string;
  sortOrder: string;
}

export interface AppState {
  // TODO rename to MoviesState
  pagination: PaginationState;
  selectedMovie?: Movie | null;
  detailsMovie?: Movie; // movie which is loaded by id for fullscreen detailsview
}

export interface DirectorsState {
  pagination: DirectorsPaginationState;
  selectedDirector?: Director | null;
  detailsDirector?: Director; // director which is loaded by id for fullscreen detailsview
}

export interface ContactsState {
  pagination: ContactsPaginationState;
  selectedContact?: Contact | null;
}

export interface TagsState {
  pagination: TagsPaginationState;
  selectedTag?: Tag | null;
}

export interface FestivalsState {
  pagination: FestivalsPaginationState;
  selectedFestival?: Festival | null;
}
