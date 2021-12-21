import { Component, Input } from '@angular/core';
import { Contact } from '../../contacts/models/contact';

@Component({
  selector: 'details-view-contact',
  template: `
    <span class="mat-primary label-colon" i18n>Type</span>
    <form #dummyForm="ngForm">
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'contactType'"
        [required]="true"
        [(model)]="contact.type"
        [tagType]="'Contact'"
        [readonly]="true"
        [multiple]="false"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>Name</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ contact?.name }}"
    />

    <span class="mat-primary label-colon" i18n>E-Mail</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ contact?.email }}"
    />

    <span class="mat-primary label-colon" i18n>Phone</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ contact?.phone }}"
    />

    <span class="mat-primary label-colon" i18n>Website</span>
    <div type="text" class="form-control form-control-sm disabled">
      <a href="{{ contact?.website }}">{{ contact?.website }}</a>
    </div>
  `,
})
export class DetailsViewContactComponent {
  @Input()
  contact: Contact;
  constructor() {}
}
