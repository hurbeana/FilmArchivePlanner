import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from "../../app.state";

//feature "movies" has to exist in app.state.ts
export const movies = createFeatureSelector<AppState>('movies');

export const selectNumberOfMovies = createSelector(movies, (state) => { console.log("numberOfMovies", state.movies.length); return state.movies.length});
export const selectAllMovies = createSelector(movies, (state) => { console.log("STATE", state); return state.movies});

/* STUFF THAT SHOULD RUN IN BACKEND over effects */
//export const selectMoviesWithOffsetAndLimit = createSelector(movies, (state) => {return state.movies.slice((state.page - 1) * state.pageSize, (state.page - 1) * state.pageSize + state.pageSize)});

export const searchTerm = createFeatureSelector<AppState>('searchTerm');
export const selectSearchTerm = createSelector(searchTerm, (state) => { console.log("searchTerm", state.searchTerm); return state.searchTerm});

