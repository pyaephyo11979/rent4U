const { z } = require('zod');

const userUpdateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  username: z.string().trim().min(3).max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  email: z.string().trim().email().max(255).optional(),
  profilePicture: z.string().url().max(500).optional(),
}).strict();

const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = { userUpdateSchema, userIdSchema };
