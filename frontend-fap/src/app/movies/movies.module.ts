import {NgModule} from '@angular/core';

/* Modules */
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import {CommonModule} from '@angular/common';
import {Store, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {SharedModule} from "../shared/shared.module";

/* Components */
import {ListViewComponent} from "./components/list-view/list-view.component";
import {DetailsViewComponent} from "./components/details-view/details-view.component";

/* state management*/
import {moviesReducer} from "./state/movies.reducer";
import {MovieEffects} from "./state/movies.effects";
import {MoviesRoutingModule} from "./movies-routing.module";
import {ContentComponent} from "./components/content/content.component";
import {retrievedMovieList} from "./state/movies.actions";


@NgModule({
  declarations: [
    DetailsViewComponent,
    ListViewComponent,
    ContentComponent
  ],
  exports: [
    ListViewComponent,
    DetailsViewComponent,
    ContentComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forRoot({movies: moviesReducer}),
    EffectsModule.forRoot([MovieEffects]),
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MoviesRoutingModule,
  ]
})
/* Movie Module contains everything related to movies */
export class MoviesModule {
  constructor(private store: Store) {
    this.store.dispatch(retrievedMovieList());
  }
}
