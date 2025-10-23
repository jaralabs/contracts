import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperar a que se verifique el usuario
  if (authService.isLoading()) {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!authService.isLoading()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir al login si no está autenticado
  return router.createUrlTree(['/']);
};
