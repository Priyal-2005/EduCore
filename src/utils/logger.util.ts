import winston from 'winston';
import { env } from '../config/env';

/**
 * Application Logger (Winston)
 *
 * Structured JSON logging in production, colorised console in development.
 * Every log entry includes a timestamp and service name for traceability.
 */
const logger = winston.createLogger({
  level: env.isDev ? 'debug' : 'info',
  defaultMeta: { service: 'educore-backend' },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true })
  ),
  transports: [
    // Console: coloured in dev, JSON in prod
    new winston.transports.Console({
      format: env.isDev
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, stack }) => {
              return `${timestamp} [${level}]: ${stack || message}`;
            })
          )
        : winston.format.json(),
    }),
  ],
});

export default logger;
