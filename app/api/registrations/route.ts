import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden', status: 403 }
  return null
}

export async function GET() {
  const supabase = await createClient()
  const authError = await requireAdmin(supabase)
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status })

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const authError = await requireAdmin(supabase)
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status })

  const body = await request.json()
  const { name, nickname, mohalla, contact_number, batting_style, payment_method, payment_status } = body

  if (!name || !nickname || !mohalla || !contact_number || !batting_style) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const id = 'REG-' + Date.now()
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      id, name, nickname, mohalla, contact_number, batting_style,
      payment_method: payment_method || 'Traditional',
      payment_status: payment_status || 'Pending',
      registered_at: new Date().toLocaleString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
