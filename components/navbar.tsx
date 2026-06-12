"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButtons } from "@/components/auth-buttons"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/contact", label: "Contact" },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:shadow-md group-hover:shadow-primary/25 transition-shadow">
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" />
          <path d="M8 10C12 14 12 18 8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 10C20 14 20 18 24 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-black tracking-tight text-foreground">GULLY XI</span>
        <span className="hidden text-[9px] font-semibold tracking-[0.18em] text-muted-foreground sm:block">PREMIER LEAGUE</span>
      </div>
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <AuthButtons />
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-border bg-background">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-6">
              <Logo />

              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <ThemeToggle />
                <AuthButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
