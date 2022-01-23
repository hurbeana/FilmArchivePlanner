import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../../../contacts/models/contact';
import { Tag } from '../../../tags/models/tag';
import { Store } from '@ngrx/store';

@Component({
  selector: 'view-contact-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Contact Details</h4>
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
      <details-view-contact [contact]="contact"></details-view-contact>
    </div>
    <div class="modal-footer">
      <button class="btn btn-light close" (click)="onCancelContactModal()">
        Close
      </button>
    </div>
  `,
})
export class ViewContactModalComponent {
  constructor(public modal: NgbActiveModal, public store: Store) {}
  contact: Contact;
  usableTags: Tag[];
  visible = true;

  onCancelContactModal() {
    this.visible = false;
    this.modal.dismiss('cancel click');
  }
}
