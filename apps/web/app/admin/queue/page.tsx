// Admin moderation queue
// Requires admin role — protected via Supabase RLS or middleware
import { createClient } from '@/lib/supabase/server'

export default async function AdminQueuePage() {
  const supabase = createClient()

  const { data: queue } = await supabase
    .from('moderation_queue')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-atlas-navy mb-6">Moderation Queue</h1>
      {queue && queue.length > 0 ? (
        <div className="flex flex-col gap-4">
          {queue.map((item: any) => (
            <div key={item.id} className="border rounded p-4 bg-white">
              <p className="text-sm text-atlas-muted">{item.content_type} — {item.submitted_at}</p>
              <p className="font-medium">{item.content_id}</p>
              {/* TODO: Approve / Reject actions */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-atlas-muted">Queue is empty. No pending submissions.</p>
      )}
    </div>
  )
}
