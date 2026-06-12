'use client'

import dynamic from 'next/dynamic'
import { MapPin, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface Venue {
  name: string
  city: string
  lat: number
  lng: number
  matches: number
  description: string
}

const venues: Venue[] = [
  { name: 'Gaddafi Stadium', city: 'Lahore', lat: 31.5497, lng: 74.3436, matches: 4, description: 'Main tournament venue, capacity 27,000' },
  { name: 'National Stadium', city: 'Karachi', lat: 24.8960, lng: 67.0641, matches: 3, description: 'Southern hub, capacity 34,228' },
  { name: 'Arbab Niaz Stadium', city: 'Peshawar', lat: 34.0064, lng: 71.5789, matches: 2, description: 'Northern frontier venue, capacity 20,000' },
  { name: 'Multan Cricket Stadium', city: 'Multan', lat: 30.2520, lng: 71.5880, matches: 2, description: 'Punjab powerhouse, capacity 35,000' },
  { name: 'Rawalpindi Cricket Stadium', city: 'Rawalpindi', lat: 33.6007, lng: 73.0679, matches: 2, description: 'Twin Cities venue, capacity 15,000' },
  { name: 'Quetta Stadium', city: 'Quetta', lat: 30.1798, lng: 67.0064, matches: 1, description: 'Balochistan base, capacity 10,000' },
  { name: 'Faisalabad Cricket Stadium', city: 'Faisalabad', lat: 31.4181, lng: 73.0792, matches: 1, description: 'Industrial city ground, capacity 12,000' },
  { name: 'Abbottabad Cricket Ground', city: 'Abbottabad', lat: 34.1562, lng: 73.2088, matches: 1, description: 'Hill station arena, capacity 8,000' },
  { name: 'Sahiwal Cricket Stadium', city: 'Sahiwal', lat: 30.6667, lng: 73.1333, matches: 1, description: 'Central Punjab ground, capacity 9,000' },
]

// Lazy-load the actual Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-xl border border-border bg-secondary/30">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading interactive map...</p>
      </div>
    </div>
  ),
})

export function VenueMap() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  return (
    <div className="space-y-6">
      {/* Interactive Leaflet Map */}
      <div className="overflow-hidden rounded-xl border border-border shadow-lg">
        <LeafletMap
          venues={venues}
          selectedVenue={selectedVenue}
          onSelectVenue={setSelectedVenue}
        />
      </div>

      {/* Selected Venue Details */}
      {selectedVenue && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">{selectedVenue.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedVenue.city} — {selectedVenue.description}</p>
              <p className="mt-1 text-xs text-primary font-semibold">
                {selectedVenue.matches} {selectedVenue.matches === 1 ? 'match' : 'matches'} scheduled
              </p>
            </div>
          </div>
          <a
            href={`https://www.openstreetmap.org/?mlat=${selectedVenue.lat}&mlon=${selectedVenue.lng}&zoom=14`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Maps
          </a>
        </div>
      )}

      {/* Venues Grid */}
      <div>
        <h3 className="mb-4 text-base font-bold text-foreground">All Tournament Venues</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <button
              key={venue.name}
              onClick={() => setSelectedVenue(selectedVenue?.name === venue.name ? null : venue)}
              className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedVenue?.name === venue.name
                  ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${selectedVenue?.name === venue.name ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{venue.name}</p>
                  <p className="text-xs text-muted-foreground">{venue.city}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">
                      {venue.matches} {venue.matches === 1 ? 'match' : 'matches'}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                      {venue.lat.toFixed(2)}, {venue.lng.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
