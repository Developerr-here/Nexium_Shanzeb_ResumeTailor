// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import supabase from '@/utils/supabase/client'

// type Resume = {
//   id: string
//   created_at: string
//   name: string
//   summary: string
//   user_id: string
// }

// export default function DashboardPage() {
//   const router = useRouter()

//   const [name, setName] = useState('')
//   const [skills, setSkills] = useState('')
//   const [experience, setExperience] = useState('')
//   const [resumes, setResumes] = useState<Resume[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetching, setIsFetching] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsFetching(true)
//       try {
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) {
//           router.replace('/login')
//           return
//         }

//         const { data, error: fetchError } = await supabase
//           .from('resumes')
//           .select('*')
//           .eq('user_id', user.id)
//           .order('created_at', { ascending: false })

//         if (fetchError) throw fetchError

//         setResumes(data ?? [])
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load resumes')
//       } finally {
//         setIsFetching(false)
//       }
//     }

//     fetchData()
//   }, [router])

//   const handleSubmit = async () => {
//     const trimmed = { name: name.trim(), skills: skills.trim(), experience: experience.trim() }
//     if (!trimmed.name || !trimmed.skills || !trimmed.experience) {
//       setError('All fields are required')
//       return
//     }

//     setIsLoading(true)
//     setError('')

//     try {
//       const { data: { user }, error: authError } = await supabase.auth.getUser()
//       if (authError || !user) throw new Error('Not authenticated')

//       const response = await fetch('/api/resumes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...trimmed, userId: user.id }),
//       })

//       const result = await response.json()
//       if (!result.success) throw new Error(result.error || 'Failed to save resume')

//       // optimistic prepend
//       const temp: Resume = {
//         id: result.data.id,
//         created_at: new Date().toISOString(),
//         name: trimmed.name,
//         summary: result.data.summary,
//         user_id: user.id,
//       }
//       setResumes(prev => [temp, ...prev])

//       setName('')
//       setSkills('')
//       setExperience('')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to save resume')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Create Resume</h1>

//       <div className="mb-8 p-4 border rounded-lg bg-white shadow space-y-3">
//         <h2 className="text-xl font-semibold">Your Details</h2>

//         <input
//           value={name}
//           onChange={e => setName(e.target.value)}
//           placeholder="Your Name"
//           className="w-full p-2 border rounded"
//           disabled={isLoading}
//         />

//         <textarea
//           value={skills}
//           onChange={e => setSkills(e.target.value)}
//           placeholder="Skills (comma separated)"
//           className="w-full p-2 border rounded h-24"
//           disabled={isLoading}
//         />

//         <input
//           value={experience}
//           onChange={e => setExperience(e.target.value)}
//           placeholder="Experience (e.g., 2 years as developer)"
//           className="w-full p-2 border rounded"
//           disabled={isLoading}
//         />

//         {error && <div className="p-2 bg-red-50 text-red-600 rounded">{error}</div>}

//         <button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className={`w-full p-3 rounded-md text-white font-medium ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//         >
//           {isLoading ? 'Saving...' : 'Save Resume'}
//         </button>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-3">Your Resumes</h2>

//         {isFetching ? (
//           <p>Loading resumes...</p>
//         ) : resumes.length === 0 ? (
//           <p className="text-gray-500">No resumes yet. Create one above!</p>
//         ) : (
//           <div className="space-y-4">
//             {resumes.map(r => (
//               <div key={r.id} className="p-4 border rounded-lg">
//                 <h3 className="font-bold text-lg">{r.name}</h3>
//                 <p className="text-gray-700 mt-2">{r.summary}</p>
//                 <div className="mt-2 text-sm text-gray-500">
//                   Created: {new Date(r.created_at).toLocaleString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }








// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import supabase from '@/utils/supabase/client'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Skeleton } from '@/components/ui/skeleton'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Separator } from '@/components/ui/separator'

// type Resume = {
//   id: string
//   created_at: string
//   name: string
//   summary: string
//   user_id: string
// }

// export default function DashboardPage() {
//   const router = useRouter()
//   const [name, setName] = useState('')
//   const [skills, setSkills] = useState('')
//   const [experience, setExperience] = useState('')
//   const [resumes, setResumes] = useState<Resume[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetching, setIsFetching] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsFetching(true)
//       try {
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) {
//           router.replace('/login')
//           return
//         }
//         const { data, error: fetchError } = await supabase
//           .from('resumes')
//           .select('*')
//           .eq('user_id', user.id)
//           .order('created_at', { ascending: false })
//         if (fetchError) throw fetchError
//         setResumes(data ?? [])
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load resumes')
//       } finally {
//         setIsFetching(false)
//       }
//     }
//     fetchData()
//   }, [router])

//   const handleSubmit = async () => {
//     const trimmed = { name: name.trim(), skills: skills.trim(), experience: experience.trim() }
//     if (!trimmed.name || !trimmed.skills || !trimmed.experience) {
//       setError('All fields are required')
//       return
//     }
//     setIsLoading(true)
//     setError('')
//     try {
//       const { data: { user }, error: authError } = await supabase.auth.getUser()
//       if (authError || !user) throw new Error('Not authenticated')
//       const response = await fetch('/api/resumes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...trimmed, userId: user.id }),
//       })
//       const result = await response.json()
//       if (!result.success) throw new Error(result.error || 'Failed to save resume')
//       const temp: Resume = {
//         id: result.data.id,
//         created_at: new Date().toISOString(),
//         name: trimmed.name,
//         summary: result.data.summary,
//         user_id: user.id,
//       }
//       setResumes(prev => [temp, ...prev])
//       setName('')
//       setSkills('')
//       setExperience('')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to save resume')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <h1 className="text-3xl font-bold text-center">Create Resume</h1>

//         <Card>
//           <CardHeader>
//             <CardTitle>Your Details</CardTitle>
//             <CardDescription>Fill in the form below to generate a new resume.</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Input
//               placeholder="Your Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               disabled={isLoading}
//             />
//             <Textarea
//               placeholder="Skills (comma separated)"
//               value={skills}
//               onChange={(e) => setSkills(e.target.value)}
//               disabled={isLoading}
//             />
//             <Input
//               placeholder="Experience (e.g., 2 years developer)"
//               value={experience}
//               onChange={(e) => setExperience(e.target.value)}
//               disabled={isLoading}
//             />
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
//             <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
//               {isLoading ? 'Saving...' : 'Save Resume'}
//             </Button>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Your Resumes</CardTitle>
//             <CardDescription>
//               {isFetching ? 'Loading...' : resumes.length === 0 ? 'No resumes yet.' : ''}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {isFetching ? (
//               <Skeleton className="h-24 w-full" />
//             ) : resumes.length === 0 ? (
//               <p className="text-sm text-muted-foreground">Create one above!</p>
//             ) : (
//               resumes.map((r) => (
//                 <Card key={r.id}>
//                   <CardHeader>
//                     <CardTitle className="text-lg">{r.name}</CardTitle>
//                     <CardDescription>{r.summary}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="text-xs text-muted-foreground">
//                     Created: {new Date(r.created_at).toLocaleString()}
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </main>
//   )
// }






'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

type Resume = {
  id: string
  created_at: string
  name: string
  summary: string
  user_id: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true)
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          router.replace('/login')
          return
        }
        const { data, error: fetchError } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (fetchError) throw fetchError
        setResumes(data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resumes')
      } finally {
        setIsFetching(false)
      }
    }
    fetchData()
  }, [router])

  const handleSubmit = async () => {
    const trimmed = { name: name.trim(), skills: skills.trim(), experience: experience.trim() }
    if (!trimmed.name || !trimmed.skills || !trimmed.experience) {
      setError('All fields are required')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('Not authenticated')
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...trimmed, userId: user.id }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Failed to save resume')
      const temp: Resume = {
        id: result.data.id,
        created_at: new Date().toISOString(),
        name: trimmed.name,
        summary: result.data.summary,
        user_id: user.id,
      }
      setResumes(prev => [temp, ...prev])
      setName('')
      setSkills('')
      setExperience('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resume')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-sm font-medium text-purple-800 dark:text-purple-200 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
              ✨ AI-Powered Resume Builder
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Create Your Perfect Resume
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transform your career story into a compelling resume with our intelligent platform
            </p>
          </div>

          {/* Create Resume Card */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/20 relative overflow-hidden group hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Details</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                    Fill in the form below to generate a new resume with AI assistance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/70 dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 text-base"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Skills & Expertise
                  </label>
                  <Textarea
                    placeholder="JavaScript, React, Node.js, Python, Machine Learning..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[100px] bg-white/70 dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 text-base resize-none"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Experience
                  </label>
                  <Input
                    placeholder="e.g., 3 years as Full Stack Developer"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/70 dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 text-base"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={isLoading} 
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Your Resume...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create Resume</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resumes Gallery */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-cyan-500/5"></div>
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Resume Collection</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                      {isFetching ? 'Loading your resumes...' : resumes.length === 0 ? 'Your resume gallery awaits your first creation' : `${resumes.length} resume${resumes.length === 1 ? '' : 's'} in your collection`}
                    </CardDescription>
                  </div>
                </div>
                {resumes.length > 0 && (
                  <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{resumes.length} Active</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              {isFetching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm animate-pulse">
                      <Skeleton className="h-6 w-3/4 mb-3 bg-slate-200 dark:bg-slate-700" />
                      <Skeleton className="h-4 w-full mb-2 bg-slate-200 dark:bg-slate-700" />
                      <Skeleton className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700" />
                    </div>
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shadow-inner">
                    <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium text-slate-600 dark:text-slate-400">No resumes yet</p>
                  <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">Start building your professional story by creating your first resume above!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {resumes.map((resume, index) => (
                    <Card key={resume.id} className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white/60 to-white/80 dark:from-slate-800/60 dark:to-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-300/50 dark:hover:border-indigo-600/50 transform hover:scale-[1.01]">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {resume.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {resume.name}
                              </CardTitle>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                Created {new Date(resume.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                              Ready
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 backdrop-blur-sm border border-slate-200/30 dark:border-slate-600/30">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {resume.summary}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}