


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


import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/login', req.url))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(new URL('/login?error=auth', req.url))

  return NextResponse.redirect(new URL('/dashboard', req.url))
}


