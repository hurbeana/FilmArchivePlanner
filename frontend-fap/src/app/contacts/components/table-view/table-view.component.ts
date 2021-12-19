import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateContactModalComponent } from './create-contact-modal.component';
import { EditContactModalComponent } from './edit-contact-modal.component';
import { TagService } from '../../../tags/services/tag.service';
import { ConfirmDeleteContactModalComponent } from './confirm-delete-contact-modal.component';
import { ContactService } from '../../services/contact.service';
import {
  NgbdSortableHeaderDirective,
  SortEvent,
} from '../../../shared/directives/sortable.directive';

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.less'],
  providers: [],
})
export class TableViewComponent implements AfterViewInit {
  contacts: Observable<Contact[]>;
  numberOfContacts: number;
  contactOnPageCount: number;
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
    private store: Store<ContactsState>,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private contactService: ContactService,
    private tagService: TagService,
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

  loadContacts() {
    this.store.dispatch(
      ContactActions.getContacts({
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
          this.loadContacts();
        }),
        tap(() => this.loading.next(false)),
      )
      .subscribe();
  }

  selectContact(contact: Contact) {
    this.store.dispatch(
      ContactActions.setSelectedContact({ selectedContact: contact }),
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
    this.loadContacts();
  }

  setPage(page: number) {
    this.page = page;
    this.loadContacts();
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.loadContacts();
  }

  openCreateContactModal() {
    const modalRef = this.modalService.open(CreateContactModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    const newContact: CreateUpdateContactDto = {
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
        (usableTags) => (modalRef.componentInstance.usableTags = usableTags),
      );
    modalRef.result.then(
      (contact) => {
        console.log(contact);
        this.createContact(modalRef.componentInstance.contactToCreate);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  createContact(contact: Contact) {
    this.store.dispatch(ContactActions.createContact({ contact: contact }));
  }

  openEditContactModal(contact: Contact) {
    const modalRef = this.modalService.open(EditContactModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });

    const contactToUpdate: CreateUpdateContactDto = {
      //type: { id: contact.type.id },
      type: contact.type,
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
        (usableTags) => (modalRef.componentInstance.usableTags = usableTags),
      );
    modalRef.result.then(
      (result) => {
        this.editContact(result.contact, result.id);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  editContact(contact: CreateUpdateContactDto, id: number) {
    this.store.dispatch(
      ContactActions.updateContact({
        contact: contact,
        id: id,
      }),
    );
  }

  openConfirmDeleteContactModal(contact: Contact) {
    const modalRef = this.modalService.open(
      ConfirmDeleteContactModalComponent,
      {
        centered: true,
        keyboard: true,
        //backdrop: 'static' // won`t close on click outside when uncommented
      },
    );

    this.contactService
      .checkIfContactIsInUse(contact)
      .subscribe(
        (isInUse) => (modalRef.componentInstance.contactIsInUse = isInUse),
      );
    modalRef.componentInstance.contactIsInUse = false;
    modalRef.componentInstance.contactToDelete = contact;
    modalRef.result.then(
      (contact) => {
        this.deleteContact(contact);
      },
      () => {
        console.log('Unconfirmed close');
      },
    );
  }
  deleteContact(contact: Contact) {
    this.store.dispatch(
      ContactActions.deleteContact({
        contactToDelete: contact,
        page: this.page,
        limit: this.pageSize,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.search.nativeElement.value,
      }),
    );
  }
}
