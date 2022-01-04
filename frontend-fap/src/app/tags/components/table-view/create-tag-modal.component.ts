import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from '../../models/tag';
import { tagTypes } from '../../models/tagtypes';

@Component({
  selector: 'create-tag-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Tag creation</h4>
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
        (ngSubmit)="tagForm.form.valid && modal.close(tagToCreate)"
      >
        <div class="form-group row">
          <label for="inputState" class="col-sm-2 col-form-label">Type</label>
          <div class="col-sm-10">
            <select
              id="inputState"
              name="inputState"
              class="form-control form-control-sm"
              (change)="changeTagType($event)"
              [(ngModel)]="tagToCreate.type"
              #type="ngModel"
              [ngClass]="{
                'is-invalid': visible && tagForm.submitted && type.invalid
              }"
              required
            >
              <option disabled selected value>Select...</option>
              <option *ngFor="let type of tagTypes" [value]="type">
                <span class="badge tag_category">{{ type }}</span>
              </option>
            </select>
            <div
              class="invalid-feedback"
              *ngIf="tagForm.submitted && type.invalid"
            >
              <p *ngIf="type.errors?.required">Type is required</p>
            </div>
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
              [(ngModel)]="tagToCreate.value"
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
        <div class="form-group">
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
        </div>
      </form>
    </div>
  `,
})
export class CreateTagModalComponent {
  constructor(public modal: NgbActiveModal) {}
  tagToCreate: Tag;
  visible = true;
  tagTypes = tagTypes;
  createTag() {}

  changeTagValue(event: any) {
    this.tagToCreate.value = event.target.value;
  }
  changeTagType(event: any) {
    this.tagToCreate.type = event.target.value;
  }

  onCancelModal() {
    this.visible = false;
    this.modal.dismiss('cancel click');
  }
}
