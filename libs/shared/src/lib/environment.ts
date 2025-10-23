import { ENV } from './env';

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

export const environment: Environment = {
  production: false,
  apiUrl: ENV.API_URL,
  aws: {
    region: ENV.AWS_REGION,
    cognito: {
      userPoolId: ENV.AWS_USER_POOL_ID,
      userPoolClientId: ENV.AWS_USER_POOL_CLIENT_ID,
      identityPoolId: ENV.AWS_IDENTITY_POOL_ID,
    },
  },
};
