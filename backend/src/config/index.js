const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}. Copy .env.example to .env and fill in the values.`);
  }
  return value;
};

const optional = (key, fallback) => process.env[key] || fallback;

const config = {
  port: parseInt(optional('PORT', '3000'), 10),
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  db: {
    url: required('DATABASE_URL'),
    provider: optional('DATABASE_PROVIDER', 'sqlite'),
  },

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  encryption: {
    key: required('ENCRYPTION_KEY'),
    algorithm: 'aes-256-gcm',
    ivLength: 16,
    tagLength: 16,
  },

  cors: {
    origin: optional('CORS_ORIGIN', 'http://localhost:5173'),
  },

  rateLimit: {
    global: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(optional('RATE_LIMIT_GLOBAL_MAX', '500'), 10),
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(optional('RATE_LIMIT_AUTH_MAX', '20'), 10),
    },
  },

  bcrypt: {
    saltRounds: parseInt(optional('BCRYPT_SALT_ROUNDS', '12'), 10),
  },

  cookie: {
    refreshMaxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },

  payment: {
    provider: optional('PAYMENT_PROVIDER', 'sample'),
  },
};

module.exports = config;
