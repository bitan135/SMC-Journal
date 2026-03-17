import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '@/lib/env';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  return createBrowserClient(url, key);
}
