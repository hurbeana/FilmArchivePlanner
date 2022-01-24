import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { Movie } from '../../../movies/models/movie';
import * as MovieSelectors from '../../../movies/state/movies.selectors';
import { Store } from '@ngrx/store';
import * as MovieActions from '../../../movies/state/movies.actions';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { getMoviesSuccess } from '../../../movies/state/movies.actions';
import { MoviesState } from '../../../app.state';
import { Tag } from 'src/app/tags/models/tag';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-planner-movie-list',
  templateUrl: './planner-movie-list.component.html',
  styleUrls: ['./planner-movie-list.component.less'],
})
export class PlannerMovieListComponent implements OnInit, AfterViewInit {
  //loading: Observable<boolean>;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private store: Store<MoviesState>,
    private actions$: Actions,
    private ngZone: NgZone,
  ) {
    this.events = this.store
      .select(MovieSelectors.selectMovies)
      .pipe(
        map((s) => s.map((f: Movie) => this.mapEventFestivalToCalendar(f))),
      );
    this.actions$
      .pipe(
        ofType(getMoviesSuccess),
        tap(() => {
          this.loading.next(false);
        }),
      )
      .subscribe();
  }

  events: Observable<CalendarEvent[]>;
  @ViewChild('searchStringField', { static: true })
  searchStringField: ElementRef;

  @ViewChild('movieSelectionTagInput', { static: true })
  movieSelectionTagInput: ElementRef;

  movieSelectionTag: Tag | null;
  movieSearchString: string;

  page = 1;
  limit = 50;

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

  ngAfterViewInit() {
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

  tagsChange() {
    this.loadMovies();
  }

  trackMovie(index: number, item: CalendarEvent) {
    return item.id;
  }

  loadMovies() {
    this.loading.next(true);
    this.store.dispatch(
      MovieActions.getMoviesAdvanced({
        page: this.page,
        limit: this.limit,
        orderBy: 'originalTitle',
        sortOrder: 'ASC',
        searchString: this.movieSearchString || '',
        selectedTagIDs: this.movieSelectionTag?.id
          ? [this.movieSelectionTag?.id]
          : [],
        negativeTagIDs: [-1],
        exactYear: -1,
        fromYear: -1,
        toYear: -1,
        exactLength: -1,
        fromLength: -1,
        toLength: -1,
        hasDialogue: -1,
        hasSubtitles: -1,
        isStudentFilm: -1,
        hasDCP: -1,
        selectedDirectorIDs: [],
        selectedContactIDs: [],
      }),
    );
  }

  clearSearchFields() {
    this.movieSearchString = '';
    this.movieSelectionTag = null;
    this.loadMovies();
  }
}
