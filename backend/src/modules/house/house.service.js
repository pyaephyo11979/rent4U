const prisma = require('../../utils/prisma');
const { NotFoundError, ForbiddenError } = require('../../utils/errors');

const SAFE_SELECT = {
  id: true,
  name: true,
  city: true,
  address: true,
  price: true,
  description: true,
  rooms: true,
  bathrooms: true,
  dateAvailable: true,
  rented: true,
  rentedAt: true,
  rentedUntil: true,
  isAvailable: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  images: { select: { id: true, url: true } },
  owner: { select: { id: true, name: true, username: true } },
};

async function findAll(query) {
  const { page, limit, city, minPrice, maxPrice, rooms, search, sortBy, sortOrder } = query;

  const where = {};
  if (city) where.city = { contains: city };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }
  if (rooms) where.rooms = rooms;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { city: { contains: search } },
    ];
  }

  const [houses, total] = await Promise.all([
    prisma.house.findMany({
      where,
      select: SAFE_SELECT,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.house.count({ where }),
  ]);

  return { houses, total, page, limit };
}

async function findById(id) {
  const house = await prisma.house.findUnique({
    where: { id },
    select: {
      ...SAFE_SELECT,
      rentedBy: { select: { id: true, name: true, username: true } },
    },
  });
  if (!house) throw new NotFoundError('House not found');
  return house;
}

async function create(data, ownerId) {
  const { images, ...houseData } = data;

  return prisma.house.create({
    data: {
      ...houseData,
      ownerId,
      ...(images && {
        images: { create: images.map((url) => ({ url })) },
      }),
    },
    select: SAFE_SELECT,
  });
}

async function update(id, data, requestUser) {
  const house = await prisma.house.findUnique({ where: { id } });
  if (!house) throw new NotFoundError('House not found');

  if (house.ownerId !== requestUser.id && requestUser.role !== 'Admin') {
    throw new ForbiddenError('You can only update your own listings');
  }

  return prisma.house.update({
    where: { id },
    data,
    select: SAFE_SELECT,
  });
}

async function remove(id, requestUser) {
  const house = await prisma.house.findUnique({ where: { id } });
  if (!house) throw new NotFoundError('House not found');

  if (house.ownerId !== requestUser.id && requestUser.role !== 'Admin') {
    throw new ForbiddenError('You can only delete your own listings');
  }

  await prisma.house.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
