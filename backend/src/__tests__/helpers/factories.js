const bcrypt = require('bcrypt');
const prisma = require('../../utils/prisma');

async function createTestUser(roleId, overrides = {}) {
  const timestamp = Date.now();
  const hashedPassword = await bcrypt.hash('password123', 10);

  return prisma.user.create({
    data: {
      name: overrides.name || 'Test User',
      username: overrides.username || `user_${timestamp}`,
      email: overrides.email || `test_${timestamp}@test.com`,
      password: hashedPassword,
      roleId,
      ...overrides,
    },
    include: { role: true },
  });
}

async function createTestHouse(ownerId, overrides = {}) {
  return prisma.house.create({
    data: {
      name: overrides.name || 'Test House',
      city: overrides.city || 'Yangon',
      address: overrides.address || '123 Test St',
      price: overrides.price || 50000,
      description: overrides.description || 'A nice test house',
      rooms: overrides.rooms || 2,
      bathrooms: overrides.bathrooms || 1,
      dateAvailable: overrides.dateAvailable || new Date(),
      isAvailable: overrides.isAvailable !== undefined ? overrides.isAvailable : true,
      ownerId,
    },
  });
}

module.exports = { createTestUser, createTestHouse };
