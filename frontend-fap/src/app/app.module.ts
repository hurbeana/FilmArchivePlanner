import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/* Modules from Angular Material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';


/* Modules created by ourselves */
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { TagInputComponent } from './components/tag-input/tag-input.component';
import { DetailsViewComponent } from './components/details-view/details-view.component';
import { ListViewComponent } from './components/list-view/list-view.component';

/* Modules for State Management */
import {StoreModule} from "@ngrx/store";
import {moviesReducer} from "./state/movies/movies.reducer";
import { HttpClientModule} from "@angular/common/http";
import {MovieEffects} from "./state/movies/movies.effects";
import {EffectsModule} from "@ngrx/effects";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    TagInputComponent,
    DetailsViewComponent,
    ListViewComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ movies: moviesReducer }),
    EffectsModule.forRoot([MovieEffects]),
    BrowserAnimationsModule,
    FormsModule,ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
