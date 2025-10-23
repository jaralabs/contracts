import { Route } from '@angular/router';
import { ContractDetailComponent } from './contract-detail.component';
import { SignaturePageComponent } from './signature-page.component';

export { ContractDetailComponent, SignaturePageComponent };

export const appRoutes: Route[] = [
  {
    path: 'signature/:id',
    component: ContractDetailComponent,
  },
  {
    path: 'signature',
    component: SignaturePageComponent,
  },
  {
    path: '',
    redirectTo: 'signature',
    pathMatch: 'full',
  },
];
