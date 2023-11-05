import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
     <h1>Welcome to the jungle.</h1>
    <p>This page is under construction.</p>
    <Link href="/lingolink">LingoLink</Link>
    <Link href="mailto:fatihhtoker@gmailcom">fatihhtoker@gmail.com</Link>
    </main>
  )
}
