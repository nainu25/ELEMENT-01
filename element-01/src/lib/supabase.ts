import { createClient } from '@supabase/supabase-js';

// We use ! to tell TypeScript these will definitely exist 
// because we added them to .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);