import { environment } from '@contracts/shared/config';

export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: environment.aws.cognito.userPoolId,
      userPoolClientId: environment.aws.cognito.userPoolClientId,
      identityPoolId: environment.aws.cognito.identityPoolId,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code' as const,
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    },
  },
};
