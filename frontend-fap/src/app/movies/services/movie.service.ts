import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { CreateUpdateMovieDto } from '../models/create.movie';
import { PaginationState } from '../../app.state';

const api = 'http://localhost:3000/movies'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  createMovie(movie: CreateUpdateMovieDto): Observable<Movie> {
    console.log('[MovieService] - CREATE MOVIE');
    return this.http.post<Movie>(api, movie);
  }

  getMovie(id: number) {
    console.log('[MovieService] - GET MOVIES ID: ' + id);
    return this.http.get<Movie>(api + '/' + id);
  }

  getMovies(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    searchString: string | undefined,
  ): Observable<PaginationState> {
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

    return this.http.get<PaginationState>(api, { params: params });
  }

  updateMovie(id: number, movie: CreateUpdateMovieDto) {
    console.log('[MovieService] - UPDATE MOVIE');
    return this.http.put<Movie>(api + '/' + id, movie);
  }

  deleteMovie(movie: Movie) {
    console.log('[MovieService] - DELETE MOVIE', movie.id);
    return this.http.delete(`${api}/${movie.id}`);
  }
}
