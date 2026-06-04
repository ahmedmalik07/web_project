import { useState, useEffect } from 'react'

interface Tournament {
  id: number
  match_number: number
  team_a: string
  team_b: string
  venue: string
  date: string
  time: string
  status: string
  is_final?: boolean
}

interface UseTournamentsDataReturn {
  tournaments: Tournament[]
  loading: boolean
  error: string | null
}

export function useTournamentsData(): UseTournamentsDataReturn {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    
    fetch(`${apiUrl}/tournaments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments data from API')
        }
        return response.json()
      })
      .then((data) => {
        setTournaments(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[v0] Error fetching tournaments from API:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { tournaments, loading, error }
}
