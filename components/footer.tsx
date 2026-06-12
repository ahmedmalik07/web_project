import Link from "next/link"
import { Github, Twitter, Instagram } from "lucide-react"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/contact", label: "Contact" },
]

const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="text-primary">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
                <path d="M8 10C12 14 12 18 8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 10C20 14 20 18 24 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-black uppercase tracking-tight text-foreground">Gully XI</span>
              <span className="text-[10px] font-bold text-primary border-l border-border pl-2 tracking-widest">PL</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
              {"Pakistan's premier tapeball cricket league — from your mohalla to the nation."}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-foreground">Navigation</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-foreground">Tournament Info</h3>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li>Season 2026 — Active</li>
              <li>9 venues across Pakistan</li>
              <li>PKR 500,000 prize pool</li>
              <li>150+ mohallas competing</li>
              <li className="flex items-center gap-1.5 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live leaderboard updates
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">
            © 2026 Gully XI Premier League. Built with Next.js + Supabase.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/50">
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
