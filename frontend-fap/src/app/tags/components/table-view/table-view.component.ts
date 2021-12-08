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
import { TagsState } from '../../../app.state';
import { fromEvent, Observable } from 'rxjs';
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
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { CreateTagModal } from './create-tag-modal.component';
import { ConfirmDeleteTagModal } from './confirm-delete-tag-modal.component';
import { EditTagModal } from './edit-tag-modal.component';
import { TagService } from '../../services/tag.service';

/* SORTABLE HEADER TODO */
export type SortColumn = keyof Tag | '';
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
  tags: Observable<Tag[]>;
  numberOfTags: number;
  tagOnPageCount: number;
  pageSize: number = 16;
  totalPages: number = 0;
  page: number = 1;

  searchTerm: string;
  selectedTag: Tag;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', { static: true })
  search: ElementRef;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private store: Store<TagsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private tagService: TagService
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
            TagActions.getTags({
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

  @Output() selectedTagChanged: EventEmitter<Tag> = new EventEmitter();

  selectTag(tag: Tag) {
    //this.store.dispatch(TagActions.setSelectedTag({selectedTag: tag}));
    this.selectedTag = tag;
    this.selectedTagChanged.emit(this.selectedTag);
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
    };
  }

  setPage(page: number) {
    this.store.dispatch(
      TagActions.getTags({
        search: this.search.nativeElement.value,
        page: page,
        limit: this.pageSize,
      })
    );
  }

  setPageSize(pageSize: number) {
    this.store.dispatch(
      TagActions.getTags({
        search: this.search.nativeElement.value,
        page: this.page,
        limit: pageSize,
      })
    );
  }

  openEditTagModal(tag: Tag) {
    const modalRef = this.modalService.open(EditTagModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });

    let tagToUpdate: CreateUpdateTagDto = {
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
      }
    );
  }
  editTag(tag: CreateUpdateTagDto, id: number) {
    this.store.dispatch(
      TagActions.updateTag({
        tag: tag,
        id: id,
      })
    );
  }

  openConfirmDeleteTagModal(tag: Tag) {
    const modalRef = this.modalService.open(ConfirmDeleteTagModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    this.tagService
      .checkIfTagIsInUse(tag)
      .subscribe(
        (isInUse) => (modalRef.componentInstance.tagIsInUse = isInUse)
      );
    modalRef.componentInstance.tagToDelete = tag;
    modalRef.result.then(
      (tag) => {
        this.deleteTag(tag);
      },
      () => {
        console.log('Unconfirmed close');
      }
    );
  }
  deleteTag(tag: Tag) {
    //TODO Service call with return value
    this.store.dispatch(
      TagActions.deleteTag({
        tagToDelete: tag,
        search: this.search.nativeElement.value,
        page: this.page,
        limit: this.pageSize,
      })
    );
  }

  openCreateTagModal() {
    const modalRef = this.modalService.open(CreateTagModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    let newTag: CreateUpdateTagDto = {
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
      }
    );
  }
  createTag(tag: Tag) {
    this.store.dispatch(TagActions.createTag({ tag: tag }));
  }
}
