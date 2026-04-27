import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middleware/error.middleware';
import routes from './routes';
import logger from './utils/logger.util';

/**
 * Express Application Setup
 *
 * Middleware order matters:
 * 1. Security (helmet, cors)
 * 2. Parsing (json, urlencoded)
 * 3. Logging (morgan)
 * 4. Routes
 * 5. Error handling (must be LAST)
 */
const app = express();

// ── Security ──
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));

// ── Body parsing ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HTTP request logging ──
app.use(morgan('dev'));

// ── Swagger UI ──
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health check ──
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API routes ──
app.use('/api', routes);

// ── Global error handler (must be last) ──
app.use(errorMiddleware);

// ── Start server ──
app.listen(env.port, () => {
  logger.info(`🚀 EduCore server running on port ${env.port}`);
  logger.info(`📚 Swagger docs: http://localhost:${env.port}/api-docs`);
  logger.info(`🏥 Health check: http://localhost:${env.port}/health`);
});

export default app;
