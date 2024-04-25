import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { MovieComponent } from './views/movie/movie.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:movieId', component: MovieComponent },
  { path: '**', component: NotFoundComponent },
];
