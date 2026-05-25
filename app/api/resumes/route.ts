export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'


const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = "llama-3.3-70b-versatile"
const SUMMARY_LENGTH = 150

function generateLocalSummaryFallback(skills: string, experience: string) {
  const profileTypes = [
    `Distinguished professional with profound expertise in ${skills}. Demonstrates over ${experience} of exceptional career history driving mission-critical projects, implementing advanced methodologies, and streamlining operational efficiency.`,
    `Goal-oriented specialist boasting ${experience} of hands-on experience mastering ${skills}. Recognized for pioneering innovative engineering strategies, accelerating team velocity, and delivering robust scalable solutions.`,
    `Accomplished technologist equipped with a comprehensive background spanning ${experience} in ${skills}. Adept at designing future-proof architectures, cultivating cross-functional collaboration, and exceeding corporate milestone expectations.`
  ]
  return profileTypes[Math.floor(Math.random() * profileTypes.length)]
}

async function generateResumeContent(skills: string, experience: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Groq API Key is not configured in environment variables.')
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{
        role: 'user',
        content: `Create a professional resume summary for someone with ${experience} experience in ${skills}. Include relevant skills and achievements.`
      }],
      temperature: 0.7,
      max_tokens: 300,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Groq API response error')
  }

  const json = await res.json()
  return json.choices[0].message.content.trim()
}

function validateResumeData(data: any) {
  const required = ['name', 'skills', 'experience', 'userId']
  const missing = required.filter(k => !data[k]?.toString().trim())
  if (missing.length) throw new Error(`Missing fields: ${missing.join(', ')}`)

  return {
    name: data.name.toString().trim(),
    skills: data.skills.toString().trim(),
    experience: data.experience.toString().trim(),
    userId: data.userId.toString().trim(),
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, skills, experience, userId } = validateResumeData(body)

    let fullText = ''
    let isAIGenerated = true

    // Generate resume content with elegant smart fallback
    try {
      fullText = await generateResumeContent(skills, experience)
    } catch (groqErr) {
      console.warn('Groq summary generation failed. Using local template engine fallback:', groqErr)
      isAIGenerated = false
      fullText = generateLocalSummaryFallback(skills, experience)
    }

    const summary = fullText.length > SUMMARY_LENGTH
      ? fullText.slice(0, SUMMARY_LENGTH) + '…'
      : fullText

    let supabaseId = `demo-${Math.random().toString(36).substring(2, 11)}`
    let supSaved = false

    // 1. Try Supabase save (skip if demo-user-id sandbox)
    if (userId !== 'demo-user-id') {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
        const supabaseAnonKey = 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
          'placeholder-anon-key';

        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data: supData, error: supErr } = await supabase
          .from('resumes')
          .insert({ user_id: userId, name, summary })
          .select()
          .single()

        if (!supErr && supData) {
          supabaseId = supData.id
          supSaved = true
        } else {
          console.warn('Supabase DB write failed:', supErr?.message)
        }
      } catch (supConnErr) {
        console.warn('Supabase database connection failed:', supConnErr)
      }
    }

    let mongoSaved = false
    // 2. Try MongoDB save
    try {
      const mongo = await getMongoClient()
      await mongo.db('resume-tailor').collection('resumes').insertOne({
        supabaseId,
        userId,
        name,
        skills,
        experience,
        fullText,
        summary,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { source: 'web-app', version: '1.0', isAIGenerated },
      })
      mongoSaved = true
    } catch (mongoErr) {
      console.warn('MongoDB database write failed:', mongoErr)
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: supabaseId, 
        name, 
        summary,
        supSaved,
        mongoSaved,
        isAIGenerated
      } 
    })
  } catch (err: any) {
    console.error('POST /api/resumes failed:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal processing error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const mongo = await getMongoClient()
    const resumes = await mongo
      .db('resume-tailor')
      .collection('resumes')
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({ success: true, data: resumes })
  } catch (err) {
    console.warn('GET /api/resumes: database unreachable. Returning sandbox fallback data:', err)
    return NextResponse.json({ 
      success: true, 
      data: [], 
      warning: 'Database connection failed. Switched to sandbox fallback mode.' 
    })
  }
}







