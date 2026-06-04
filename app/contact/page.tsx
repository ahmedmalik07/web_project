"use client"

import { useState, type FormEvent } from "react"
import { MapPin, Phone, Mail } from "lucide-react"
import { VenueMap } from "@/components/venue-map"
import { ThreeViewerClient } from "@/components/three-viewer-client"

interface FormData {
  name: string
  email: string
  subject: string
  phone: string
  message: string
}

const subjects = [
  "General Inquiry",
  "Tournament Registration",
  "Sponsorship",
  "Complaint",
]

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: subjects[0],
    phone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.name.trim()) newErrors.name = "Full name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!formData.message.trim()) newErrors.message = "Message is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Message Sent!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {"We'll get back to you within 24 hours. Shukriya for reaching out!"}
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({ name: "", email: "", subject: subjects[0], phone: "", message: "" })
            }}
            className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            Get In Touch
          </span>
          <h1 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            {"Have a question about the tournament? Want to register your mohalla's team? Drop us a message."}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 lg:col-span-3"
          >
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Ahmed Khan"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="ahmed@example.com"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Subject
              </label>
              <select
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Phone <span className="text-xs text-muted-foreground/60">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+92 3XX XXXXXXX"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Tell us what's on your mind..."
                className="w-full resize-none rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info Sidebar */}
          <aside className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-foreground">Tournament Office</h3>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Gaddafi Stadium Road, Gulberg III, Lahore, Pakistan
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Phone</p>
                <p className="text-xs text-muted-foreground">+92 42 1234 5678</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-xs text-slate-400">info@gullyxi.pk</p>
              </div>
            </div>

            {/* Native 3D GLB Model Showcase */}
            <div className="w-full aspect-square rounded-2xl border border-slate-800 bg-slate-950 p-2 relative overflow-hidden neon-border-glow">
              <ThreeViewerClient type="glb" glbUrl="/avocado.glb" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900 text-[8px] font-black text-slate-400 rounded border border-slate-800 z-20">
                INTERACTIVE GLB LOADED
              </div>
            </div>

            <div className="mt-auto rounded-lg bg-slate-950/60 p-4 border border-slate-850">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {"Office hours: Mon-Fri, 10 AM - 6 PM (PKT). Closed on national holidays and match days!"}
              </p>
            </div>
          </aside>
        </div>

        {/* Venue Map Section */}
        <div className="mt-16">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Find Us
            </span>
            <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
              Tournament Venues Across Pakistan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Click on any marker to see venue details. All 9 venues hosting Gully XI matches.
            </p>
          </div>
          <VenueMap />
        </div>
      </div>
    </div>
  )
}
