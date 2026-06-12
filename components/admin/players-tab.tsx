"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react"
import type { Player } from "@/lib/types"
import { toast } from "sonner"

const MOHALLAS = ["Saddar","Defence","Gulberg","Johar Town","Model Town","Clifton","Nazimabad","F-6 Islamabad","G-9 Islamabad","Hayatabad","Walled City","Anarkali","Bahria Town","Cantt Area","Other"]

interface EditingPlayer { name: string; score: string; mohalla: string }

export function PlayersTab({ initialPlayers }: { initialPlayers: Player[] }) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<EditingPlayer>({ name: "", score: "", mohalla: "" })
  const [showAdd, setShowAdd] = useState(false)
  const [newData, setNewData] = useState<EditingPlayer>({ name: "", score: "", mohalla: "" })

  // ── CREATE ────────────────────────────────────────────────────
  async function handleCreate() {
    if (!newData.name.trim() || !newData.score || !newData.mohalla) {
      toast.error("Fill in all fields")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newData.name.trim(), score: parseInt(newData.score), mohalla: newData.mohalla }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPlayers((prev) => [...prev, data].sort((a, b) => b.score - a.score))
      setNewData({ name: "", score: "", mohalla: "" })
      setShowAdd(false)
      toast.success("Player added successfully")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add player")
    } finally {
      setLoading(false)
    }
  }

  // ── UPDATE ────────────────────────────────────────────────────
  async function handleUpdate(id: string) {
    if (!editData.name.trim() || !editData.score || !editData.mohalla) {
      toast.error("Fill in all fields")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editData.name.trim(), score: parseInt(editData.score), mohalla: editData.mohalla }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPlayers((prev) => prev.map((p) => p.id === id ? data : p).sort((a, b) => b.score - a.score))
      setEditId(null)
      toast.success("Player updated")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update player")
    } finally {
      setLoading(false)
    }
  }

  // ── DELETE ────────────────────────────────────────────────────
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/players/${id}`, { method: "DELETE" })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setPlayers((prev) => prev.filter((p) => p.id !== id))
      toast.success("Player deleted")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete player")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Players ({players.length})</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Player
        </button>
      </div>

      {/* Add row */}
      {showAdd && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">New Player</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={newData.name} onChange={(e) => setNewData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Player name" className="admin-input" />
            <input type="number" value={newData.score} onChange={(e) => setNewData((p) => ({ ...p, score: e.target.value }))}
              placeholder="Runs scored" className="admin-input" />
            <select value={newData.mohalla} onChange={(e) => setNewData((p) => ({ ...p, mohalla: e.target.value }))}
              className="admin-input">
              <option value="">Select mohalla...</option>
              {MOHALLAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleCreate} disabled={loading}
              className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Save
            </button>
            <button onClick={() => setShowAdd(false)}
              className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="admin-th">Rank</th>
              <th className="admin-th">Name</th>
              <th className="admin-th">Mohalla</th>
              <th className="admin-th text-right">Score</th>
              <th className="admin-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr key={player.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                {editId === player.id ? (
                  <>
                    <td className="admin-td text-muted-foreground font-mono">#{i + 1}</td>
                    <td className="admin-td"><input value={editData.name} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} className="admin-input w-full" /></td>
                    <td className="admin-td">
                      <select value={editData.mohalla} onChange={(e) => setEditData((p) => ({ ...p, mohalla: e.target.value }))} className="admin-input w-full">
                        {MOHALLAS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className="admin-td"><input type="number" value={editData.score} onChange={(e) => setEditData((p) => ({ ...p, score: e.target.value }))} className="admin-input w-24 text-right ml-auto block" /></td>
                    <td className="admin-td">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleUpdate(player.id)} disabled={loading} className="icon-btn text-primary hover:bg-primary/10"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditId(null)} className="icon-btn text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="admin-td text-muted-foreground font-mono text-xs">#{i + 1}</td>
                    <td className="admin-td font-semibold text-foreground">{player.name}</td>
                    <td className="admin-td text-muted-foreground">{player.mohalla}</td>
                    <td className="admin-td text-right font-mono font-bold text-primary">{player.score.toLocaleString()}</td>
                    <td className="admin-td">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditId(player.id); setEditData({ name: player.name, score: String(player.score), mohalla: player.mohalla }) }}
                          className="icon-btn text-muted-foreground hover:text-foreground hover:bg-secondary">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(player.id, player.name)} disabled={loading}
                          className="icon-btn text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {players.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No players yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
