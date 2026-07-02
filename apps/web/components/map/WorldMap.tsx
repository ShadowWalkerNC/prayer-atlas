'use client'
// Interactive world map using Leaflet + OpenStreetMap
// Client-side only — must be dynamically imported with ssr: false
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useRouter } from 'next/navigation'
import 'leaflet/dist/leaflet.css'

export default function WorldMap() {
  const router = useRouter()

  function onRegionClick(feature: any) {
    const slug = feature?.properties?.slug
    if (slug) router.push(`/region/${slug}`)
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      className="w-full h-full"
      style={{ background: '#a8c8e8' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* TODO: Load GeoJSON region boundaries from Supabase or static file */}
      {/* <GeoJSON data={regionData} onEachFeature={(f, l) => l.on('click', () => onRegionClick(f))} /> */}
    </MapContainer>
  )
}
