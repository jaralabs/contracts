export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_cURobggRv',
      userPoolClientId: '70km7nv8tdu1upubtm8le7evep',
      identityPoolId: 'us-east-1:7b1efcc9-3475-451b-899e-b5ebb9853bce',
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
