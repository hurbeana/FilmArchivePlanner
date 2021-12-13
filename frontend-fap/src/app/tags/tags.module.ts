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
import { DetailsViewComponent } from './components/details-view/details-view.component';

/* state management*/
import { tagsReducer } from './state/tags.reducer';
import { TagEffects } from './state/tags.effects';
import { TagsRoutingModule } from './tags-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from './components/content/content.component';
import { TableViewComponent } from './components/table-view/table-view.component';
import * as TagActions from './state/tags.actions';
import { ConfirmDeleteTagModal } from './components/table-view/confirm-delete-tag-modal.component';
import { CreateTagModal } from './components/table-view/create-tag-modal.component';
import { EditTagModal } from './components/table-view/edit-tag-modal.component';

@NgModule({
  declarations: [
    DetailsViewComponent,
    TableViewComponent,
    ContentComponent,
    ConfirmDeleteTagModal,
    CreateTagModal,
    EditTagModal,
  ],
  exports: [TableViewComponent, DetailsViewComponent, ContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forRoot({
      pagination: tagsReducer,
      selectedTag: tagsReducer,
      searchTerm: tagsReducer,
    }),
    EffectsModule.forRoot([TagEffects]),
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
  constructor(private store: Store) {
    this.store.dispatch(TagActions.getTags({ page: 1, limit: 16 }));
  }
}
