'use client'

import Link from "next/link"
import { ShoppingCart, User } from 'lucide-react'
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const routes = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/categories',
    label: 'Categories',
  },
  {
    href: '/product',
    label: 'Products',
  }
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="font-bold">
          STORE
        </Link>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-black ${
                pathname === route.href
                  ? "text-black"
                  : "text-neutral-500"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}