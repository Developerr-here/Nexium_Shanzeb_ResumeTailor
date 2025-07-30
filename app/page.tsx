
// import Link from 'next/link';

// export default function Home() {
//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Resume Tailor</h1>
//       <p className="mb-4">Create and manage your professional resumes</p>
//       <Link 
//         href="/dashboard" 
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Get Started
//       </Link>
//     </div>
//   );
// }


// 'use client'

// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// export default function Home() {
//   return (
//     <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Resume Tailor</CardTitle>
//           <CardDescription>Create and manage your professional resumes in seconds.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button asChild className="w-full">
//             <Link href="/dashboard">Get Started</Link>
//           </Button>
//         </CardContent>
//       </Card>
//     </main>
//   )
// }








'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-indigo-400/60 rounded-full animate-ping delay-500"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 dark:shadow-indigo-500/20 hover:shadow-3xl hover:shadow-blue-500/20 dark:hover:shadow-indigo-500/30 transition-all duration-700 hover:scale-105 group">
        {/* Subtle gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-700 -z-10"></div>
        
        <CardHeader className="text-center space-y-4 pb-8">
          {/* Logo/Icon area with animation */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 group-hover:scale-105 transition-transform duration-300">
            Resume Tailor
          </CardTitle>
          
          <CardDescription className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
            Create and manage your professional resumes in 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> seconds</span>.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Button 
            asChild 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-500 hover:scale-105 group-hover:scale-110 relative overflow-hidden"
          >
            <Link href="/dashboard" className="relative z-10 flex items-center justify-center space-x-2">
              <span>Get Started</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
          
          {/* Subtle feature hints */}
          <div className="mt-6 flex justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>Fast & Easy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
              <span>Professional</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}








// import { supabase } from '@/lib/supabase';
// import Link from 'next/link';

// export default async function Home() {
//   const { data: { user } } = await supabase.auth.getUser();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md text-center">
//         <h1 className="text-2xl font-bold mb-4">Resume Tailor</h1>
//         {user ? (
//           <>
//             <p className="mb-6">Welcome back!</p>
//             <Link
//               href="/dashboard"
//               className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
//             >
//               Go to Dashboard
//             </Link>
//           </>
//         ) : (
//           <>
//             <p className="mb-6">Create amazing resumes with AI</p>
//             <Link
//               href="/login"
//               className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
//             >
//               Get Started
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }