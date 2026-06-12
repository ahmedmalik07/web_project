"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface FormFields {
  firstName: string
  lastName: string
  age: string
  email: string
  password: string
  confirmPassword: string
}

type FieldErrors = Partial<Record<keyof FormFields | "general", string>>

const initialFields: FormFields = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  password: "",
  confirmPassword: "",
}

function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length
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
  const router = useRouter()
  const [fields, setFields] = useState<FormFields>(initialFields)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const strength = getPasswordStrength(fields.password)

  function handleChange(field: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: fields.email,
        password: fields.password,
        options: {
          data: {
            first_name: fields.firstName,
            last_name: fields.lastName,
            age: parseInt(fields.age),
          },
        },
      })

      if (error) {
        setErrors({ general: error.message })
        return
      }

      setEmailSent(true)
    } catch {
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-2xl">
            ✉️
          </div>
          <h2 className="text-2xl font-bold text-foreground">Check your email!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{fields.email}</strong>. Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Join Pakistan's biggest gully cricket community"}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <input id="firstName" type="text" required value={fields.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)} placeholder="Ahmed"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Last Name <span className="text-destructive">*</span>
              </label>
              <input id="lastName" type="text" required value={fields.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Khan"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Age <span className="text-destructive">*</span>
            </label>
            <input id="age" type="number" required min={10} max={60} value={fields.age}
              onChange={(e) => handleChange("age", e.target.value)} placeholder="e.g. 22"
              className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input id="email" type="email" required value={fields.email}
                onChange={(e) => handleChange("email", e.target.value)} placeholder="ahmed@example.com"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              {fields.email.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">
                  {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
                    ? <span className="text-primary">✓</span>
                    : <span className="text-destructive">✗</span>}
                </span>
              )}
            </div>
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} required value={fields.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Min 8 chars, uppercase, number, special"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground hover:text-foreground">
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {fields.password.length > 0 && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>{strength.label}</span><span>{strength.score}/5</span>
                </div>
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
                        {strength.checks[item.key as keyof typeof strength.checks] ? "✓" : "•"}
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
              <input id="confirmPassword" type={showConfirm ? "text" : "password"} required
                value={fields.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground hover:text-foreground">
                {showConfirm ? "🙈" : "👁"}
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

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Creating account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"Already have an account? "}
          <Link href="/login" className="font-medium text-primary hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}
