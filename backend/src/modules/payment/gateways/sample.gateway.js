const crypto = require('crypto');
const BaseGateway = require('./base.gateway');
const logger = require('../../../utils/logger');

/**
 * Sample payment gateway for local development and testing.
 * Simulates payment processing with deterministic behavior.
 */
class SampleGateway extends BaseGateway {
  async createPayment(amount, currency, metadata) {
    const externalId = `sample_${crypto.randomUUID()}`;
    logger.info(`[SampleGateway] Payment created: ${externalId} (${amount} ${currency})`);

    return {
      externalId,
      status: 'completed',
      metadata: {
        ...metadata,
        note: 'Sample gateway — payment auto-approved for development',
      },
    };
  }

  async verifyPayment(externalId) {
    logger.info(`[SampleGateway] Payment verified: ${externalId}`);
    return {
      status: 'completed',
      verified: true,
    };
  }

  async refundPayment(externalId, amount) {
    const refundId = `refund_${crypto.randomUUID()}`;
    logger.info(`[SampleGateway] Payment refunded: ${externalId} -> ${refundId} (${amount || 'full'})`);
    return {
      status: 'refunded',
      refundId,
    };
  }

  async getPaymentStatus(externalId) {
    return { status: 'completed' };
  }
}

module.exports = SampleGateway;
