import { PrismaClient } from '@prisma/client';
import logger from '@/utils/logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  logger.debug('Query', {
    query: e.query,
    duration: `${e.duration}ms`,
  });
});

prisma.$on('error', (e) => {
  logger.error('Database error', e);
});

prisma.$on('warn', (e) => {
  logger.warn('Database warning', e);
});

export default prisma;
