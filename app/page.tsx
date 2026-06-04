import { HeroHeader } from "@/components/hero-header"
import { AboutTournament } from "@/components/about-tournament"
import { ButterflyBackground } from "@/components/butterfly-background"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative">
      <ButterflyBackground />
      <div className="relative z-10">
        <HeroHeader />
        <AboutTournament />

        {/* CTA to leaderboard */}
        <section className="px-4 pb-20 text-center perspective-1000">
          <div className="mx-auto max-w-md border border-rose-500/10 bg-[#05070a]/80 backdrop-blur-md p-8 val-cut cyber-panel-3d transform-style-3d">
            <h3 className="mb-2 text-xl font-black text-white uppercase tracking-wider">
              Ready to compete?
            </h3>
            <p className="mb-6 text-sm text-slate-400 font-bold">
              {"Head to the live leaderboard to register your player and track rankings in real time."}
            </p>
            <Link
              href="/leaderboard"
              className="val-btn val-cut inline-block px-8 py-3.5 text-sm font-black"
            >
              Open Leaderboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
