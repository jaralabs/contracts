import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

// Solo para standalone mode (cuando signature corre solo en :4201)
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)],
};
