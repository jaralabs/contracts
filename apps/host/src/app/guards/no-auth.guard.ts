import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@contracts/shared';

export const noAuthGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

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
    return router.createUrlTree(['/erp']);
  }

  return true;
};
