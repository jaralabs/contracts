// apps/signature/src/app/app.routes.ts
import { Route } from '@angular/router';
import { SignaturePageComponent } from './signature-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: SignaturePageComponent,
  },
];
