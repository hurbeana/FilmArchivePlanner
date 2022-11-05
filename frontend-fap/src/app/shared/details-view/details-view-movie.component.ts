import { Component, Input } from '@angular/core';
import { Movie } from '../../movies/models/movie';
import { DetailsViewComponent } from './details-view.component';
import * as MovieActions from '../../movies/state/movies.actions';
import * as MovieSelectors from '../../movies/state/movies.selectors';
import { Contact } from '../../contacts/models/contact';
import { ViewContactModalComponent } from '../components/view-contact-modal/view-contact-modal.component';
import * as ContactSelectors from '../../contacts/state/contacts.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'details-view-movie',
  template: `
    <div *ngIf="movie">
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
      <div
        *ngIf="
          movie &&
            movie.movieFiles &&
            movie.movieFiles.length &&
            movie.movieFiles.length > 0;
          else emptyInput
        "
      >
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
      <div
        *ngIf="
          movie &&
            movie.dcpFiles &&
            movie.dcpFiles.length &&
            movie.dcpFiles.length > 0;
          else emptyInput
        "
      >
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

      <span class="mat-primary label-colon" i18n>Still Files</span>
      <div
        *ngIf="
          movie &&
            movie.stillFiles &&
            movie.stillFiles.length &&
            movie.stillFiles.length > 0;
          else emptyInput
        "
      >
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
      <div
        *ngIf="
          movie &&
            movie.subtitleFiles &&
            movie.subtitleFiles.length &&
            movie.subtitleFiles.length > 0;
          else emptyInput
        "
      >
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
      <div
        *ngIf="
          movie &&
            movie.directors &&
            movie.directors.length &&
            movie.directors.length > 0;
          else emptyInput
        "
      >
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

      <span class="mat-primary label-colon" i18n>Categories</span>
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
      <span class="mat-primary label-colon" i18n>Reference Number</span>
      <input
        type="text"
        class="form-control form-control-sm"
        readonly
        value="{{ movie?.referenceNumber }}"
      />
      <span class="mat-primary label-colon" i18n>Preview Link</span>
      <div *ngIf="movie?.previewLink; else emptyInput">
        <div type="text" class="form-control form-control-sm disabled">
          <a target="_blank" href="{{ movie?.previewLink }}">
            {{ movie?.previewLink }}
          </a>
        </div>
      </div>

      <span class="mat-primary label-colon" i18n>Contact</span>
      <div
        *ngIf="movie.contact; else emptyInput"
        type="text"
        class="form-control form-control-sm disabled"
      >
        <a href="javascript:void(0)" (click)="openViewContactModal()">
          {{ movie?.contact?.name }}
        </a>
      </div>
    </div>
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
  movieId: number;

  movie: Movie | null | undefined;
  contact: Contact | null | undefined;
  subscription: Subscription;

  ngOnInit() {
    this.store.select(MovieSelectors.selectSelectedMovie).subscribe((movie) => {
      this.movie = movie;
    });

    this.subscription = this.store
      .select(ContactSelectors.selectSelectedContact)
      .subscribe((contact) => {
        this.contact = contact;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.movieId) {
      // load movie by ID and set it as selectedMovie
      this.store.dispatch(
        MovieActions.getMovieByIdAndSetAsSelectedMovie({
          id: this.movieId,
        }),
      );
    }
  }

  openViewContactModal() {
    const modalRef = this.modalService.open(ViewContactModalComponent, {
      centered: true,
      keyboard: true,
      //backdrop: 'static' // won`t close on click outside when uncommented
    });
    modalRef.componentInstance.contact = this.contact;
    modalRef.componentInstance.contactId = this.contact?.id;

    this.tagService
      .getTagsByType('Contact')
      .subscribe(
        (usableTags) => (modalRef.componentInstance.usableTags = usableTags),
      );
  }
}
