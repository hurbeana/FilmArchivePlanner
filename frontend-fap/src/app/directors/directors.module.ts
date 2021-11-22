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
import { directorsReducer } from './state/directors.reducer';
import { DirectorEffects } from './state/directors.effects';
import { DirectorsRoutingModule } from './directors-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from './components/content/content.component';
import { NgbdSortableHeader, TableViewComponent } from './components/table-view/table-view.component';
import * as DirectorActions from './state/directors.actions';

@NgModule({
  declarations: [
    DetailsViewComponent,
    TableViewComponent,
    NgbdSortableHeader,
    ContentComponent
  ],
  exports: [
    TableViewComponent,
    DetailsViewComponent,
    ContentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forRoot({
      pagination: directorsReducer,
      selectedDirector: directorsReducer,
      searchTerm: directorsReducer
    }),
    EffectsModule.forRoot([DirectorEffects]),
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    DirectorsRoutingModule,
  ]
})
/* Director Module contains everything related to Directors */
export class DirectorsModule {
  constructor(private store: Store) {
    this.store.dispatch(DirectorActions.getDirectors({search: "", page: 1, limit: 16}));
  }
}
