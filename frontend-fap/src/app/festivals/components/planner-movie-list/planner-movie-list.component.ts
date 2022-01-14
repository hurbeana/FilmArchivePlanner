import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { Movie } from '../../../movies/models/movie';
import * as MovieSelectors from '../../../movies/state/movies.selectors';
import { Store } from '@ngrx/store';
import * as MovieActions from '../../../movies/state/movies.actions';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { getMoviesSuccess } from '../../../movies/state/movies.actions';
import { MoviesState } from '../../../app.state';
import { Tag } from 'src/app/tags/models/tag';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-planner-movie-list',
  templateUrl: './planner-movie-list.component.html',
  styleUrls: ['./planner-movie-list.component.less'],
})
export class PlannerMovieListComponent implements OnInit, AfterViewInit {
  constructor(private store: Store<MoviesState>, private actions$: Actions) {
    this.events = this.store
      .select(MovieSelectors.selectMovies)
      .pipe(
        map((s) => s.map((f: Movie) => this.mapEventFestivalToCalendar(f))),
      );

    this.obs$ = this.actions$.pipe(
      ofType(getMoviesSuccess),
      takeUntil(this.destroy$),
    );
  }

  destroy$ = new Subject();
  obs$: Observable<any>;
  // movies: Observable<Movie[]>;
  events: Observable<CalendarEvent[]>;
  @ViewChild('searchStringField', { static: true })
  searchStringField: ElementRef;

  @ViewChild('movieSelectionTagInput', { static: true })
  movieSelectionTagInput: ElementRef;

  movieSelectionTag: Tag | null;
  movieSearchString: string;

  externalEvents: CalendarEvent[] = [
    {
      title: 'Event 1',
      color: {
        primary: '#eddf1d',
        secondary: '#fbf8cc',
      },
      start: new Date(),
      draggable: true,
      meta: {
        dropped: true,
      },
    },
    {
      title: 'Event 2',
      color: {
        primary: '#eddf1d',
        secondary: '#fbf8cc',
      },
      start: new Date(),
      draggable: true,
      meta: {
        dropped: true,
      },
    },
  ];

  ngOnInit() {
    this.loadMovies();
  }

  mapEventFestivalToCalendar(movie: Movie): CalendarEvent {
    return {
      id: movie.id,
      start: new Date(),
      end: new Date(),
      title: movie.originalTitle,
      meta: {
        eventLocation: '',
        type: 'Movie',
        movie: movie,
        dropped: true, // ganz wichtig
      },
      //color: this.colors[this.getColorIndex(fe.eventLocation)],
      draggable: true,
      resizable: {
        beforeStart: true, // this allows you to configure the sides the event is resizable from
        afterEnd: true,
      },
    };
  }

  loadMovies() {
    this.store.dispatch(
      MovieActions.getMovies({
        page: 1,
        limit: 0,
        orderBy: 'originalTitle',
        sortOrder: 'ASC',
        searchString: this.movieSearchString || '',
      }),
    );
    console.log(
      `selection tag: ${this.movieSelectionTag?.value.toString()}, search string: ${this.movieSearchString?.toString()}`,
    );
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.searchStringField.nativeElement, 'keyup')
      .pipe(
        filter((value) => !!value),
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.loadMovies();
        }),
      )
      .subscribe();
  }

  trackMovie(index: number, item: CalendarEvent) {
    return item.id;
  }

  clearSearchFields() {
    this.movieSearchString = '';
    this.movieSelectionTag = null;
    this.loadMovies();
  }
}
