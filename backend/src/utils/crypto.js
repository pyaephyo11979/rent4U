const crypto = require('crypto');
const config = require('../config');

const { algorithm, ivLength, tagLength } = config.encryption;

function getKey() {
  const key = config.encryption.key;
  return crypto.createHash('sha256').update(key).digest();
}

function encrypt(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

function decrypt(ciphertext) {
  const key = getKey();
  const parts = ciphertext.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted data format');

  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Encrypt specific fields in an object, leaving others untouched.
 * @param {Record<string, any>} obj
 * @param {string[]} fields
 * @returns {Record<string, any>}
 */
function encryptFields(obj, fields) {
  if (!obj) return obj;
  const result = { ...obj };
  for (const field of fields) {
    if (result[field] != null && typeof result[field] === 'string') {
      result[field] = encrypt(result[field]);
    }
  }
  return result;
}

/**
 * Decrypt specific fields in an object.
 * @param {Record<string, any>} obj
 * @param {string[]} fields
 * @returns {Record<string, any>}
 */
function decryptFields(obj, fields) {
  if (!obj) return obj;
  const result = { ...obj };
  for (const field of fields) {
    if (result[field] != null && typeof result[field] === 'string') {
      try {
        result[field] = decrypt(result[field]);
      } catch {
        // Field may not be encrypted (legacy data)
      }
    }
  }
  return result;
}

module.exports = { encrypt, decrypt, encryptFields, decryptFields };
