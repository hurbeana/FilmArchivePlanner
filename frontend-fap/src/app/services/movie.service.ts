import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {Movie} from "../models/movie";
import {CreateUpdateMovieDto} from "../models/create.movie";

const api: string='http://localhost:3000/movies'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(api);
  }

  createMovie(movie: CreateUpdateMovieDto): Observable<Movie> {
    console.log("CREATE MOVIE");
    console.log(movie);
    return this.http.post<Movie>(api, movie);
  }

  updateMovie(movie: Movie) {
    return this.http.put(api, movie);
  }

  deleteMovie(id: number){
    return this.http.delete(api);
  }
}
