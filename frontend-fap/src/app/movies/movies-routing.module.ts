import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DetailsViewComponent} from "./components/details-view/details-view.component";
import {ContentComponent} from "./components/content/content.component";

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: '/:id', component: DetailsViewComponent }, // TODO: replace with update movie component
  { path: '/create', component: DetailsViewComponent } // TODO: replace with create movie component
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
