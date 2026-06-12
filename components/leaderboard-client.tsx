"use client"

import { useState, useEffect, useCallback } from "react"
import { PlayerForm } from "@/components/player-form"
import { LeaderboardTable } from "@/components/leaderboard-table"
import type { Player } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

function sortByScore(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score)
}

export function LeaderboardClient() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch from Supabase on mount
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("players")
      .select("*")
      .order("score", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPlayers(data as Player[])
        setIsLoaded(true)
      })
  }, [])

  const handleAddPlayer = useCallback(async (playerData: Omit<Player, "id">) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("players")
      .insert({ name: playerData.name, score: playerData.score, mohalla: playerData.mohalla, timestamp: Date.now() })
      .select()
      .single()

    if (!error && data) {
      setPlayers((prev) => sortByScore([...prev, data as Player]))
    }
  }, [])

  const handleRemovePlayer = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("players").delete().eq("id", id)
    if (!error) {
      setPlayers((prev) => prev.filter((p) => p.id !== id))
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading leaderboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-12 md:gap-12">
      <PlayerForm onAddPlayer={handleAddPlayer} />
      <LeaderboardTable players={players} onRemovePlayer={handleRemovePlayer} />
    </div>
  )
}
