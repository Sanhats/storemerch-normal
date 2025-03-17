"use client"

import Image from "next/image"
import { X } from "lucide-react"

import type { CartItem } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface CartItemProps {
  data: CartItem
}

export function CartItem({ data }: CartItemProps) {
  const cart = useCart()

  const onRemove = () => {
    cart.removeItem(data.id)
  }

  return (
    <div className="flex items-start gap-4">
      <div className="relative aspect-square h-20 w-20 min-w-[80px] overflow-hidden rounded-lg">
        <Image fill src={data.imageUrl || data.images[0].url} alt={data.name} className="object-cover object-center" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold">{data.name}</h4>
            <p className="text-xs text-muted-foreground">Color: {data.selectedColorName}</p>
            <p className="text-xs text-muted-foreground">Cantidad: {data.quantity}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm font-medium">{formatPrice(Number(data.price) * data.quantity)}</span>
      </div>
    </div>
  )
}

