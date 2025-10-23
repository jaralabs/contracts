import { Route } from '@angular/router';
import { ContractDetailComponent } from './contract-detail.component';
import { HomeComponent } from './home.component';
import { SignaturePageComponent } from './signature-page.component';

export { ContractDetailComponent, HomeComponent, SignaturePageComponent };

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signature/:id',
    component: ContractDetailComponent,
  },
  {
    path: 'signature',
    component: SignaturePageComponent,
  },
];
