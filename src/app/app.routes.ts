import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
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
    { path: 'lore', loadComponent: () => import('./features/lore/lore.page').then(m => m.LorePage) },
  { path: 'ships', loadComponent: () => import('./features/ships/ships-list/ships-list.page').then(m => m.ShipsListPage) },
  { path: 'ships/:id', loadComponent: () => import('./features/ships/ships-detail/ships-detail.page').then(m => m.ShipDetailPage) },
  { path: 'logistics', loadComponent: () => import('./features/logistics/logistics.page').then(m => m.LogisticsPage) },
  { path: 'engineering', loadComponent: () => import('./features/engineering/engineering.page').then(m => m.EngineeringPage) },
  { path: 'stations', loadComponent: () => import('./features/stations/stations.page').then(m => m.StationsPage) },
  { path: 'medical', loadComponent: () => import('./features/medical/medical.page').then(m => m.MedicalPage) },
  { path: 'habitation', loadComponent: () => import('./features/habitation/habitation.page').then(m => m.HabitationPage) },
  { path: 'codex', loadComponent: () => import('./features/codex/codex.page').then(m => m.CodexPage) },
  { path: 'media', loadComponent: () => import('./features/media/media.page').then(m => m.MediaPage) },
  { path: 'updates', loadComponent: () => import('./features/updates/updates.page').then(m => m.UpdatesPage) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.page').then(m => m.ContactPage) },
];
