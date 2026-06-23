const prisma = require('../../utils/prisma');

async function cleanDatabase() {
  await prisma.payment.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.image.deleteMany();
  await prisma.house.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
}

async function seedRoles() {
  const admin = await prisma.role.create({ data: { name: 'Admin' } });
  const host = await prisma.role.create({ data: { name: 'Host' } });
  const user = await prisma.role.create({ data: { name: 'User' } });
  return { admin, host, user };
}

async function setup() {
  await cleanDatabase();
  const roles = await seedRoles();
  return roles;
}

async function teardown() {
  await cleanDatabase();
  await prisma.$disconnect();
}

module.exports = { setup, teardown, cleanDatabase, seedRoles };
