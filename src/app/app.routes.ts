import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'route-tester',
    loadComponent: () => import('./route-tester/route-tester.page').then( m => m.RouteTesterPage)
  },
  {
    path: 'star-map',
    loadComponent: () => import('./star-map/star-map.page').then( m => m.StarMapPage)
  },
  {
    path: 'route-tester',
    loadComponent: () => import('./route-tester/route-tester.page').then( m => m.RouteTesterPage)
  },
];
