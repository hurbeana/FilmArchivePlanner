import {NgModule} from '@angular/core';

/* Components*/
import {AppComponent} from './app.component';

/* Modules*/
import {CoreModule} from "./core/core.module";
import {MoviesModule} from "./movies/movies.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
    MoviesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
