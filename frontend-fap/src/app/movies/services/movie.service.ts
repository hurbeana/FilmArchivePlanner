import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {Movie} from "../models/movie";
import {CreateUpdateMovieDto} from "../models/create.movie";

const api: string='http://localhost:3000/movies'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  createMovie(movie: CreateUpdateMovieDto): Observable<Movie> {
    console.log("[MovieService] - CREATE MOVIE");
    return this.http.post<Movie>(api, movie);
  }

  getMovies(): Observable<Movie[]> {
    console.log("[MovieService] - GET MOVIES");
    return this.http.get<Movie[]>(api);
  }

  updateMovie(movie: Movie) {
    console.log("[MovieService] - UPDATE MOVIE");
    return this.http.put(api, movie);
  }

  deleteMovie(id: number){
    console.log("[MovieService] - DELETE MOVIE");
    return this.http.delete(api);
  }
}
