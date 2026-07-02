import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prayer Atlas',
  description: 'Discover missionaries, ministries, and prayer needs around the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-atlas-sand text-atlas-navy min-h-screen">
        {children}
      </body>
    </html>
  )
}
