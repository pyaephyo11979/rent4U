const { Router } = require('express');
const paymentController = require('./payment.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();

router.post('/', authenticate, paymentController.createPayment);
router.get('/my', authenticate, paymentController.getMyPayments);
router.get('/:id', authenticate, paymentController.getPayment);
router.post('/:id/verify', authenticate, paymentController.verifyPayment);
router.post('/:id/refund', authenticate, authorize('Admin'), paymentController.refundPayment);

module.exports = router;
