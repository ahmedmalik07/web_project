import { useState, useEffect } from 'react'

interface Team {
  id: number
  name: string
  city: string
  captain: string
  players: string[]
  wins: number
  losses: number
  points: number
}

interface UseTeamsDataReturn {
  teams: Team[]
  loading: boolean
  error: string | null
}

export function useTeamsData(): UseTeamsDataReturn {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    
    fetch(`${apiUrl}/teams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch teams data from API')
        }
        return response.json()
      })
      .then((data) => {
        setTeams(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[v0] Error fetching teams from API:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { teams, loading, error }
}
