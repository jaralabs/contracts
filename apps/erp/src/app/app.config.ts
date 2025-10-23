import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ɵprovideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    ɵprovideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),
  ],
};
