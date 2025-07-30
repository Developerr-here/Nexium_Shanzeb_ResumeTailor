import { createClient } from '@supabase/supabase-js'

// 1. Basic Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 2. Validation (dev-only)
if (process.env.NODE_ENV !== 'production') {
  if (!supabaseUrl || !supabaseKey) {
    console.error(`
      Missing Supabase config! Add to .env.local:
      NEXT_PUBLIC_SUPABASE_URL=your-url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
    `)
  }
}

// 3. Client Initialization
export const supabase = createClient(
  supabaseUrl || 'https://default-fallback-url.supabase.co', 
  supabaseKey || 'default-anon-key',
  {
    auth: {
        flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)




