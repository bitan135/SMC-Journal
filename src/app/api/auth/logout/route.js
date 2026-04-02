import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // 1. Sign out from Supabase
  await supabase.auth.signOut();

  // 2. Explicitly clear all Supabase cookies with the domain-level scope
  // This is crucial because client-side signOut might miss .smcjournal.app cookies
  const allCookies = cookieStore.getAll();
  const supabaseCookieNames = allCookies
    .filter(c => c.name.startsWith('sb-') || c.name.includes('supabase'))
    .map(c => c.name);

  const response = NextResponse.redirect(new URL('/?logout=true', request.url));

  // Determine if we are in production
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const domain = isLocal ? undefined : '.smcjournal.app';

  // Clear specific cookies with the correct domain
  supabaseCookieNames.forEach(name => {
    response.cookies.set(name, '', {
      domain,
      path: '/',
      maxAge: 0,
    });
  });

  return response;
}

export async function POST(request) {
  return GET(request);
}
