import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jvlgpecoduxrzwctumff.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bGdwZWNvZHV4cnp3Y3R1bWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzYxNjksImV4cCI6MjA4OTA1MjE2OX0.fEh8R12OdUnqpStAciXnWgfdTw4yKcM0hSrDauYI61I',
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

    if (!user && !isAuthPage) {
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
      url.pathname = '/';
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
