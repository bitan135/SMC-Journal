import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { ENV } from '@/lib/env';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // --- START: Affiliate Referral Logic ---
      const cookieStore = await cookies();
      const refCode = cookieStore.get('smc_referral_code')?.value;
      
      if (refCode) {
        try {
          // 1. Find the affiliate
          const { data: affiliate } = await supabase
            .from('affiliates')
            .select('id, total_referrals, total_earnings_usd')
            .eq('referral_code', refCode)
            .single();

          if (affiliate && affiliate.id !== user.id) {
            // 2. Check if user already has a referrer
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

              // 4. Create referral record
              await supabase
                .from('referrals')
                .insert({
                  affiliate_id: affiliate.id,
                  referred_user_id: user.id,
                  status: 'pending',
                  commission_amount_usd: 0.00 // Adjust based on business logic later
                });

              // 5. Update affiliate stats
              await supabase
                .from('affiliates')
                .update({ 
                  total_referrals: (affiliate.total_referrals || 0) + 1
                  // total_earnings_usd: (parseFloat(affiliate.total_earnings_usd) || 0) + 10.00 // Optional: Reward on signup
                })
                .eq('id', affiliate.id);
            }
          }
        } catch (err) {
          console.error('[Referral Logic] Failed:', err);
        }
      }
      // --- END: Affiliate Referral Logic ---

      // The Supabase client in server.js handles cookie setting via setAll during exchange
      // We don't need manual bridging anymore.
      
      // The Supabase client in server.js handles cookie setting via setAll during exchange.
      // Redirect to the canonical site URL to ensure unified domain session recognition.
      return NextResponse.redirect(new URL(next, ENV.SITE_URL));
    }
    console.error('OAuth Code Exchange Error:', error);
  } else {
    console.warn('No code provided in OAuth callback');
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
}
