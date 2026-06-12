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
    .from('payments')
    .select('*, registrations(name, mohalla)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const authError = await requireAdmin(supabase)
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status })

  const body = await request.json()
  const { registration_id, amount, currency, method, status, tx_hash } = body

  if (!registration_id || !amount || !method) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const id = 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  const { data, error } = await supabase
    .from('payments')
    .insert({
      id, registration_id, amount: parseInt(amount),
      currency: currency || 'PKR', method,
      status: status || 'Pending',
      tx_hash: tx_hash || 'TXN-' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      payment_date: new Date().toLocaleString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
