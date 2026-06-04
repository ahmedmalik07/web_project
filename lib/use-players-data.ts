import { useState, useEffect } from 'react'

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

interface UsePlayersDataReturn {
  players: Player[]
  loading: boolean
  error: string | null
}

export function usePlayersData(): UsePlayersDataReturn {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch players data from API server using Fetch API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    
    fetch(`${apiUrl}/players`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch players data from API')
        }
        return response.json()
      })
      .then((data) => {
        setPlayers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[v0] Error fetching players from API:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { players, loading, error }
}
