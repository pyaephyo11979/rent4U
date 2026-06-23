/**
 * Base payment gateway interface.
 * All gateway implementations must extend this class.
 *
 * @abstract
 */
class BaseGateway {
  /**
   * Create a new payment.
   * @param {number} amount
   * @param {string} currency
   * @param {Record<string, any>} metadata
   * @returns {Promise<{ externalId: string, status: string, metadata?: any }>}
   */
  async createPayment(amount, currency, metadata) {
    throw new Error('Not implemented');
  }

  /**
   * Verify a payment by its external ID.
   * @param {string} externalId
   * @returns {Promise<{ status: string, verified: boolean }>}
   */
  async verifyPayment(externalId) {
    throw new Error('Not implemented');
  }

  /**
   * Refund a payment.
   * @param {string} externalId
   * @param {number} [amount] - Partial refund amount. If omitted, full refund.
   * @returns {Promise<{ status: string, refundId: string }>}
   */
  async refundPayment(externalId, amount) {
    throw new Error('Not implemented');
  }

  /**
   * Get the current status of a payment.
   * @param {string} externalId
   * @returns {Promise<{ status: string }>}
   */
  async getPaymentStatus(externalId) {
    throw new Error('Not implemented');
  }
}

module.exports = BaseGateway;
