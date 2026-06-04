'use client'

import { TournamentRegistration } from "@/components/tournament-registration"
import { PlayersFilter } from "@/components/players-filter"
import { usePlayersData } from "@/lib/use-players-data"

export default function PlayersPage() {
  const { players, loading, error } = usePlayersData()

  return (
    <div>
      {/* Tournament Registration Section */}
      <TournamentRegistration />

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Players Search & Filter Section */}
      <div className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Page header */}
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Season Roster
            </span>
            <h1 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-5xl">
              Star Players
            </h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              {"Search, filter, and discover Pakistan's finest tapeball cricketers. Click cards to flip for more info."}
            </p>
          </div>

          {/* Players Filter Component */}
          <PlayersFilter players={players} loading={loading} error={error} />
        </div>
      </div>
    </div>
  )
}
