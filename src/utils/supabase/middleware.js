import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export async function updateSession(request) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const isLocal = process.env.NODE_ENV === 'development' || 
                 host.includes('localhost') || 
                 host.includes('127.0.0.1');

  // 0. Canonical Domain Enforcement (Production only)
  // Ensures session cookies match the intended domain (Apex vs WWW)
  if (!isLocal && ENV.SITE_URL.includes('https://www.')) {
    if (host === 'smcjournal.app') {
      const url = request.nextUrl.clone();
      url.host = 'www.smcjournal.app';
      url.protocol = 'https';
      return NextResponse.redirect(url);
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              secure: isLocal ? false : true,
              sameSite: isLocal ? 'lax' : 'none',
              path: '/',
            };
            
            request.cookies.set({ name, value, ...cookieOptions });
            supabaseResponse.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const isAuthOrLanding = pathname === '/' || pathname === '/login' || pathname === '/signup';
    
    // Protected paths list
    const protectedPaths = [
      '/dashboard',
      '/trades',
      '/add-trade',
      '/analytics',
      '/strategies',
      '/billing',
      '/settings',
      '/donation'
    ];
    
    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

    // 1. Auth Guard: Unauthenticated users -> /login
    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // 2. Redirect Loop Prevention: Authenticated users -> /dashboard
    // Skip IF we are on landing page AND 'logout=true' is present
    const isLogoutSignal = pathname === '/' && request.nextUrl.searchParams.get('logout') === 'true';
    if (user && isAuthOrLanding && !isLogoutSignal) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

  } catch (e) {
    // Auth failure
  }

  // Final safety sync
  supabaseResponse.cookies.getAll().forEach(cookie => {
    supabaseResponse.cookies.set(cookie.name, cookie.value, {
      ...cookie.options,
      secure: isLocal ? false : true,
      sameSite: isLocal ? 'lax' : 'none',
      path: '/',
    });
  });

  return supabaseResponse;
}
