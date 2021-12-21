import { Component, Input } from '@angular/core';
import { Director } from '../../directors/models/director';
import { DetailsViewComponent } from './details-view.component';

@Component({
  selector: 'details-view-director',
  template: `
    <span class="mat-primary label-colon" i18n>First name</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ director?.firstName }}"
    />

    <span class="mat-primary label-colon" i18n>Middle name</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ director?.middleName }}"
    />

    <span class="mat-primary label-colon" i18n>Last name</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ director?.lastName }}"
    />

    <span class="mat-primary label-colon" i18n>Filmography</span>
    <div type="text" class="form-control form-control-sm disabled">
      <a
        href="{{ getDownloadLink('filmography_file', director?.filmography) }}"
      >
        {{ printFile(director?.filmography) }}
      </a>
    </div>

    <span class="mat-primary label-colon" i18n>Biography English</span>
    <div type="text" class="form-control form-control-sm disabled">
      <a
        href="{{
          getDownloadLink('biography_english_file', director?.biographyEnglish)
        }}"
      >
        {{ printFile(director?.biographyEnglish) }}
      </a>
    </div>

    <span class="mat-primary label-colon" i18n>Biography German</span>
    <div type="text" class="form-control form-control-sm disabled">
      <a
        href="{{
          getDownloadLink('biography_german_file', director?.biographyGerman)
        }}"
      >
        {{ printFile(director?.biographyGerman) }}
      </a>
    </div>
  `,
})
export class DetailsViewDirectorComponent extends DetailsViewComponent {
  @Input()
  director: Director;
}
