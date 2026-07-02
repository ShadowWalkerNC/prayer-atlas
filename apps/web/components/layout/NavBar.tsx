import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-atlas-navy text-white px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-lg font-bold tracking-wide">
        🌍 Prayer Atlas
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/explore" className="hover:text-atlas-sky transition">Explore</Link>
        <Link href="/submit/request" className="hover:text-atlas-sky transition">Submit</Link>
        <Link href="/login" className="bg-atlas-blue px-3 py-1 rounded hover:bg-atlas-sky transition">Sign In</Link>
      </div>
    </nav>
  )
}
