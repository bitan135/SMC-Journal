// Validate required environment variables at startup
// This file is imported in API routes that need these vars

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Add it to your .env.local file and Vercel environment variables.`
    );
  }
  return value;
}

export const ENV = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://smcjournal.com',
  NOWPAYMENTS_API_KEY: process.env.NOWPAYMENTS_API_KEY,
  NOWPAYMENTS_IPN_SECRET: process.env.NOWPAYMENTS_IPN_SECRET,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};
