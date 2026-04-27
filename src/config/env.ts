import dotenv from 'dotenv';

dotenv.config();

/**
 * Validated environment configuration.
 * Centralizes all env access — no process.env scattered through the codebase.
 */
export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  get isDev(): boolean {
    return this.nodeEnv === 'development';
  },

  get isProd(): boolean {
    return this.nodeEnv === 'production';
  },
} as const;
