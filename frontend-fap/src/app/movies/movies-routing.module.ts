import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { FullDetailViewComponent } from './components/full-detail-view/full-detail-view.component';

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: ':id', component: FullDetailViewComponent }, // TODO: replace with update movie component
  { path: 'create', component: FullDetailViewComponent }, // TODO: replace with create movie component
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
