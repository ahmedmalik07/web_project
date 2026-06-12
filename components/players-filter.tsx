'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, X, Zap, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

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

const rankOrder: Record<string, number> = {
  Champion: 1, Elite: 2, Ace: 3, Pro: 4, Rising: 5,
}

const rankColors: Record<string, string> = {
  Champion: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400',
  Elite:    'bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-400',
  Ace:      'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400',
  Pro:      'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  Rising:   'bg-primary/10 text-primary border-primary/25',
}

type SortKey = 'rank' | 'score_desc' | 'score_asc' | 'name'

export function PlayersFilter({ players, loading, error }: PlayersFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState<string>('All')
  const [selectedRank, setSelectedRank] = useState<string>('All')
  const [selectedStyle, setSelectedStyle] = useState<string>('All')
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const uniqueGames = useMemo(() => ['All', ...Array.from(new Set(players.map(p => p.game))).sort()], [players])
  const uniqueRanks = useMemo(() => ['All', ...Array.from(new Set(players.map(p => p.rank))).sort((a, b) =>
    (rankOrder[a] || 99) - (rankOrder[b] || 99)
  )], [players])
  const uniqueStyles = useMemo(() => ['All', ...Array.from(new Set(players.map(p => p.batting_style))).sort()], [players])

  const filteredPlayers = useMemo(() => {
    return players
      .filter(p => {
        const q = searchQuery.toLowerCase()
        const matchesSearch = !q ||
          p.name.toLowerCase().includes(q) ||
          p.nickname.toLowerCase().includes(q) ||
          p.mohalla.toLowerCase().includes(q)
        return matchesSearch &&
          (selectedGame === 'All' || p.game === selectedGame) &&
          (selectedRank === 'All' || p.rank === selectedRank) &&
          (selectedStyle === 'All' || p.batting_style === selectedStyle)
      })
      .sort((a, b) => {
        switch (sortKey) {
          case 'rank':    return (rankOrder[a.rank] || 99) - (rankOrder[b.rank] || 99) || b.score - a.score
          case 'score_desc': return b.score - a.score
          case 'score_asc':  return a.score - b.score
          case 'name':    return a.name.localeCompare(b.name)
          default:        return 0
        }
      })
  }, [players, searchQuery, selectedGame, selectedRank, selectedStyle, sortKey])

  const toggleFlip = (name: string) => {
    setFlippedCards(prev => {
      const s = new Set(prev)
      s.has(name) ? s.delete(name) : s.add(name)
      return s
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGame('All')
    setSelectedRank('All')
    setSelectedStyle('All')
    setSortKey('rank')
  }

  const activeFilters = [selectedGame, selectedRank, selectedStyle].filter(v => v !== 'All').length

  if (error) return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="text-sm font-medium text-destructive">Failed to load players: {error}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Search + Filter Toggle Row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, nickname or mohalla..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
            showFilters || activeFilters > 0
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters{activeFilters > 0 ? ` (${activeFilters})` : ''}
        </button>
      </div>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card/50 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Game */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Game Type</label>
              <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                {uniqueGames.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            {/* Rank */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Rank Level</label>
              <select value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                {uniqueRanks.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            {/* Batting Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Batting Style</label>
              <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                {uniqueStyles.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {/* Sort */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Sort By</label>
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="rank">Rank (Best first)</option>
                <option value="score_desc">Score (High → Low)</option>
                <option value="score_asc">Score (Low → High)</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredPlayers.length}</span> of {players.length} players
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowUpDown className="h-3 w-3" />
          {sortKey === 'rank' ? 'By rank' : sortKey === 'score_desc' ? 'Score ↓' : sortKey === 'score_asc' ? 'Score ↑' : 'A–Z'}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading player roster...</p>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && filteredPlayers.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => {
            const isFlipped = flippedCards.has(player.name)
            const isChampion = player.rank === 'Champion'
            const rankColor = rankColors[player.rank] || rankColors.Rising

            return (
              <div key={player.name} onClick={() => toggleFlip(player.name)} className="cursor-pointer h-80" style={{ perspective: '1000px' }}>
                <div style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.55s cubic-bezier(0.4,0.2,0.2,1)' }}
                  className="relative w-full h-full">

                  {/* FRONT */}
                  <div style={{ backfaceVisibility: 'hidden' }}
                    className={`absolute inset-0 overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      isChampion ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/8 via-card to-amber-500/5 shadow-amber-500/10 shadow-lg' : 'border-border bg-card hover:border-primary/30'
                    }`}>
                    {/* Champion glow top bar */}
                    {isChampion && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />}

                    <div className="flex flex-col items-center p-6 pt-7 h-full">
                      {/* Avatar */}
                      <div className={`relative mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 transition-all ${isChampion ? 'ring-amber-400/60' : 'ring-border hover:ring-primary/40'}`}>
                        <Image src={player.image} alt={player.name} fill className="object-cover" sizes="80px" />
                        {isChampion && (
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-500/20" />
                        )}
                      </div>

                      <p className="text-center text-base font-black text-foreground">{player.nickname}</p>
                      <p className="text-center text-xs text-muted-foreground">({player.name})</p>
                      <p className="mt-1 text-xs font-semibold text-primary">{player.mohalla}</p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${rankColor}`}>
                          {player.rank}
                        </span>
                        <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                          {player.score} runs
                        </span>
                      </div>

                      <p className="mt-auto text-[10px] text-muted-foreground/50 uppercase tracking-widest">Tap to flip</p>
                    </div>
                  </div>

                  {/* BACK */}
                  <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    className="absolute inset-0 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 flex flex-col justify-center">
                    <div className="text-center space-y-4">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-xl font-black text-primary">#{rankOrder[player.rank] || '?'}</span>
                      </div>
                      <h4 className="text-sm font-black text-foreground">{player.nickname}</h4>
                      <div className="grid grid-cols-2 gap-3 text-left">
                        {[
                          ['Game', player.game],
                          ['Style', player.batting_style],
                          ['Mohalla', player.mohalla],
                          ['Score', String(player.score)],
                        ].map(([label, val]) => (
                          <div key={label} className="rounded-lg bg-background/50 p-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                            <p className="text-xs font-semibold text-foreground mt-0.5">{val}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">Tap to flip back</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredPlayers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
          <Zap className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No players found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  )
}
