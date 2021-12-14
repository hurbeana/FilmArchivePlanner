import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../../models/contact';
import { Tag } from '../../../tags/models/tag';

@Component({
  selector: 'create-contact-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Edit contact</h4>
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
    <form
      #contactForm="ngForm"
      (ngSubmit)="contactForm.form.valid && onSubmitContactModal()"
    >
      <div class="modal-body">
        <div class="form-group row">
          <label for="inputState" class="col-sm-2 col-form-label">Type</label>
          <div class="col-sm-10">
            <select
              id="inputState"
              class="form-control form-control-sm"
              name="type"
              [(ngModel)]="contactToEdit.type.id"
              disabled
            >
              <option disabled selected value>Select...</option>
              <option *ngFor="let tag of usableTags" [value]="tag.id">
                <span class="badge tag_category">{{ tag.value }}</span>
              </option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="tagValue" class="col-sm-2 col-form-label">Name</label>
          <div class="col-sm-10">
            <input
              type="text"
              name="name"
              class="form-control form-control-sm"
              [(ngModel)]="contactToEdit.name"
              #name="ngModel"
              [ngClass]="{
                'is-invalid': visible && contactForm.submitted && name.invalid
              }"
              required
            />
            <div
              class="invalid-feedback"
              *ngIf="contactForm.submitted && name.invalid"
            >
              <p *ngIf="visible && name.errors?.required">Name is required</p>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label for="tagValue" class="col-sm-2 col-form-label">E-Mail</label>
          <div class="col-sm-10">
            <input
              type="email"
              name="email"
              class="form-control form-control-sm"
              [(ngModel)]="contactToEdit.email"
              #mail="ngModel"
              [ngClass]="{
                'is-invalid': visible && contactForm.submitted && mail.invalid
              }"
              required
            />
            <div
              class="invalid-feedback"
              *ngIf="contactForm.submitted && mail.invalid"
            >
              <p *ngIf="visible && mail.errors?.required">E-mail is required</p>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label for="tagValue" class="col-sm-2 col-form-label">Phone</label>
          <div class="col-sm-10">
            <input
              type="tel"
              name="phone"
              class="form-control form-control-sm"
              [(ngModel)]="contactToEdit.phone"
              #phone="ngModel"
              [ngClass]="{
                'is-invalid': visible && contactForm.submitted && phone.invalid
              }"
              required
            />
            <div
              class="invalid-feedback"
              *ngIf="contactForm.submitted && phone.invalid"
            >
              <p *ngIf="visible && phone.errors?.required">
                Phonenumber is required
              </p>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label for="tagValue" class="col-sm-2 col-form-label">Website</label>
          <div class="col-sm-10">
            <input
              type="text"
              name="website"
              class="form-control form-control-sm"
              [(ngModel)]="contactToEdit.website"
              #website="ngModel"
              [ngClass]="{
                'is-invalid':
                  visible && contactForm.submitted && website.invalid
              }"
              required
            />
            <div
              class="invalid-feedback"
              *ngIf="contactForm.submitted && website.invalid"
            >
              <p *ngIf="visible && website.errors?.required">
                Website is required
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="submit"
          class="btn btn-outline-secondary"
          (click)="onCancelContactModal()"
        >
          Cancel
        </button>
        <button type="submit" class="btn btn-success">Ok</button>
        <!-- autoFocus a button with ngbAutofocus as attribute-->
      </div>
    </form>
  `,
})
export class EditContactModalComponent {
  constructor(public modal: NgbActiveModal) {}
  contactToEdit: Contact;
  contactId: number;
  usableTags: Tag[];
  visible = true;

  createContact() {}

  onCancelContactModal() {
    this.visible = false;
    this.modal.dismiss('cancel click');
  }

  onSubmitContactModal() {
    this.contactToEdit.type = { id: this.contactToEdit.type.id };
    this.modal.close({ contact: this.contactToEdit, id: this.contactId });
  }
}
