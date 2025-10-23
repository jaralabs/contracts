import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { awsConfig } from './aws-config';

// Configurar Amplify ANTES de inicializar la aplicación
Amplify.configure(awsConfig);

// Inicializar la aplicación
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
