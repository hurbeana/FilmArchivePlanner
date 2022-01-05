import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  MoviesState,
  DirectorsState,
  ContactsState,
  TagsState,
} from '../../app.state';

/* feature selector */
/* corresponds to "StoreModule.forRoot({ moviesState: moviesReducer })" */
export const moviesState = createFeatureSelector<MoviesState>('moviesState');

/* helper selectors */
const paginationState = createSelector(moviesState, (s: MoviesState) => {
  return s.pagination;
});
const metaState = createSelector(paginationState, (p: any) => {
  return p.meta;
});

/* selectedMovie */
export const selectSelectedMovie = createSelector(
  moviesState,
  (s: MoviesState) => {
    return s.selectedMovie;
  },
);

/* detailsMovie */
export const selectDetailsMovie = createSelector(
  moviesState,
  (s: MoviesState) => {
    return s.detailsMovie;
  },
);

export const advancedSearchState = createFeatureSelector<MoviesState>(
  'advancedSearchState',
);

/* pagination */
export const selectMovies = createSelector(paginationState, (p: any) => {
  return p.items;
});
export const selectOrderBy = createSelector(paginationState, (p: any) => {
  return p.orderBy;
});
export const selectSortOrder = createSelector(paginationState, (p: any) => {
  return p.sortOrder;
});
export const selectSearchString = createSelector(paginationState, (p: any) => {
  return p.searchString;
});

/* meta */
export const selectTotalItems = createSelector(metaState, (m: any) => {
  return m.totalItems;
});
export const selectItemCount = createSelector(metaState, (m: any) => {
  return m.itemCount;
});
export const selectItemsPerPage = createSelector(metaState, (m: any) => {
  return m.itemsPerPage;
});
export const selectTotalPages = createSelector(metaState, (m: any) => {
  return m.totalPages;
});
export const selectCurrentPage = createSelector(metaState, (m: any) => {
  return m.currentPage;
});

/* internal states */
export const directorsState =
  createFeatureSelector<DirectorsState>('directorsState');
export const contactsState =
  createFeatureSelector<ContactsState>('contactsState');
export const tagsState = createFeatureSelector<TagsState>('tagsState');

/* Dropdown items: directors, contacts, tags */
export const selectDirectorItems = createSelector(
  directorsState,
  (state: DirectorsState) => {
    return state.pagination.items;
  },
);

export const selectContactItems = createSelector(
  contactsState,
  (state: ContactsState) => {
    return state.pagination.items;
  },
);

/* TODO selectors for tagTypes are not needed and should be retreived diretly from Tag Component */
export const selectTagsAnimationItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Animation');
  },
);

export const selectTagsCategoryItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Category');
  },
);

export const selectTagsContactItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Contact');
  },
);

export const selectTagsCountryItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Country');
  },
);

export const selectTagsKeywordItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Keyword');
  },
);

export const selectTagsLanguageItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Language');
  },
);

export const selectTagsSoftwareItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Software');
  },
);

export const selectTagsSelectionItems = createSelector(
  tagsState,
  (state: TagsState) => {
    return state.pagination.items.filter((t) => t.type === 'Selection');
  },
);

export const selectAdvancedSearchState = createSelector(
  advancedSearchState,
  (state: MoviesState) => {
    return state.advancedSearchState;
  },
);
