import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {Movie} from "../models/movie";
import {CreateUpdateMovieDto} from "../models/create.movie";
import {PaginationState} from "../../app.state";

const api: string='http://localhost:3000/movies'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  createMovie(movie: CreateUpdateMovieDto): Observable<Movie> {
    console.log("[MovieService] - CREATE MOVIE");
    return this.http.post<Movie>(api, movie);
  }

  getMovies(search: string, page: number, limit: number): Observable<PaginationState> {
    console.log("[MovieService] - GET MOVIES WITH SEARCH PAGE AND LIMIT", "'"+search+"'", page, limit);
    let params;
    if(search == ""){
      params = new HttpParams({fromObject : {'page': page, 'limit': limit}});
    }else{
      params = new HttpParams({fromObject : {'searchstring': search, 'page': page, 'limit': limit}});
    }
    return this.http.get<PaginationState>(api, {params: params});
}

  updateMovie(movie: Movie) {
    console.log("[MovieService] - UPDATE MOVIE");
    return this.http.put(api, movie);
  }

  deleteMovie(id: number){
    console.log("[MovieService] - DELETE MOVIE", id);
    return this.http.delete(api);
  }
}
