"use client"

import { useState, useEffect, useCallback } from "react"
import { PlayerForm } from "@/components/player-form"
import { LeaderboardTable } from "@/components/leaderboard-table"
import type { Player } from "@/lib/types"

const STORAGE_KEY = "gully-xi-players"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function loadPlayers(): Player[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: Player[] = JSON.parse(stored)
    // Validate the data structure
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p) =>
        p &&
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        typeof p.score === "number" &&
        typeof p.mohalla === "string"
    )
  } catch {
    return []
  }
}

function savePlayers(players: Player[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
  } catch {
    console.error("Failed to save to localStorage")
  }
}

function sortPlayersByScore(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score)
}

export function LeaderboardClient() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadPlayers()
    setPlayers(sortPlayersByScore(loaded))
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever players change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      savePlayers(players)
    }
  }, [players, isLoaded])

  const handleAddPlayer = useCallback(
    (playerData: Omit<Player, "id">) => {
      const newPlayer: Player = {
        ...playerData,
        id: generateId(),
      }
      setPlayers((prev) => sortPlayersByScore([...prev, newPlayer]))
    },
    []
  )

  const handleRemovePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">
            Loading leaderboard...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-12 md:gap-12">
      <PlayerForm onAddPlayer={handleAddPlayer} />
      <LeaderboardTable
        players={players}
        onRemovePlayer={handleRemovePlayer}
      />
    </div>
  )
}
