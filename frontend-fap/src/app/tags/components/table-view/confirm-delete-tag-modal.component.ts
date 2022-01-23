import { Component } from '@angular/core';
import { Tag } from '../../models/tag';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  //selector: 'ngbd-modal-confirm-autofocus',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Tag deletion</h4>
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
          >Are you sure you want to delete tag
          <span class="text-primary">{{ tagToDelete.value }}</span
          >?</strong
        >
      </p>
      <p>
        All information associated to this tag will be permanently deleted.
        <span class="text-danger">This operation can not be undone.</span>
      </p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-light"
        (click)="modal.dismiss('cancel click')"
      >
        Cancel
      </button>

      <div *ngIf="tagIsInUse; then thenBlock; else elseBlock"></div>
      <ng-template #thenBlock>
        <span
          ngbPopover="The tag cannot be deleted because it is in use."
          [openDelay]="200"
          [closeDelay]="400"
          triggers="mouseenter:mouseleave"
        >
          <button
            [disabled]="tagIsInUse"
            type="button"
            class="btn btn-danger"
            (click)="modal.close(tagToDelete)"
          >
            Ok
          </button>
        </span>
      </ng-template>
      <ng-template #elseBlock>
        <button
          [disabled]="tagIsInUse"
          type="button"
          class="btn btn-danger"
          (click)="modal.close(tagToDelete)"
        >
          Ok
        </button>
      </ng-template>
      <!-- autoFocus a button with ngbAutofocus as attribute-->
    </div>
  `,
})
export class ConfirmDeleteTagModalComponent {
  tagToDelete: Tag;
  tagIsInUse: boolean;
  constructor(public modal: NgbActiveModal) {}
}
