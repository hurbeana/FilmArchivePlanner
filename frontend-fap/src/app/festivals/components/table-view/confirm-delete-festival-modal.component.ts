import { Component } from '@angular/core';
import { Festival } from '../../models/festival';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FestivalService } from '../../services/festival.service';
import { Observable } from 'rxjs';

@Component({
  //selector: 'ngbd-modal-confirm-autofocus',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Festival deletion</h4>
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
          >Are you sure you want to delete festival
          <span class="text-primary">{{ festivalToDelete.name }} </span
          >?</strong
        >
      </p>
      <p>
        All information associated to this festival will be permanently deleted.
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

      <div *ngIf="festivalIsInUse; then thenBlock; else elseBlock"></div>
      <ng-template #thenBlock>
        <span
          ngbPopover="The festival cannot be deleted because it still contains events."
          [openDelay]="200"
          [closeDelay]="400"
          triggers="mouseenter:mouseleave"
        >
          <button
            [disabled]="festivalIsInUse"
            type="button"
            class="btn btn-danger"
            (click)="modal.close(festivalToDelete)"
          >
            Ok
          </button>
        </span>
      </ng-template>
      <ng-template #elseBlock>
        <button
          [disabled]="festivalIsInUse"
          type="button"
          class="btn btn-danger"
          (click)="modal.close(festivalToDelete)"
        >
          Ok
        </button>
      </ng-template>
      <!-- autoFocus a button with ngbAutofocus as attribute-->
    </div>
  `,
})
export class ConfirmDeleteFestivalModalComponent {
  festivalToDelete: Festival;
  festivalIsInUse: boolean;
  constructor(public modal: NgbActiveModal) {}
}
