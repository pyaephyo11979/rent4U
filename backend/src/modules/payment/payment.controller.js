const paymentService = require('./payment.service');
const { createPaymentSchema, paymentIdSchema, refundSchema } = require('./payment.validator');
const { successResponse } = require('../../utils/response');

async function createPayment(req, res, next) {
  try {
    const data = createPaymentSchema.parse(req.body);
    const payment = await paymentService.createPayment(req.user.id, data);
    res.status(201).json(successResponse(payment, 'Payment initiated'));
  } catch (err) {
    next(err);
  }
}

async function getPayment(req, res, next) {
  try {
    const { id } = paymentIdSchema.parse(req.params);
    const payment = await paymentService.getPayment(id, req.user.id, req.user.role);
    res.json(successResponse(payment));
  } catch (err) {
    next(err);
  }
}

async function getMyPayments(req, res, next) {
  try {
    const payments = await paymentService.getUserPayments(req.user.id);
    res.json(successResponse(payments));
  } catch (err) {
    next(err);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const { id } = paymentIdSchema.parse(req.params);
    const payment = await paymentService.verifyPayment(id, req.user.id);
    res.json(successResponse(payment, 'Payment verified'));
  } catch (err) {
    next(err);
  }
}

async function refundPayment(req, res, next) {
  try {
    const { id } = paymentIdSchema.parse(req.params);
    const { reason } = refundSchema.parse(req.body);
    const payment = await paymentService.refundPayment(id, reason);
    res.json(successResponse(payment, 'Payment refunded'));
  } catch (err) {
    next(err);
  }
}

module.exports = { createPayment, getPayment, getMyPayments, verifyPayment, refundPayment };
