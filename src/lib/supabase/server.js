import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { ENV } from '@/config/env';

export async function createClient() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get('host') || '';
  const isLocal = process.env.NODE_ENV === 'development' || 
                 host.includes('localhost') || 
                 host.includes('127.0.0.1');

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const cookieOptions = {
                ...options,
                secure: isLocal ? false : true,
                sameSite: isLocal ? 'lax' : 'lax',
                path: '/',
                domain: isLocal ? undefined : '.smcjournal.app',
              };
              cookieStore.set(name, value, cookieOptions);
            });
          } catch (error) {
            // Read-only context (Server Components)
          }
        },
      },
      auth: {
        storageKey: 'sb-smc-auth-v5',
      }
    }
  );
}
