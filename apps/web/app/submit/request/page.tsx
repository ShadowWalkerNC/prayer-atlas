'use client'
// Prayer request submission form
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SubmitRequestPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: '',
    urgency: 'normal',
    region_id: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('prayer_requests').insert({
      ...form,
      status: 'pending',
      visibility: 'public',
    })
    setLoading(false)
    if (!error) router.push('/')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-atlas-navy mb-6">Submit a Prayer Request</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="border rounded px-3 py-2 text-sm min-h-[120px]"
          placeholder="Describe the prayer need..."
          value={form.body}
          onChange={e => setForm({ ...form, body: e.target.value })}
          required
        />
        <select
          className="border rounded px-3 py-2 text-sm"
          value={form.urgency}
          onChange={e => setForm({ ...form, urgency: e.target.value })}
        >
          <option value="low">Low urgency</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-atlas-blue text-white rounded px-4 py-2 text-sm font-medium hover:bg-atlas-navy transition"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}
