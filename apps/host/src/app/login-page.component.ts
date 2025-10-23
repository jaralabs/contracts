import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HeaderComponent,
  InputComponent,
  LabelComponent,
} from '@contracts/design-system';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [HeaderComponent, FormsModule, InputComponent, LabelComponent],
  template: `
    <div
      class="fixed inset-0 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <!-- Header Component -->
      <lib-header></lib-header>

      <!-- Login Content -->
      <div
        class="absolute inset-x-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-y-auto"
        style="top: 80px; bottom: 0;"
      >
        <div class="w-full max-w-lg">
          <!-- Login Form -->
          @if (authService.authStep() === 'LOGIN') {
          <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <!-- Logo y Título -->
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-brand-orange rounded-2xl mb-4"
              >
                <span class="text-white font-bold text-2xl">GS</span>
              </div>
              <h2 class="text-3xl font-bold text-secondary-900">
                ¡Bienvenido!
              </h2>
              <p class="mt-2 text-sm text-secondary-600">
                Completa los detalles a continuación para iniciar sesión
              </p>
            </div>

            <!-- Error Message -->
            @if (errorMessage()) {
            <div class="rounded-lg bg-red-50 border border-red-200 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">
                    {{ errorMessage() }}
                  </p>
                </div>
              </div>
            </div>
            }

            <form (submit)="onLogin($event)" class="space-y-5">
              <!-- Email -->
              <div>
                <lib-label
                  class="block text-sm font-medium text-secondary-700 mb-2"
                  >Correo electrónico</lib-label
                >
                <lib-input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  [(ngModel)]="email"
                  name="email"
                  [disabled]="isLoading()"
                  [variant]="errorMessage() ? 'error' : 'default'"
                  required
                  class="w-full"
                ></lib-input>
              </div>

              <!-- Password -->
              <div>
                <lib-label
                  class="block text-sm font-medium text-secondary-700 mb-2"
                  >Contraseña</lib-label
                >
                <lib-input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  [(ngModel)]="password"
                  name="password"
                  [disabled]="isLoading()"
                  [variant]="errorMessage() ? 'error' : 'default'"
                  required
                  class="w-full"
                ></lib-input>
              </div>

              <!-- Forgot password -->
              <div class="flex items-center justify-end">
                <a
                  href="#"
                  class="text-sm font-medium text-brand-orange hover:text-primary-600 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <!-- Login Button -->
              <button
                type="submit"
                [disabled]="isLoading()"
                class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-orange hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:bg-secondary-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                @if (isLoading()) {
                <svg
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Iniciando sesión...</span>
                } @else {
                <span>Iniciar sesión</span>
                }
              </button>
            </form>
          </div>
          }

          <!-- Nueva Contraseña Form -->
          @if (authService.authStep() === 'NEW_PASSWORD_REQUIRED') {
          <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <!-- Título -->
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-brand-orange rounded-2xl mb-4"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-secondary-900">
                Cambiar contraseña
              </h2>
              <p class="mt-2 text-sm text-secondary-600">
                Tu contraseña es temporal. Por favor, establece una nueva
                contraseña.
              </p>
            </div>

            <!-- Error Message -->
            @if (errorMessage()) {
            <div class="rounded-lg bg-red-50 border border-red-200 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">
                    {{ errorMessage() }}
                  </p>
                </div>
              </div>
            </div>
            }

            <form (submit)="onChangePassword($event)" class="space-y-5">
              <!-- Nueva Contraseña -->
              <div>
                <lib-label class="block text-sm font-medium text-gray-700 mb-2"
                  >Nueva contraseña</lib-label
                >
                <lib-input
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  [(ngModel)]="newPassword"
                  name="newPassword"
                  [disabled]="isLoading()"
                  required
                  class="w-full"
                ></lib-input>
              </div>

              <!-- Confirmar Contraseña -->
              <div>
                <lib-label class="block text-sm font-medium text-gray-700 mb-2"
                  >Confirmar contraseña</lib-label
                >
                <lib-input
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  [disabled]="isLoading()"
                  required
                  class="w-full"
                ></lib-input>
              </div>

              <!-- Requisitos de contraseña -->
              <div class="rounded-lg bg-orange-50 border border-orange-200 p-4">
                <p class="text-sm font-semibold text-secondary-900 mb-3">
                  Requisitos de la contraseña:
                </p>
                <ul class="space-y-2">
                  <li class="flex items-start text-sm text-secondary-800">
                    <svg
                      class="h-5 w-5 text-brand-orange mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mínimo 8 caracteres</span>
                  </li>
                  <li class="flex items-start text-sm text-secondary-800">
                    <svg
                      class="h-5 w-5 text-brand-orange mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Al menos una letra mayúscula y una minúscula</span>
                  </li>
                  <li class="flex items-start text-sm text-secondary-800">
                    <svg
                      class="h-5 w-5 text-brand-orange mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Al menos un número y un carácter especial</span>
                  </li>
                </ul>
              </div>

              <!-- Change Password Button -->
              <button
                type="submit"
                [disabled]="isLoading()"
                class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-orange hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:bg-secondary-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                @if (isLoading()) {
                <svg
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Cambiando contraseña...</span>
                } @else {
                <span>Cambiar contraseña</span>
                }
              </button>
            </form>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  email = '';
  password = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(public authService: AuthService) {}

  async onLogin(event: Event) {
    event.preventDefault();

    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      await this.authService.login(this.email, this.password);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async onChangePassword(event: Event) {
    event.preventDefault();

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    // Validar requisitos de contraseña
    if (this.newPassword.length < 8) {
      this.errorMessage.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/[A-Z]/.test(this.newPassword)) {
      this.errorMessage.set(
        'La contraseña debe contener al menos una mayúscula'
      );
      return;
    }

    if (!/[a-z]/.test(this.newPassword)) {
      this.errorMessage.set(
        'La contraseña debe contener al menos una minúscula'
      );
      return;
    }

    if (!/[0-9]/.test(this.newPassword)) {
      this.errorMessage.set('La contraseña debe contener al menos un número');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(this.newPassword)) {
      this.errorMessage.set(
        'La contraseña debe contener al menos un carácter especial'
      );
      return;
    }

    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      await this.authService.confirmNewPassword(this.newPassword);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Error al cambiar contraseña'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
