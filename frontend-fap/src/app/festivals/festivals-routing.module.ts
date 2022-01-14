import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { PlanEditorComponent } from './components/plan-editor/plan-editor.component';

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'edit/:id', component: PlanEditorComponent },
  { path: ':id', component: PlanEditorComponent, data: { readonly: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FestivalsRoutingModule {}
