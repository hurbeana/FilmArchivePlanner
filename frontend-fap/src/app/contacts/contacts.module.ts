import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

/* Modules */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';

/* Components */
import { DetailsViewComponent } from './components/details-view/details-view.component';
import { CreateContactModalComponent } from './components/table-view/create-contact-modal.component';
import { EditContactModalComponent } from './components/table-view/edit-contact-modal.component';
import { ConfirmDeleteContactModalComponent } from './components/table-view/confirm-delete-contact-modal.component';

/* state management*/
import { contactsReducer } from './state/contacts.reducer';
import { ContactEffects } from './state/contacts.effects';
import { ContactsRoutingModule } from './contacts-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from './components/content/content.component';
import { TableViewComponent } from './components/table-view/table-view.component';
import * as ContactActions from './state/contacts.actions';

@NgModule({
  declarations: [
    DetailsViewComponent,
    TableViewComponent,
    ContentComponent,
    ConfirmDeleteContactModalComponent,
    CreateContactModalComponent,
    EditContactModalComponent,
  ],
  exports: [TableViewComponent, DetailsViewComponent, ContentComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forRoot({
      pagination: contactsReducer,
      selectedContact: contactsReducer,
      searchTerm: contactsReducer,
    }),
    EffectsModule.forRoot([ContactEffects]),
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    ContactsRoutingModule,
  ],
})
/* Contact Module contains everything related to Contacts */
export class ContactsModule {
  constructor(private store: Store) {
    this.store.dispatch(ContactActions.getContacts({ page: 1, limit: 16 }));
  }
}
