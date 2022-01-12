import { createReducer, on } from '@ngrx/store';
import * as FestivalActions from './festivals.actions';
import { FestivalsState } from '../../app.state';

export const initialState: FestivalsState = {
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
  selectedFestival: null,
};

export const festivalsReducer = createReducer(
  initialState,
  on(FestivalActions.getFestivals, (state) => state),
  on(FestivalActions.getFestivalsSuccess, (state, { pagination }) => ({
    ...state,
    pagination: {
      ...pagination,
      items: [...pagination.items],
      meta: { ...pagination.meta },
    },
    selectedFestival: null,
  })),
  on(FestivalActions.createFestival, (state) => state),
  on(FestivalActions.createFestivalSuccess, (state, { festival }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items:
        state.pagination.items.length === state.pagination.meta.itemsPerPage
          ? [...state.pagination.items]
          : [...state.pagination.items, festival],
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
  on(FestivalActions.setSelectedFestival, (state, { selectedFestival }) => ({
    ...state,
    selectedFestival: selectedFestival,
  })),

  on(FestivalActions.updateFestivalSuccess, (state, { festival }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [
        ...state.pagination.items.map((stateFestival) =>
          stateFestival.id === festival.id ? festival : stateFestival,
        ),
      ],
    },
    selectedFestival: festival,
  })),

  on(FestivalActions.deleteFestivalSuccess, (state, { festivalToDelete }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      items: [
        ...state.pagination.items.filter(
          (item) => item.id !== festivalToDelete.id,
        ),
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
