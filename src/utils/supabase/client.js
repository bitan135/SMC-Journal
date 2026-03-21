import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '@/lib/env';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  return createBrowserClient(url, key, {
    cookieOptions: {
      domain: isLocal ? undefined : '.smcjournal.app',
      path: '/',
      sameSite: 'lax',
      secure: isLocal ? false : true,
    },
    auth: {
      flowType: 'pkce',
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'sb-smcjournal-auth-v2' // Rotate storage key to ensure a fresh cookie-based state
    }
  });
}
