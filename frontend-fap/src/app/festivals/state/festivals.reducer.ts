import { createReducer, on } from '@ngrx/store';
import * as FestivalActions from './festivals.actions';
import { FestivalsState } from '../../app.state';
import * as MovieActions from '../../movies/state/movies.actions';

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
  on(FestivalActions.getFestival, (state) => state),
  on(FestivalActions.getFestivalSuccess, (state, { festival }) => ({
    ...state,
    detailsFestival: festival,
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
    detailsFestival: festival,
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
  on(
    FestivalActions.createFestivalEventSuccess,
    (state, { festivalEvent }) => ({
      ...state,
      ...(state.detailsFestival && {
        detailsFestival: {
          ...state.detailsFestival,
          events: [...state.detailsFestival.events, festivalEvent],
        },
      }),
    }),
  ),
  on(
    FestivalActions.updateFestivalEventSuccess,
    (state, { festivalEvent }) => ({
      ...state,
      ...(state.detailsFestival && {
        detailsFestival: {
          ...state.detailsFestival,
          events: state.detailsFestival?.events.map((x) =>
            x.id === festivalEvent.id ? festivalEvent : x,
          ),
        },
      }),
    }),
  ),
  on(
    FestivalActions.deleteFestivalEventSuccess,
    (state, { festivalEventToDelete }) => ({
      ...state,
      ...(state.detailsFestival && {
        detailsFestival: {
          ...state.detailsFestival,
          events: state.detailsFestival?.events.filter(
            (x) => x.id !== festivalEventToDelete.id, //update event
          ),
        },
      }),
    }),
  ),
);
