import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact';
import * as ContactSelectors from '../../state/contacts.selectors';
import { Store } from '@ngrx/store';
import { ContactsState } from '../../../app.state';

@Component({
  selector: 'contacts-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  contact: Contact | null | undefined;

  constructor(private store: Store<ContactsState>) {}

  ngOnInit(): void {
    this.store
      .select(ContactSelectors.selectSelectedContact)
      .subscribe((selectedContact) => (this.contact = selectedContact));
  }
}
