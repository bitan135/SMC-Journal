import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(next, request.url));
      
      // Expert Hard-Link: Manually bridge all cookies with sanitized attributes
      const host = request.headers.get('host') || '';
      const isLocal = process.env.NODE_ENV === 'development' || 
                     host.includes('localhost') || 
                     host.includes('127.0.0.1');

      const cookieStore = await cookies();
      cookieStore.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
          ...cookie.options,
          secure: isLocal ? false : true,
          sameSite: isLocal ? 'lax' : 'none',
          path: '/',
        });
      });
      
      return response;
    }
    console.error('OAuth Code Exchange Error:', error);
  } else {
    console.warn('No code provided in OAuth callback');
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
}
