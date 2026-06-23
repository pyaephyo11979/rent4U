const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../utils/errors');

function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Access token required'));
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Access token expired'));
    }
    next(new UnauthorizedError('Invalid access token'));
  }
}

module.exports = authenticate;
