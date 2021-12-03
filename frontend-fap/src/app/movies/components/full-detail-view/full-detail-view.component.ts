import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Movie } from '../../models/movie';
import { getMovie } from '../../state/movies.actions';
import { selectDetailsMovie } from '../../state/movies.selectors';

@Component({
  selector: 'app-full-detail-view',
  templateUrl: './full-detail-view.component.html',
  styleUrls: ['./full-detail-view.component.less'],
})
export class FullDetailViewComponent implements OnInit {
  movie?: Movie;
  id: number;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store
      .select(selectDetailsMovie)
      .subscribe((movie) => (this.movie = movie));

    this.route.params.subscribe((params) => {
      const id: number = +params['id'];
      if (id) {
        this.store.dispatch(getMovie({ id: id })); // load movie by id
      }
    });
  }
}
