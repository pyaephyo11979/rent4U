const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().trim().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  roleId: z.number().int().positive('Role ID must be a positive integer').optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

module.exports = { registerSchema, loginSchema, refreshTokenSchema };
