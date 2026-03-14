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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  try {
    await supabase.auth.getUser();
  } catch (e) {
    // If auth fails or env vars missing, we still want the request to proceed
    // The client-side logic will handle the unauthenticated state
  }

  return supabaseResponse;
}
