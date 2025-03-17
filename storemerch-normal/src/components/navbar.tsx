'use client'

import Link from "next/link"
import { User } from 'lucide-react'
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CartSheet } from "@/components/ui/cart-sheet"
import Image from "next/image"

const routes = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/categories',
    label: 'Categorias',
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-[#0a3b5c] shadow-md">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center">
          {/* Reemplaza "/logo.jpg" con la ruta a tu logo */}
          <Image 
            src="/assets/ceen.png" 
            alt="Logo CEEN" 
            width={50} 
            height={50} 
            className="rounded-full"
          />
          
        </Link>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-[#4a90c0] ${
                pathname === route.href
                  ? "text-[#4a90c0] font-bold"
                  : "text-white"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <CartSheet />
        </div>
      </div>
    </header>
  )
}