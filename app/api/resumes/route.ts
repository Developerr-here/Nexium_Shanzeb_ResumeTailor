



// export const runtime = 'nodejs' // Mongo driver needs Node

// import { NextResponse } from 'next/server'
// import { getMongoClient } from '@/lib/mongodb'
// // import { createServerSupabase } from '@/lib/supabase-server'
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'

// const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
// const GROQ_MODEL = 'mixtral-8x7b-32768'
// const SUMMARY_LENGTH = 150

// // ---------- helpers ----------
// async function generateResumeContent(skills: string, experience: string) {
//   console.log('env:', { GROQ: process.env.GROQ_API_KEY });
//   if (!process.env.GROQ_API_KEY) throw new Error('Missing Groq API key')

//   const res = await fetch(GROQ_API_URL, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: GROQ_MODEL,
//       messages: [{
//         role: 'user',
//         content: `Create a professional resume summary for someone with ${experience} experience in ${skills}. Include relevant skills and achievements.`
//       }],
//       temperature: 0.7,
//       max_tokens: 300,
//     }),
//   })

//   if (!res.ok) {
//     const err = await res.json()
//     throw new Error(err.error?.message || 'Groq error')
//   }

//   const json = await res.json()
//   return json.choices[0].message.content.trim()
// }

// function validateResumeData(data: any) {
//   const required = ['name', 'skills', 'experience', 'userId']
//   const missing = required.filter(k => !data[k]?.toString().trim())
//   if (missing.length) throw new Error(`Missing fields: ${missing.join(', ')}`)

//   return {
//     name: data.name.toString().trim(),
//     skills: data.skills.toString().trim(),
//     experience: data.experience.toString().trim(),
//     userId: data.userId.toString().trim(),
//   }
// }

// // ---------- POST ----------
// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { name, skills, experience, userId } = validateResumeData(body)

//     // const supabase = createServerSupabase()
//     // const supabase = createRouteHandlerClient({ cookies })
//      const cookieStore = await cookies()
//      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

//     const fullText = await generateResumeContent(skills, experience)
//     const summary = fullText.length > SUMMARY_LENGTH
//       ? fullText.slice(0, SUMMARY_LENGTH) + '…'
//       : fullText

//     // Supabase insert (RLS enforces user_id)
//     const { data: supData, error: supErr } = await supabase
//       .from('resumes')
//       .insert({ user_id: userId, name, summary })
//       .select()
//       .single()

//     if (supErr) throw new Error(`Supabase: ${supErr.message}`)

//     // Mongo insert
//     const mongo = await getMongoClient()
//     await mongo.db('resume-tailor').collection('resumes').insertOne({
//       supabaseId: supData.id,
//       userId,
//       name,
//       skills,
//       experience,
//       fullText,
//       summary,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       metadata: { source: 'web-app', version: '1.0' },
//     })

//     return NextResponse.json({ success: true, data: { id: supData.id, name, summary } })
//   } catch (err) {
//     console.error('POST /api/resumes', err)
//     console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY?.slice(0, 6) + '***');
//     const msg = err instanceof Error ? err.message : 'Internal error'
//     const status = msg.includes('Missing') ? 400 : 500
//     return NextResponse.json({ success: false, error: msg }, { status })
//   }
// }

// // ---------- GET ----------
// export async function GET() {
//   try {
//     const mongo = await getMongoClient()
//     const resumes = await mongo
//       .db('resume-tailor')
//       .collection('resumes')
//       .find({}, { projection: { _id: 0 } })
//       .sort({ createdAt: -1 })
//       .limit(50)
//       .toArray()

//     return NextResponse.json({ success: true, data: resumes })
//   } catch (err) {
//     console.error('GET /api/resumes', err)
//     return NextResponse.json(
//       { success: false, error: err instanceof Error ? err.message : 'Fetch failed' },
//       { status: 500 }
//     )
//   }
// }


export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = "llama-3.3-70b-versatile"
const SUMMARY_LENGTH = 150

async function generateResumeContent(skills: string, experience: string) {
  if (!process.env.GROQ_API_KEY) throw new Error('Missing Groq API key')

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
    throw new Error(err.error?.message || 'Groq error')
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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fullText = await generateResumeContent(skills, experience)
    const summary = fullText.length > SUMMARY_LENGTH
      ? fullText.slice(0, SUMMARY_LENGTH) + '…'
      : fullText

    const { data: supData, error: supErr } = await supabase
      .from('resumes')
      .insert({ user_id: userId, name, summary })
      .select()
      .single()

    if (supErr) throw new Error(`Supabase: ${supErr.message}`)

    const mongo = await getMongoClient()
    await mongo.db('resume-tailor').collection('resumes').insertOne({
      supabaseId: supData.id,
      userId,
      name,
      skills,
      experience,
      fullText,
      summary,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: { source: 'web-app', version: '1.0' },
    })

    return NextResponse.json({ success: true, data: { id: supData.id, name, summary } })
  } catch (err) {
    console.error('POST /api/resumes', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Internal error' },
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
    console.error('GET /api/resumes', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Fetch failed' },
      { status: 500 }
    )
  }
}