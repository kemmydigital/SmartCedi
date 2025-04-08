import { supabase } from './api';
import { showToast } from './toast';
import type { Session } from '@supabase/supabase-js';

export const authAPI = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) showToast({ title: 'Signup Failed', description: error.message });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) showToast({ title: 'Login Failed', description: error.message });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) showToast({ title: 'Logout Failed', description: error.message });
    return { error };
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  onAuthStateChange: (
    callback: (event: 'SIGNED_IN'|'SIGNED_OUT'|'TOKEN_REFRESHED'|'USER_UPDATED', 
              session: Session | null) => void
  ) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
