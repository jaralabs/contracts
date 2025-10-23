export interface Environment {
  production: boolean;
  apiUrl: string;
  aws: {
    region: string;
    cognito: {
      userPoolId: string;
      userPoolClientId: string;
      identityPoolId: string;
    };
  };
}

function readEnv(name: string, fallback = ''): string {
  const value =
    (typeof process !== 'undefined' && process.env && process.env[name]) ||
    fallback;
  return value;
}

export const environment: Environment = {
  production: readEnv('NODE_ENV', 'development') === 'production',
  apiUrl: readEnv('API_URL', 'http://localhost:3000'),
  aws: {
    region: readEnv('AWS_REGION', 'us-east-1'),
    cognito: {
      userPoolId: readEnv('AWS_USER_POOL_ID'),
      userPoolClientId: readEnv('AWS_USER_POOL_CLIENT_ID'),
      identityPoolId: readEnv('AWS_IDENTITY_POOL_ID'),
    },
  },
};
