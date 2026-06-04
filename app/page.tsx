import { HeroHeader } from "@/components/hero-header"
import { AboutTournament } from "@/components/about-tournament"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative">
      <HeroHeader />
      <AboutTournament />

      {/* CTA to leaderboard */}
      <section className="px-4 pb-20 text-center perspective-1000 relative z-10">
        <div className="mx-auto max-w-md val-cut border border-rose-500/20 bg-slate-950/70 p-8 esports-bracket shadow-2xl">
          <h3 className="mb-2 text-xl font-black text-white uppercase tracking-wider">
            Ready to compete?
          </h3>
          <p className="mb-6 text-sm text-slate-450 font-bold uppercase tracking-wide">
            {"Head to the live leaderboard to register your player and track rankings in real time."}
          </p>
          <Link
            href="/leaderboard"
            className="val-btn val-cut-sm inline-block px-8 py-3.5 text-xs font-black"
          >
            Open Leaderboard
          </Link>
        </div>
      </section>
    </div>
  )
}
