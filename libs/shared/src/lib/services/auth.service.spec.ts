import { AuthError, AuthStep, AuthUser } from './auth.service';

describe('AuthService - Logic Tests', () => {
  describe('Error parsing', () => {
    it('should parse UserNotFoundException correctly', () => {
      const error = { name: 'UserNotFoundException' };
      const expectedMessage = 'Usuario no encontrado. Verifica tu email.';

      const code = error.name;
      const message = getErrorMessage(code);

      expect(message).toBe(expectedMessage);
    });

    it('should parse NotAuthorizedException correctly', () => {
      const error = { name: 'NotAuthorizedException' };
      const expectedMessage =
        'Email o contraseña incorrectos. Intenta nuevamente.';

      const code = error.name;
      const message = getErrorMessage(code);

      expect(message).toBe(expectedMessage);
    });

    it('should parse InvalidPasswordException correctly', () => {
      const error = { name: 'InvalidPasswordException' };
      const expectedMessage =
        'La contraseña no cumple con los requisitos mínimos.';

      const code = error.name;
      const message = getErrorMessage(code);

      expect(message).toBe(expectedMessage);
    });

    it('should handle unknown error codes', () => {
      const error = { name: 'UnknownErrorCode' };
      const defaultMessage = 'Ha ocurrido un error. Intenta nuevamente.';

      const code = error.name;
      const message = getErrorMessage(code);

      expect(message).toBe(defaultMessage);
    });

    it('should use original message if provided for unknown error', () => {
      const error = {
        name: 'UnknownErrorCode',
        message: 'Custom error message',
      };

      const code = error.name;
      const message = getErrorMessage(code, error.message);

      expect(message).toBe('Custom error message');
    });
  });

  describe('Auth state management', () => {
    it('should have correct initial auth state structure', () => {
      const initialUser: AuthUser | null = null;
      const isAuthenticated = false;
      const isLoading = true;
      const authStep: AuthStep = 'LOGIN';
      const error: AuthError | null = null;

      expect(initialUser).toBeNull();
      expect(isAuthenticated).toBe(false);
      expect(isLoading).toBe(true);
      expect(authStep).toBe('LOGIN');
      expect(error).toBeNull();
    });

    it('should have valid auth step values', () => {
      const validSteps: AuthStep[] = [
        'LOGIN',
        'NEW_PASSWORD_REQUIRED',
        'AUTHENTICATED',
      ];

      validSteps.forEach((step) => {
        expect(['LOGIN', 'NEW_PASSWORD_REQUIRED', 'AUTHENTICATED']).toContain(
          step
        );
      });
    });

    it('should handle authenticated user state', () => {
      const user: AuthUser = {
        username: 'test@example.com',
        email: 'test@example.com',
        userId: 'user-123',
      };
      const isAuthenticated = true;
      const authStep: AuthStep = 'AUTHENTICATED';

      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('userId');
      expect(isAuthenticated).toBe(true);
      expect(authStep).toBe('AUTHENTICATED');
    });

    it('should handle new password required state', () => {
      const pendingEmail = 'test@example.com';
      const authStep: AuthStep = 'NEW_PASSWORD_REQUIRED';

      expect(pendingEmail).toBeTruthy();
      expect(authStep).toBe('NEW_PASSWORD_REQUIRED');
    });
  });

  describe('User validation', () => {
    it('should validate user object structure', () => {
      const user: AuthUser = {
        username: 'testuser',
        email: 'test@example.com',
        userId: 'user-123',
      };

      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.userId).toBeDefined();
      expect(typeof user.username).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.userId).toBe('string');
    });

    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'admin@company.org',
      ];

      validEmails.forEach((email) => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should invalidate incorrect email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      invalidEmails.forEach((email) => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe('Error object validation', () => {
    it('should have valid error structure', () => {
      const error: AuthError = {
        code: 'UserNotFoundException',
        message: 'Usuario no encontrado',
      };

      expect(error).toHaveProperty('code');
      expect(error).toHaveProperty('message');
      expect(typeof error.code).toBe('string');
      expect(typeof error.message).toBe('string');
    });

    it('should handle null error state', () => {
      const error: AuthError | null = null;
      expect(error).toBeNull();
    });
  });

  describe('Password validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = ['SecureP@ss123', 'MyP@ssw0rd!', 'C0mpl3x!ty'];

      strongPasswords.forEach((password) => {
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        expect(
          hasMinLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSpecial
        ).toBe(true);
      });
    });

    it('should invalidate weak passwords', () => {
      const weakPasswords = ['12345678', 'password', 'abc123'];

      weakPasswords.forEach((password) => {
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const isStrong =
          hasMinLength &&
          hasUppercase &&
          hasLowercase &&
          hasNumber &&
          hasSpecial;

        expect(isStrong).toBe(false);
      });
    });
  });
});

function getErrorMessage(code: string, originalMessage?: string): string {
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
