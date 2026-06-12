"use client"

import { useState } from "react"
import { Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Player } from "@/lib/types"

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, "id">) => void
}

interface FormErrors {
  name?: string
  score?: string
  mohalla?: string
}

const MOHALLAS = [
  "Saddar", "Defence", "Gulberg", "Johar Town", "Model Town",
  "Clifton", "Nazimabad", "F-6 Islamabad", "G-9 Islamabad",
  "Hayatabad", "Walled City", "Anarkali", "Bahria Town", "Cantt Area", "Other",
]

function validate(name: string, score: string, mohalla: string): FormErrors {
  const errors: FormErrors = {}
  if (!name.trim()) {
    errors.name = "Player name is required"
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters"
  } else if (name.trim().length > 40) {
    errors.name = "Name must be under 40 characters"
  }

  if (!score.trim()) {
    errors.score = "Runs scored is required"
  } else {
    const n = parseInt(score, 10)
    if (isNaN(n)) {
      errors.score = "Must be a valid number"
    } else if (n < 0) {
      errors.score = "Score cannot be negative"
    } else if (n > 10000) {
      errors.score = "Score cannot exceed 10,000"
    }
  }

  if (!mohalla) {
    errors.mohalla = "Please select a mohalla"
  }

  return errors
}

export function PlayerForm({ onAddPlayer }: PlayerFormProps) {
  const [name, setName] = useState("")
  const [score, setScore] = useState("")
  const [mohalla, setMohalla] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const currentErrors = validate(name, score, mohalla)
  const hasErrors = Object.keys(currentErrors).length > 0

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function getFieldError(field: keyof FormErrors) {
    return touched[field] ? currentErrors[field] : undefined
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Touch all fields to show all errors
    setTouched({ name: true, score: true, mohalla: true })
    const errs = validate(name, score, mohalla)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      onAddPlayer({ name: name.trim(), score: parseInt(score, 10), mohalla, timestamp: Date.now() })
      setName("")
      setScore("")
      setMohalla("")
      setErrors({})
      setTouched({})
      setIsSubmitting(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    }, 300)
  }

  function inputClass(field: keyof FormErrors) {
    const err = getFieldError(field)
    const ok = touched[field] && !currentErrors[field]
    return [
      "h-11 w-full rounded-lg border px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-colors",
      err ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20"
          : ok ? "border-green-500 bg-green-500/5 focus:border-green-500 focus:ring-green-500/20"
               : "border-border bg-input focus:border-primary focus:ring-ring/20",
    ].join(" ")
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-card-foreground">Register Player</h2>
            <p className="text-sm text-muted-foreground">Add a new tapeball champion to the leaderboard</p>
          </div>
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Player added to the leaderboard!
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="player-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Player Name <span className="text-destructive">*</span>
              </label>
              <input
                id="player-name"
                type="text"
                placeholder="e.g. Ahmed Sixer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => touch("name")}
                className={inputClass("name")}
              />
              {getFieldError("name") && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {getFieldError("name")}
                </p>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="player-score" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Runs Scored <span className="text-destructive">*</span>
              </label>
              <input
                id="player-score"
                type="number"
                placeholder="e.g. 156"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                onBlur={() => touch("score")}
                min="0"
                max="10000"
                className={inputClass("score")}
              />
              {getFieldError("score") && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {getFieldError("score")}
                </p>
              )}
            </div>

            {/* Mohalla */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="player-mohalla" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mohalla <span className="text-destructive">*</span>
              </label>
              <select
                id="player-mohalla"
                value={mohalla}
                onChange={(e) => setMohalla(e.target.value)}
                onBlur={() => touch("mohalla")}
                className={inputClass("mohalla")}
              >
                <option value="" disabled>Select mohalla...</option>
                {MOHALLAS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {getFieldError("mohalla") && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {getFieldError("mohalla")}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Adding...
              </span>
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
