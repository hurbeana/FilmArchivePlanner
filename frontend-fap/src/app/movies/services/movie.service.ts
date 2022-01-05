import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { CreateUpdateMovieDto } from '../models/create.movie';
import { MoviesPaginationState } from '../../app.state';

const api = 'http://localhost:3000/movies'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  createMovie(movie: CreateUpdateMovieDto): Observable<Movie> {
    console.log('[MovieService] - CREATE MOVIE');
    return this.http.post<Movie>(api, movie);
  }

  getMovie(id: number) {
    console.log('[MovieService] - GET MOVIE BY ID: ' + id);
    return this.http.get<Movie>(api + '/' + id);
  }

  getMovies(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    searchString: string | undefined,
  ): Observable<MoviesPaginationState> {
    console.log(
      '[MovieService] - GET MOVIES WITH page, limit, orderBy, sortOrder, searchString',
      page,
      limit,
      orderBy,
      sortOrder,
      searchString,
    );

    const params = new HttpParams({
      fromObject: {
        page: page,
        limit: limit,
        ...(orderBy !== undefined && { orderBy: orderBy }),
        ...(sortOrder !== undefined && { sortOrder: sortOrder }),
        ...(searchString !== undefined && { searchString: searchString }),
      },
    });

    return this.http.get<MoviesPaginationState>(api, { params: params });
  }

  getMoviesAdvanced(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    query: string,
    selectedTagIDs: number[],
    negativeTagIDs: number[],
    exactYear: number,
    fromYear: number,
    toYear: number,
    exactLength: number,
    fromLength: number,
    toLength: number,
    hasDialogue: number,
    hasSubtitles: number,
    isStudentFilm: number,
    hasDCP: number,
    selectedDirectorIDs: number[],
    selectedContactIDs: number[],
  ): Observable<PaginationState> {
    console.log(
      '[MovieService] - GET MOVIES ADVANCED',
      page,
      limit,
      orderBy,
      sortOrder,
      query,
    );

    const params = new HttpParams({
      fromObject: {
        page: page,
        limit: limit,
        ...(orderBy !== undefined && { orderBy: orderBy }),
        ...(sortOrder !== undefined && { sortOrder: sortOrder }),
        query: query,
        selectedTagIDs: selectedTagIDs,
        negativeTagIDs: negativeTagIDs,
        exactYear: exactYear,
        fromYear: fromYear,
        toYear: toYear,
        exactLength: exactLength,
        fromLength: fromLength,
        toLength: toLength,
        hasDialogue: hasDialogue,
        hasSubtitles_: hasSubtitles,
        isStudentFilm_: isStudentFilm,
        hasDCP: hasDCP,
        selectedDirectorIDs: selectedDirectorIDs,
        selectedContactIDs: selectedContactIDs,
      },
    });
    return this.http.get<PaginationState>(`${api}/advanced`, {
      params: params,
    });
  }

  updateMovie(id: number, movie: CreateUpdateMovieDto) {
    console.log('[MovieService] - UPDATE MOVIE');
    return this.http.put<Movie>(api + '/' + id, movie);
  }

  deleteMovie(movie: Movie) {
    console.log('[MovieService] - DELETE MOVIE', movie.id);
    return this.http.delete(`${api}/${movie.id}`);
  }

  downloadCSV() {
    console.log('[MovieService] - DOWNLOAD CSV');
    return this.http.get(`http://localhost:3000/export/movies`, {
      responseType: 'blob',
    });
  }
}
