import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AdvancedSearchState, MoviesState } from '../../../app.state';
import { Movie } from '../../models/movie';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as MovieSelectors from '../../state/movies.selectors';
import * as MovieActions from '../../state/movies.actions';
import * as ContactActions from '../../../contacts/state/contacts.actions';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbdSortableHeaderDirective,
  SortEvent,
} from '../../../shared/directives/sortable.directive';

import { ofType } from '@ngrx/effects';
import { ConfirmDeleteMovieModalComponent } from './confirm-delete-movie-modal.component';

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers: [],
})
export class TableViewComponent implements AfterViewInit {
  movies: Observable<Movie[]>;
  numberOfMovies: number;
  movieOnPageCount: number;
  pageSize = 16;
  totalPages = 0;
  page = 1;
  searchString: '';
  orderBy: string;
  sortOrder: string;
  loading = new BehaviorSubject<boolean>(true);

  subscription = new Subscription();
  fullyLoaded = false;

  advancedSearchState?: AdvancedSearchState | null;

  showAdvanced = false;

  @ViewChild('search', { static: true })
  search: ElementRef;

  @ViewChildren(NgbdSortableHeaderDirective)
  headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(
    private store: Store<MoviesState>,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private actionsSubject: ActionsSubject,
  ) {
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
    this.store
      .select(MovieSelectors.selectSearchString)
      .subscribe((searchString) => (this.searchString = searchString));

    this.loading.next(false);
    this.store
      .select(MovieSelectors.selectAdvancedSearchState)
      .subscribe((state) => (this.advancedSearchState = state));
  }

  formatDate(d: string): string {
    return (
      d.substr(8, 2) +
      '.' +
      d.substr(5, 2) +
      '.' +
      d.substr(0, 4) +
      ', ' +
      d.substr(11, 5)
    );
  }

  loadMovies() {
    //dispatch(Action) -> Effect -> Success Action -> Reducer (changes AppState)
    if (this.showAdvanced && this.advancedSearchState) {
      if (this.advancedSearchState) {
        this.store.dispatch(
          MovieActions.getMoviesAdvanced({
            page: this.page,
            limit: this.pageSize,
            orderBy: this.orderBy,
            sortOrder: this.sortOrder,
            searchString: this.search.nativeElement.value,
            selectedTagIDs: this.advancedSearchState.selectedTagIDs,
            negativeTagIDs: this.advancedSearchState.negativeTagIDs,
            exactYear: this.advancedSearchState.exactYear,
            fromYear: this.advancedSearchState.fromYear,
            toYear: this.advancedSearchState.toYear,
            exactLength: this.advancedSearchState.exactLength,
            fromLength: this.advancedSearchState.fromLength,
            toLength: this.advancedSearchState.toLength,
            hasDialogue: this.advancedSearchState.hasDialogue,
            hasSubtitles: this.advancedSearchState.hasSubtitles,
            isStudentFilm: this.advancedSearchState.isStudentFilm,
            hasDCP: this.advancedSearchState.hasDCP,
            selectedDirectorIDs: this.advancedSearchState.selectedDirectorIDs,
            selectedContactIDs: this.advancedSearchState.selectedContactIDs,
          }),
        );
      }
    } else {
      this.store.dispatch(
        MovieActions.getMovies({
          page: this.page,
          limit: this.pageSize,
          orderBy: this.orderBy,
          sortOrder: this.sortOrder,
          searchString: this.search.nativeElement.value,
        }),
      );
    }
  }

  ngOnInit() {
    // executed on routing --> get rid of stale entries
    this.store.dispatch(MovieActions.getMovies({ page: 1, limit: 16 }));
    this.subscription = this.actionsSubject
      .pipe(ofType(MovieActions.getMoviesSuccess))
      .subscribe((movies) => {
        this.fullyLoaded = true;
      });
  }

  ngOnDestroy() {
    // executed on routing --> get rid of stale entries
    this.store.dispatch(MovieActions.setSelectedMovie({ selectedMovie: null }));
    this.subscription.unsubscribe();
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
          this.loadMovies();
        }),
        tap(() => this.loading.next(false)),
      )
      .subscribe();
  }

  selectMovie(movie: Movie) {
    this.store.dispatch(
      MovieActions.getMovieByIdAndSetAsSelectedMovie({ id: movie.id }),
    );
    this.store.dispatch(
      ContactActions.getContactByIdAndSetAsSelectedContact({
        id: movie.contact.id,
      }),
    );
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.sortOrder = direction;
    this.orderBy = column;
    this.loadMovies();
  }

  setPage(page: number) {
    this.page = page;
    this.loadMovies();
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.loadMovies();
  }

  deleteMovie(movie: Movie) {
    this.store.dispatch(
      MovieActions.deleteMovie({
        movieToDelete: movie,
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
    );
  }

  openConfirmDeleteMovieModal(movie: Movie) {
    const modalRef = this.modalService.open(ConfirmDeleteMovieModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    modalRef.componentInstance.movieToDelete = movie;
    modalRef.result.then(
      //executed after popup is closed
      (movie) => {
        //gets called by modal.close (see template)
        this.deleteMovie(movie);
      },
      () => {
        console.log('Unconfirmed close');
      }, //gets called by modal.dismiss
    );
  }

  //Advanced Search
  openAdvancedSearch() {
    this.showAdvanced = !this.showAdvanced;
  }
}
