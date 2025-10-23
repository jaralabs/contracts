import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-brand-orange rounded-2xl mb-6"
        >
          <span class="text-white font-bold text-3xl">GS</span>
        </div>
        <h1 class="text-4xl font-bold text-primary-400 mb-4">¡Bienvenido!</h1>
        <p class="text-lg text-secondary-600">
          Selecciona una opción para comenzar
        </p>
      </div>
    </div>
  `,
})
export class HomeComponent {}
