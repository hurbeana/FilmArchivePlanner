import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  calendar,
  listUl,
  NgxBootstrapIconsModule,
  pencil,
  search,
  trash,
  filter,
  arrowLeft,
  arrowRight,
} from 'ngx-bootstrap-icons';

const icons = {
  trash,
  pencil,
  listUl,
  calendar,
  search,
  filter,
  arrowLeft,
  arrowRight,
};
@NgModule({
  declarations: [HeaderComponent, FooterComponent, HomeComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    NgxBootstrapIconsModule.pick(icons),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    NgxBootstrapIconsModule,
  ],
})

/*Core Module is the main module, used for central components.
 it is imported from App Module only mentioned in : https://medium.com/god-dev-blog/building-an-angular-application-structure-ef4cee9da934*/
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        `${parentModule} has already been loaded. Import Core module in the AppModule only.`,
      );
    }
  }
}
