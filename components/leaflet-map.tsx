'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMap, Marker } from 'leaflet'

interface Venue {
  name: string
  city: string
  lat: number
  lng: number
  matches: number
  description: string
}

interface LeafletMapProps {
  venues: Venue[]
  selectedVenue: Venue | null
  onSelectVenue: (venue: Venue) => void
}

export default function LeafletMapComponent({ venues, selectedVenue, onSelectVenue }: LeafletMapProps) {
  const mapRef = useRef<LeafletMap | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamically import Leaflet to avoid SSR
    import('leaflet').then((L) => {
      // Fix default icon path issue with webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Init map centred on Pakistan
      const map = L.map(containerRef.current!, {
        center: [30.3753, 69.3451],
        zoom: 5,
        scrollWheelZoom: false,
        attributionControl: true,
      })

      // OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom red marker icon for Gully XI
      const redIcon = L.divIcon({
        className: '',
        html: `<div style="
          width: 28px; height: 28px;
          background: #ef4444;
          border: 2px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(239,68,68,0.5);
          cursor: pointer;
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
      })

      // Add markers for all venues
      venues.forEach((venue) => {
        const marker = L.marker([venue.lat, venue.lng], { icon: redIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; min-width: 160px;">
              <strong style="font-size: 13px; color: #111;">${venue.name}</strong>
              <p style="margin: 4px 0 2px; font-size: 11px; color: #666;">${venue.city}</p>
              <p style="margin: 0; font-size: 11px; color: #ef4444; font-weight: 600;">${venue.matches} match${venue.matches > 1 ? 'es' : ''}</p>
            </div>
          `, { maxWidth: 200 })

        marker.on('click', () => {
          onSelectVenue(venue)
        })

        markersRef.current.set(venue.name, marker)
      })

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current.clear()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to selected venue when it changes
  useEffect(() => {
    if (!mapRef.current || !selectedVenue) return

    mapRef.current.flyTo([selectedVenue.lat, selectedVenue.lng], 11, {
      duration: 1.2,
      easeLinearity: 0.25,
    })

    const marker = markersRef.current.get(selectedVenue.name)
    if (marker) {
      marker.openPopup()
    }
  }, [selectedVenue])

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div
        ref={containerRef}
        style={{ height: '420px', width: '100%', zIndex: 0 }}
      />
    </>
  )
}
