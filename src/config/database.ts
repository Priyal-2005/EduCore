import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Prisma Client Singleton.
 *
 * In development, we attach the client to globalThis to survive
 * hot-reloads without exhausting database connections.
 *
 * Pattern: Singleton via global reference.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isDev ? ['query', 'warn', 'error'] : ['error'],
  });

if (env.isDev) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
