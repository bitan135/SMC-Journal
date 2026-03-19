import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AFFILIATE_JWT_SECRET || 'fallback-secret-for-dev-only-replace-in-prod';

/**
 * Generates a JWT for an affiliate session.
 * @param {Object} payload - User/Affiliate data
 * @returns {string} Token
 */
export function signAffiliateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies an affiliate JWT.
 * @param {string} token 
 * @returns {Object|null} Decoded payload or null
 */
export function verifyAffiliateToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Generates a random referral code.
 * @returns {string} 8-character alphanumeric code
 */
export function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
