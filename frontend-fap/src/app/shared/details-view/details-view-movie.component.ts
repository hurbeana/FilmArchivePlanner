import { Component, Input } from '@angular/core';
import { Movie } from '../../movies/models/movie';
import { DetailsViewComponent } from './details-view.component';

@Component({
  selector: 'details-view-movie',
  template: `
    <span class="mat-primary label-colon" i18n>Original Title</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.originalTitle }}"
    />

    <span class="mat-primary label-colon" i18n>English Title</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.englishTitle }}"
    />

    <span class="mat-primary label-colon" i18n>Movie Files</span>
    <div *ngIf="movie?.movieFiles; else emptyInput">
      <div
        *ngFor="let file of movie?.movieFiles"
        type="text"
        class="form-control form-control-sm disabled"
      >
        <a href="{{ getDownloadLink('movie_file', file) }}">
          {{ printFile(file) }}
        </a>
      </div>
    </div>

    <span class="mat-primary label-colon" i18n>DCP Files</span>
    <!--<input type="text" disabled value="{{ printFiles(movie?.dcpFiles) }}" />-->
    <div *ngIf="movie?.dcpFiles; else emptyInput">
      <div
        *ngFor="let file of movie?.dcpFiles"
        type="text"
        class="form-control form-control-sm disabled"
      >
        <a href="{{ getDownloadLink('dcp_file', file) }}">
          {{ printFile(file) }}
        </a>
      </div>
    </div>

    <span class="mat-primary label-colon" i18n>Preview File</span>
    <div *ngIf="movie?.previewFile; else emptyInput">
      <div type="text" class="form-control form-control-sm disabled">
        <a href="{{ getDownloadLink('preview_file', movie?.previewFile) }}">
          {{ printFile(movie?.previewFile) }}
        </a>
      </div>
    </div>

    <span class="mat-primary label-colon" i18n>Trailer File</span>
    <div *ngIf="movie?.trailerFile; else emptyInput">
      <div type="text" class="form-control form-control-sm disabled">
        <a href="{{ getDownloadLink('trailer_file', movie?.trailerFile) }}">
          {{ printFile(movie?.trailerFile) }}
        </a>
      </div>
    </div>

    <span class="mat-primary label-colon" i18n>Still Files</span>
    <div *ngIf="movie?.stillFiles; else emptyInput">
      <div
        *ngFor="let file of movie?.stillFiles"
        type="text"
        class="form-control form-control-sm disabled"
      >
        <a href="{{ getDownloadLink('still_file', file) }}">
          {{ printFile(file) }}
        </a>
      </div>
    </div>

    <span class="mat-primary label-colon" i18n>Subtitle Files</span>
    <div *ngIf="movie?.subtitleFiles; else emptyInput">
      <div
        *ngFor="let file of movie?.subtitleFiles"
        type="text"
        class="form-control form-control-sm disabled"
      >
        <a href="{{ getDownloadLink('subtitle_file', file) }}">
          {{ printFile(file) }}
        </a>
      </div>
    </div>

    <span class="mat-primary label-colon" i18n>Directors</span>
    <div *ngIf="movie?.directors; else emptyInput">
      <div
        *ngFor="let director of movie?.directors"
        type="text"
        class="form-control form-control-sm disabled"
      >
        {{ director.fullName }}
      </div>
    </div>

    <span class="mat-primary label-colon" i18n>Selection Tags</span>
    <form #dummyForm="ngForm" *ngIf="movie?.selectionTags; else emptyInput">
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'selectionTags'"
        [required]="true"
        [(model)]="movie.selectionTags"
        [tagType]="'Selection'"
        [readonly]="true"
        [multiple]="true"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>Countries of Production</span>
    <form
      #dummyForm="ngForm"
      *ngIf="movie?.countriesOfProduction; else emptyInput"
    >
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'countriesOfProduction'"
        [required]="true"
        [(model)]="movie.countriesOfProduction"
        [tagType]="'Country'"
        [readonly]="true"
        [multiple]="true"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>Year of Production</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.yearOfProduction }}"
    />

    <span class="mat-primary label-colon" i18n>Duration</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.duration | durationFormat }}"
    />

    <span class="mat-primary label-colon" i18n>Animation Technique</span>
    <form
      #dummyForm="ngForm"
      *ngIf="movie.animationTechniques; else emptyInput"
    >
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'animationTechniques'"
        [required]="true"
        [(model)]="movie.animationTechniques"
        [tagType]="'Animation'"
        [readonly]="true"
        [multiple]="true"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>Software Used</span>
    <form #dummyForm="ngForm" *ngIf="movie?.softwareUsed; else emptyInput">
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'softwareUsed'"
        [required]="true"
        [(model)]="movie.softwareUsed"
        [tagType]="'Software'"
        [readonly]="true"
        [multiple]="true"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>Keywords</span>
    <form #dummyForm="ngForm" *ngIf="movie?.keywords; else emptyInput">
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'keywords'"
        [required]="true"
        [(model)]="movie.keywords"
        [tagType]="'Keyword'"
        [readonly]="true"
        [multiple]="true"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>German Synopsis</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.germanSynopsis }}"
    />
    <span class="mat-primary label-colon" i18n>English Synopsis</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.englishSynopsis }}"
    />

    <span class="mat-primary label-colon" i18n>Submission Categories</span>
    <form
      #dummyForm="ngForm"
      *ngIf="movie?.submissionCategories; else emptyInput"
    >
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'submissionCategories'"
        [required]="true"
        [(model)]="movie.submissionCategories"
        [tagType]="'Category'"
        [readonly]="true"
        [multiple]="true"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>Has Dialog</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      [value]="movie?.hasDialog ? 'Yes' : 'No'"
    />

    <span class="mat-primary label-colon" i18n>Dialog Languages</span>
    <form #dummyForm="ngForm" *ngIf="movie?.dialogLanguages; else emptyInput">
      <shared-tag-input
        [form]="dummyForm"
        [formCtrlName]="'dialogLanguages'"
        [required]="true"
        [(model)]="movie.dialogLanguages"
        [tagType]="'Language'"
        [readonly]="true"
        [multiple]="true"
      ></shared-tag-input>
    </form>

    <span class="mat-primary label-colon" i18n>Has Subtitles</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      [value]="movie?.hasSubtitles ? 'Yes' : 'No'"
    />

    <span class="mat-primary label-colon" i18n>Is Student Film</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      [value]="movie?.isStudentFilm ? 'Yes' : 'No'"
    />
    <span class="mat-primary label-colon" i18n>Film School</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.filmSchool }}"
    />

    <span class="mat-primary label-colon" i18n>Script</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.script }}"
    />
    <span class="mat-primary label-colon" i18n>Animation</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.animation }}"
    />
    <span class="mat-primary label-colon" i18n>Editing</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.editing }}"
    />
    <span class="mat-primary label-colon" i18n>Sound</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.sound }}"
    />
    <span class="mat-primary label-colon" i18n>Music</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.music }}"
    />
    <span class="mat-primary label-colon" i18n>Production Company</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.productionCompany }}"
    />

    <span class="mat-primary label-colon" i18n>Contact</span>
    <input
      type="text"
      class="form-control form-control-sm"
      readonly
      value="{{ movie?.contact?.name }}"
    />

    <ng-template #emptyInput>
      <input
        type="text"
        class="form-control form-control-sm"
        readonly
        value=""
      />
    </ng-template>
  `,
})
export class DetailsViewMovieComponent extends DetailsViewComponent {
  @Input()
  movie: Movie;

  ngOnInit() {
    console.log('INIT', this.movie);
  }
}
