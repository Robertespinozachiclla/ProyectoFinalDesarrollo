import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 👈 Importa withInterceptors
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor'; // 👈 Importa tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // 🟢 Agregamos withInterceptors([authInterceptor]) aquí:
   provideHttpClient()
  ]
};  