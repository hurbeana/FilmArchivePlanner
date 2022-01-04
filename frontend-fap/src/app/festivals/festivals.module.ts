import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FestivalsRoutingModule } from './festivals-routing.module';
import { TableViewComponent } from './components/table-view/table-view.component';
import { DetailsViewComponent } from './components/details-view/details-view.component';
import { ContentComponent } from './components/content/content.component';
import { ConfirmDeleteFestivalModalComponent } from './components/table-view/confirm-delete-festival-modal.component';
import { CreateFestivalModalComponent } from './components/table-view/create-festival-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule } from '@ngrx/store';
import { festivalsReducer } from './state/festivals.reducer';
import { FestivalEffects } from './state/festivals.effects';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import * as FestivalActions from './state/festivals.actions';

@NgModule({
  declarations: [
    DetailsViewComponent,
    TableViewComponent,
    ContentComponent,
    ConfirmDeleteFestivalModalComponent,
    CreateFestivalModalComponent,
  ],
  exports: [TableViewComponent, DetailsViewComponent, ContentComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StoreModule.forRoot({
      pagination: festivalsReducer,
      selectedFestival: festivalsReducer,
      searchTerm: festivalsReducer,
    }),
    EffectsModule.forRoot([FestivalEffects]),
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    FestivalsRoutingModule,
  ],
})
export class FestivalsModule {
  constructor(private store: Store) {
    this.store.dispatch(FestivalActions.getFestivals({ page: 1, limit: 16 }));
  }
}
