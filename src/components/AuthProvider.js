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
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchUserData(initialSession.user.id);
        }
      } catch (error) {
        console.error('[AuthProvider] Initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserData = async (userId) => {
      try {
        const [profileRes, subRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('subscriptions').select('*').eq('user_id', userId).single()
        ]);
        
        setProfile(profileRes.data);
        setSubscription(subRes.data || { plan_id: 'free' });
      } catch (error) {
        console.error('[AuthProvider] Data fetch failed:', error);
      }
    };

    initializeAuth();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (event === 'SIGNED_IN' && currentSession?.user) {
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

  if (isLoading && isProtectedRoute(pathname)) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-2xl shadow-[var(--accent)]/20">
            <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Synchronizing Session
          </p>
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
