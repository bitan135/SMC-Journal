import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';
import { isPublicRoute, isProtectedRoute } from '@/lib/routes';

export async function updateSession(request) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const isLocal = process.env.NODE_ENV === 'development' || 
                 host.includes('localhost') || 
                 host.includes('127.0.0.1');

  // 0. Canonical Domain Enforcement (Production only)
  // Ensures session cookies match the intended domain (Apex vs WWW)
  if (!isLocal && host.includes('smcjournal.app') && !host.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = 'www.smcjournal.app';
    url.protocol = 'https';
    return NextResponse.redirect(url);
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
              sameSite: isLocal ? 'lax' : 'lax',
              path: '/',
              domain: isLocal ? undefined : '.smcjournal.app',
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
    const isPublic = isPublicRoute(pathname);
    const isProtected = isProtectedRoute(pathname);
    
    // 1. Auth Guard: Unauthenticated users -> /login
    if (!user && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    // 2. Redirect Loop Prevention: Authenticated users -> /dashboard
    // If they are on /login or /, and they HAVE a session, send to dashboard
    const isLoginPage = pathname === '/login' || pathname === '/signup';
    const isLandingPage = pathname === '/';
    const isLogoutSignal = pathname === '/' && request.nextUrl.searchParams.get('logout') === 'true';

    if (user && (isLoginPage || isLandingPage) && !isLogoutSignal) {
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
      sameSite: isLocal ? 'lax' : 'lax',
      path: '/',
      domain: isLocal ? undefined : '.smcjournal.app',
    });
  });

  return supabaseResponse;
}
