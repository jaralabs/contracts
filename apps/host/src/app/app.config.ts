import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { appReducers } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideStore(appReducers),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
