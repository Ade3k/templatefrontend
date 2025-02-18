// Importation des éléments nécessaires depuis Angular
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; 
// `ApplicationConfig` permet de configurer l'application Angular avec divers services.
// `provideZoneChangeDetection` optimise la gestion des changements de zone pour de meilleures performances.

import { provideRouter } from '@angular/router'; 
// `provideRouter` configure les routes définies dans l'application.
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes'; 
// Importation des définitions de routes de l'application.

// `provideHttpClient` permet d'activer le client HTTP pour faire des requêtes.
// `withInterceptors` permet d'ajouter des interceptors pour modifier les requêtes ou réponses HTTP.

// Intercepteur personnalisé qui peut ajouter des headers JWT (JSON Web Token) aux requêtes HTTP pour l'authentification.

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuration de la détection de zone avec optimisation
    provideZoneChangeDetection({
      eventCoalescing: true // Combine les événements proches en un seul pour réduire le nombre de vérifications de changement
    }),
    provideEnvironmentNgxMask(), provideAnimationsAsync(),
    provideToastr(
      {
        closeButton: true, positionClass: 'toast-top-center',
        timeOut: 1000000,preventDuplicates:false
      }
    ),
    // Injection du système de routage avec les routes définies
    provideRouter(routes),

    // Configuration du client HTTP avec un intercepteur pour ajouter des tokens JWT
    
  ]
};
