import Link from "next/link"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            width="22"
            height="22"
            viewBox="0 0 32 32"
            fill="none"
            className="text-primary"
          >
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
            <path d="M8 10C12 14 12 18 8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 10C20 14 20 18 24 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-bold text-foreground">
            Gully XI Premier League
          </span>
        </div>

        {/* Nav Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Taglines */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {"Celebrating Pakistan's tapeball cricket culture, one gully at a time."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {"Data stored locally using JSON & localStorage"}
          </p>
        </div>
      </div>
    </footer>
  )
}
