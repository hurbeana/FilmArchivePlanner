import { Component, Input } from '@angular/core';
import { Tag } from '../../tags/models/tag';

@Component({
  selector: 'details-view-tag',
  template: `
    <span class="mat-primary label-colon" i18n>Value</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ tag?.value }}"
    />

    <span class="mat-primary label-colon" i18n>Type</span>
    <form #dummyForm="ngForm">
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'tagType'"
        [bindLabel]="'type'"
        [required]="true"
        [(model)]="tag"
        [tagType]="tag.type"
        [readonly]="true"
        [multiple]="false"
      ></shared-tag-input>
    </form>

    <!--
    <span class="mat-primary label-colon" i18n>User</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ tag?.user }}"
    />

    <span class="mat-primary label-colon" i18n>Public</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      [value]="tag?.public ? 'Yes' : 'No'"
    /> -->
  `,
})
export class DetailsViewTagComponent {
  @Input()
  tag: Tag;
  constructor() {}
}
