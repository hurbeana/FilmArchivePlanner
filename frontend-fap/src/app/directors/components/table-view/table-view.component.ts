import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DirectorsState } from '../../../app.state';
import { fromEvent, Observable } from 'rxjs';
import { Director } from '../../models/director';
import { CreateUpdateDirectorDto } from '../../models/create.director';
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
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import {
  NgbdSortableHeaderDirective,
  SortEvent,
} from '../../../shared/directives/sortable.directive';
import * as TagActions from '../../../tags/state/tags.actions';
import { ConfirmDeleteDirectorModal } from './confirm-delete-director-modal.component';
@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers: [],
})
export class TableViewComponent {
  directors: Observable<Director[]>;
  numberOfDirectors: number;
  directorOnPageCount: number;
  pageSize: number = 16;
  totalPages: number = 0;
  page: number = 1;

  searchTerm: string;
  selectedDirector: Director;
  orderBy: string;
  sortOrder: string;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', { static: true })
  search: ElementRef;

  constructor(
    private store: Store<DirectorsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal
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
      })
    );
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
        tap(() => this.loading.next(false))
      )
      .subscribe();
  }

  selectDirector(director: Director) {
    this.store.dispatch(
      DirectorActions.setSelectedDirector({ selectedDirector: director })
    );
  }

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;
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

  deleteDirector(director: Director) {
    this.store.dispatch(
      DirectorActions.deleteDirector({
        directorToDelete: director,
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      })
    );
  }

  openConfirmDeleteDirectorModal(director: Director) {
    const modalRef = this.modalService.open(ConfirmDeleteDirectorModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    modalRef.componentInstance.directorToDelete = director;
    modalRef.result.then(
      (director) => {
        this.deleteDirector(director);
      },
      () => {
        console.log('Unconfirmed close');
      }
    );
  }
}
