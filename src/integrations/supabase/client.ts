
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://czspqegzlqlafnwlhwkh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6c3BxZWd6bHFsYWZud2xod2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzAwMjIsImV4cCI6MjA2MDkwNjAyMn0.jxc1050sn_ZtH683RyRMB7gaURdIVgIvBz-Nbv1mk40";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
