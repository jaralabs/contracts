import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@contracts/shared';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 401:
            errorMessage =
              'No autorizado. Por favor, inicia sesión nuevamente.';
            authService.logout();
            router.navigate(['/']);
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 500:
            errorMessage = 'Error del servidor. Intenta más tarde.';
            break;
          case 503:
            errorMessage = 'Servicio no disponible. Intenta más tarde.';
            break;
          default:
            errorMessage =
              error.error?.message || `Error ${error.status}: ${error.message}`;
        }
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
