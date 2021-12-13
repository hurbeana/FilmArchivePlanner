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
      <form
        #tagForm="ngForm"
        (ngSubmit)="
          tagForm.form.valid && modal.close({ tag: tagToEdit, id: tagId })
        "
      >
        <div class="form-group row">
          <label for="inputState" class="col-sm-2 col-form-label">Type</label>
          <div class="col-sm-10">
            <select
              id="inputState"
              class="form-control form-control-sm"
              name="type"
              [(ngModel)]="tagToEdit.type"
              disabled
            >
              <option *ngFor="let type of tagTypes" [value]="type">
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
              name="tagValue"
              [(ngModel)]="tagToEdit.value"
              #value="ngModel"
              [ngClass]="{
                'is-invalid': visible && tagForm.submitted && value.invalid
              }"
              required
            />
            <div
              class="invalid-feedback"
              *ngIf="tagForm.submitted && value.invalid"
            >
              <p *ngIf="value.errors?.required">Value is required</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-secondary"
            (click)="this.onCancelModal()"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-success">Ok</button>
          <!-- autoFocus a button with ngbAutofocus as attribute-->
        </div>
      </form>
    </div>
  `,
})
export class EditTagModal {
  constructor(public modal: NgbActiveModal) {}
  visible: boolean = true;
  tagToEdit: Tag;
  tagId: number;
  tagTypes: string[] = [
    'Animation',
    'Category',
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

  onCancelModal() {
    this.visible = false;
    this.modal.dismiss('cancel click');
  }
}
