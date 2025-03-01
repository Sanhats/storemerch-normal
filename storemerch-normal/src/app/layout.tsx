import { Toaster } from "sonner"
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Store',
  description: 'Your store description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}