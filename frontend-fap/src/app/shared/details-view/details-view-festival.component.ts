import { Component, Input } from '@angular/core';
import { Festival } from '../../festivals/models/festival';
import { DetailsViewComponent } from './details-view.component';

@Component({
  selector: 'details-view-festival',
  template: `
    <span class="mat-primary label-colon" i18n>Name</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ festival?.name }}"
    />

    <span class="mat-primary label-colon" i18n>Location</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ festival?.location }}"
    />

    <span class="mat-primary label-colon" i18n>Year</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ festival?.firstDate?.getFullYear() }}"
    />

    <span class="mat-primary label-colon" i18n>Description</span>
    <textarea
      class="form-control form-control-sm"
      readonly
      value="{{ festival?.description }}"
    ></textarea>
  `,
})
export class DetailsViewFestivalComponent extends DetailsViewComponent {
  @Input()
  festival: Festival;
}
