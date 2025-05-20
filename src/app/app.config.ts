import { ApplicationConfig, provideZoneChangeDetection,importProvidersFrom,provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { routes } from './app.routes';


export function registerFontAwesome(library: FaIconLibrary) {
  return () => {
    library.addIconPacks(fas);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    importProvidersFrom(FontAwesomeModule),
    provideRouter(routes),
    provideAppInitializer(() => {
      // `inject()` funziona solo qui, dentro provideAppInitializer
      const library = inject(FaIconLibrary);
      // Registra tutte le icone necessarie in un colpo solo
      library.addIconPacks(fas);
      // Nessun valore di ritorno necessario (void)
    }),
  ]
};
