"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/contact", label: "Contact" },
]

function CricketBallIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M8 10C12 14 12 18 8 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 10C20 14 20 18 24 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-rose-500/10 bg-[#05070a]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5),0_1px_0_rgba(239,68,68,0.1)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <CricketBallIcon className="text-primary animate-pulse" />
          <span className="text-xl font-black uppercase tracking-tighter text-white">
            GULLY XI
          </span>
          <span className="hidden text-[10px] font-black tracking-[0.25em] text-primary sm:inline border-l border-slate-800 pl-2">
            PREMIER LEAGUE
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-slate-400 hover:bg-secondary hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth buttons + theme toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="val-btn val-cut-sm px-6 py-2 text-xs font-black transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-secondary hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-slate-900 bg-[#05070a] text-white">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-8">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 px-2">
                <CricketBallIcon className="text-primary" />
                <span className="font-black tracking-tighter text-lg text-white">GULLY XI</span>
              </div>

              {/* Mobile links */}
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-slate-400 hover:bg-secondary hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile theme toggle + auth buttons */}
              <div className="flex flex-col gap-2 border-t border-slate-900 pt-4">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-slate-400 transition-colors hover:bg-secondary hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="val-btn val-cut-sm py-2.5 text-center text-xs font-black transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
