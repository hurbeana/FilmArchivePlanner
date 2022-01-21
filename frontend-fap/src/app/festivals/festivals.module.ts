import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FestivalsRoutingModule } from './festivals-routing.module';
import { TableViewComponent } from './components/table-view/table-view.component';
import { ContentComponent } from './components/content/content.component';
import { ConfirmDeleteFestivalModalComponent } from './components/table-view/confirm-delete-festival-modal.component';
import { CreateFestivalModalComponent } from './components/table-view/create-festival-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
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
import { PlanEditorComponent } from './components/plan-editor/plan-editor.component';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter,
  DateFormatterParams,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { PlannerMovieListComponent } from './components/planner-movie-list/planner-movie-list.component';
import { moviesReducer } from '../movies/state/movies.reducer';
import { MovieEffects } from '../movies/state/movies.effects';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditEventModalComponent } from './components/edit-event-modal/edit-event-modal.component';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public weekViewHour({ date, locale }: DateFormatterParams): string {
    // change this to return a different date format
    const formats = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return formats;
  }
}

@NgModule({
  declarations: [
    TableViewComponent,
    ContentComponent,
    ConfirmDeleteFestivalModalComponent,
    CreateFestivalModalComponent,
    PlanEditorComponent,
    PlannerMovieListComponent,
    EditEventModalComponent,
  ],
  exports: [TableViewComponent, ContentComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory,
    }),
    EffectsModule.forFeature([MovieEffects, FestivalEffects]),
    StoreModule.forFeature('festivalsState', festivalsReducer),
    StoreModule.forFeature('moviesState', moviesReducer),
    SharedModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
    DragDropModule,
    NgbDatepickerModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    FestivalsRoutingModule,
    NgxBootstrapIconsModule,
    NgbTimepickerModule,
    NgSelectModule,
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class FestivalsModule {
  constructor(private store: Store) {}
}
