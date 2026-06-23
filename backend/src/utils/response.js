/**
 * @param {any} data
 * @param {string} [message]
 * @returns {{ success: true, message?: string, data: any }}
 */
function successResponse(data, message) {
  const res = { success: true, data };
  if (message) res.message = message;
  return res;
}

/**
 * @param {string} message
 * @param {any[]} [errors]
 * @returns {{ success: false, message: string, errors?: any[] }}
 */
function errorResponse(message, errors) {
  const res = { success: false, message };
  if (errors && errors.length) res.errors = errors;
  return res;
}

/**
 * @param {any} data
 * @param {{ page: number, limit: number, total: number }} pagination
 * @param {string} [message]
 */
function paginatedResponse(data, pagination, message) {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  return {
    success: true,
    ...(message && { message }),
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}

module.exports = { successResponse, errorResponse, paginatedResponse };
