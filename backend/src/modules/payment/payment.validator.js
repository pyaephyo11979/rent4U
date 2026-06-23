const { z } = require('zod');

const createPaymentSchema = z.object({
  houseId: z.number().int().positive('House ID must be a positive integer'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().trim().length(3, 'Currency must be a 3-letter code').default('MMK'),
}).strict();

const paymentIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const refundSchema = z.object({
  reason: z.string().trim().min(1).max(500).optional(),
}).strict();

module.exports = { createPaymentSchema, paymentIdSchema, refundSchema };
