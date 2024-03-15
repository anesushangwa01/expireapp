import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Ensure this import is present
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { OAuthModule } from 'angular-oauth2-oidc';


bootstrapApplication(AppComponent,  {
  providers: [
    provideHttpClient(),
    ...appConfig.providers,  // Merge providers from appConfig
 
  ],
})
  .catch((err) => console.error(err));