"use client"

import { Trophy, Medal, Star, Trash2, Crown } from "lucide-react"
import type { Player } from "@/lib/types"

interface LeaderboardTableProps {
  players: Player[]
  onRemovePlayer: (id: string) => void
}

function getRankIcon(rank: number) {
  if (rank === 1)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
        <Trophy className="h-4 w-4 text-accent" />
      </div>
    )
  if (rank === 2)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <Medal className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  if (rank === 3)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <Star className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full">
      <span className="text-sm font-bold text-muted-foreground">{rank}</span>
    </div>
  )
}

export function LeaderboardTable({
  players,
  onRemovePlayer,
}: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4">
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary/50" />
          </div>
          <h3 className="text-lg font-bold text-card-foreground">
            No Players Yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {
              "Register your mohalla's tapeball champions above and watch them climb the leaderboard!"
            }
          </p>
        </div>
      </section>
    )
  }

  const topPlayer = players[0]

  return (
    <section className="mx-auto w-full max-w-4xl px-4">
      {/* Top Player Highlight */}
      {topPlayer && (
        <div className="mb-6 overflow-hidden rounded-xl border-2 border-accent/30 bg-gradient-to-r from-accent/10 via-card to-accent/10 p-6 md:p-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <Crown className="h-8 w-8 text-accent" />
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  1
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Gully Ka Champion
                </div>
                <div className="text-2xl font-bold text-card-foreground md:text-3xl">
                  {topPlayer.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {topPlayer.mohalla}
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-4xl font-bold text-accent md:text-5xl">
                {topPlayer.score.toLocaleString()}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Runs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Live Rankings</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {players.length} {players.length === 1 ? "Player" : "Players"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        {/* Table Head */}
        <div className="grid grid-cols-[60px_1fr_1fr_100px_50px] border-b border-border bg-secondary/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid-cols-[80px_1fr_1fr_120px_60px]">
          <div>Rank</div>
          <div>Player</div>
          <div>Mohalla</div>
          <div className="text-right">Runs</div>
          <div />
        </div>

        {/* Table Body */}
        <div>
          {players.map((player, index) => {
            const rank = index + 1
            const isTop = rank === 1
            const isTopThree = rank <= 3

            return (
              <div
                key={player.id}
                className={`group grid grid-cols-[60px_1fr_1fr_100px_50px] items-center border-b border-border px-4 py-3 transition-colors last:border-b-0 md:grid-cols-[80px_1fr_1fr_120px_60px] ${
                  isTop
                    ? "bg-accent/5"
                    : isTopThree
                      ? "bg-card/80"
                      : "bg-card/40 hover:bg-card/80"
                }`}
                style={{
                  animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <div>{getRankIcon(rank)}</div>
                <div
                  className={`truncate text-sm font-semibold ${isTop ? "text-accent" : "text-card-foreground"}`}
                >
                  {player.name}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {player.mohalla}
                </div>
                <div
                  className={`text-right font-mono text-sm font-bold ${isTop ? "text-accent" : "text-card-foreground"}`}
                >
                  {player.score.toLocaleString()}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label={`Remove ${player.name} from leaderboard`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
