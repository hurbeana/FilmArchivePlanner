import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { fromEvent, Observable } from 'rxjs';
import { Movie } from '../../models/movie';
import { CreateUpdateMovieDto } from '../../models/create.movie';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as MovieSelectors from '../../state/movies.selectors';
import * as MovieActions from '../../state/movies.actions';
import { debounceTime, distinctUntilChanged, filter, tap, } from 'rxjs/operators';import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* SORTABLE HEADER TODO */
export type SortColumn = keyof Movie | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers: [],
})
export class TableViewComponent {
  movies: Observable<Movie[]>;
  numberOfMovies: number;
  movieOnPageCount: number;
  pageSize: number = 16;
  totalPages: number = 0;
  page: number = 1;

  searchTerm: string;
  selectedMovie: Movie;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', { static: true })
  search: ElementRef;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private modalService: NgbModal) {
    this.movies = this.store.select(MovieSelectors.selectMovies);
    this.store
      .select(MovieSelectors.selectTotalItems)
      .subscribe((totalItems) => (this.numberOfMovies = totalItems));
    this.store
      .select(MovieSelectors.selectItemCount)
      .subscribe((itemCount) => (this.movieOnPageCount = itemCount));
    this.store
      .select(MovieSelectors.selectItemsPerPage)
      .subscribe((itemsPerPage) => (this.pageSize = itemsPerPage));
    this.store
      .select(MovieSelectors.selectTotalPages)
      .subscribe((totalPages) => (this.totalPages = totalPages));
    this.store
      .select(MovieSelectors.selectCurrentPage)
      .subscribe((currentPage) => (this.page = currentPage));
    this.loading.next(false);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        tap(() => this.loading.next(true)),
        filter((value) => !!value),
        debounceTime(200),
        distinctUntilChanged(),
        tap((event) => {
          this.store.dispatch(
            MovieActions.getMovies({
              search: this.search.nativeElement.value,
              page: this.page,
              limit: this.pageSize,
            })
          );
        }),
        tap(() => this.loading.next(false))
      )
      .subscribe();
  }

  // @Output() selectedMovieChanged: EventEmitter<Movie> = new EventEmitter();

  selectMovie(movie: Movie) {
    this.store.dispatch(
      MovieActions.setSelectedMovie({ selectedMovie: movie })
    );
    //this.selectedMovie = movie;
    //this.selectedMovieChanged.emit(this.selectedMovie);
  }

  setPage(page: number) {
    this.store.dispatch(
      MovieActions.getMovies({
        search: this.search.nativeElement.value,
        page: page,
        limit: this.pageSize,
      })
    );
    this.page = page;
  }

  setPageSize(pageSize: number) {
    this.store.dispatch(
      MovieActions.getMovies({
        search: this.search.nativeElement.value,
        page: this.page,
        limit: pageSize,
      })
    );
  }

  deleteMovie(movie: Movie) {
    this.store.dispatch(MovieActions.deleteMovie({ movieToDelete: movie, search: this.search.nativeElement.value, page: this.page, limit: this.pageSize }));
  }

  openConfirmDeleteMovieModal(movie: Movie) {
    const modalRef = this.modalService.open(ConfirmDeleteMovieModal,
      {
        centered: true,
        keyboard: true,
        //backdrop: 'static' // won`t close on click outside when uncommented
      });
    modalRef.componentInstance.movieToDelete = movie;
    modalRef.result.then( //executed after popup is closed
      (movie) => { //gets called by modal.close (see template)
        this.deleteMovie(movie)
      },
      () => { console.log("Unconfirmed close") } //gets called by modal.dismiss
    );
  }
}

@Component({
  //selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Movie deletion</h4>
    <button type="button" class="btn btn-md close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to delete movie <span class="text-primary">{{movieToDelete.englishTitle}}</span>?</strong></p>
    <p>All information associated to this movie will be permanently removed.<br>
        <span class="text-danger">This action cannot be undone.</span>
    </p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close(movieToDelete)">Ok</button>
    <!-- autoFocus a button with ngbAutofocus as attribute-->
  </div>
  `
})
export class ConfirmDeleteMovieModal {
  movieToDelete: Movie;
  constructor(public modal: NgbActiveModal) { }
}
