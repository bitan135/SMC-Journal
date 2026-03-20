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
              sameSite: 'lax',
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

  // IMPORTANT: Do not use getUser() here if it's not strictly necessary for the redirect logic,
  // but since we need it for the guards, we must handle it carefully.
  const { data: { user } } = await supabase.auth.getUser();
  const isPublic = isPublicRoute(pathname);
  const isProtected = isProtectedRoute(pathname);
  
  // 1. Auth Guard: Unauthenticated users -> /login
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    
    // Create the redirect response
    const redirectResponse = NextResponse.redirect(url);
    
    // Transfer the cookies from the Supabase response to the redirect response
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    
    return redirectResponse;
  }

  // 2. Redirect Loop Prevention: Authenticated users -> /dashboard
  const isLoginPage = pathname === '/login' || pathname === '/signup';
  const isLandingPage = pathname === '/';
  const isLogoutSignal = pathname === '/' && request.nextUrl.searchParams.get('logout') === 'true';

  if (user && (isLoginPage || isLandingPage) && !isLogoutSignal) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    const redirectResponse = NextResponse.redirect(url);
    
    // Sync cookies
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    
    return redirectResponse;
  }

  // Final safety sync for standard next() response
  supabaseResponse.cookies.getAll().forEach(cookie => {
    supabaseResponse.cookies.set(cookie.name, cookie.value, {
      ...cookie.options,
      secure: isLocal ? false : true,
      sameSite: 'lax',
      path: '/',
      domain: isLocal ? undefined : '.smcjournal.app',
    });
  });

  return supabaseResponse;
}
