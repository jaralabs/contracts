import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  confirmSignIn,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  SignInInput,
  signOut,
} from 'aws-amplify/auth';

export interface AuthUser {
  username: string;
  email: string;
  userId: string;
}

export type AuthStep = 'LOGIN' | 'NEW_PASSWORD_REQUIRED' | 'AUTHENTICATED';

export interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<AuthUser | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  authStep = signal<AuthStep>('LOGIN');
  pendingEmail = signal<string>('');
  error = signal<AuthError | null>(null);

  constructor(private router: Router) {
    this.checkCurrentUser();
  }

  async checkCurrentUser(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

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

        if (this.router.url === '/' || this.router.url === '') {
          this.router.navigate(['/erp']);
        }
      }
    } catch {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.authStep.set('LOGIN');
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

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
        this.pendingEmail.set(email);
        this.authStep.set('NEW_PASSWORD_REQUIRED');
      }
    } catch (error: unknown) {
      const authError = this.parseError(error);
      this.error.set(authError);
      throw new Error(authError.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  async confirmNewPassword(newPassword: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const { isSignedIn } = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (isSignedIn) {
        await this.checkCurrentUser();
        this.authStep.set('AUTHENTICATED');
        this.router.navigate(['/erp']);
      }
    } catch (error: unknown) {
      const authError = this.parseError(error);
      this.error.set(authError);
      throw new Error(authError.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      await signOut();
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.authStep.set('LOGIN');
      this.router.navigate(['/']);
    } catch (error) {
      const authError = this.parseError(error);
      this.error.set(authError);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getAccessToken(): Promise<string | undefined> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString();
    } catch {
      return undefined;
    }
  }

  clearError(): void {
    this.error.set(null);
  }

  private parseError(error: unknown): AuthError {
    if (!error || typeof error !== 'object') {
      return {
        code: 'UNKNOWN_ERROR',
        message: 'Ha ocurrido un error desconocido',
      };
    }

    const err = error as { name?: string; message?: string };
    const code = err.name || 'UNKNOWN_ERROR';
    const message = this.getErrorMessage(code, err.message);

    return { code, message };
  }

  private getErrorMessage(code: string, originalMessage?: string): string {
    const errorMap: Record<string, string> = {
      UserNotFoundException: 'Usuario no encontrado. Verifica tu email.',
      NotAuthorizedException:
        'Email o contraseña incorrectos. Intenta nuevamente.',
      UserNotConfirmedException:
        'Usuario no confirmado. Por favor, verifica tu email.',
      InvalidPasswordException:
        'La contraseña no cumple con los requisitos mínimos.',
      TooManyRequestsException:
        'Demasiados intentos. Por favor, intenta más tarde.',
      NetworkError: 'Error de conexión. Verifica tu conexión a internet.',
      InvalidParameterException:
        'Parámetros inválidos. Verifica los datos ingresados.',
      CodeMismatchException: 'Código de verificación incorrecto.',
      ExpiredCodeException: 'El código de verificación ha expirado.',
      LimitExceededException: 'Se ha excedido el límite de intentos.',
    };

    return (
      errorMap[code] ||
      originalMessage ||
      'Ha ocurrido un error. Intenta nuevamente.'
    );
  }
}
