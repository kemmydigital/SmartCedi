import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authAPI } from '@/lib/auth';

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  user: { email?: string; id?: string } | null;
  signIn: typeof authAPI.signIn;
  signOut: typeof authAPI.signOut;
  signUp: typeof authAPI.signUp;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  user: null,
  signIn: authAPI.signIn,
  signOut: authAPI.signOut,
  signUp: authAPI.signUp,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authAPI.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: { subscription } } = authAPI.onAuthStateChange((event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    isLoading,
    user: session?.user ?? null,
    signIn: authAPI.signIn,
    signOut: authAPI.signOut,
    signUp: authAPI.signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
