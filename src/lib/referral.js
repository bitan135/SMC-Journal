'use client';

/**
 * Captures referral code from URL and stores it in a cookie.
 */
export function captureReferral() {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');

  if (ref) {
    // Store for 30 days
    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = `smc_referral_code=${ref};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    console.log(`[Referral] Captured code in cookie: ${ref}`);
  }
}

/**
 * Retrieves the stored referral code.
 */
export function getStoredReferral() {
  if (typeof window === 'undefined') return null;
  
  const name = "smc_referral_code=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

/**
 * Clears the stored referral code.
 */
export function clearReferral() {
  if (typeof window === 'undefined') return;
  document.cookie = "smc_referral_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
