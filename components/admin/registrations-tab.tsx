"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react"
import type { Registration } from "@/lib/types"
import { toast } from "sonner"

const MOHALLAS = ["Saddar","Defence","Gulberg","Johar Town","Model Town","Clifton","Nazimabad","F-6 Islamabad","Hayatabad","Walled City","Other"]
const BATTING = ["Right-handed", "Left-handed"]
const PAYMENT_METHODS = ["Traditional","JazzCash","EasyPaisa","Stripe","PayPal","USDT","BTC","ETH"]
const PAYMENT_STATUS = ["Pending","Paid","Failed","Refunded"]

type RegForm = Omit<Registration, "id" | "created_at">

const EMPTY: RegForm = { name:"", nickname:"", mohalla:"", contact_number:"", batting_style:"Right-handed", payment_method:"Traditional", payment_status:"Pending", registered_at:"" }

export function RegistrationsTab({ initialRegistrations }: { initialRegistrations: Registration[] }) {
  const [regs, setRegs] = useState<Registration[]>(initialRegistrations)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<RegForm>(EMPTY)
  const [showAdd, setShowAdd] = useState(false)
  const [newData, setNewData] = useState<RegForm>(EMPTY)

  async function handleCreate() {
    if (!newData.name || !newData.nickname || !newData.mohalla || !newData.contact_number) {
      toast.error("Fill required fields"); return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/registrations", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(newData) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRegs((p) => [data, ...p])
      setNewData(EMPTY); setShowAdd(false)
      toast.success("Registration created")
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error") }
    finally { setLoading(false) }
  }

  async function handleUpdate(id: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/registrations/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(editData) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRegs((p) => p.map((r) => r.id === id ? data : r))
      setEditId(null)
      toast.success("Registration updated")
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error") }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete registration for "${name}"?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/registrations/${id}`, { method:"DELETE" })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setRegs((p) => p.filter((r) => r.id !== id))
      toast.success("Registration deleted")
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error") }
    finally { setLoading(false) }
  }

  const statusColor: Record<string,string> = {
    Paid: "text-green-500 bg-green-500/10",
    Pending: "text-yellow-500 bg-yellow-500/10",
    Failed: "text-destructive bg-destructive/10",
    Refunded: "text-blue-400 bg-blue-400/10",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Registrations ({regs.length})</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Registration
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">New Registration</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input value={newData.name} onChange={(e) => setNewData((p) => ({ ...p, name: e.target.value }))} placeholder="Full name *" className="admin-input" />
            <input value={newData.nickname} onChange={(e) => setNewData((p) => ({ ...p, nickname: e.target.value }))} placeholder="Nickname *" className="admin-input" />
            <select value={newData.mohalla} onChange={(e) => setNewData((p) => ({ ...p, mohalla: e.target.value }))} className="admin-input">
              <option value="">Select mohalla *</option>
              {MOHALLAS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <input value={newData.contact_number} onChange={(e) => setNewData((p) => ({ ...p, contact_number: e.target.value }))} placeholder="Contact number *" className="admin-input" />
            <select value={newData.batting_style} onChange={(e) => setNewData((p) => ({ ...p, batting_style: e.target.value }))} className="admin-input">
              {BATTING.map((b) => <option key={b}>{b}</option>)}
            </select>
            <select value={newData.payment_method} onChange={(e) => setNewData((p) => ({ ...p, payment_method: e.target.value }))} className="admin-input">
              {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select value={newData.payment_status} onChange={(e) => setNewData((p) => ({ ...p, payment_status: e.target.value }))} className="admin-input">
              {PAYMENT_STATUS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleCreate} disabled={loading} className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Save
            </button>
            <button onClick={() => setShowAdd(false)} className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="admin-th">Name</th>
              <th className="admin-th">Nickname</th>
              <th className="admin-th hidden md:table-cell">Mohalla</th>
              <th className="admin-th hidden lg:table-cell">Contact</th>
              <th className="admin-th hidden lg:table-cell">Batting</th>
              <th className="admin-th">Payment</th>
              <th className="admin-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regs.map((reg) => (
              <tr key={reg.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                {editId === reg.id ? (
                  <>
                    <td className="admin-td"><input value={editData.name} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} className="admin-input w-full" /></td>
                    <td className="admin-td"><input value={editData.nickname} onChange={(e) => setEditData((p) => ({ ...p, nickname: e.target.value }))} className="admin-input w-full" /></td>
                    <td className="admin-td hidden md:table-cell">
                      <select value={editData.mohalla} onChange={(e) => setEditData((p) => ({ ...p, mohalla: e.target.value }))} className="admin-input w-full">
                        {MOHALLAS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className="admin-td hidden lg:table-cell"><input value={editData.contact_number} onChange={(e) => setEditData((p) => ({ ...p, contact_number: e.target.value }))} className="admin-input w-full" /></td>
                    <td className="admin-td hidden lg:table-cell">
                      <select value={editData.batting_style} onChange={(e) => setEditData((p) => ({ ...p, batting_style: e.target.value }))} className="admin-input w-full">
                        {BATTING.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </td>
                    <td className="admin-td">
                      <select value={editData.payment_status} onChange={(e) => setEditData((p) => ({ ...p, payment_status: e.target.value }))} className="admin-input w-24">
                        {PAYMENT_STATUS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="admin-td">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleUpdate(reg.id)} disabled={loading} className="icon-btn text-primary hover:bg-primary/10"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditId(null)} className="icon-btn text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="admin-td font-semibold text-foreground">{reg.name}</td>
                    <td className="admin-td text-muted-foreground">{reg.nickname}</td>
                    <td className="admin-td text-muted-foreground hidden md:table-cell">{reg.mohalla}</td>
                    <td className="admin-td text-muted-foreground font-mono text-xs hidden lg:table-cell">{reg.contact_number}</td>
                    <td className="admin-td text-muted-foreground hidden lg:table-cell">{reg.batting_style}</td>
                    <td className="admin-td">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${statusColor[reg.payment_status] || ""}`}>
                        {reg.payment_status}
                      </span>
                    </td>
                    <td className="admin-td">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditId(reg.id); setEditData({ name: reg.name, nickname: reg.nickname, mohalla: reg.mohalla, contact_number: reg.contact_number, batting_style: reg.batting_style, payment_method: reg.payment_method, payment_status: reg.payment_status, registered_at: reg.registered_at }) }}
                          className="icon-btn text-muted-foreground hover:text-foreground hover:bg-secondary">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(reg.id, reg.name)} disabled={loading}
                          className="icon-btn text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {regs.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No registrations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
