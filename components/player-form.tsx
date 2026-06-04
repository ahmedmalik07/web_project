"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { Player } from "@/lib/types"

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, "id">) => void
}

const MOHALLAS = [
  "Saddar",
  "Defence",
  "Gulberg",
  "Johar Town",
  "Model Town",
  "Clifton",
  "Nazimabad",
  "F-6 Islamabad",
  "G-9 Islamabad",
  "Hayatabad",
  "Walled City",
  "Anarkali",
  "Bahria Town",
  "Cantt Area",
  "Other",
]

export function PlayerForm({ onAddPlayer }: PlayerFormProps) {
  const [name, setName] = useState("")
  const [score, setScore] = useState("")
  const [mohalla, setMohalla] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !score.trim() || !mohalla) return

    setIsSubmitting(true)

    setTimeout(() => {
      onAddPlayer({
        name: name.trim(),
        score: parseInt(score, 10),
        mohalla,
        timestamp: Date.now(),
      })
      setName("")
      setScore("")
      setMohalla("")
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4">
      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-card-foreground">
              Register Player
            </h2>
            <p className="text-sm text-muted-foreground">
              Add a new tapeball champion to the leaderboard
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="player-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Player Name
              </label>
              <input
                id="player-name"
                type="text"
                placeholder="e.g. Ahmed Sixer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-lg border border-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Score Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="player-score"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Runs Scored
              </label>
              <input
                id="player-score"
                type="number"
                placeholder="e.g. 156"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                min="0"
                max="10000"
                className="h-11 rounded-lg border border-border bg-input px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Mohalla Select */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="player-mohalla"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Mohalla
              </label>
              <select
                id="player-mohalla"
                value={mohalla}
                onChange={(e) => setMohalla(e.target.value)}
                required
                className="h-11 rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="" disabled>
                  Select mohalla...
                </option>
                {MOHALLAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !score.trim() || !mohalla}
            className="group mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Adding Player...</span>
            ) : (
              <>
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Add to Leaderboard
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
