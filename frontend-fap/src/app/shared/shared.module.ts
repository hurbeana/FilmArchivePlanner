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

@NgModule({
  declarations: [
    TagInputComponent,
    YesNoLabelComponent,
    ResizableDirective,
    FileUploadComponent,
    NotFoundComponent,
    NgbdSortableHeaderDirective,
    ExportButtonComponent,
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
  ],
})
/* The shared module contains components, which are shared and reused from the feature
 * modules. It is imported from the features modules. It should export used Modules,
 * so feature modules don't have to.  */
export class SharedModule {}
