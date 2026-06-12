"use client"

import { useState } from "react"
import { Pencil, Trash2, X, Check, Loader2 } from "lucide-react"
import type { Payment } from "@/lib/types"
import { toast } from "sonner"

const METHODS = ["JazzCash","EasyPaisa","Stripe","PayPal","USDT","BTC","ETH","Traditional"]
const STATUS = ["Pending","Paid","Failed","Refunded"]

type PayForm = { registration_id:string; amount:string; currency:string; method:string; status:string; tx_hash:string; payment_date:string }
const EMPTY: PayForm = { registration_id:"", amount:"", currency:"PKR", method:"JazzCash", status:"Pending", tx_hash:"", payment_date:"" }

export function PaymentsTab({ initialPayments }: { initialPayments: (Payment & { registrations?: { name: string; mohalla: string } | null })[] }) {
  const [payments, setPayments] = useState(initialPayments)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<PayForm>(EMPTY)

  async function handleUpdate(id: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/payments/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ ...editData, amount: parseInt(editData.amount) }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPayments((p) => p.map((pay) => pay.id === id ? { ...data, registrations: pay.registrations } : pay))
      setEditId(null)
      toast.success("Payment updated")
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error") }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete payment ${id}?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/payments/${id}`, { method:"DELETE" })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setPayments((p) => p.filter((pay) => pay.id !== id))
      toast.success("Payment deleted")
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error") }
    finally { setLoading(false) }
  }

  const statusColor: Record<string,string> = {
    Paid: "text-green-500 bg-green-500/10",
    Pending: "text-yellow-500 bg-yellow-500/10",
    Failed: "text-destructive bg-destructive/10",
    Refunded: "text-blue-400 bg-blue-400/10",
  }

  const total = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-foreground">Payments ({payments.length})</h2>
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-500">
          Total Collected: PKR {total.toLocaleString()}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="admin-th">ID</th>
              <th className="admin-th hidden md:table-cell">Player</th>
              <th className="admin-th">Method</th>
              <th className="admin-th text-right">Amount</th>
              <th className="admin-th">Status</th>
              <th className="admin-th hidden lg:table-cell">Tx Hash</th>
              <th className="admin-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay) => (
              <tr key={pay.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                {editId === pay.id ? (
                  <>
                    <td className="admin-td font-mono text-xs text-muted-foreground">{pay.id}</td>
                    <td className="admin-td hidden md:table-cell text-muted-foreground">{pay.registrations?.name ?? pay.registration_id}</td>
                    <td className="admin-td">
                      <select value={editData.method} onChange={(e) => setEditData((p) => ({ ...p, method: e.target.value }))} className="admin-input w-full">
                        {METHODS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className="admin-td">
                      <input type="number" value={editData.amount} onChange={(e) => setEditData((p) => ({ ...p, amount: e.target.value }))} className="admin-input w-24 text-right ml-auto block" />
                    </td>
                    <td className="admin-td">
                      <select value={editData.status} onChange={(e) => setEditData((p) => ({ ...p, status: e.target.value }))} className="admin-input w-28">
                        {STATUS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="admin-td hidden lg:table-cell">
                      <input value={editData.tx_hash} onChange={(e) => setEditData((p) => ({ ...p, tx_hash: e.target.value }))} className="admin-input w-full font-mono text-xs" placeholder="Tx hash" />
                    </td>
                    <td className="admin-td">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleUpdate(pay.id)} disabled={loading} className="icon-btn text-primary hover:bg-primary/10"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditId(null)} className="icon-btn text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="admin-td font-mono text-xs text-muted-foreground">{pay.id}</td>
                    <td className="admin-td text-muted-foreground hidden md:table-cell">{pay.registrations?.name ?? pay.registration_id}</td>
                    <td className="admin-td text-foreground">{pay.method}</td>
                    <td className="admin-td text-right font-mono font-bold text-foreground">{pay.amount?.toLocaleString()}</td>
                    <td className="admin-td">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${statusColor[pay.status] || ""}`}>{pay.status}</span>
                    </td>
                    <td className="admin-td font-mono text-xs text-muted-foreground truncate max-w-[140px] hidden lg:table-cell">{pay.tx_hash}</td>
                    <td className="admin-td">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditId(pay.id); setEditData({ registration_id: pay.registration_id, amount: String(pay.amount), currency: pay.currency, method: pay.method, status: pay.status, tx_hash: pay.tx_hash, payment_date: pay.payment_date }) }}
                          className="icon-btn text-muted-foreground hover:text-foreground hover:bg-secondary">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(pay.id)} disabled={loading}
                          className="icon-btn text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No payments recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
