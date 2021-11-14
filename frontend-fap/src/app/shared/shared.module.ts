import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagInputComponent} from "./components/tag-input/tag-input.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatChipsModule} from "@angular/material/chips";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {YesNoLabelComponent} from './components/yes-no-label/yes-no-label.component';
import {ResizableDirective} from './resizable.directive';


@NgModule({
  declarations: [
    TagInputComponent,
    YesNoLabelComponent,
    ResizableDirective
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
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
    ResizableDirective
  ]
})
/* The shared module contains components, which are shared and reused from the feature
* modules. It is imported from the features modules. It should export used Modules,
* so feature modules don't have to.  */
export class SharedModule { }
