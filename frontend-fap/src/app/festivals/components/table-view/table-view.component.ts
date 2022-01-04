import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FestivalsState } from '../../../app.state';
import { fromEvent, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as FestivalSelectors from '../../state/festivals.selectors';
import * as FestivalActions from '../../state/festivals.actions';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateFestivalModalComponent } from './create-festival-modal.component';
import { ConfirmDeleteFestivalModalComponent } from './confirm-delete-festival-modal.component';
import { FestivalService } from '../../services/festival.service';
import {
  NgbdSortableHeaderDirective,
  SortEvent,
} from '../../../shared/directives/sortable.directive';
import { Festival } from '../../models/festival';
import { CreateUpdateFestivalDto } from '../../models/create.festival';

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers: [],
})
export class TableViewComponent implements AfterViewInit {
  festivals: Observable<Festival[]>;
  numberOfFestivals: number;
  festivalOnPageCount: number;
  pageSize = 16;
  totalPages = 0;
  page = 1;

  searchTerm: string;
  orderBy: string;
  sortOrder: string;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', { static: true })
  search: ElementRef;

  @ViewChildren(NgbdSortableHeaderDirective)
  headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(
    private store: Store<FestivalsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private festivalService: FestivalService,
  ) {
    this.festivals = this.store.select(FestivalSelectors.selectFestivals);

    this.store
      .select(FestivalSelectors.selectTotalItems)
      .subscribe((totalItems) => (this.numberOfFestivals = totalItems));
    this.store
      .select(FestivalSelectors.selectItemCount)
      .subscribe((itemCount) => (this.festivalOnPageCount = itemCount));
    this.store
      .select(FestivalSelectors.selectItemsPerPage)
      .subscribe((itemsPerPage) => (this.pageSize = itemsPerPage));
    this.store
      .select(FestivalSelectors.selectTotalPages)
      .subscribe((totalPages) => (this.totalPages = totalPages));
    this.store
      .select(FestivalSelectors.selectCurrentPage)
      .subscribe((currentPage) => (this.page = currentPage));
    this.loading.next(false);
  }

  loadFestivals() {
    this.store.dispatch(
      FestivalActions.getFestivals({
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
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
          this.loadFestivals();
        }),
        tap(() => this.loading.next(false)),
      )
      .subscribe();
  }

  selectFestival(festival: Festival) {
    this.store.dispatch(
      FestivalActions.setSelectedFestival({ selectedFestival: festival }),
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
    this.loadFestivals();
  }

  setPage(page: number) {
    this.page = page;
    this.loadFestivals();
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.loadFestivals();
  }

  openCreateFestivalModal() {
    const modalRef = this.modalService.open(CreateFestivalModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    const newFestival: CreateUpdateFestivalDto = {
      name: '',
      location: '',
    };
    modalRef.componentInstance.festivalToCreate = newFestival;
    modalRef.result.then(
      (festival) => {
        console.log(festival);
        this.createFestival(modalRef.componentInstance.festivalToCreate);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  createFestival(festival: Festival) {
    this.store.dispatch(FestivalActions.createFestival({ festival: festival }));
  }

  openConfirmDeleteFestivalModal(festival: Festival) {
    const modalRef = this.modalService.open(
      ConfirmDeleteFestivalModalComponent,
      {
        centered: true,
        keyboard: true,
        //backdrop: 'static' // won`t close on click outside when uncommented
      },
    );

    modalRef.componentInstance.festivalIsInUse = false;
    modalRef.componentInstance.festivalToDelete = festival;
    modalRef.result.then(
      (festival) => {
        this.deleteFestival(festival);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  deleteFestival(festival: Festival) {
    this.store.dispatch(
      FestivalActions.deleteFestival({
        festivalToDelete: festival,
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
    );
  }
}
