import { Injectable, signal } from '@angular/core';

/**
 * Servicio para gestionar el estado de carga global de la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCount = 0;
  isLoading = signal<boolean>(false);

  /**
   * Incrementar contador de peticiones activas
   */
  show(): void {
    this.loadingCount++;
    if (this.loadingCount > 0) {
      this.isLoading.set(true);
    }
  }

  /**
   * Decrementar contador de peticiones activas
   */
  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.isLoading.set(false);
    }
  }

  /**
   * Forzar estado de carga (útil para operaciones manuales)
   */
  setLoading(loading: boolean): void {
    this.loadingCount = loading ? 1 : 0;
    this.isLoading.set(loading);
  }
}
