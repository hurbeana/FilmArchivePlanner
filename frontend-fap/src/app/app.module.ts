import { NgModule } from '@angular/core';

/* Components*/
import { AppComponent } from './app.component';

/* Modules*/
import { CoreModule } from './core/core.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, MatSidenavModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
