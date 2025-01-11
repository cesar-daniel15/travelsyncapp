import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

(window as any).process = {
  env: {
    NODE_ENV: 'development',
  },
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

