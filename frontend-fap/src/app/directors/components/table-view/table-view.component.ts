import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList, TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Store} from "@ngrx/store";
import {DirectorsState} from "../../../app.state";
import {fromEvent, Observable} from "rxjs";
import {Director} from "../../models/director";
import {CreateUpdateDirectorDto} from "../../models/create.director";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import * as DirectorSelectors from "../../state/directors.selectors";
import * as DirectorActions from "../../state/directors.actions";
import {debounceTime, distinctUntilChanged, filter, tap} from "rxjs/operators";
import {NgbActiveModal, NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";


/* SORTABLE HEADER TODO */
export type SortColumn = keyof Director | '';
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
  directors: Observable<Director[]>;
  numberOfDirectors: number;
  directorOnPageCount : number;
  pageSize: number = 16;
  totalPages: number = 0;
  page:  number = 1;

  searchTerm: string;
  selectedDirector: Director;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', {static: true})
  search: ElementRef;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private store: Store<DirectorsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.directors = this.store.select(DirectorSelectors.selectDirectors);
    this.store.select(DirectorSelectors.selectTotalItems).subscribe(totalItems => this.numberOfDirectors = totalItems);
    this.store.select(DirectorSelectors.selectItemCount).subscribe(itemCount => this.directorOnPageCount = itemCount);
    this.store.select(DirectorSelectors.selectItemsPerPage).subscribe(itemsPerPage => this.pageSize = itemsPerPage);
    this.store.select(DirectorSelectors.selectTotalPages).subscribe(totalPages => this.totalPages = totalPages);
    this.store.select(DirectorSelectors.selectCurrentPage).subscribe(currentPage => this.page = currentPage);
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
          this.store.dispatch(DirectorActions.getDirectors({search: this.search.nativeElement.value, page: this.page, limit: this.pageSize}));
        }),
        tap(() => this.loading.next(false))
      )
      .subscribe();
  }

  @Output() selectedDirectorChanged: EventEmitter<Director> = new EventEmitter();

  selectDirector(director: Director){
    //this.store.dispatch(DirectorActions.setSelectedDirector({selectedDirector: director}));
    this.selectedDirector = director;
    this.selectedDirectorChanged.emit(this.selectedDirector);
  }

  setPage(page: number){
    this.store.dispatch(DirectorActions.getDirectors({search: this.search.nativeElement.value, page: page, limit: this.pageSize}));
  }

  setPageSize(pageSize: number){
    this.store.dispatch(DirectorActions.getDirectors({search: this.search.nativeElement.value, page: this.page, limit: pageSize}));
  }

  populate(){
    let i = Math.random();

    let newDirector : CreateUpdateDirectorDto = {
      firstName:	"firstName".concat(i.toString()),
      middleName:	"middleName".concat(i.toString()),
      lastName:	"lastName".concat(i.toString()),
      biographyEnglish:	"biographyEnglish".concat(i.toString()),
      biographyGerman:	"biographyGerman".concat(i.toString()),
      filmography:	"filmography".concat(i.toString()),
    };
    this.store.dispatch(DirectorActions.createDirector({director: newDirector})); // create director
  }

  deleteDirector(director: Director){
    this.store.dispatch(DirectorActions.deleteDirector({directorToDelete: director, search: this.search.nativeElement.value, page:this.page, limit:this.pageSize}));
  }

  editDirector(director: Director) {
    alert("EDIT");
  }

  openConfirmDeleteDirectorModal(director: Director) {
    const modalRef = this.modalService.open(ConfirmDeleteDirectorModal,
      {
        centered: true,
        keyboard: true,
        //backdrop: 'static' // won`t close on click outside when uncommented
      });
    modalRef.componentInstance.directorToDelete = director;
    modalRef.result.then(
      (director) => {this.deleteDirector(director)},
      () => {console.log("Unconfirmed close")}
    );
  }

}

@Component({
  //selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Director deletion</h4>
    <button type="button" class="btn btn-md close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to delete director <span class="text-primary">{{directorToDelete.firstName}}  {{directorToDelete.lastName}}</span>?</strong></p>
    <p>All information associated to this director will be permanently deleted.
    <span class="text-danger">This operation can not be undone.</span>
    </p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close(directorToDelete)">Ok</button>
    <!-- autoFocus a button with ngbAutofocus as attribute-->
  </div>
  `
})
export class ConfirmDeleteDirectorModal {
  directorToDelete: Director;
  constructor(public modal: NgbActiveModal) {}
}
