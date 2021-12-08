import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { EditViewComponent } from './components/edit-view/edit-view.component';
import { FullDetailViewComponent } from './components/full-detail-view/full-detail-view.component';

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'edit/:id', component: EditViewComponent },
  { path: 'create', component: EditViewComponent },
  { path: ':id', component: FullDetailViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
