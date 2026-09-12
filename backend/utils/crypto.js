const crypto = require('crypto');

/**
 * Hash password using scrypt
 */
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

/**
 * Timing-safe password verification
 */
function verifyPassword(password, hash, salt) {
  try {
    const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
  } catch (e) {
    return false;
  }
}

module.exports = {
  hashPassword,
  verifyPassword
};
