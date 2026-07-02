import Link from 'next/link'

interface Request {
  id: string
  title: string
  body: string
  category?: string
  urgency: string
  status: string
  created_at: string
}

export default function RequestCard({ request }: { request: Request }) {
  const urgencyColor: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700',
    normal: 'bg-blue-100 text-atlas-blue',
    low:    'bg-gray-100 text-gray-500',
  }

  return (
    <Link href={`/request/${request.id}`}>
      <div className="border rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyColor[request.urgency] ?? ''}`}>
            {request.urgency}
          </span>
          {request.category && (
            <span className="text-xs text-atlas-muted">{request.category}</span>
          )}
        </div>
        <h3 className="font-semibold text-atlas-navy mt-1">{request.title}</h3>
        <p className="text-sm text-atlas-muted mt-1 line-clamp-2">{request.body}</p>
        <p className="text-xs text-atlas-muted mt-2">{new Date(request.created_at).toLocaleDateString()}</p>
      </div>
    </Link>
  )
}
