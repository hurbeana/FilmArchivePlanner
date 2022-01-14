import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInputComponent } from './components/tag-input/tag-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { YesNoLabelComponent } from './components/yes-no-label/yes-no-label.component';
import { ResizableDirective } from './directives/resizable.directive';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgbdSortableHeaderDirective } from './directives/sortable.directive';
import { ExportButtonComponent } from './components/export-button/export-button.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DetailsViewComponent } from './details-view/details-view.component';
import { DetailsViewTagComponent } from './details-view/details-view-tag.component';
import { DetailsViewMovieComponent } from './details-view/details-view-movie.component';
import { DetailsViewDirectorComponent } from './details-view/details-view-director.component';
import { DetailsViewContactComponent } from './details-view/details-view-contact.component';
import { WithLoadingPipe } from './pipes/with.loading.pipe';
import { DetailsViewFestivalComponent } from './details-view/details-view-festival.component';
import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { RouterModule } from '@angular/router';
import { ViewContactModalComponent } from './components/view-contact-modal/view-contact-modal.component';

@NgModule({
  declarations: [
    TagInputComponent,
    YesNoLabelComponent,
    ResizableDirective,
    FileUploadComponent,
    NotFoundComponent,
    NgbdSortableHeaderDirective,
    ExportButtonComponent,
    WithLoadingPipe,
    DetailsViewComponent,
    DetailsViewMovieComponent,
    DetailsViewDirectorComponent,
    DetailsViewContactComponent,
    DetailsViewTagComponent,
    DetailsViewFestivalComponent,
    ViewContactModalComponent,
    DurationFormatPipe,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    NgSelectModule,
    RouterModule,
  ],
  exports: [
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputComponent,
    YesNoLabelComponent,
    ResizableDirective,
    FileUploadComponent,
    NgbdSortableHeaderDirective,
    ExportButtonComponent,
    WithLoadingPipe,
    DetailsViewComponent,
    DurationFormatPipe,
  ],
})
/* The shared module contains components, which are shared and reused from the feature
 * modules. It is imported from the features modules. It should export used Modules,
 * so feature modules don't have to.  */
export class SharedModule {}
