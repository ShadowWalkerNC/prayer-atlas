// Region detail page
// Shows missionaries, ministries, and prayer requests for a given region
import { createClient } from '@/lib/supabase/server'
import RequestCard from '@/components/cards/RequestCard'
import MissionaryCard from '@/components/cards/MissionaryCard'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export default async function RegionPage({ params }: Props) {
  const supabase = createClient()

  const { data: region } = await supabase
    .from('regions')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!region) return notFound()

  const { data: requests } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('region_id', region.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const { data: missionaries } = await supabase
    .from('missionaries')
    .select('*')
    .eq('region_id', region.id)
    .eq('status', 'active')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-atlas-navy mb-2">{region.name}</h1>
      <p className="text-atlas-muted mb-8">{region.type}</p>

      {missionaries && missionaries.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Missionaries & Ministries</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {missionaries.map((m: any) => (
              <MissionaryCard key={m.id} missionary={m} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Prayer Requests</h2>
        {requests && requests.length > 0 ? (
          <div className="flex flex-col gap-4">
            {requests.map((r: any) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <p className="text-atlas-muted">No active prayer requests for this region yet.</p>
        )}
      </section>
    </div>
  )
}
