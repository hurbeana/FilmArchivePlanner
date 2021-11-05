import { Component } from '@angular/core';
import {DummyMovieService} from "./services/movie.dummy.service";
import {Store} from "@ngrx/store";
import {retrievedMovieList} from "./state/movies/movies.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'frontend-FAP';


  constructor(
    private store: Store
  ) {}

  ngOnInit() {
    //this.moviesService
    //  .getMovies()
    //  .subscribe((movies) => this.store.dispatch(retrievedMovieList({ movies })));
    this.store.dispatch(retrievedMovieList());
  }
}
