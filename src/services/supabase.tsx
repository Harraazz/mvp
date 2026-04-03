import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'URL_KAMU';
const supabaseAnonKey = 'API_KEY_KAMU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);