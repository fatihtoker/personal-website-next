import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LingoLink | Fatih Toker',
  description: 'Homepage of Lingolink',
}

export default function LingoLink() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
     <h1>Welcome to LingoLink app page.</h1>
    <p>This page is under construction.</p>
    <Link href="/lingolink/privacy-policy">Privacy Policy</Link>
    </main>
  )
}
