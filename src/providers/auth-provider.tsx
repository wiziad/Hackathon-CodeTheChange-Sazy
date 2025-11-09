'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Ctx = {
  loading: boolean;
  session: any | null;
  user: any | null;
  profile: any | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthCtx = createContext<Ctx>({ loading: true, session: null, user: null, profile: null, refreshProfile: async () => {}, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  const loadProfile = async (u: any | null) => {
    if (!u) { 
      setProfile(null); 
      return; 
    }
    
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('auth_id', u.id).single();
      
      if (error && error.code === 'PGRST116') {
        // create minimal profile using any onboarding info saved during guest flow
        const savedRole = localStorage.getItem('metra_role');
        const role = savedRole === 'recipient' ? 'receiver' : (savedRole as 'donor' | 'receiver') || 'receiver';
        const postal = localStorage.getItem('metra_postal') || null;
        const name = u.user_metadata?.full_name || u.email?.split('@')[0] || 'New user';
        const { data: created } = await supabase.from('profiles')
          .insert({ auth_id: u.id, email: u.email, name, role, postal_code: postal, visibility: 'public', dm_allowed: true })
          .select('*').single();
        setProfile(created);
        return;
      }
      
      if (error) {
        console.error('Profile load error:', error);
        setProfile(null);
        return;
      }
      
      if (data) {
        console.log('Profile loaded:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile load exception:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      await loadProfile(data.session?.user ?? null);
    } catch (error) {
      console.error('Refresh profile error:', error);
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      try {
        localStorage.removeItem('metra_session');
        localStorage.removeItem('metra_return_to');
        // Clear potential Supabase auth tokens in localStorage (sb-*) for dev environments
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i) || '';
          if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
            localStorage.removeItem(k);
          }
        }
      } catch {}
      // Force navigation to sign-in to avoid stale state
      try { router.replace('/auth'); } catch {}
      if (typeof window !== 'undefined') {
        window.location.assign('/auth');
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        // Get session without waiting too long
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Auth error:', error);
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        await loadProfile(data.session?.user ?? null);
      } catch (error) {
        console.error('Init auth error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout');
        setLoading(false);
      }
    }, 3000);
    
    initAuth();
    
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (!mounted) return;
      
      setSession(s);
      setUser(s?.user ?? null);
      await loadProfile(s?.user ?? null);
      
      // Only redirect after explicit sign-in, and only if a return path exists
      if (event === 'SIGNED_IN' && s?.user) {
        const ret = localStorage.getItem('metra_return_to');
        if (ret) {
          localStorage.removeItem('metra_return_to');
          router.replace(ret);
        }
      }
    });
    
    return () => { 
      mounted = false; 
      sub.subscription.unsubscribe(); 
      clearTimeout(timeoutId);
    };
  }, [supabase, router]);

  return <AuthCtx.Provider value={{ loading, session, user, profile, refreshProfile, signOut }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);