// Home page — renders the interactive world map
// Map component is client-side only (Leaflet requires browser)
import dynamic from 'next/dynamic'
import NavBar from '@/components/layout/NavBar'

const WorldMap = dynamic(() => import('@/components/map/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-atlas-muted">
      Loading map...
    </div>
  ),
})

export default function HomePage() {
  return (
    <main className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 relative">
        <WorldMap />
      </div>
    </main>
  )
}
