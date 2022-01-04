import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/content/content.component';

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'edit/:id', component: ContentComponent },
  { path: ':id', component: ContentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FestivalsRoutingModule {}
