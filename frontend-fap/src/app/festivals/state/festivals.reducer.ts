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
    selectedFestival:
      pagination.items.filter(
        (item) => item.id == state?.selectedFestival?.id,
      )[0] ?? null,
  })),
  on(FestivalActions.getFestivalSuccess, (state, { festival }) => ({
    ...state,
    detailsFestival: festival,
  })),
  on(FestivalActions.setSelectedFestival, (state, { selectedFestival }) => ({
    ...state,
    selectedFestival: selectedFestival,
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
