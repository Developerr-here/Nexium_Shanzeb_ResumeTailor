// 'use client'
// import { useRouter } from 'next/navigation'
// import  supabase  from '@/utils/supabase/client'
// import { useEffect } from 'react'

// export default function LoginPage() {
//   const router = useRouter()

//   // Global auth watcher (handles magic-link returns)
//   useEffect(() => {
//     const { data: sub } = supabase.auth.onAuthStateChange((event) => {
//       if (event === 'SIGNED_IN') router.replace('/dashboard')
//     })
//     return () => sub.subscription.unsubscribe()
//   }, [router])

//   const handleLogin = async () => {
//     const email = prompt('Enter your email:')
//     if (!email) return

//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
//     })
//     if (error) alert(error.message)
//     else alert('Check your email for the login link!')
//   }

//   return (
//     <div className="text-center p-4">
//       <button
//         onClick={handleLogin}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Get Started
//       </button>
//     </div>
//   )
// }


// 'use client'

// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'
// import supabase from '@/utils/supabase/client'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// // import { Icons } from '@/components/icons' // optional spinner icon

// export default function LoginPage() {
//   const router = useRouter()

//   useEffect(() => {
//     const { data } = supabase.auth.onAuthStateChange((event) => {
//       if (event === 'SIGNED_IN') router.replace('/dashboard')
//     })
//     return () => data.subscription.unsubscribe()
//   }, [router])

//   const handleLogin = async () => {
//     const email = prompt('Enter your email:')
//     if (!email) return
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
//     })
//     error ? alert(error.message) : alert('Check your email!')
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
//       <Card className="w-full max-w-sm">
//         <CardHeader className="text-center">
//           <CardTitle>Welcome back</CardTitle>
//           <CardDescription>Sign in with a magic link</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button onClick={handleLogin} className="w-full">
//             Sign in with Email
//           </Button>
//         </CardContent>
//       </Card>
//     </main>
//   )
// }







'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import supabase from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Icons } from '@/components/icons' // optional spinner icon

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.replace('/dashboard')
    })
    return () => data.subscription.unsubscribe()
  }, [router])

  const handleLogin = async () => {
    const email = prompt('Enter your email:')
    if (!email) return
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    error ? alert(error.message) : alert('Check your email!')
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.4),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,119,198,0.3),transparent)]"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-purple-500/25">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-lg"></div>
        
        <CardHeader className="text-center relative z-10 pb-8 pt-8">
          {/* Logo/Icon */}
          <div className="mx-auto mb-6 relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <svg className="w-8 h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
          </div>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-2">
            Resume Tailor
          </CardTitle>
          <CardDescription className="text-white/70 text-lg">
            Sign in with a magic link
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 pb-8">
          <Button 
            onClick={handleLogin} 
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl border-0 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Sign in with Email</span>
            </div>
          </Button>
          
          {/* Additional decorative elements */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-white/50 text-sm">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
            <span>Secure & Fast</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
          </div>
        </CardContent>
      </Card>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </main>
  )
}