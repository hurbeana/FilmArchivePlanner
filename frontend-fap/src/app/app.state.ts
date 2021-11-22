import {Movie} from "./movies/models/movie";
import {Director} from "./directors/models/director";
/* The state of the application*/

export interface PaginationState{ // TODO rename to MoviesPaginationState
  items: Movie[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  }
}

export interface DirectorsPaginationState{
  items: Director[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  }
}

export interface AppState { // TODO rename to MoviesState
  pagination: PaginationState, // TODO rename to moviesPagination : MoviesPaginationState
  selectedMovie: Movie|null,
  searchTerm: string
}

export interface DirectorsState {
  pagination: DirectorsPaginationState,
  selectedDirector?: Director|null,
  searchTerm: string
}
