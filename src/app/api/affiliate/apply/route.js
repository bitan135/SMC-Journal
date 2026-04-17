import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, platform, audience } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    // Input sanitization & length limits
    const sanitizedName = String(name).trim().slice(0, 100);
    const sanitizedEmail = String(email).toLowerCase().trim().slice(0, 255);
    const sanitizedPlatform = String(platform || '').trim().slice(0, 500);
    const sanitizedAudience = String(audience || '').trim().slice(0, 2000);

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Rate limit: 3 applications per hour per email
    const limit = rateLimit(`aff_apply_${sanitizedEmail}`, 3, 3600000);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Application already submitted. Please wait before resubmitting.' },
        { status: 429 }
      );
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check for duplicate application
    const { data: existing } = await sb
      .from('affiliate_applications')
      .select('id')
      .eq('email', sanitizedEmail)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 409 });
    }

    await sb.from('affiliate_applications').insert({
      name: sanitizedName,
      email: sanitizedEmail,
      channel_url: sanitizedPlatform,
      platform: sanitizedPlatform,
      audience_size: sanitizedAudience,
      message: sanitizedAudience,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Affiliate apply error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
