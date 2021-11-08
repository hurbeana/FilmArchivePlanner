import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MoviesRoutingModule} from "./movies/movies-routing.module";
import {MoviesModule} from "./movies/movies.module";
import {DetailsViewComponent} from "./movies/components/details-view/details-view.component";
import {ListViewComponent} from "./movies/components/list-view/list-view.component";
import {HomeComponent} from "./core/components/home/home.component";

const routes: Routes = [
  //{ path: 'movies', component: ListViewComponent },
  //{ path: 'movies/:id', component: DetailsViewComponent },
  //{ path: '', component: HomeComponent },
  //{ path: 'movies', loadChildren: () => MoviesModule}
  //{ path: 'movies', loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
