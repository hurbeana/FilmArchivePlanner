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
import { FullDetailViewComponent } from './components/full-detail-view/full-detail-view.component';
import { EditViewComponent } from './components/edit-view/edit-view.component';
import { ContentComponent } from './components/content/content.component';

/* state management*/
import { directorsReducer } from './state/directors.reducer';
import { DirectorEffects } from './state/directors.effects';
import { DirectorsRoutingModule } from './directors-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableViewComponent } from './components/table-view/table-view.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDeleteDirectorModalComponent } from './components/table-view/confirm-delete-director-modal.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    TableViewComponent,
    ContentComponent,
    FullDetailViewComponent,
    EditViewComponent,
    ConfirmDeleteDirectorModalComponent,
  ],
  exports: [
    TableViewComponent,
    ContentComponent,
    FullDetailViewComponent,
    EditViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forFeature('directorsState', directorsReducer),
    EffectsModule.forFeature([DirectorEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    DirectorsRoutingModule,
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
  ],
})
/* Director Module contains everything related to Directors */
export class DirectorsModule {
  constructor(private store: Store) {}
}
