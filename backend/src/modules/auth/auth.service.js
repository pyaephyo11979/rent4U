const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../../utils/prisma');
const config = require('../../config');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../../utils/errors');
const logger = require('../../utils/logger');

const SAFE_USER_SELECT = {
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

async function register(data) {
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) throw new ConflictError('Email already registered');

  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
  if (existingUsername) throw new ConflictError('Username already taken');

  const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

  let roleId = data.roleId;
  if (!roleId) {
    const userRole = await prisma.role.findFirst({ where: { name: 'User' } });
    if (!userRole) throw new NotFoundError('Default role not found. Run seed:roles first.');
    roleId = userRole.id;
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      roleId,
    },
    select: SAFE_USER_SELECT,
  });

  logger.info(`User registered: ${user.email} (id: ${user.id})`);
  return user;
}

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) throw new UnauthorizedError('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role.name },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, jti: crypto.randomUUID() },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  const decoded = jwt.decode(refreshToken);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  logger.info(`User logged in: ${user.email} (id: ${user.id})`);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      role: user.role.name,
    },
  };
}

async function refreshAccessToken(token) {
  if (!token) throw new UnauthorizedError('Refresh token required');

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.revoked) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });
    throw new UnauthorizedError('Refresh token expired');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.refreshSecret);
  } catch {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });
    throw new UnauthorizedError('Invalid refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { role: true },
  });
  if (!user) throw new UnauthorizedError('User not found');

  // Rotate: revoke old, issue new pair
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  const newAccessToken = jwt.sign(
    { userId: user.id, role: user.role.name },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

  const newRefreshToken = jwt.sign(
    { userId: user.id, jti: crypto.randomUUID() },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  const newDecoded = jwt.decode(newRefreshToken);
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(newDecoded.exp * 1000),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

async function logout(userId, refreshToken) {
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, userId },
      data: { revoked: true },
    });
  } else {
    // Revoke all refresh tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  logger.info(`User logged out (id: ${userId})`);
}

module.exports = { register, login, refreshAccessToken, logout };
