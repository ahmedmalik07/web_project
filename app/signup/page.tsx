"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

interface FormFields {
  firstName: string
  lastName: string
  age: string
  email: string
  password: string
  confirmPassword: string
}

type FieldErrors = Partial<Record<keyof FormFields, string>>

const initialFields: FormFields = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  password: "",
  confirmPassword: "",
}

// Password strength criteria
function getPasswordStrength(password: string) {
  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  score = Object.values(checks).filter(Boolean).length

  const levels: Record<number, { label: string; color: string; width: string }> = {
    0: { label: "", color: "bg-muted", width: "w-0" },
    1: { label: "Weak", color: "bg-red-500", width: "w-1/5" },
    2: { label: "Fair", color: "bg-orange-500", width: "w-2/5" },
    3: { label: "Good", color: "bg-yellow-500", width: "w-3/5" },
    4: { label: "Strong", color: "bg-primary", width: "w-4/5" },
    5: { label: "Very Strong", color: "bg-primary", width: "w-full" },
  }

  return { score, checks, ...(levels[score] || levels[0]) }
}

export default function SignUpPage() {
  const [fields, setFields] = useState<FormFields>(initialFields)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const strength = getPasswordStrength(fields.password)

  function handleChange(field: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validate(): boolean {
    const newErrors: FieldErrors = {}

    if (!fields.firstName.trim()) newErrors.firstName = "First name is required"
    if (!fields.lastName.trim()) newErrors.lastName = "Last name is required"

    if (!fields.age.trim()) {
      newErrors.age = "Age is required"
    } else if (isNaN(Number(fields.age)) || Number(fields.age) < 10 || Number(fields.age) > 60) {
      newErrors.age = "Age must be between 10 and 60"
    }

    if (!fields.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!fields.password) {
      newErrors.password = "Password is required"
    } else if (strength.score < 3) {
      newErrors.password = "Password must meet at least 3 criteria below"
    }

    if (!fields.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (fields.password !== fields.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
          <h2 className="text-2xl font-bold text-foreground">Welcome to Gully XI!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Account created successfully, " + fields.firstName + ". Ab khel shuru!"}
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
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Join Pakistan's biggest gully cricket community"}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* First Name + Last Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={fields.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Ahmed"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Last Name <span className="text-destructive">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={fields.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Khan"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Age <span className="text-destructive">*</span>
            </label>
            <input
              id="age"
              type="number"
              required
              min={10}
              max={60}
              value={fields.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder="e.g. 22"
              className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age}</p>}
          </div>

          {/* Email with validation indicator */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={fields.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="ahmed@example.com"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {fields.email.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">
                  {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) ? (
                    <span className="text-primary" aria-label="Valid email">&#10003;</span>
                  ) : (
                    <span className="text-destructive" aria-label="Invalid email">&#10007;</span>
                  )}
                </span>
              )}
            </div>
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Password with strength bar */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={fields.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Min 8 chars, uppercase, number, special"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "\u{1F441}" : "\u{1F441}\u200D\u{1F5E8}"}
              </button>
            </div>

            {/* Password strength bar */}
            {fields.password.length > 0 && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{strength.label}</span>
                  <span className="text-xs text-muted-foreground">{strength.score}/5</span>
                </div>
                {/* Criteria checklist */}
                <ul className="mt-2 space-y-0.5">
                  {[
                    { key: "length", label: "At least 8 characters" },
                    { key: "uppercase", label: "One uppercase letter" },
                    { key: "lowercase", label: "One lowercase letter" },
                    { key: "number", label: "One number" },
                    { key: "special", label: "One special character" },
                  ].map((item) => (
                    <li key={item.key} className="flex items-center gap-1.5 text-xs">
                      <span className={strength.checks[item.key as keyof typeof strength.checks] ? "text-primary" : "text-muted-foreground/50"}>
                        {strength.checks[item.key as keyof typeof strength.checks] ? "\u2713" : "\u2022"}
                      </span>
                      <span className={strength.checks[item.key as keyof typeof strength.checks] ? "text-foreground" : "text-muted-foreground/60"}>
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Confirm Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                value={fields.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground hover:text-foreground"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "\u{1F441}" : "\u{1F441}\u200D\u{1F5E8}"}
              </button>
            </div>
            {fields.confirmPassword.length > 0 && fields.password !== fields.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
            )}
            {fields.confirmPassword.length > 0 && fields.password === fields.confirmPassword && fields.password.length > 0 && (
              <p className="mt-1 text-xs text-primary">Passwords match</p>
            )}
            {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Account
          </button>
        </form>

        {/* Link to login */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"Already have an account? "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
