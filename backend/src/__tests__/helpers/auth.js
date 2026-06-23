const jwt = require('jsonwebtoken');
const config = require('../../config');

function generateAccessToken(userId, role = 'User') {
  return jwt.sign(
    { userId, role },
    config.jwt.accessSecret,
    { expiresIn: '1h' }
  );
}

function authHeader(token) {
  return `Bearer ${token}`;
}

module.exports = { generateAccessToken, authHeader };
