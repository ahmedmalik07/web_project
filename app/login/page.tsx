"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!password.trim()) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-2xl">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-primary"><circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" /><path d="M8 10C12 14 12 18 8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M24 10C20 14 20 18 24 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Welcome Back!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Logged in successfully. Chalo, time to dominate the gully!"}
          </p>
          <Link
            href="/leaderboard"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Leaderboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Welcome back to Gully XI Premier League"}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="loginEmail" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="loginEmail"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              placeholder="ahmed@example.com"
              className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Password with emoji toggle */}
          <div>
            <label htmlFor="loginPassword" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "\u{1F441}" : "\u{1F441}\u200D\u{1F5E8}"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Login
          </button>
        </form>

        {/* Link to sign up */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
