import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Resiliently map custom publishable key to anon key if auth-helpers requires it
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    await supabase.auth.getSession()
  } catch (error) {
    console.warn('Supabase middleware session fetch failed (offline/paused):', error)
  }
  return res
}

