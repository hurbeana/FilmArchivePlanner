import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

/* Modules */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';

/* Components */
import { FullDetailViewComponent } from './components/full-detail-view/full-detail-view.component';

/* state management*/
import { moviesReducer } from './state/movies.reducer';
import { directorsReducer } from '../directors/state/directors.reducer';
import { contactsReducer } from '../contacts/state/contacts.reducer';
import { tagsReducer } from '../tags/state/tags.reducer';
import { MovieEffects } from './state/movies.effects';
import { MoviesRoutingModule } from './movies-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from './components/content/content.component';
import {
  ConfirmDeleteMovieModalComponent,
  TableViewComponent,
} from './components/table-view/table-view.component';
import * as MovieActions from './state/movies.actions';
import { EditViewComponent } from './components/edit-view/edit-view.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { DirectorEffects } from '../directors/state/directors.effects';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { TagEffects } from '../tags/state/tags.effects';
import { ContactEffects } from '../contacts/state/contacts.effects';

@NgModule({
  declarations: [
    TableViewComponent,
    ContentComponent,
    EditViewComponent,
    ContentComponent,
    FullDetailViewComponent,
    ConfirmDeleteMovieModalComponent,
  ],
  exports: [TableViewComponent, ContentComponent, FullDetailViewComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forRoot({
      moviesState: moviesReducer,
      directorsState: directorsReducer,
      contactsState: contactsReducer,
      tagsState: tagsReducer,
    }),
    EffectsModule.forRoot([MovieEffects]),
    EffectsModule.forFeature([DirectorEffects, ContactEffects, TagEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    GalleryModule,
    LightboxModule,
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MoviesRoutingModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
  ],
})
/* Movie Module contains everything related to movies */
export class MoviesModule {
  constructor(private store: Store) {}
}
