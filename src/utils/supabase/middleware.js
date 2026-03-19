import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export async function updateSession(request) {
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
          const host = request.headers.get('host') || '';
          const isLocal = process.env.NODE_ENV === 'development' || 
                         host.includes('localhost') || 
                         host.includes('127.0.0.1');
          
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              secure: isLocal ? false : true,
              sameSite: isLocal ? 'lax' : 'none',
              path: '/',
            };
            
            // Sync to request
            request.cookies.set({ name, value, ...cookieOptions });
            
            // Sync to response
            supabaseResponse.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  // refreshing the auth token
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Auth Guard: Redirect unauthenticated users to login
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup') ||
                      request.nextUrl.pathname.startsWith('/auth');

    const isPublicPage =
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname === '/features' ||
      request.nextUrl.pathname === '/pricing' ||
      request.nextUrl.pathname === '/privacy' ||
      request.nextUrl.pathname === '/terms' ||
      request.nextUrl.pathname.startsWith('/affiliate');

    if (!user && !isAuthPage && !isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      const response = NextResponse.redirect(url);
      
      // Sanitized Transfer: Ensure attributes are host-safe
      const host = request.headers.get('host') || '';
      const isLocal = process.env.NODE_ENV === 'development' || host.includes('localhost') || host.includes('127.0.0.1');

      supabaseResponse.cookies.getAll().forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value, {
          ...cookie.options,
          secure: isLocal ? false : true,
          sameSite: isLocal ? 'lax' : 'none',
          path: '/',
        });
      });
      return response;
    }

    // Redirect authenticated users away from login/signup to dashboard
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      const response = NextResponse.redirect(url);
      
      // Sanitized Transfer: Ensure attributes are host-safe
      const host = request.headers.get('host') || '';
      const isLocal = process.env.NODE_ENV === 'development' || host.includes('localhost') || host.includes('127.0.0.1');

      supabaseResponse.cookies.getAll().forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value, {
          ...cookie.options,
          secure: isLocal ? false : true,
          sameSite: isLocal ? 'lax' : 'none',
          path: '/',
        });
      });
      return response;
    }

  } catch (e) {
    // Auth failure
  }

  // Final safety sync of all cookies with sanitization
  const host = request.headers.get('host') || '';
  const isLocal = process.env.NODE_ENV === 'development' || host.includes('localhost') || host.includes('127.0.0.1');

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
