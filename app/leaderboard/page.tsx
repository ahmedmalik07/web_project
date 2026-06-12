import type { Metadata } from "next"
import { LeaderboardClient } from "@/components/leaderboard-client"
import { LootLockerLeaderboard } from "@/components/lootlocker-leaderboard"

import { ThreeViewerClient } from "@/components/three-viewer-client"

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Live leaderboard for Gully XI Premier League. Add players, track scores, and see who rules the gully.",
}

export default function LeaderboardPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Page header */}
        <div className="grid gap-8 md:grid-cols-12 items-center mb-10 pb-8 border-b border-border">
          <div className="md:col-span-8 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Live Rankings
            </span>
            <h1 className="mt-4 text-balance text-3xl font-black text-foreground md:text-5xl">
              Tournament Standings
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl">
              Track player scores, batting styles, and rank upgrades in real time. Full CRUD operations persisted directly to Supabase PostgreSQL — no Express server needed.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center">
            <div className="w-32 h-32 relative rounded-2xl border border-border bg-card p-1 shadow-md neon-border-glow">
              <ThreeViewerClient type="ball" />
            </div>
          </div>
        </div>

        {/* Local Leaderboard */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Local Tournament Rankings</h2>
          <LeaderboardClient />
        </div>

        {/* Global Leaderboard via LootLocker */}
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Global Rankings (LootLocker Integration)</h2>
          <LootLockerLeaderboard />
        </div>
      </div>
    </div>
  )
}
