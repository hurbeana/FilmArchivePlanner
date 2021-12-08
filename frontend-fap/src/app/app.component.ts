import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MovieActions from './movies/state/movies.actions';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'Film Archive Planner';

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(this.title); // set page title
  }
}
