import { Component } from '@angular/core';
import { Contact } from '../../models/contact';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

      <div *ngIf="contactIsInUse; then thenBlock; else elseBlock"></div>
      <ng-template #thenBlock>
        <span
          ngbPopover="The contact cannot be deleted because it is in use."
          [openDelay]="200"
          [closeDelay]="400"
          triggers="mouseenter:mouseleave"
        >
          <button
            [disabled]="contactIsInUse"
            type="button"
            class="btn btn-danger"
            (click)="modal.close(contactToDelete)"
          >
            Ok
          </button>
        </span>
      </ng-template>
      <ng-template #elseBlock>
        <button
          [disabled]="contactIsInUse"
          type="button"
          class="btn btn-danger"
          (click)="modal.close(contactToDelete)"
        >
          Ok
        </button>
      </ng-template>
      <!-- autoFocus a button with ngbAutofocus as attribute-->
    </div>
  `,
})
export class ConfirmDeleteContactModalComponent {
  contactToDelete: Contact;
  contactIsInUse: boolean;
  constructor(public modal: NgbActiveModal) {}
}
