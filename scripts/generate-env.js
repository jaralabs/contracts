#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envVars = {
  API_URL: process.env.API_URL || 'http://localhost:3000',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_USER_POOL_ID: process.env.AWS_USER_POOL_ID || '',
  AWS_USER_POOL_CLIENT_ID: process.env.AWS_USER_POOL_CLIENT_ID || '',
  AWS_IDENTITY_POOL_ID: process.env.AWS_IDENTITY_POOL_ID || '',
};

const content = `// Auto-generated from .env - DO NOT EDIT MANUALLY
// Run 'node scripts/generate-env.js' to regenerate

export const ENV = {
  API_URL: '${envVars.API_URL}',
  AWS_REGION: '${envVars.AWS_REGION}',
  AWS_USER_POOL_ID: '${envVars.AWS_USER_POOL_ID}',
  AWS_USER_POOL_CLIENT_ID: '${envVars.AWS_USER_POOL_CLIENT_ID}',
  AWS_IDENTITY_POOL_ID: '${envVars.AWS_IDENTITY_POOL_ID}',
} as const;
`;

const outputPath = path.join(__dirname, '../libs/shared/src/lib/env.ts');
fs.writeFileSync(outputPath, content, 'utf8');

console.log('✅ Environment variables generated at libs/shared/src/lib/env.ts');
