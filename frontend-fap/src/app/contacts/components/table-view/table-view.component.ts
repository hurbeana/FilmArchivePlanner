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
import { CreateContactModal } from './create-contact-modal.component';
import { EditContactModal } from './edit-contact-modal.component';
import { TagService } from '../../../tags/services/tag.service';
import { ConfirmDeleteContactModal } from './confirm-delete-contact-modal.component';
import { ContactService } from '../../services/contact.service';

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
  selectedContact: Contact | null | undefined;
  loading = new BehaviorSubject<boolean>(true);

  @ViewChild('search', { static: true })
  search: ElementRef;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(
    private store: Store<ContactsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private contactService: ContactService,
    private tagService: TagService
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

  selectContact(contact: Contact) {
    this.store.dispatch(
      ContactActions.setSelectedContact({ selectedContact: contact })
    );
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

  openCreateContactModal() {
    const modalRef = this.modalService.open(CreateContactModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    let newContact: CreateUpdateContactDto = {
      type: { id: '' },
      name: '',
      email: '',
      phone: '',
      website: '',
    };
    modalRef.componentInstance.contactToCreate = newContact;
    this.tagService
      .getTagsByType('Contact')
      .subscribe(
        (usableTags) => (modalRef.componentInstance.usableTags = usableTags)
      );
    modalRef.result.then(
      (contact) => {
        console.log(contact);
        this.createContact(modalRef.componentInstance.contactToCreate);
      },
      () => {
        console.log('Unconfirmed close');
      }
    );
  }
  createContact(contact: Contact) {
    this.store.dispatch(ContactActions.createContact({ contact: contact }));
  }

  openEditContactModal(contact: Contact) {
    const modalRef = this.modalService.open(EditContactModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });

    let contactToUpdate: CreateUpdateContactDto = {
      type: { id: contact.type.id },
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      website: contact.website,
    };

    modalRef.componentInstance.contactToEdit = contactToUpdate;
    modalRef.componentInstance.contactId = contact.id;
    this.tagService
      .getTagsByType('Contact')
      .subscribe(
        (usableTags) => (modalRef.componentInstance.usableTags = usableTags)
      );
    modalRef.result.then(
      (result) => {
        this.editContact(result.contact, result.id);
      },
      () => {
        console.log('Unconfirmed close');
      }
    );
  }
  editContact(contact: CreateUpdateContactDto, id: number) {
    this.store.dispatch(
      ContactActions.updateContact({
        contact: contact,
        id: id,
      })
    );
  }

  openConfirmDeleteContactModal(contact: Contact) {
    const modalRef = this.modalService.open(ConfirmDeleteContactModal, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });

    this.contactService
      .checkIfContactIsInUse(contact)
      .subscribe(
        (isInUse) => (modalRef.componentInstance.contactIsInUse = isInUse)
      );
    modalRef.componentInstance.contactIsInUse = false;
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
}
