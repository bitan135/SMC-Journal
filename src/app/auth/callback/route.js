import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { ENV } from '@/config/env';

export async function GET(request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';
    const isLocal = request.headers.get('host')?.includes('localhost');

    if (code) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      const user = data?.user;
      
      if (!error && user) {
        // --- START: Affiliate Referral Logic ---
        const cookieStore = await cookies();
        const refCode = cookieStore.get('smc_referral_code')?.value;
        
        if (refCode) {
          try {
            // Sanitize the referral code to match coupon_code format
            const sanitizedRef = String(refCode).toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 32);

            if (sanitizedRef) {
              // 1. Find the affiliate by coupon_code (unified field name)
              const { data: affiliate } = await supabase
                .from('affiliates')
                .select('id, commission_rate, total_referrals, total_earnings_usd')
                .eq('coupon_code', sanitizedRef)
                .eq('status', 'active')
                .single();

              if (affiliate && affiliate.id !== user.id) {
                // 2. Check if user already has a referrer (prevent re-attribution)
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('referred_by')
                  .eq('id', user.id)
                  .single();

                if (profile && !profile.referred_by) {
                  // 3. Link user to affiliate
                  await supabase
                    .from('profiles')
                    .update({ referred_by: affiliate.id })
                    .eq('id', user.id);

                  // 4. Check for duplicate referral record
                  const { data: existingReferral } = await supabase
                    .from('affiliate_referrals')
                    .select('id')
                    .eq('affiliate_id', affiliate.id)
                    .eq('user_id', user.id)
                    .limit(1);

                  if (!existingReferral || existingReferral.length === 0) {
                    // 5. Create referral record in the UNIFIED table (affiliate_referrals)
                    await supabase
                      .from('affiliate_referrals')
                      .insert({
                        affiliate_id: affiliate.id,
                        user_id: user.id,
                        signup_date: new Date().toISOString(),
                        plan_purchased: null,
                        commission_earned: 0,
                        commission_paid: false,
                      });

                    // 6. Increment affiliate referral counter
                    await supabase
                      .from('affiliates')
                      .update({ 
                        total_referrals: (affiliate.total_referrals || 0) + 1
                      })
                      .eq('id', affiliate.id);
                  }
                }
              }
            }
          } catch (err) {
            console.error('[Referral Logic] Failed:', err);
          }
        }
        // --- END: Affiliate Referral Logic ---

        const finalPath = next.startsWith('/') ? next : `/${next}`;
        const finalUrl = !isLocal ? `https://smcjournal.app${finalPath}` : new URL(finalPath, request.url).toString();
        return NextResponse.redirect(finalUrl);
      }
      console.error('[Auth Callback] Code Exchange Error:', error?.code, error?.message);
      return NextResponse.redirect(new URL(`/login?error=auth_callback_failed&msg=${encodeURIComponent(error?.message || 'exchange_failed')}`, request.url));
    } else {
      console.warn('[Auth Callback] No code provided');
      return NextResponse.redirect(new URL(`/login?error=auth_callback_failed&msg=no_code`, request.url));
    }
  } catch (err) {
    console.error('[Auth Callback] Global Crash:', err);
    return NextResponse.redirect(new URL(`/login?error=auth_callback_failed&msg=system_error`, request.url));
  }
}
