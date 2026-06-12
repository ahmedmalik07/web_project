import { HeroHeader } from "@/components/hero-header"
import { AboutTournament } from "@/components/about-tournament"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative">
      <HeroHeader />
      <AboutTournament />

      {/* CTA to leaderboard */}
      <section className="px-4 pb-20 text-center relative z-10">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 shadow-sm">
          <h3 className="mb-2 text-xl font-bold text-foreground">
            Ready to compete?
          </h3>
          <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
            Head to the live leaderboard to register your player and track rankings in real time.
          </p>
          <Link
            href="/leaderboard"
            className="val-btn inline-flex items-center gap-2 px-8 py-3 text-sm"
          >
            Open Leaderboard
          </Link>
        </div>
      </section>
    </div>
  )
}
