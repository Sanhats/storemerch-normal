'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Expand, ShoppingCart } from 'lucide-react'

import { Button } from "@/components/ui/button"
import type { Product } from "@/types"

interface ProductCardProps {
  data: Product
}

export function ProductCard({ data }: ProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/products/${data.id}`)
  }

  return (
    <div className="group cursor-pointer space-y-4">
      <div className="aspect-square rounded-lg bg-gray-100 relative">
        <Image 
          src={data.images?.[0]?.url || ''} 
          alt="" 
          fill
          className="aspect-square object-cover rounded-lg"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <Button
              onClick={handleClick}
              variant="secondary"
              size="icon"
            >
              <Expand size={20} className="text-gray-600" />
            </Button>
            <Button
              onClick={() => {}}
              variant="secondary"
              size="icon"
            >
              <ShoppingCart size={20} className="text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-semibold">
          ${data.price}
        </div>
      </div>
    </div>
  )
}