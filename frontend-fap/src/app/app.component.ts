import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {retrievedMovieList} from "./movies/state/movies.actions";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Festivator';


  constructor(
    private store: Store,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title); // set webpage title
    this.store.dispatch(retrievedMovieList()); // get movie list initial
  }
}
