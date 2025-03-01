'use client'

import { useState } from "react"
import { ShoppingCart } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { formatter } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductInfoProps {
  data: Product
}

export function ProductInfo({ data }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)

  const onAddToCart = () => {
    // Implementar lógica del carrito
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: Product) => item.id === data.id)

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity
      localStorage.setItem('cart', JSON.stringify(cart))
    } else {
      cart.push({ ...data, quantity })
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          {formatter.format(data.price)}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Stock:</h3>
          <div>{data.stock}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Category:</h3>
          <div>{data.category?.name}</div>
        </div>
        <div className="mt-4 flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Quantity:</h3>
          <div className="flex items-center gap-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <div className="text-lg">{quantity}</div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(Math.min(data.stock, quantity + 1))}
            >
              +
            </Button>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-x-3">
          <Button 
            onClick={onAddToCart}
            className="flex items-center gap-x-2"
          >
            Add To Cart
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}