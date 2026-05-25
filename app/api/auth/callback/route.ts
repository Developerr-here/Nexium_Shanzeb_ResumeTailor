


// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// // export async function GET(req: Request) {
// //   const supabase = createRouteHandlerClient({ cookies })
// export async function GET(req: Request) {
//     const cookieStore = await cookies()
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
//   const { searchParams } = new URL(req.url)
//   const code = searchParams.get('code')

//   if (!code) return NextResponse.redirect(new URL('/login', req.url))

//   try {
//     await supabase.auth.exchangeCodeForSession(code)
//     return NextResponse.redirect(new URL('/dashboard', req.url))
//   } catch {
//     return NextResponse.redirect(new URL('/login?error=auth', req.url))
//   }
// }

export const runtime = 'nodejs'
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/login', req.url))

  try {
    const supabase = await createServerSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Auth code exchange error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_callback', req.url))
    }
  } catch (err) {
    console.error('Supabase DNS or connection failure in callback:', err)
    // Seamlessly fall back to dashboard in demo mode if Supabase is offline/dns fails
    return NextResponse.redirect(new URL('/dashboard?demo=true&origin=fallback', req.url))
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
}


