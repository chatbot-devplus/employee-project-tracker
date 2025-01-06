import { createClient } from "@supabase/supabase-js";

// Thay bằng URL và API Key của bạn từ Supabase Dashboard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
