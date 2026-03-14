import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jvlgpecoduxrzwctumff.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bGdwZWNvZHV4cnp3Y3R1bWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzYxNjksImV4cCI6MjA4OTA1MjE2OX0.fEh8R12OdUnqpStAciXnWgfdTw4yKcM0hSrDauYI61I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
