// apps/erp/src/app/app.routes.ts
import { Route } from '@angular/router';
import { ContractDetailComponent } from './contract-detail.component';
import { HomeComponent } from './home.component';
import { SignaturePageComponent } from './signature-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signature',
    component: SignaturePageComponent,
  },
  {
    path: 'contract/:id',
    component: ContractDetailComponent,
  },
];
