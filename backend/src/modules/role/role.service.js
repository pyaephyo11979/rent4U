const prisma = require('../../utils/prisma');
const logger = require('../../utils/logger');

const DEFAULT_ROLES = ['Admin', 'Host', 'User'];

async function seed() {
  for (const roleName of DEFAULT_ROLES) {
    const existing = await prisma.role.findFirst({ where: { name: roleName } });
    if (!existing) {
      await prisma.role.create({ data: { name: roleName } });
      logger.info(`Role created: ${roleName}`);
    }
  }
  logger.info('Role seeding complete');
}

async function findAll() {
  return prisma.role.findMany({
    select: { id: true, name: true, createdAt: true },
  });
}

module.exports = { seed, findAll };
