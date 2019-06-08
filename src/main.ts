import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LicenseManager } from 'ag-grid-enterprise';

if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey(
  'Evaluation_License-_Not_For_Production_Valid_Until_30_July_2019__MTU2NDQ0MTIwMDAwMA==ea74e3eea79dddf4f61fde5faf1ef7c2')
  ;
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

