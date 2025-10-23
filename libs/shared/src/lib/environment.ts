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
  apiUrl: 'http://localhost:3000',
  aws: {
    region: 'us-east-1',
    cognito: {
      userPoolId: 'us-east-1_cURobggRv',
      userPoolClientId: '70km7nv8tdu1upubtm8le7evep',
      identityPoolId: 'us-east-1:7b1efcc9-3475-451b-899e-b5ebb9853bce',
    },
  },
};
