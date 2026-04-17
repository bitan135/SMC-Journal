import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== 'string' || code.length > 50) {
      return NextResponse.json({ ok: false });
    }

    const sanitizedCode = code.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 32);
    if (!sanitizedCode) return NextResponse.json({ ok: false });

    // Rate limit: 10 clicks per minute per code (prevents inflation)
    const limit = rateLimit(`aff_click_${sanitizedCode}`, 10, 60000);
    if (!limit.success) {
      return NextResponse.json({ ok: false });
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: aff } = await sb
      .from('affiliates')
      .select('id')
      .eq('coupon_code', sanitizedCode)
      .eq('status', 'active')
      .single();

    if (!aff) return NextResponse.json({ ok: false });

    // Deduplicate: max 1 click per affiliate per IP per hour
    const headerStore = await headers();
    const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count: recentClicks } = await sb
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('affiliate_id', aff.id)
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo);

    if (recentClicks && recentClicks > 0) {
      // Already tracked this visitor recently - don't inflate
      return NextResponse.json({ ok: true });
    }

    await sb.from('affiliate_clicks').insert({
      affiliate_id: aff.id,
      coupon_code: sanitizedCode,
      ip_address: ip,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
