"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut, ShieldCheck } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export function AuthButtons() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from("profiles").select("role").eq("id", user.id).single()
          .then(({ data }) => setIsAdmin(data?.role === "admin"))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from("profiles").select("role").eq("id", session.user.id).single()
          .then(({ data }) => setIsAdmin(data?.role === "admin"))
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (!mounted) return <div className="h-9 w-32" />

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/14 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="val-btn inline-flex items-center px-4 py-2 text-sm"
      >
        Sign Up
      </Link>
    </div>
  )
}
