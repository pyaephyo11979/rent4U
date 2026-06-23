const config = require('../../../config');
const SampleGateway = require('./sample.gateway');

const GATEWAYS = {
  sample: () => new SampleGateway(),
  // Add real gateways here as they are implemented:
  // stripe: () => new StripeGateway(),
  // paypal: () => new PayPalGateway(),
};

/**
 * Create a payment gateway instance based on the configured provider.
 * @returns {import('./base.gateway')}
 */
function createGateway() {
  const provider = config.payment.provider;
  const factory = GATEWAYS[provider];
  if (!factory) {
    throw new Error(`Unknown payment provider: ${provider}. Available: ${Object.keys(GATEWAYS).join(', ')}`);
  }
  return factory();
}

module.exports = { createGateway };
