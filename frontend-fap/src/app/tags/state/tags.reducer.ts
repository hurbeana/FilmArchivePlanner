import { createReducer, on } from '@ngrx/store';
import * as TagActions from './tags.actions';
import { TagsState } from '../../app.state';

export const initialState: TagsState = {
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
  selectedTag: null,
};

export const tagsReducer = createReducer(
  initialState,
  on(TagActions.getTags, (state) => state),
  on(TagActions.getTagsSuccess, (state, { pagination }) => ({
    ...state,
    pagination: {
      ...pagination,
      items: [...pagination.items],
      meta: { ...pagination.meta },
    },
  })),
  on(TagActions.createTag, (state) => state),
  on(TagActions.createTagSuccess, (state, { tag }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items:
        state.pagination.items.length === state.pagination.meta.itemsPerPage
          ? [...state.pagination.items]
          : [...state.pagination.items, tag],
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

  on(TagActions.setSelectedTag, (state, { selectedTag }) => ({
    ...state,
    selectedTag: selectedTag,
  })),

  on(TagActions.updateTagSuccess, (state, { tag }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [
        ...state.pagination.items.map((stateTag) =>
          stateTag.id === tag.id ? tag : stateTag,
        ),
      ],
    },
    selectedTag: tag,
  })),

  on(TagActions.deleteTagSuccess, (state, { tagToDelete }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [
        ...state.pagination.items.filter((item) => item.id !== tagToDelete.id),
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
  })),
);
