const rateLimit = require('express-rate-limit');
const config = require('../config');

const skipInTest = () => config.isTest;

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: { success: false, message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: { success: false, message: 'Too many authentication attempts, please try again later' },
});

module.exports = { globalLimiter, authLimiter };
