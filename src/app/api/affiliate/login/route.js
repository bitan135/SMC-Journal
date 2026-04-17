import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAffiliateToken } from '@/lib/affiliate-auth';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Input length validation to prevent oversized payloads
    if (email.length > 255 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid input length' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: 5 attempts per 5 minutes per email
    const limit = rateLimit(`aff_login_${normalizedEmail}`, 5, 300000);
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 5 minutes.' },
        { status: 429 }
      );
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: aff, error } = await sb
      .from('affiliates')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('status', 'active')
      .single();

    if (error || !aff) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, aff.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signAffiliateToken(aff.id, aff.email);

    const res = NextResponse.json({ success: true, name: aff.name });
    res.cookies.set('aff_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('Affiliate login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
