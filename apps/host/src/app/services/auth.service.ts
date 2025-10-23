import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Amplify } from 'aws-amplify';
import {
  confirmSignIn,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  SignInInput,
  signOut,
} from 'aws-amplify/auth';
import { awsConfig } from '../../aws-config';

// Configurar Amplify
Amplify.configure(awsConfig);

export interface AuthUser {
  username: string;
  email: string;
  userId: string;
}

export type AuthStep = 'LOGIN' | 'NEW_PASSWORD_REQUIRED' | 'AUTHENTICATED';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Señal para el estado de autenticación
  currentUser = signal<AuthUser | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  authStep = signal<AuthStep>('LOGIN');
  pendingEmail = signal<string>('');

  constructor(private router: Router) {
    this.checkCurrentUser();
  }

  /**
   * Verifica si hay un usuario autenticado al iniciar la app
   */
  async checkCurrentUser(): Promise<void> {
    try {
      this.isLoading.set(true);
      const user = await getCurrentUser();
      const session = await fetchAuthSession();

      if (user && session.tokens) {
        this.currentUser.set({
          username: user.username,
          email: user.signInDetails?.loginId || '',
          userId: user.userId,
        });
        this.isAuthenticated.set(true);
        this.authStep.set('AUTHENTICATED');

        // Si está en la página de login y ya está autenticado, redirigir
        if (this.router.url === '/' || this.router.url === '') {
          this.router.navigate(['/erp']);
        }
      }
    } catch (error) {
      console.log('No hay usuario autenticado');
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.authStep.set('LOGIN');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const signInInput: SignInInput = {
        username: email,
        password: password,
      };

      const { isSignedIn, nextStep } = await signIn(signInInput);

      if (isSignedIn) {
        await this.checkCurrentUser();
        this.authStep.set('AUTHENTICATED');
        this.router.navigate(['/erp']);
      } else if (
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
      ) {
        // Usuario necesita cambiar contraseña
        this.pendingEmail.set(email);
        this.authStep.set('NEW_PASSWORD_REQUIRED');
      } else {
        console.log('Next step:', nextStep);
      }
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Confirmar nueva contraseña
   */
  async confirmNewPassword(newPassword: string): Promise<void> {
    try {
      const { isSignedIn } = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (isSignedIn) {
        await this.checkCurrentUser();
        this.authStep.set('AUTHENTICATED');
        this.router.navigate(['/erp']);
      }
    } catch (error: unknown) {
      console.error('Error al cambiar contraseña:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await signOut();
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.authStep.set('LOGIN');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtener token de acceso
   */
  async getAccessToken(): Promise<string | undefined> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString();
    } catch (error) {
      console.error('Error al obtener token:', error);
      return undefined;
    }
  }

  /**
   * Mensajes de error amigables
   */
  private getErrorMessage(error: unknown): string {
    if (!error || typeof error !== 'object') {
      return 'Error desconocido';
    }

    const err = error as { name?: string; message?: string };

    const errorMap: Record<string, string> = {
      UserNotFoundException: 'Usuario no encontrado',
      NotAuthorizedException: 'Email o contraseña incorrectos',
      UserNotConfirmedException: 'Usuario no confirmado. Verifica tu email.',
      InvalidPasswordException: 'Contraseña inválida',
      TooManyRequestsException: 'Demasiados intentos. Intenta más tarde.',
      NetworkError: 'Error de conexión. Verifica tu internet.',
    };

    return errorMap[err.name || ''] || err.message || 'Error desconocido';
  }
}
