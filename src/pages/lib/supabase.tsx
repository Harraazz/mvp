import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nuttliyzeznbhsecuver.supabase.co";
const supabaseAnonKey = "sb_publishable_YIYNiS4DtzsmzgRkYeTFjQ_Bxre6pSi";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
