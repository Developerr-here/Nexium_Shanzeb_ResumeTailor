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
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true)
      setError('')
      
      // Check query parameter and localStorage flags
      const urlParams = new URLSearchParams(window.location.search)
      const hasDemoParam = urlParams.get('demo') === 'true'
      const hasDemoStorage = localStorage.getItem('resume_tailor_demo') === 'true'
      
      if (hasDemoParam || hasDemoStorage) {
        setIsDemoMode(true)
        localStorage.setItem('resume_tailor_demo', 'true')
        const localData = localStorage.getItem('resume_tailor_resumes')
        const parsed = localData ? JSON.parse(localData) : []
        setResumes(parsed)
        setIsFetching(false)
        return
      }

      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          router.replace('/login')
          return
        }
        
        // Fetch resumes from Supabase
        const { data, error: fetchError } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          
        if (fetchError) throw fetchError
        setResumes(data ?? [])
      } catch (err: any) {
        console.warn('Supabase fetch failed. Automatically degrading to Demo Mode:', err)
        setIsDemoMode(true)
        localStorage.setItem('resume_tailor_demo', 'true')
        
        // Load offline resumes
        const localData = localStorage.getItem('resume_tailor_resumes')
        const parsed = localData ? JSON.parse(localData) : []
        setResumes(parsed)
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

    // Intelligent smart-template builder as local fallback
    const generateLocalSummary = (fullName: string, techSkills: string, expYears: string) => {
      const verbPool = ['Spearheaded', 'Optimized', 'Architected', 'Engineered', 'Delivered']
      const chosenVerb = verbPool[Math.floor(Math.random() * verbPool.length)]
      return `${chosenVerb} highly functional workflows as a professional. Expertly leveraged skills in ${techSkills} to implement key performance gains over ${expYears} of industry expertise. Known for leading with design excellence, streamlining engineering efficiency, and driving high-impact technical initiatives across stakeholders.`
    }

    if (isDemoMode) {
      try {
        let summaryText = ''
        // Try to generate using the server-side AI endpoint first
        try {
          const response = await fetch('/api/resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...trimmed, userId: 'demo-user-id' }),
          })
          const result = await response.json()
          if (result.success) {
            summaryText = result.data.summary
          } else {
            console.warn('API error, reverting to smart summary templates.')
            summaryText = generateLocalSummary(trimmed.name, trimmed.skills, trimmed.experience)
          }
        } catch (apiErr) {
          console.warn('Server API offline, using local summary builder.')
          summaryText = generateLocalSummary(trimmed.name, trimmed.skills, trimmed.experience)
        }

        const temp: Resume = {
          id: `demo-${Math.random().toString(36).substring(2, 11)}`,
          created_at: new Date().toISOString(),
          name: trimmed.name,
          summary: summaryText,
          user_id: 'demo-user-id',
        }

        const updated = [temp, ...resumes]
        setResumes(updated)
        localStorage.setItem('resume_tailor_resumes', JSON.stringify(updated))
        
        setName('')
        setSkills('')
        setExperience('')
      } catch (err: any) {
        setError(err.message || 'Failed to generate resume summary.')
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Standard client route (active database)
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
    } catch (err: any) {
      console.warn('Supabase/MongoDB save failed. Switching to Local Storage Fallback.', err)
      setIsDemoMode(true)
      localStorage.setItem('resume_tailor_demo', 'true')
      
      const summaryText = generateLocalSummary(trimmed.name, trimmed.skills, trimmed.experience)
      const temp: Resume = {
        id: `demo-${Math.random().toString(36).substring(2, 11)}`,
        created_at: new Date().toISOString(),
        name: trimmed.name,
        summary: summaryText,
        user_id: 'demo-user-id',
      }
      
      const updated = [temp, ...resumes]
      setResumes(updated)
      localStorage.setItem('resume_tailor_resumes', JSON.stringify(updated))
      setError('Switched to offline Demo Mode. Save succeeded locally.')
      
      setName('')
      setSkills('')
      setExperience('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExitDemoMode = () => {
    localStorage.removeItem('resume_tailor_demo')
    localStorage.removeItem('resume_tailor_resumes')
    setIsDemoMode(false)
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden py-12">
      {/* Animated Ambient Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Resilient Demo Mode Banner */}
          {isDemoMode && (
            <div className="w-full bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border border-purple-500/20 text-slate-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-purple-500/5">
              <div className="flex items-center space-x-3">
                <span className="flex h-3.5 w-3.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
                </span>
                <p className="text-sm font-medium leading-relaxed">
                  <span className="font-extrabold text-purple-300">Demo Mode Active:</span> Database offline or demo selected. Data is stored safely in your browser.
                </p>
              </div>
              <Button 
                onClick={handleExitDemoMode}
                className="h-9 px-4 bg-white/10 hover:bg-white/20 border-0 text-xs font-semibold rounded-xl text-white transition-all duration-300 shrink-0 self-end sm:self-center"
              >
                Sign In Again
              </Button>
            </div>
          )}

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-purple-300 backdrop-blur-md">
              ✨ AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-slate-300 bg-clip-text text-transparent leading-tight tracking-tight">
              Create Your Perfect Resume
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
              Transform your career achievements into an elegant resume with state-of-the-art AI.
            </p>
          </div>

          {/* Create Resume Card */}
          <Card className="backdrop-blur-xl bg-white/[0.02] border border-white/10 shadow-2xl shadow-purple-500/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">Your Professional Profile</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Enter details below and watch the builder formulate your professional summary
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Full Name
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl text-base"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Skills & Expertise
                  </label>
                  <Textarea
                    placeholder="JavaScript, React, Node.js, Cloud Services, System Design..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[90px] bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl text-base resize-none"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Work Experience
                  </label>
                  <Input
                    placeholder="e.g. 5 years as Senior Software Engineer at Stripe"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl text-base"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={isLoading} 
                className="w-full h-13 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl border-0 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.01] transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2.5">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Tailoring Summary...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Tailor My Resume</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Gallery Collection */}
          <Card className="backdrop-blur-xl bg-white/[0.02] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent -z-10"></div>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Your Collection</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      {isFetching ? 'Fetching data...' : resumes.length === 0 ? 'Start creating resumes to build your collection' : `${resumes.length} resume summary profile${resumes.length === 1 ? '' : 's'} available`}
                    </CardDescription>
                  </div>
                </div>
                {resumes.length > 0 && (
                  <div className="inline-flex items-center self-start sm:self-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                    {resumes.length} Active
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {isFetching ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 animate-pulse">
                      <Skeleton className="h-6 w-1/3 mb-3 bg-white/10" />
                      <Skeleton className="h-4 w-full mb-2 bg-white/5" />
                      <Skeleton className="h-4 w-2/3 bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-16 space-y-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center shadow-inner">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-slate-300">No resumes generated</p>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                    Fill in your details in the builder above to formulate your first professional profile!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {resumes.map((resume) => (
                    <Card key={resume.id} className="group overflow-hidden bg-white/[0.01] border-white/5 hover:border-purple-500/30 transition-all duration-300 shadow-md">
                      <CardHeader className="pb-3 pt-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/25 flex items-center justify-center text-purple-300 font-extrabold text-sm shadow">
                              {resume.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <CardTitle className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                                {resume.name}
                              </CardTitle>
                              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                Created {new Date(resume.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xxs font-bold tracking-wider uppercase shrink-0">
                            Ready
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-5 pt-0">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                          <p className="text-slate-300 text-sm leading-relaxed font-medium">
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