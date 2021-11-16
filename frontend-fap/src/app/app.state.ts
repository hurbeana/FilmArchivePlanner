import {Movie} from "./movies/models/movie";
/* The state of the application*/

export interface PaginationState{
  items: Movie[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  }
}

export interface AppState {
  pagination: PaginationState,
  selectedMovie: Movie|null,
  searchTerm: string
}
