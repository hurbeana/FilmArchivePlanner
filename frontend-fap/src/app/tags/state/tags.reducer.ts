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
    selectedTag:
      pagination.items.filter((item) => item.id == state?.selectedTag?.id)[0] ??
      null,
  })),
  on(TagActions.createTag, (state) => state),

  on(TagActions.setSelectedTag, (state, { selectedTag }) => ({
    ...state,
    selectedTag: selectedTag,
  })),
);
