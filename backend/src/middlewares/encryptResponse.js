const { encryptFields } = require('../utils/crypto');

const SENSITIVE_FIELDS = ['email', 'profilePicture'];

/**
 * Middleware that encrypts sensitive fields in the response body
 * before sending it to the client.
 */
function encryptResponse(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    if (body && body.success && body.data) {
      if (Array.isArray(body.data)) {
        body.data = body.data.map((item) => encryptFields(item, SENSITIVE_FIELDS));
      } else if (typeof body.data === 'object') {
        body.data = encryptFields(body.data, SENSITIVE_FIELDS);
      }
    }
    return originalJson(body);
  };

  next();
}

module.exports = encryptResponse;
