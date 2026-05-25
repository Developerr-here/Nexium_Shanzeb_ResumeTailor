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
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type Particle = {
  left: string
  top: string
  duration: string
  delay: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [isConnectionError, setIsConnectionError] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({
    type: '',
    message: ''
  })

  // Watch for auth changes
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/dashboard')
      }
    })
    return () => data.subscription.unsubscribe()
  }, [router])

  // Prevent hydration mismatch by generating particle properties only after client mount
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${4 + Math.random() * 5}s`,
      delay: `${Math.random() * 3}s`
    }))
    setParticles(generated)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    setIsLoading(true)
    setIsConnectionError(false)
    setStatus({ type: '', message: '' })

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
      })
      if (error) {
        throw error
      }
      setStatus({
        type: 'success',
        message: 'Magic link sent! Check your inbox for a login link.'
      })
    } catch (error: any) {
      console.error('Login error:', error)
      const isDnsOrNetworkError = 
        error.message?.toLowerCase().includes('failed to fetch') || 
        error.toString().toLowerCase().includes('failed to fetch') ||
        error.message?.toLowerCase().includes('err_name_not_resolved');

      if (isDnsOrNetworkError) {
        setIsConnectionError(true)
        setStatus({
          type: 'error',
          message: 'Supabase is unreachable. The configured project is likely paused or deleted.'
        })
      } else {
        setStatus({
          type: 'error',
          message: error.message || 'Failed to send login link. Please try again.'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    setIsDemoLoading(true)
    // Save demo flag in localStorage
    localStorage.setItem('resume_tailor_demo', 'true')
    
    // Redirect to dashboard in demo mode
    setTimeout(() => {
      router.push('/dashboard?demo=true')
    }, 800)
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-slate-950">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(236,72,153,0.08),transparent_50%)]"></div>
      </div>
      
      {/* Floating ambient glow spheres */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] -z-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '45px 45px'
        }}></div>
      </div>

      {/* Main card */}
      <Card className="w-full max-w-md relative z-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10">
        {/* Decorative inner gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl pointer-events-none -z-10"></div>
        
        <CardHeader className="text-center pb-6 pt-8">
          {/* Glowing logo badge */}
          <div className="mx-auto mb-5 relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 animate-pulse"></div>
          </div>

          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-slate-200 bg-clip-text text-transparent tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400 text-base mt-2">
            Build interview-winning resumes with AI
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-300">
                Email Address
              </label>
              <Input 
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isDemoLoading}
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:ring-purple-500/20 text-base rounded-xl transition-all"
              />
            </div>

            {status.message && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${
                status.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                <div className="flex items-start space-x-2">
                  {status.type === 'success' ? (
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  <span>{status.message}</span>
                </div>
              </div>
            )}

            <Button 
              type="submit"
              disabled={isLoading || isDemoLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl border-0 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending Magic Link...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Sign In with Email</span>
                </div>
              )}
            </Button>
          </form>

          {isConnectionError && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-300 text-xs space-y-2.5">
              <p className="font-extrabold text-purple-300 text-sm flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-400 mr-2 animate-ping"></span>
                💡 Diagnose Supabase Error:
              </p>
              <p className="text-slate-400 leading-relaxed">
                The Supabase project URL in your <code className="text-pink-400 bg-slate-900/60 px-1 py-0.5 rounded border border-white/5">.env</code> file does not exist, has expired, or is currently paused by Supabase.
              </p>
              <div className="space-y-1.5 text-slate-400 mt-2 bg-slate-950/40 p-3 rounded-lg border border-white/5">
                <p className="font-bold text-white text-[11px]">To resolve this live database issue:</p>
                <ol className="list-decimal list-inside space-y-1.5 mt-1 text-[11px] leading-relaxed">
                  <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">supabase.com</a> & create a new free project.</li>
                  <li>Copy your new <b>Project URL</b> and <b>Anon API Key</b>.</li>
                  <li>Paste them into your local <code className="text-pink-400">.env</code> file.</li>
                  <li>Restart the local dev server (<code className="text-pink-400">npm run dev</code>).</li>
                </ol>
              </div>
            </div>
          )}

          {/* Elegant Divider */}
          <div className="flex items-center space-x-3 text-slate-500 text-xs font-semibold py-2">
            <div className="flex-grow h-px bg-white/5"></div>
            <span className="uppercase tracking-wider">OR</span>
            <div className="flex-grow h-px bg-white/5"></div>
          </div>

          {/* Try Demo Mode Option */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleDemoMode}
              disabled={isLoading || isDemoLoading}
              className="w-full h-12 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-inner"
            >
              {isDemoLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>
                  <span>Entering Demo Mode...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>✨ Try Demo Mode (Database Free)</span>
                </div>
              )}
            </Button>
            <p className="text-center text-xs text-slate-500 px-4 leading-relaxed">
              Explore the resume creation workbench instantly using browser storage. No login required.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Floating Client-side Particles (Resolved Hydration Mismatch) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/25 rounded-full"
            style={{
              left: p.left,
              top: p.top,
              animation: `float ${p.duration} ease-in-out infinite`,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-35px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </main>
  )
}