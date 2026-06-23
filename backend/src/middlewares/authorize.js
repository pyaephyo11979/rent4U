const { ForbiddenError } = require('../utils/errors');

/**
 * Check if the authenticated user has one of the required roles.
 * @param  {...string} roles - Allowed role names (e.g. 'Admin', 'Host')
 */
function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Requires one of: ${roles.join(', ')}`));
    }

    next();
  };
}

module.exports = authorize;
