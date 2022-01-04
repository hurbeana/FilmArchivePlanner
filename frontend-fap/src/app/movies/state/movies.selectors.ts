import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AppState,
  ContactsState,
  DirectorsState,
  TagsState,
} from '../../app.state';

//feature "movies" has to exist in app.state.ts
//export const movies = createFeatureSelector<AppState>('movies');

export const pagination = createFeatureSelector<AppState>('pagination');
export const selectedMovie = createFeatureSelector<AppState>('selectedMovie');

export const selectSelectedMovie = createSelector(
  selectedMovie,
  (state: AppState) => {
    return state.selectedMovie;
  },
);

export const selectDirectorspagination = createFeatureSelector<DirectorsState>(
  'directorsPagination',
);
export const selectContactspagination =
  createFeatureSelector<ContactsState>('contactsPagination');
export const selectTagspagination =
  createFeatureSelector<TagsState>('tagsPagination');

/* fk dropdowns*/
export const selectDirectorItems = createSelector(
  selectDirectorspagination,
  (state: DirectorsState) => {
    return state.pagination.items;
  },
);

export const selectContactItems = createSelector(
  selectContactspagination,
  (state: ContactsState) => {
    return state.pagination.items;
  },
);

export const selectTagsAnimationItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Animation');
  },
);

export const selectTagsCategoryItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Category');
  },
);

export const selectTagsContactItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Contact');
  },
);

export const selectTagsCountryItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Country');
  },
);

export const selectTagsKeywordItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Keyword');
  },
);

export const selectTagsLanguageItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Language');
  },
);

export const selectTagsSoftwareItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Software');
  },
);

export const selectTagsSelectionItems = createSelector(
  selectTagspagination,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Selection');
  },
);

export const selectMovies = createSelector(pagination, (state: AppState) => {
  return state.pagination.items;
});
export const selectMovie = createSelector(selectedMovie, (state: AppState) => {
  return state.selectedMovie;
});

export const selectDetailsMovie = createSelector(
  selectedMovie,
  (state: AppState) => {
    return state.detailsMovie;
  },
);

export const selectTotalItems = createSelector(
  pagination,
  (state: AppState) => {
    return state.pagination.meta.totalItems;
  },
);
export const selectItemCount = createSelector(pagination, (state: AppState) => {
  return state.pagination.meta.itemCount;
});
export const selectItemsPerPage = createSelector(
  pagination,
  (state: AppState) => {
    return state.pagination.meta.itemsPerPage;
  },
);
export const selectTotalPages = createSelector(
  pagination,
  (state: AppState) => {
    return state.pagination.meta.totalPages;
  },
);
export const selectCurrentPage = createSelector(
  pagination,
  (state: AppState) => {
    return state.pagination.meta.currentPage;
  },
);
