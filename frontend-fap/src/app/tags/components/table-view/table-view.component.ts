import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { TagsState } from '../../../app.state';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Tag } from '../../models/tag';
import { CreateUpdateTagDto } from '../../models/create.tag';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as TagSelectors from '../../state/tags.selectors';
import * as TagActions from '../../state/tags.actions';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTagModalComponent } from './create-tag-modal.component';
import { ConfirmDeleteTagModalComponent } from './confirm-delete-tag-modal.component';
import { EditTagModalComponent } from './edit-tag-modal.component';
import { TagService } from '../../services/tag.service';
import {
  NgbdSortableHeaderDirective,
  SortEvent,
} from '../../../shared/directives/sortable.directive';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers: [],
})
export class TableViewComponent implements AfterViewInit {
  tags: Observable<Tag[]> | null;
  numberOfTags: number;
  tagOnPageCount: number;
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
    private store: Store<TagsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private tagService: TagService,
    private actionsSubject: ActionsSubject,
  ) {
    this.tags = this.store.select(TagSelectors.selectTags);
    this.store
      .select(TagSelectors.selectTotalItems)
      .subscribe((totalItems) => (this.numberOfTags = totalItems));
    this.store
      .select(TagSelectors.selectItemCount)
      .subscribe((itemCount) => (this.tagOnPageCount = itemCount));
    this.store
      .select(TagSelectors.selectItemsPerPage)
      .subscribe((itemsPerPage) => (this.pageSize = itemsPerPage));
    this.store
      .select(TagSelectors.selectTotalPages)
      .subscribe((totalPages) => (this.totalPages = totalPages));
    this.store
      .select(TagSelectors.selectCurrentPage)
      .subscribe((currentPage) => (this.page = currentPage));
    this.store
      .select(TagSelectors.selectOrderBy)
      .subscribe((orderBy) => (this.orderBy = orderBy));
    this.store
      .select(TagSelectors.selectSortOrder)
      .subscribe((sortOrder) => (this.sortOrder = sortOrder));
    this.loading.next(false);
  }

  loadTags() {
    this.store.dispatch(
      TagActions.getTags({
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
    );
  }

  ngOnInit() {
    // executed on routing --> get rid of stale entries
    this.store.dispatch(TagActions.getTags({ page: 1, limit: 16 }));
    this.subscription = this.actionsSubject
      .pipe(ofType(TagActions.getTagsSuccess))
      .subscribe((tags) => {
        this.fullyLoaded = true;
      });
  }

  ngOnDestroy() {
    // executed on routing --> get rid of stale entries
    this.store.dispatch(TagActions.setSelectedTag({ selectedTag: null }));
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
          this.loadTags();
        }),
        tap(() => this.loading.next(false)),
      )
      .subscribe();
  }

  selectTag(tag: Tag) {
    this.store.dispatch(TagActions.setSelectedTag({ selectedTag: tag }));
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
    this.loadTags();
  }

  getTagTypeClass(type: string) {
    return {
      tag_animation: type === 'Animation',
      tag_category: type === 'Category',
      tag_contact: type === 'Contact',
      tag_country: type === 'Country',
      tag_keyword: type === 'Keyword',
      tag_language: type === 'Language',
      tag_software: type === 'Software',
      tag_selection: type === 'Selection',
      badge: true,
    };
  }

  setPage(page: number) {
    this.page = page;
    this.loadTags();
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.loadTags();
  }

  openEditTagModal(tag: Tag) {
    const modalRef = this.modalService.open(EditTagModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });

    const tagToUpdate: CreateUpdateTagDto = {
      value: tag.value,
      type: tag.type,
      user: tag.user,
      public: tag.public,
    };

    modalRef.componentInstance.tagToEdit = tagToUpdate;
    modalRef.componentInstance.tagId = tag.id;
    modalRef.result.then(
      (result) => {
        this.editTag(result.tag, result.id);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  editTag(tag: CreateUpdateTagDto, id: number) {
    this.store.dispatch(
      TagActions.updateTag({
        tag: tag,
        id: id,
      }),
    );
  }

  openConfirmDeleteTagModal(tag: Tag) {
    const modalRef = this.modalService.open(ConfirmDeleteTagModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    this.tagService
      .checkIfTagIsInUse(tag)
      .subscribe(
        (isInUse) => (modalRef.componentInstance.tagIsInUse = isInUse),
      );
    modalRef.componentInstance.tagToDelete = tag;
    modalRef.result.then(
      (tag) => {
        this.deleteTag(tag);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  deleteTag(tag: Tag) {
    //TODO Service call with return value
    this.store.dispatch(
      TagActions.deleteTag({
        tagToDelete: tag,
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
    );
  }

  openCreateTagModal() {
    const modalRef = this.modalService.open(CreateTagModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    const newTag: CreateUpdateTagDto = {
      value: '',
      type: '',
      user: 'User',
      public: true,
    };
    modalRef.componentInstance.tagToCreate = newTag;
    modalRef.result.then(
      (tag) => {
        console.log(tag);
        this.createTag(modalRef.componentInstance.tagToCreate);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  createTag(tag: Tag) {
    this.store.dispatch(TagActions.createTag({ tag: tag }));
  }
}
