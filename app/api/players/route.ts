import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET all players (public)
export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('score', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST create player (admin only)
export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
  }

  const body = await request.json()
  const { name, score, mohalla } = body

  if (!name || score === undefined || !mohalla) {
    return NextResponse.json({ error: 'Missing required fields: name, score, mohalla' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('players')
    .insert({ name, score: parseInt(score), mohalla, timestamp: Date.now() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
