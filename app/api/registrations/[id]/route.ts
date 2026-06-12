import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden', status: 403 }
  return null
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const authError = await requireAdmin(supabase)
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status })

  const body = await request.json()
  const { name, nickname, mohalla, contact_number, batting_style, payment_method, payment_status } = body

  const { data, error } = await supabase
    .from('registrations')
    .update({ name, nickname, mohalla, contact_number, batting_style, payment_method, payment_status })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const authError = await requireAdmin(supabase)
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status })

  const { error } = await supabase.from('registrations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
