const { z } = require('zod');

const houseCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  city: z.string().trim().min(1, 'City is required').max(100),
  address: z.string().trim().min(1, 'Address is required').max(500),
  price: z.number().positive('Price must be positive'),
  description: z.string().trim().min(1, 'Description is required').max(2000),
  rooms: z.number().int().positive('Rooms must be a positive integer'),
  bathrooms: z.number().int().positive('Bathrooms must be a positive integer'),
  dateAvailable: z.coerce.date(),
  images: z.array(z.string().url()).max(10).optional(),
}).strict();

const houseUpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  city: z.string().trim().min(1).max(100).optional(),
  address: z.string().trim().min(1).max(500).optional(),
  price: z.number().positive().optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  rooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  dateAvailable: z.coerce.date().optional(),
  isAvailable: z.boolean().optional(),
}).strict();

const houseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  city: z.string().trim().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  rooms: z.coerce.number().int().positive().optional(),
  search: z.string().trim().max(200).optional(),
  sortBy: z.enum(['price', 'createdAt', 'rooms']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).strict();

const houseIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = { houseCreateSchema, houseUpdateSchema, houseQuerySchema, houseIdSchema };
