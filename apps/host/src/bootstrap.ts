import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { awsConfig } from './aws-config';

Amplify.configure(awsConfig);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
