import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '@/config/env';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  return createBrowserClient(url, key, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'sb-smc-auth-v5',
    },
    cookies: {
      getAll() {
        if (typeof document === 'undefined') return [];
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [name, ...rest] = cookie.split('=');
          acc[name] = rest.join('=');
          return acc;
        }, {});
        return Object.entries(cookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        if (typeof document === 'undefined') return;
        cookiesToSet.forEach(({ name, value, options }) => {
          const domain = isLocal ? '' : `; domain=.smcjournal.app`;
          const secure = isLocal ? '' : '; Secure';
          const maxAge = options?.maxAge ? `; max-age=${options.maxAge}` : '';
          const path = options?.path ? `; path=${options.path}` : '; path=/';
          document.cookie = `${name}=${value}${path}; SameSite=Lax${domain}${secure}${maxAge}`;
        });
      },
    },
  });
}
