import { Movie } from './movies/models/movie';
import { Director } from './directors/models/director';
import { Contact } from './contacts/models/contact';
import { Tag } from './tags/models/tag';
import { Festival } from './festivals/models/festival';
import { NgModule } from '@angular/core';

/* The state of the application*/
export interface MoviesPaginationState {
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

export interface AdvancedSearchState {
  loading: boolean;
  selectedTagIDs: number[];
  negativeTagIDs: number[];
  exactYear: number;
  fromYear: number;
  toYear: number;
  exactLength: number;
  fromLength: number;
  toLength: number;
  hasDialogue: number;
  hasSubtitles: number;
  isStudentFilm: number;
  hasDCP: number;
  selectedDirectorIDs: number[];
  selectedContactIDs: number[];
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

export interface MoviesState {
  pagination: MoviesPaginationState;
  selectedMovie?: Movie | null; // movie is loaded by id for details-view
  detailsMovie?: Movie; // movie is loaded by id for full-detail-view and edit-view
  advancedSearchState: AdvancedSearchState;
}

export interface DirectorsState {
  pagination: DirectorsPaginationState;
  selectedDirector?: Director | null;
  detailsDirector?: Director; // director is loaded by id for full-detail-view and edit-view
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
  detailsFestival?: Festival; // festival which is loaded by id for fullscreen detailsview
}
