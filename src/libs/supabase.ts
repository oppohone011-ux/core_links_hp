import { createClient } from '@supabase/supabase-js'

// .env.local に書いた「住所」と「鍵」を読み込む
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase専用のクライアントを書き出し
export const supabase = createClient(supabaseUrl, supabaseAnonKey)