import {Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {Observable} from "rxjs";
import {Movie} from "../../models/movie";
import {CreateUpdateMovieDto} from "../../models/create.movie";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import * as MovieSelectors from "../../state/movies.selectors";
import * as MovieActions from "../../state/movies.actions";


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
  selectedMovie: Movie;
  numberOfMovies: number;
  page:  number = 1;
  pageSize: number = 16;
  searchTerm: string;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(private store: Store<AppState>,private route: ActivatedRoute) {
    this.movies = this.store.select(MovieSelectors.selectAllMovies);
    this.store.select(MovieSelectors.selectNumberOfMovies).subscribe(numberOfMovies => this.numberOfMovies = numberOfMovies);
    this.store.select(MovieSelectors.selectSearchTerm).subscribe(searchTerm => this.searchTerm = searchTerm);
  }

  @Output() selectedMovieChanged: EventEmitter<Movie> = new EventEmitter();

  selectMovie(movie: Movie){
    //this.store.dispatch(MovieActions.setSelectedMovie({selectedMovie: movie}));
    this.selectedMovie = movie;
    this.selectedMovieChanged.emit(this.selectedMovie);
  }

  populate(){
    for(let i=0; i < 1; i++){
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
}
