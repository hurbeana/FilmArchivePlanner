import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'movies',
    loadChildren: () =>
      import('./movies/movies.module').then((m) => m.MoviesModule),
  }, // lazy load module
  {
    path: 'directors',
    loadChildren: () =>
      import('./directors/directors.module').then((m) => m.DirectorsModule),
  }, // lazy load module
  {
    path: 'contacts',
    loadChildren: () =>
      import('./contacts/contacts.module').then((m) => m.ContactsModule),
  }, // lazy load module
  {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then((m) => m.TagsModule),
  }, // lazy load module
  {
    path: 'festivals',
    loadChildren: () =>
      import('./festivals/festivals.module').then((m) => m.FestivalsModule),
  }, // lazy load module
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules, // preload all modules in the background
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
