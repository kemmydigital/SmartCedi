import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Mock implementation for development
const mockSupabase = {
  auth: {
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  }
};

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : (import.meta.env.DEV ? mockSupabase : (() => { 
      throw new Error('Missing Supabase environment variables') 
    })());
