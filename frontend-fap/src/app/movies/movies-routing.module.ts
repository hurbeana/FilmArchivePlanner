import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DetailsViewComponent} from "./components/details-view/details-view.component";

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
