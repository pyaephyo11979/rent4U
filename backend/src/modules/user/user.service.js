const prisma = require('../../utils/prisma');
const { NotFoundError, ForbiddenError } = require('../../utils/errors');

const SAFE_SELECT = {
  id: true,
  name: true,
  username: true,
  email: true,
  profilePicture: true,
  roleId: true,
  role: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
};

async function findAll() {
  return prisma.user.findMany({ select: SAFE_SELECT });
}

async function findById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...SAFE_SELECT,
      houses: { select: { id: true, name: true, city: true, price: true, isAvailable: true } },
    },
  });
  if (!user) throw new NotFoundError('User not found');
  return user;
}

async function update(id, data, requestUser) {
  if (requestUser.id !== id && requestUser.role !== 'Admin') {
    throw new ForbiddenError('You can only update your own profile');
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User not found');

  return prisma.user.update({
    where: { id },
    data,
    select: SAFE_SELECT,
  });
}

async function remove(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User not found');

  await prisma.user.delete({ where: { id } });
}

module.exports = { findAll, findById, update, remove };
