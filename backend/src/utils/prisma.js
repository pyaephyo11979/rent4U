const { PrismaClient } = require('../generated/prisma/client');
const config = require('../config');
const logger = require('./logger');

let adapter;

if (config.db.provider === 'sqlite') {
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  adapter = new PrismaBetterSqlite3({ url: config.db.url });
}

const prisma = new PrismaClient({
  ...(adapter && { adapter }),
  log: config.isProduction
    ? ['error']
    : [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
});

if (!config.isProduction) {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e) => {
  logger.error(`Prisma Error: ${e.message}`);
});

module.exports = prisma;
