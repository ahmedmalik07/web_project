'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, X, Zap } from 'lucide-react'

interface Player {
  name: string
  nickname: string
  game: string
  rank: string
  score: number
  mohalla: string
  batting_style: string
  image: string
}

interface PlayersFilterProps {
  players: Player[]
  loading: boolean
  error: string | null
}

const rankOrder = {
  Champion: 1,
  Elite: 2,
  Ace: 3,
  Pro: 4,
  Rising: 5,
}

export function PlayersFilter({ players, loading, error }: PlayersFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState<string>('All')
  const [selectedRank, setSelectedRank] = useState<string>('All')
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

  const uniqueGames = useMemo(() => {
    const games = new Set(players.map(p => p.game))
    return ['All', ...Array.from(games).sort()]
  }, [players])

  const uniqueRanks = useMemo(() => {
    const ranks = new Set(players.map(p => p.rank))
    return ['All', ...Array.from(ranks).sort((a, b) => 
      (rankOrder[a as keyof typeof rankOrder] || 999) - (rankOrder[b as keyof typeof rankOrder] || 999)
    )]
  }, [players])

  const filteredPlayers = useMemo(() => {
    return players
      .filter(player => {
        const matchesSearch = 
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.mohalla.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesGame = selectedGame === 'All' || player.game === selectedGame
        const matchesRank = selectedRank === 'All' || player.rank === selectedRank

        return matchesSearch && matchesGame && matchesRank
      })
      .sort((a, b) => {
        const rankDiff = (rankOrder[a.rank as keyof typeof rankOrder] || 999) - 
                        (rankOrder[b.rank as keyof typeof rankOrder] || 999)
        if (rankDiff !== 0) return rankDiff
        return b.score - a.score
      })
  }, [players, searchQuery, selectedGame, selectedRank])

  const toggleFlip = (playerName: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(playerName)) {
        newSet.delete(playerName)
      } else {
        newSet.add(playerName)
      }
      return newSet
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGame('All')
    setSelectedRank('All')
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
        <p className="text-sm text-destructive">Failed to load players: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, nickname, or mohalla..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Game Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">
              Game Type
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {uniqueGames.map(game => (
                <option key={game} value={game}>
                  {game}
                </option>
              ))}
            </select>
          </div>

          {/* Rank Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">
              Rank Level
            </label>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {uniqueRanks.map(rank => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold uppercase text-foreground transition-colors hover:bg-secondary/80"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-xs text-muted-foreground">
          Showing {filteredPlayers.length} of {players.length} players
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Loading player roster...</p>
          </div>
        </div>
      )}

      {/* Players Grid */}
      {!loading && filteredPlayers.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player, index) => {
            const isFlipped = flippedCards.has(player.name)
            const isChampion = player.rank === 'Champion'

            return (
              <div
                key={player.name}
                onClick={() => toggleFlip(player.name)}
                className="cursor-pointer perspective h-80"
              >
                <div
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.6s',
                  }}
                  className="relative w-full h-full"
                >
                  {/* Front of Card */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                    className={`absolute w-full h-full group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${
                      isChampion
                        ? 'border-accent/50 bg-gradient-to-br from-accent/10 to-accent/5'
                        : 'border-border bg-card hover:scale-105'
                    }`}
                  >
                    {/* Diamond Badge for Champion */}
                    {isChampion && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 bg-accent rotate-45 rounded-sm shadow-lg" />
                          <div className="absolute inset-1 bg-gradient-to-br from-accent to-accent/80 rotate-45 rounded-sm flex items-center justify-center">
                            <div className="rotate-45 text-xs font-bold text-accent-foreground">★</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center p-6 pt-8 h-full">
                      {/* Player Image */}
                      <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-border transition-transform duration-300 group-hover:ring-primary/50">
                        <Image
                          src={player.image}
                          alt={player.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Player Info */}
                      <h3 className="text-center text-base font-bold text-foreground">
                        {player.nickname}
                      </h3>
                      <p className="text-center text-xs text-muted-foreground">
                        ({player.name})
                      </p>

                      {/* Mohalla */}
                      <p className="mt-1 text-xs font-medium text-primary">
                        {player.mohalla}
                      </p>

                      {/* Score Badge */}
                      <div className="mt-4 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                        <span className="text-xs text-muted-foreground">Score:</span>
                        <span className="text-sm font-bold text-foreground">{player.score}</span>
                      </div>

                      {/* Rank Badge */}
                      <div className="mt-2 rounded-full bg-primary/10 px-2 py-1">
                        <p className="text-xs font-semibold text-primary">
                          {player.rank}
                        </p>
                      </div>

                      {/* Flip Hint */}
                      <p className="mt-auto text-xs text-muted-foreground/50">Click to flip</p>
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute w-full h-full rounded-xl border border-border bg-gradient-to-br from-primary/20 to-accent/20 p-6 flex flex-col justify-center"
                  >
                    <div className="text-center space-y-3">
                      <h4 className="text-sm font-bold text-foreground">{player.nickname}</h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Game</p>
                          <p className="font-semibold text-foreground">{player.game}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Batting Style</p>
                          <p className="font-semibold text-foreground">{player.batting_style}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Runs</p>
                          <p className="font-bold text-primary text-lg">{player.score}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* No Results State */}
      {!loading && filteredPlayers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
          <Zap className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">No players found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
