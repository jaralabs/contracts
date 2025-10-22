// apps/host/src/app/app.routes.ts
import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { HomePageComponent } from './home-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'signature',
    loadChildren: () =>
      loadRemoteModule('signature', './Routes').then((m) => m.appRoutes),
  },
];
