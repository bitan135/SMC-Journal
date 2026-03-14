import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jvlgpecoduxrzwctumff.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bGdwZWNvZHV4cnp3Y3R1bWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzYxNjksImV4cCI6MjA4OTA1MjE2OX0.fEh8R12OdUnqpStAciXnWgfdTw4yKcM0hSrDauYI61I',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            const host = process.env.NEXT_PUBLIC_SITE_URL || '';
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
              cookieStore.set(name, value, cookieOptions);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
