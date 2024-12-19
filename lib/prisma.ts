import { PrismaClient } from '@prisma/client';

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

// globalThis.prisma: The global variable ensures that the Prisma client instant is
// reused across hot reloads during development. Without this, each time your application
// reloads. a new instance of the Prisma client would be created, potentially loading
// to connection issues.
