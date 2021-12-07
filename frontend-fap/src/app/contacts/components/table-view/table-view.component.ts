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
import { ContactsState } from '../../../app.state';
import { fromEvent, Observable } from 'rxjs';
import { Contact } from '../../models/contact';
import { CreateUpdateContactDto } from '../../models/create.contact';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as ContactSelectors from '../../state/contacts.selectors';
import * as ContactActions from '../../state/contacts.actions';
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

/* SORTABLE HEADER TODO */
export type SortColumn = keyof Contact | '';
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
  contacts: Observable<Contact[]>;
  numberOfContacts: number;
  contactOnPageCount: number;
  pageSize: number = 16;
  totalPages: number = 0;
  page: number = 1;

  searchTerm: string;
  selectedContact: Contact;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', { static: true })
  search: ElementRef;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private store: Store<ContactsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.contacts = this.store.select(ContactSelectors.selectContacts);
    this.store
      .select(ContactSelectors.selectTotalItems)
      .subscribe((totalItems) => (this.numberOfContacts = totalItems));
    this.store
      .select(ContactSelectors.selectItemCount)
      .subscribe((itemCount) => (this.contactOnPageCount = itemCount));
    this.store
      .select(ContactSelectors.selectItemsPerPage)
      .subscribe((itemsPerPage) => (this.pageSize = itemsPerPage));
    this.store
      .select(ContactSelectors.selectTotalPages)
      .subscribe((totalPages) => (this.totalPages = totalPages));
    this.store
      .select(ContactSelectors.selectCurrentPage)
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
            ContactActions.getContacts({
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

  @Output() selectedContactChanged: EventEmitter<Contact> = new EventEmitter();

  selectContact(contact: Contact) {
    //this.store.dispatch(ContactActions.setSelectedContact({selectedContact: contact}));
    this.selectedContact = contact;
    this.selectedContactChanged.emit(this.selectedContact);
  }

  setPage(page: number) {
    this.store.dispatch(
      ContactActions.getContacts({
        search: this.search.nativeElement.value,
        page: page,
        limit: this.pageSize,
      })
    );
  }

  setPageSize(pageSize: number) {
    this.store.dispatch(
      ContactActions.getContacts({
        search: this.search.nativeElement.value,
        page: this.page,
        limit: pageSize,
      })
    );
  }

  populate() {
    let i = Math.random();

    let newContactType: Object = {
      id: 1,
      type: 'Contact',
      value: 'Unknown',
      user: 'Test',
      public: true,
    };

    let newContact: CreateUpdateContactDto = {
      type: newContactType,
      name: 'name'.concat(i.toString()),
      email: 'email'.concat(i.toString()),
      phone: 'phone'.concat(i.toString()),
      website: 'website'.concat(i.toString()),
    };
    this.store.dispatch(ContactActions.createContact({ contact: newContact })); // create contact
  }

  deleteContact(contact: Contact) {
    this.store.dispatch(
      ContactActions.deleteContact({
        contactToDelete: contact,
        search: this.search.nativeElement.value,
        page: this.page,
        limit: this.pageSize,
      })
    );
  }

  editContact(contact: Contact) {
    alert('EDIT');
  }

  openConfirmDeleteContactModal(contact: Contact) {
    const modalRef = this.modalService.open(ConfirmDeleteContactModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    modalRef.componentInstance.contactToDelete = contact;
    modalRef.result.then(
      (contact) => {
        this.deleteContact(contact);
      },
      () => {
        console.log('Unconfirmed close');
      }
    );
  }
}

@Component({
  //selector: 'ngbd-modal-confirm-autofocus',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Contact deletion</h4>
      <button
        type="button"
        class="btn btn-md close"
        aria-label="Close button"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>
        <strong
          >Are you sure you want to delete contact
          <span class="text-primary">{{ contactToDelete.name }} </span>?</strong
        >
      </p>
      <p>
        All information associated to this contact will be permanently deleted.
        <span class="text-danger">This operation can not be undone.</span>
      </p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-danger"
        (click)="modal.close(contactToDelete)"
      >
        Ok
      </button>
      <!-- autoFocus a button with ngbAutofocus as attribute-->
    </div>
  `,
})
export class ConfirmDeleteContactModal {
  contactToDelete: Contact;
  constructor(public modal: NgbActiveModal) {}
}
