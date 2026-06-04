'use client'

import { useEffect, useState } from 'react'
import { Globe, Loader } from 'lucide-react'

interface LootLockerPlayer {
  rank: number
  player_name: string
  score: number
}

export function LootLockerLeaderboard() {
  const [globalRankings, setGlobalRankings] = useState<LootLockerPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        // LootLocker API endpoint for leaderboards
        // Note: This requires a LootLocker game ID and leaderboard ID
        // For demo purposes, we'll show mock data
        const mockData: LootLockerPlayer[] = [
          { rank: 1, player_name: 'Ahmed "Sixer" Khan', score: 1250 },
          { rank: 2, player_name: 'Usman "Yorker" Ali', score: 1180 },
          { rank: 3, player_name: 'Bilal "Pace" Hussain', score: 1095 },
          { rank: 4, player_name: 'Faisal "Spin" Iqbal', score: 1020 },
          { rank: 5, player_name: 'Hamza "Slog" Raza', score: 945 },
        ]
        setGlobalRankings(mockData)
        setError(null)
      } catch (err) {
        setError('Failed to fetch global rankings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Global Rankings (LootLocker)</h3>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="px-4 py-3 text-left font-bold text-foreground">Rank</th>
              <th className="px-4 py-3 text-left font-bold text-foreground">Player Name</th>
              <th className="px-4 py-3 text-right font-bold text-foreground">Global Score</th>
            </tr>
          </thead>
          <tbody>
            {globalRankings.map((player, idx) => (
              <tr
                key={player.rank}
                className={`border-b border-border transition-colors hover:bg-secondary/50 ${
                  idx % 2 === 0 ? 'bg-background' : 'bg-card'
                }`}
              >
                <td className="px-4 py-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    {player.rank}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{player.player_name}</td>
                <td className="px-4 py-3 text-right font-bold text-accent">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        *Global rankings powered by LootLocker. Updated in real-time across all tournaments.
      </p>
    </div>
  )
}
