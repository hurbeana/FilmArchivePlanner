import { Component, OnInit } from '@angular/core';
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
        class="btn btn-light"
        (click)="modal.dismiss('cancel click')"
      >
        Cancel
      </button>

      <div
        *ngIf="
          directorIsInUse || directorHasFiles;
          then thenBlock;
          else elseBlock
        "
      ></div>
      <ng-template #thenBlock>
        <span
          ngbPopover="The director cannot be deleted because {{ errorReason }}."
          [openDelay]="200"
          [closeDelay]="400"
          triggers="mouseenter:mouseleave"
        >
          <button disabled="true" type="button" class="btn btn-danger">
            Ok
          </button>
        </span>
      </ng-template>
      <ng-template #elseBlock>
        <button
          type="button"
          class="btn btn-danger"
          (click)="modal.close(directorToDelete)"
        >
          Ok
        </button>
      </ng-template>
      <!-- autoFocus a button with ngbAutofocus as attribute-->
    </div>
  `,
})
export class ConfirmDeleteDirectorModalComponent implements OnInit {
  directorToDelete: Director;
  directorIsInUse: boolean;
  directorHasFiles: boolean;
  errorReason: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {
    this.directorHasFiles = [
      this.directorToDelete.biographyEnglish,
      this.directorToDelete.biographyGerman,
      this.directorToDelete.filmography,
    ].some((f) => f !== null);
    if (this.directorHasFiles)
      this.errorReason = 'director has files left, remove them first';
    else this.errorReason = 'director is in use';
  }
}
