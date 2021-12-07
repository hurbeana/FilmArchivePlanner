import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from '../../models/tag';

@Component({
  selector: 'create-tag-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Edit tag</h4>
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
      <div>
        <div class="form-group row">
          <label for="inputState" class="col-sm-2 col-form-label">Type</label>
          <div class="col-sm-10">
            <select
              disabled
              id="inputState"
              class="form-control form-control-sm"
              [(ngModel)]="tagToEdit.type"
            >
              <option *ngFor="let type of tagTypes">
                <span class="badge tag_category">{{ type }}</span>
              </option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="tagValue" class="col-sm-2 col-form-label">Value</label>
          <div class="col-sm-10">
            <input
              (change)="changeTagValue($event)"
              type="text"
              placeholder="Enter..."
              class="form-control form-control-sm"
              id="tagValue"
              [value]="tagToEdit.value"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="submit"
        class="btn btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-success"
        (click)="modal.close({ tag: tagToEdit, id: tagId })"
      >
        Ok
      </button>
      <!-- autoFocus a button with ngbAutofocus as attribute-->
    </div>
  `,
})
export class EditTagModal {
  constructor(public modal: NgbActiveModal) {}
  tagToEdit: Tag;
  tagId: number;
  tagTypes: any = [
    'Animation',
    'Contact',
    'Country',
    'Keyword',
    'Language',
    'Software',
  ];
  createTag() {}

  changeTagValue(event: any) {
    this.tagToEdit.value = event.target.value;
  }
  changeTagType(event: any) {
    this.tagToEdit.type = event.target.value;
  }
}
