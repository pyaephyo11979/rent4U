const { Router } = require('express');
const authController = require('./auth.controller');
const authenticate = require('../../middlewares/authenticate');
const { authLimiter } = require('../../middlewares/rateLimiter');

const router = Router();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
