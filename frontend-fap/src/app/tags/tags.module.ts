import { NgModule } from '@angular/core';

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
/* state management*/
import { tagsReducer } from './state/tags.reducer';
import { TagEffects } from './state/tags.effects';
import { TagsRoutingModule } from './tags-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from './components/content/content.component';
import { TableViewComponent } from './components/table-view/table-view.component';
import * as TagActions from './state/tags.actions';
import { ConfirmDeleteTagModalComponent } from './components/table-view/confirm-delete-tag-modal.component';
import { CreateTagModalComponent } from './components/table-view/create-tag-modal.component';
import { EditTagModalComponent } from './components/table-view/edit-tag-modal.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    TableViewComponent,
    ContentComponent,
    ConfirmDeleteTagModalComponent,
    CreateTagModalComponent,
    EditTagModalComponent,
  ],
  exports: [TableViewComponent, ContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forRoot({ tagsState: tagsReducer }),
    EffectsModule.forRoot([TagEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    TagsRoutingModule,
  ],
})
/* Tag Module contains everything related to Tags */
export class TagsModule {
  constructor(private store: Store) {}
}
