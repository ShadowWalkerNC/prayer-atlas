import Link from 'next/link'
import Image from 'next/image'

interface Missionary {
  id: string
  display_name: string
  bio?: string
  avatar_url?: string
  category?: string
}

export default function MissionaryCard({ missionary }: { missionary: Missionary }) {
  return (
    <Link href={`/missionary/${missionary.id}`}>
      <div className="border rounded-lg p-4 bg-white flex gap-3 hover:shadow-md transition cursor-pointer">
        {missionary.avatar_url ? (
          <Image
            src={missionary.avatar_url}
            alt={missionary.display_name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-atlas-sky flex items-center justify-center text-white font-bold text-lg">
            {missionary.display_name[0]}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-atlas-navy">{missionary.display_name}</h3>
          {missionary.category && (
            <p className="text-xs text-atlas-muted">{missionary.category}</p>
          )}
          {missionary.bio && (
            <p className="text-sm text-atlas-muted mt-1 line-clamp-2">{missionary.bio}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
