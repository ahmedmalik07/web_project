'use client'

import { MapPin } from 'lucide-react'
import { useState } from 'react'

interface Venue {
  name: string
  city: string
  lat: number
  lng: number
  matches: number
}

const venues: Venue[] = [
  { name: 'Gaddafi Stadium', city: 'Lahore', lat: 31.5497, lng: 74.3436, matches: 4 },
  { name: 'National Stadium', city: 'Karachi', lat: 24.8607, lng: 67.0011, matches: 3 },
  { name: 'Arbab Niaz Stadium', city: 'Peshawar', lat: 34.0064, lng: 71.5789, matches: 2 },
  { name: 'Multan Cricket Stadium', city: 'Multan', lat: 30.1575, lng: 71.4263, matches: 2 },
  { name: 'Rawalpindi Cricket Stadium', city: 'Rawalpindi', lat: 33.8047, lng: 73.2673, matches: 2 },
  { name: 'Quetta Stadium', city: 'Quetta', lat: 30.1798, lng: 67.0064, matches: 1 },
  { name: 'Faisalabad Stadium', city: 'Faisalabad', lat: 31.4181, lng: 72.3456, matches: 1 },
  { name: 'Abbottabad Cricket Ground', city: 'Abbottabad', lat: 34.1562, lng: 73.2088, matches: 1 },
  { name: 'Sahiwal Cricket Stadium', city: 'Sahiwal', lat: 30.6667, lng: 73.1333, matches: 1 },
]

export function VenueMap() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  return (
    <div className="space-y-6">
      {/* OpenStreetMap Iframe */}
      <div className="relative h-96 w-full overflow-hidden rounded-lg border border-border">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=66.5,23.5,76.5,36.5&layer=mapnik"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen={true}
          loading="lazy"
          title="Gully XI Venues Map"
        ></iframe>
        <a
          href="https://www.openstreetmap.org/#map=6/30.38/69.35"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-xs text-foreground hover:bg-background"
        >
          View larger map
        </a>
      </div>

      {/* Venues List */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">All Tournament Venues</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {venues.map((venue) => (
            <button
              key={venue.name}
              onClick={() => setSelectedVenue(venue)}
              className={`rounded-lg border p-4 text-left transition-all ${
                selectedVenue?.name === venue.name
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{venue.name}</p>
                  <p className="text-xs text-muted-foreground">{venue.city}</p>
                  <p className="mt-1 text-xs font-medium text-accent">
                    {venue.matches} {venue.matches === 1 ? 'match' : 'matches'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Venue Details */}
      {selectedVenue && (
        <div className="rounded-lg border border-accent bg-accent/5 p-4">
          <h4 className="font-semibold text-foreground">{selectedVenue.name}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{selectedVenue.city}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Coordinates: {selectedVenue.lat.toFixed(4)}, {selectedVenue.lng.toFixed(4)}
          </p>
          <a
            href={`https://www.openstreetmap.org/?mlat=${selectedVenue.lat}&mlon=${selectedVenue.lng}&zoom=13`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            View on OpenStreetMap
          </a>
        </div>
      )}
    </div>
  )
}
