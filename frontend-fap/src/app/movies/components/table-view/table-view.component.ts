import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {fromEvent, Observable} from "rxjs";
import {Movie} from "../../models/movie";
import {CreateUpdateMovieDto} from "../../models/create.movie";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import * as MovieSelectors from "../../state/movies.selectors";
import * as MovieActions from "../../state/movies.actions";
import {debounceTime, distinctUntilChanged, filter, tap} from "rxjs/operators";


/* SORTABLE HEADER TODO */
export type SortColumn = keyof Movie | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}


@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers:[]
})
export class TableViewComponent {
  movies: Observable<Movie[]>;
  numberOfMovies: number;
  movieOnPageCount : number;
  pageSize: number = 16;
  totalPages: number = 0;
  page:  number = 1;

  searchTerm: string;
  selectedMovie: Movie;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', {static: true})
  search: ElementRef;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(private store: Store<AppState>,private route: ActivatedRoute) {
    this.movies = this.store.select(MovieSelectors.selectMovies);
    this.store.select(MovieSelectors.selectTotalItems).subscribe(totalItems => this.numberOfMovies = totalItems);
    this.store.select(MovieSelectors.selectItemCount).subscribe(itemCount => this.movieOnPageCount = itemCount);
    this.store.select(MovieSelectors.selectItemsPerPage).subscribe(itemsPerPage => this.pageSize = itemsPerPage);
    this.store.select(MovieSelectors.selectTotalPages).subscribe(totalPages => this.totalPages = totalPages);
    this.store.select(MovieSelectors.selectCurrentPage).subscribe(currentPage => this.page = currentPage);
    this.loading.next(false);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.search.nativeElement,'keyup')
      .pipe(
        tap(()=> this.loading.next(true)),
        filter(value=>!!value),
        debounceTime(200),
        distinctUntilChanged(),
        tap((event) => {
          this.store.dispatch(MovieActions.getMovies({search: this.search.nativeElement.value, page: this.page, limit: this.pageSize}));
        }),
        tap(() => this.loading.next(false))
      )
      .subscribe();
  }

  @Output() selectedMovieChanged: EventEmitter<Movie> = new EventEmitter();

  selectMovie(movie: Movie){
    //this.store.dispatch(MovieActions.setSelectedMovie({selectedMovie: movie}));
    this.selectedMovie = movie;
    this.selectedMovieChanged.emit(this.selectedMovie);
  }

  setPage(page: number){
    this.store.dispatch(MovieActions.getMovies({search: this.search.nativeElement.value, page: page, limit: this.pageSize}));
    this.page = page;
  }

  setPageSize(pageSize: number){
    this.store.dispatch(MovieActions.getMovies({search: this.search.nativeElement.value, page: this.page, limit: pageSize}));
  }

  populate(){
    let i = Math.random();
    let newMovie : CreateUpdateMovieDto = {
      originalTitle:	"originalTitle".concat(i.toString()),
      englishTitle:	"englishTitle".concat(i.toString()),
      movieFile:	"movieFile".concat(i.toString()),
      previewFile:	"previewFile".concat(i.toString()),
      trailerFile:	"trailerFile".concat(i.toString()),
      stillFiles:	["stillFiles", "stillFiles"],
      subtitleFiles:	["subtitleFiles"],
      directors:	["directors", "directors"],
      countriesOfProduction:	["countriesOfProduction", "countriesOfProduction"],
      yearOfProduction:	1990,
      duration:	200, //Duration in minutes
      animationTechniques:	["animationTechniques","animationTechniques"],
      softwareUsed:	["softwareUsed","softwareUsed"],
      keywords:	["keywords","keywords"],
      germanSynopsis:	"germanSynopsis".concat(i.toString()),
      englishSynopsis:	"englishSynopsis".concat(i.toString()),
      submissionCategory:	"submissionCategory".concat(i.toString()),
      hasDialog:	true,
      dialogLanguages:	["dialogLanguages","dialogLanguages"],
      hasSubtitles:	false,
      isStudentFilm:	false,
      filmSchool:	"filmSchool".concat(i.toString()),
      script:	"script".concat(i.toString()),
      animation:	"animation".concat(i.toString()),
      editing:	"editing".concat(i.toString()),
      sound:	"sound".concat(i.toString()),
      music:	"music".concat(i.toString()),
      productionCompany:	"productionCompany".concat(i.toString()),
      contact:	"contact".concat(i.toString()),
    };
    this.store.dispatch(MovieActions.createMovie({movie: newMovie})); // create movie
  }
}
