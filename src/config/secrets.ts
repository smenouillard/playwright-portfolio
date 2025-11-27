// src/config/secrets.ts

import dotenv from 'dotenv';
dotenv.config();

// Retrieve required environment variable
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Export structured secrets for current project needs
export const secrets = {
  internet: {
    username: required('PW_USERNAME'),
    password: required('PW_PASSWORD'),
  },
};
