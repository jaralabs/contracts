import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LoginPageComponent } from './login-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [noAuthGuard],
  },
  {
    path: 'erp',
    component: LayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule('erp', './Routes').then((m) => m.appRoutes),
  },
  {
    path: '**',
    redirectTo: 'erp',
  },
];
