import { createClient } from '@/lib/supabase/server'
import { AdminPanel } from '@/components/admin/admin-panel'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { data: players },
    { data: registrations },
    { data: payments },
    { data: profiles },
  ] = await Promise.all([
    supabase.from('players').select('*').order('score', { ascending: false }),
    supabase.from('registrations').select('*').order('created_at', { ascending: false }),
    supabase.from('payments').select('*, registrations(name, mohalla)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20">
              Admin Panel
            </span>
            <h1 className="mt-3 text-3xl font-black text-foreground md:text-4xl">
              Gully XI Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage players, registrations, payments and users
            </p>
          </div>
          {/* Stats bar */}
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Players', value: players?.length ?? 0, color: 'text-primary' },
              { label: 'Registrations', value: registrations?.length ?? 0, color: 'text-accent' },
              { label: 'Payments', value: payments?.length ?? 0, color: 'text-green-500' },
              { label: 'Users', value: profiles?.length ?? 0, color: 'text-blue-400' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-3 text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <AdminPanel
          initialPlayers={players ?? []}
          initialRegistrations={registrations ?? []}
          initialPayments={payments ?? []}
          initialProfiles={profiles ?? []}
        />
      </div>
    </div>
  )
}
