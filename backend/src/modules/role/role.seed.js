const roleService = require('./role.service');
const prisma = require('../../utils/prisma');
const logger = require('../../utils/logger');

async function main() {
  await roleService.seed();
  logger.info('Seeding complete');
}

main()
  .catch((err) => {
    logger.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
