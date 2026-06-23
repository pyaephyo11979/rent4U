const prisma = require('../../utils/prisma');
const config = require('../../config');
const { createGateway } = require('./gateways');
const { NotFoundError, PaymentError } = require('../../utils/errors');
const logger = require('../../utils/logger');

const gateway = createGateway();

async function createPayment(userId, data) {
  const house = await prisma.house.findUnique({ where: { id: data.houseId } });
  if (!house) throw new NotFoundError('House not found');
  if (!house.isAvailable) throw new PaymentError('House is not available for booking');

  const result = await gateway.createPayment(data.amount, data.currency, {
    houseId: house.id,
    userId,
    houseName: house.name,
  });

  const payment = await prisma.payment.create({
    data: {
      externalId: result.externalId,
      userId,
      houseId: data.houseId,
      amount: data.amount,
      currency: data.currency,
      status: result.status,
      provider: config.payment.provider,
      metadata: result.metadata ? JSON.stringify(result.metadata) : null,
    },
    include: {
      house: { select: { id: true, name: true, city: true } },
    },
  });

  logger.info(`Payment created: ${payment.id} (${payment.externalId}) for house ${house.id}`);
  return payment;
}

async function getPayment(id, userId, userRole) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      house: { select: { id: true, name: true, city: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!payment) throw new NotFoundError('Payment not found');
  if (payment.userId !== userId && userRole !== 'Admin') {
    throw new NotFoundError('Payment not found');
  }

  return payment;
}

async function getUserPayments(userId) {
  return prisma.payment.findMany({
    where: { userId },
    include: { house: { select: { id: true, name: true, city: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function verifyPayment(id, userId) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new NotFoundError('Payment not found');
  if (payment.userId !== userId) throw new NotFoundError('Payment not found');

  const result = await gateway.verifyPayment(payment.externalId);

  const updated = await prisma.payment.update({
    where: { id },
    data: { status: result.status },
  });

  if (result.verified && result.status === 'completed') {
    await prisma.house.update({
      where: { id: payment.houseId },
      data: { rented: true, rentedAt: new Date(), rentedById: userId },
    });
  }

  return updated;
}

async function refundPayment(id, reason) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new NotFoundError('Payment not found');
  if (payment.status !== 'completed') throw new PaymentError('Can only refund completed payments');

  const result = await gateway.refundPayment(payment.externalId);

  const updated = await prisma.payment.update({
    where: { id },
    data: {
      status: result.status,
      metadata: JSON.stringify({
        ...(payment.metadata ? JSON.parse(payment.metadata) : {}),
        refundId: result.refundId,
        refundReason: reason,
      }),
    },
  });

  await prisma.house.update({
    where: { id: payment.houseId },
    data: { rented: false, rentedAt: null, rentedUntil: null, rentedById: null },
  });

  logger.info(`Payment refunded: ${id} (${result.refundId})`);
  return updated;
}

module.exports = { createPayment, getPayment, getUserPayments, verifyPayment, refundPayment };
