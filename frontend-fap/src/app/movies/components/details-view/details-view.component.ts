import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import * as MovieSelector from '../../state/movies.selectors';

@Component({
    selector: 'movies-details-view',
    templateUrl: './details-view.component.html',
    styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
    movie?: Movie;

    constructor(private route: ActivatedRoute, private store: Store<AppState>) { }

    ngOnInit(): void {
        this.store.select(MovieSelector.selectMovie).subscribe((movie) => {
            console.log('selcted movie');
            this.movie = movie;
        });
    }
}
