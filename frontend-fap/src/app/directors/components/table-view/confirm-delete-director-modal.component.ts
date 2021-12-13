import { Component } from '@angular/core';
import { Director } from '../../models/director';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  //selector: 'ngbd-modal-confirm-autofocus',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Director deletion</h4>
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
          >Are you sure you want to delete director
          <span class="text-primary"
            >{{ directorToDelete.firstName }}
            {{ directorToDelete.lastName }}</span
          >?</strong
        >
      </p>
      <p>
        All information associated to this director will be permanently deleted.
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
        (click)="modal.close(directorToDelete)"
      >
        Ok
      </button>
      <!-- autoFocus a button with ngbAutofocus as attribute-->
    </div>
  `,
})
export class ConfirmDeleteDirectorModal {
  directorToDelete: Director;
  constructor(public modal: NgbActiveModal) {}
}
