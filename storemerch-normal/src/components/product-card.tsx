'use client'

import Image from "next/image"
import Link from "next/link"
import { Expand, ShoppingCart } from 'lucide-react'

import { Button } from "@/components/ui/button"
import type { Product, Category } from "@/types"

interface ProductCardProps {
  data: Product
}

export function ProductCard({ data }: ProductCardProps) {
  if (!data || !data.id) {
    return null
  }

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    // TODO: Implementar funcionalidad del carrito
  }

  // Verificamos si category es un objeto o un string
  const categoryName = typeof data.category === 'object' && data.category 
    ? data.category.name 
    : typeof data.category === 'string' 
      ? data.category 
      : 'Uncategorized'

  // Formateamos el precio correctamente
  const formattedPrice = typeof data.price === 'number'
    ? data.price.toFixed(2)
    : data.price

  return (
    <Link 
      href={`/products/${data.id}`} 
      className="group block space-y-4 bg-white rounded-lg overflow-hidden"
    >
      <div className="aspect-square relative bg-gray-100">
        <Image 
          src={data.images?.[0]?.url || '/placeholder.svg'} 
          alt={data.name}
          fill
          className="object-cover transition group-hover:scale-105"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <Button
              onClick={(e) => e.preventDefault()}
              variant="secondary"
              size="icon"
            >
              <Expand size={20} className="text-gray-600" />
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              size="icon"
            >
              <ShoppingCart size={20} className="text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500">{categoryName}</p>
      </div>
      <div className="px-4 pb-4">
        <div className="font-semibold">
          ${formattedPrice}
        </div>
      </div>
    </Link>
  )
}