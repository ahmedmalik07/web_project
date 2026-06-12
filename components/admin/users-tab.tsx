"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import type { Profile } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function UsersTab({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleRole(profile: Profile) {
    const newRole = profile.role === "admin" ? "user" : "admin"
    if (!confirm(`Change ${profile.email} to "${newRole}"?`)) return

    setLoading(profile.id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", profile.id)

      if (error) throw error

      setProfiles((p) => p.map((u) => u.id === profile.id ? { ...u, role: newRole } : u))
      toast.success(`${profile.email} is now ${newRole}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update role")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Users ({profiles.length})</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage user roles. Admins have full access to this panel.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="admin-th">Email</th>
              <th className="admin-th">Role</th>
              <th className="admin-th hidden md:table-cell">Joined</th>
              <th className="admin-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="admin-td font-medium text-foreground">{profile.email}</td>
                <td className="admin-td">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    profile.role === "admin"
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground border border-border"
                  }`}>
                    {profile.role}
                  </span>
                </td>
                <td className="admin-td text-muted-foreground text-xs hidden md:table-cell">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                </td>
                <td className="admin-td">
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleRole(profile)}
                      disabled={loading === profile.id}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50"
                    >
                      {loading === profile.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Check className="h-3 w-3" />}
                      Make {profile.role === "admin" ? "User" : "Admin"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">To make yourself admin:</strong> Run this SQL in your Supabase dashboard SQL editor:
        <pre className="mt-2 overflow-x-auto rounded bg-secondary p-3 text-xs text-foreground">
          {`UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';`}
        </pre>
      </div>
    </div>
  )
}
