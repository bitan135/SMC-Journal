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

const getSiteURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this in Vercel dash
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000';
  
  // Make sure to include `https://` when not localhost
  url = url.includes('http') ? url : `https://${url}`;
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  return url;
};

export const ENV = {
  SITE_URL: getSiteURL(),
  NOWPAYMENTS_API_KEY: process.env.NOWPAYMENTS_API_KEY,
  NOWPAYMENTS_IPN_SECRET: process.env.NOWPAYMENTS_IPN_SECRET,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  IS_SUPABASE_CONFIGURED: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
};
