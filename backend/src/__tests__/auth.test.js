const request = require('supertest');
const app = require('../app');
const prisma = require('../utils/prisma');
const { setup, teardown } = require('./helpers/setup');

let roles;

beforeAll(async () => {
  roles = await setup();
});

afterAll(async () => {
  await teardown();
});

afterEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

describe('Auth Module', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@test.com',
          password: 'password123',
          roleId: roles.user.id,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBeDefined();
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@test.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Jane Doe',
          username: 'janedoe',
          email: 'john@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          username: 'johndoe',
          email: 'not-an-email',
          password: 'password123',
        });

      expect(res.status).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@test.com',
          password: 'short',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      const bcrypt = require('bcrypt');
      const hashed = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          name: 'Test User',
          username: 'testlogin',
          email: 'login@test.com',
          password: hashed,
          roleId: roles.user.id,
        },
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@test.com', password: 'password123' });

      expect(res.status).toBe(401);
    });

    it('should return a refresh token in cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'password123' });

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie).toContain('HttpOnly');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens with a valid refresh token', async () => {
      const bcrypt = require('bcrypt');
      const jwt = require('jsonwebtoken');
      const config = require('../config');

      const hashed = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          name: 'Refresh User',
          username: 'refreshuser',
          email: 'refresh@test.com',
          password: hashed,
          roleId: roles.user.id,
        },
        include: { role: true },
      });

      const refreshToken = jwt.sign(
        { userId: user.id },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
      );

      const decoded = jwt.decode(refreshToken);
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(decoded.exp * 1000),
        },
      });

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout an authenticated user', async () => {
      const bcrypt = require('bcrypt');
      const { generateAccessToken } = require('./helpers/auth');

      const hashed = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          name: 'Logout User',
          username: 'logoutuser',
          email: 'logout@test.com',
          password: hashed,
          roleId: roles.user.id,
        },
        include: { role: true },
      });

      const token = generateAccessToken(user.id, user.role.name);

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });

    it('should reject unauthenticated logout', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout');

      expect(res.status).toBe(401);
    });
  });
});
