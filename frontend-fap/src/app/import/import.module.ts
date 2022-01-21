import { NgModule } from '@angular/core';
import { ImportComponent } from './components/import.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportRoutingModule } from './import-routing.module';
import { MatCardModule } from '@angular/material/card';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

@NgModule({
  declarations: [ImportComponent],
  exports: [ImportComponent],
  imports: [
    ImportRoutingModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgxBootstrapIconsModule,
  ],
})
export class ImportModule {}
