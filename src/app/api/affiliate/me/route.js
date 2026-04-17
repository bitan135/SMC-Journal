import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { verifyAffiliateToken } from '@/lib/affiliate-auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const store = await cookies();
    const token = store.get('aff_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyAffiliateToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify affiliate is still active (prevents deactivated partners from accessing dashboard)
    const { data: aff } = await sb
      .from('affiliates')
      .select('id, name, email, coupon_code, commission_rate, discount_rate, channel_name, channel_url, status')
      .eq('id', payload.affiliateId)
      .single();

    if (!aff) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    if (aff.status !== 'active') return NextResponse.json({ error: 'Account deactivated' }, { status: 403 });

    const { data: referrals } = await sb
      .from('affiliate_referrals')
      .select('*')
      .eq('affiliate_id', payload.affiliateId)
      .order('created_at', { ascending: false });

    const { count: clicks } = await sb
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('affiliate_id', payload.affiliateId);

    const allReferrals = referrals || [];
    const totalEarned = allReferrals.reduce((s, r) => s + (Number(r.commission_earned) || 0), 0);
    const pending = allReferrals.filter(r => !r.commission_paid).reduce((s, r) => s + (Number(r.commission_earned) || 0), 0);

    // Remove sensitive fields before sending
    const { status, ...safeAffiliate } = aff;

    return NextResponse.json({
      affiliate: safeAffiliate,
      stats: {
        totalClicks: clicks || 0,
        totalSignups: allReferrals.length,
        conversions: allReferrals.filter(r => r.plan_purchased).length,
        totalEarned: parseFloat(totalEarned.toFixed(2)),
        pendingPayout: parseFloat(pending.toFixed(2)),
        paidOut: parseFloat((totalEarned - pending).toFixed(2)),
      },
      referrals: allReferrals,
    });
  } catch (err) {
    console.error('Affiliate me error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
