'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { isProtectedRoute, isPublicRoute } from '@/lib/routes';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  subscription: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Client-Side Canonical Domain Guard (Production Only)
    // Ensures that the browser is ALWAYS on the www subdomain to prevent PKCE verifier loss.
    // PKCE storage (cookies/localStorage) is origin-bound; jumping subdomains breaks the flow.
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    if (process.env.NODE_ENV === 'production' && host === 'smcjournal.app') {
      window.location.href = `https://www.smcjournal.app${pathname}${window.location.search}`;
      return;
    }

    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    let isInitializing = true;

    const fetchUserData = async (userId) => {
      try {
        const [profileRes, subRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('subscriptions').select('*').eq('user_id', userId).single()
        ]);
        
        setProfile(profileRes.data);
        setSubscription(subRes.data || { plan_id: 'free' });
        return { profile: profileRes.data, subscription: subRes.data };
      } catch (error) {
        console.error('[AuthProvider] Data fetch failed:', error);
        setSubscription({ plan_id: 'free' });
        return { profile: null, subscription: { plan_id: 'free' } };
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          // Wait for data BEFORE resolving loading state
          await fetchUserData(initialSession.user.id);
        }
      } catch (error) {
        console.error('[AuthProvider] Initialization failed:', error);
      } finally {
        isInitializing = false;
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // Only suppress loading state updates if we are in the middle of a manual initialization
      if (isInitializing) return;

      console.log(`[AuthProvider] Auth Event: ${event}`);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && currentSession?.user) {
        await fetchUserData(currentSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setSubscription(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Client-side session sync guard
    // If the client hydrates and sees a user, but we are on a public route (like / or /login),
    // we should immediately push them to the dashboard to handle "middleware misses".
    if (!isLoading && user && isPublicRoute(pathname)) {
      // Use window.location.href for a clean reset across potential domain boundaries
      window.location.href = '/dashboard';
    }
  }, [user, isLoading, pathname]);

  const updateProfile = async (updates) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    setProfile(data);
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/api/auth/logout'; // Using our reliable server-side termination
  };

  // Deterministic Gate: Block ALL rendering until auth state is resolved.
  // This prevents UI flicker and unauthorized page flashes.
  // EXCEPTION: Allow the landing page (/) to render immediately for marketing.
  const isRedirecting = !isLoading && user && isPublicRoute(pathname);
  const shouldShowGate = (isLoading || isRedirecting) && pathname !== '/';

  if (shouldShowGate) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-2xl shadow-[var(--accent)]/20 overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-white animate-spin relative z-10" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-80">
                SMC Journal
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] animate-pulse">
                {isRedirecting ? 'Establishing Institutional Sync...' : 'Synchronizing Secure Session...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      subscription, 
      isLoading,
      signOut,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
