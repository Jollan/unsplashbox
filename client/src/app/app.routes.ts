import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { AuthComponent } from './auth/auth.component';
import { CanActivate } from './guards/auth.guard';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { CollectionsComponent } from './collections/collections.component';
import { ImagesComponent } from './collections/images/images.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'authen', component: AuthComponent },
  {
    path: 'search/result/:keyword',
    component: SearchResultComponent,
  },
  {
    path: 'image/details',
    component: ImageDetailsComponent,
    canActivate: [CanActivate],
  },
  {
    path: 'collections',
    component: CollectionsComponent,
    canActivate: [CanActivate],
  },
  {
    path: 'collections',
    canActivateChild: [CanActivate],
    children: [{ path: ':id', component: ImagesComponent }],
  },
  {
    path: 'images/:id',
    component: ImageDetailsComponent,
    canActivate: [CanActivate],
  },
];
