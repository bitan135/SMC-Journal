import jwt from 'jsonwebtoken';

/**
 * Affiliate JWT Auth Module
 * 
 * SECURITY: No hardcoded fallback secret. In production, if AFFILIATE_JWT_SECRET
 * is missing, all token operations will fail safely (return null / throw).
 * This prevents token forgery from a known default secret.
 */

function getSecret() {
  const secret = process.env.AFFILIATE_JWT_SECRET;
  
  if (!secret && process.env.NODE_ENV === 'production') {
    console.error('FATAL: AFFILIATE_JWT_SECRET is not set in production. Affiliate auth will reject all requests.');
    return null;
  }

  // In dev, generate a per-process fallback that is NOT predictable from source code
  return secret || `dev-${process.pid}-${Date.now()}`;
}

export function signAffiliateToken(affiliateId, email) {
  const secret = getSecret();
  if (!secret) throw new Error('Affiliate auth is not configured.');

  return jwt.sign(
    { affiliateId, email },
    secret,
    {
      expiresIn: '24h',
      issuer: 'smcjournal-affiliate',
      audience: 'smcjournal-partner-portal',
    }
  );
}

export function verifyAffiliateToken(token) {
  const secret = getSecret();
  if (!secret) return null;

  try {
    return jwt.verify(token, secret, {
      issuer: 'smcjournal-affiliate',
      audience: 'smcjournal-partner-portal',
    });
  } catch {
    return null;
  }
}
