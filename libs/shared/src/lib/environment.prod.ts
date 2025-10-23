import { Environment } from './environment';

export const environment: Environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.production.com',
  aws: {
    region: process.env['AWS_REGION'] || 'us-east-1',
    cognito: {
      userPoolId: process.env['AWS_USER_POOL_ID'] || '',
      userPoolClientId: process.env['AWS_USER_POOL_CLIENT_ID'] || '',
      identityPoolId: process.env['AWS_IDENTITY_POOL_ID'] || '',
    },
  },
};
