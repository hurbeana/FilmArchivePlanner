import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { DirectorsState } from '../../../app.state';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Director } from '../../models/director';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as DirectorSelectors from '../../state/directors.selectors';
import * as DirectorActions from '../../state/directors.actions';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbdSortableHeaderDirective,
  SortEvent,
} from '../../../shared/directives/sortable.directive';
import { ConfirmDeleteDirectorModalComponent } from './confirm-delete-director-modal.component';
import { DirectorService } from '../../services/director.service';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers: [],
})
export class TableViewComponent implements AfterViewInit {
  directors: Observable<Director[]>;
  numberOfDirectors: number;
  directorOnPageCount: number;
  pageSize = 16;
  totalPages = 0;
  page = 1;

  searchTerm: string;
  orderBy: string;
  sortOrder: string;
  loading = new BehaviorSubject<boolean>(true);

  subscription = new Subscription();
  fullyLoaded = false;

  @ViewChild('search', { static: true })
  search: ElementRef;

  @ViewChildren(NgbdSortableHeaderDirective)
  headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(
    private store: Store<DirectorsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private directorService: DirectorService,
    private actionsSubject: ActionsSubject,
  ) {
    this.directors = this.store.select(DirectorSelectors.selectDirectors);
    this.store
      .select(DirectorSelectors.selectTotalItems)
      .subscribe((totalItems) => (this.numberOfDirectors = totalItems));
    this.store
      .select(DirectorSelectors.selectItemCount)
      .subscribe((itemCount) => (this.directorOnPageCount = itemCount));
    this.store
      .select(DirectorSelectors.selectItemsPerPage)
      .subscribe((itemsPerPage) => (this.pageSize = itemsPerPage));
    this.store
      .select(DirectorSelectors.selectTotalPages)
      .subscribe((totalPages) => (this.totalPages = totalPages));
    this.store
      .select(DirectorSelectors.selectCurrentPage)
      .subscribe((currentPage) => (this.page = currentPage));
    this.store
      .select(DirectorSelectors.selectOrderBy)
      .subscribe((orderBy) => (this.orderBy = orderBy));
    this.store
      .select(DirectorSelectors.selectSortOrder)
      .subscribe((sortOrder) => (this.sortOrder = sortOrder));
    this.loading.next(false);
  }

  loadDirectors() {
    this.store.dispatch(
      DirectorActions.getDirectors({
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
    );
  }

  ngOnInit() {
    // executed before routing to another page
    this.store.dispatch(DirectorActions.getDirectors({ page: 1, limit: 16 }));
    this.subscription = this.actionsSubject
      .pipe(ofType(DirectorActions.getDirectorsSuccess))
      .subscribe((directors) => {
        this.fullyLoaded = true;
      });
  }

  ngOnDestroy() {
    // executed on routing --> get rid of stale entries
    this.store.dispatch(
      DirectorActions.setSelectedDirector({ selectedDirector: null }),
    );
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
          this.loadDirectors();
        }),
        tap(() => this.loading.next(false)),
      )
      .subscribe();
  }

  selectDirector(director: Director) {
    this.store.dispatch(
      DirectorActions.setSelectedDirector({ selectedDirector: director }),
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
    this.loadDirectors();
  }

  setPage(page: number) {
    this.page = page;
    this.loadDirectors();
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.loadDirectors();
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

  deleteDirector(director: Director) {
    this.store.dispatch(
      DirectorActions.deleteDirector({
        director: director,
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
    );
  }

  openConfirmDeleteDirectorModal(director: Director) {
    const modalRef = this.modalService.open(
      ConfirmDeleteDirectorModalComponent,
      {
        centered: true,
        keyboard: true,
        //backdrop: 'static' // won`t close on click outside when uncommented
      },
    );
    this.directorService
      .checkIfDirectorIsInUse(director)
      .subscribe(
        (isInUse) => (modalRef.componentInstance.directorIsInUse = isInUse),
      );
    modalRef.componentInstance.directorToDelete = director;
    modalRef.componentInstance.directorIsInUse = false;
    modalRef.result.then(
      (director) => {
        this.deleteDirector(director);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
}
