'use client'

import Image from "next/image"
import { X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { formatter } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  data: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function CartItem({ 
  data,
  onRemove,
  onUpdateQuantity
}: CartItemProps) {
  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images[0]?.url || "/placeholder.svg"}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <Button onClick={onRemove} variant="ghost" size="icon">
            <X size={15} />
          </Button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">
              {data.name}
            </p>
          </div>
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.category?.name}</p>
          </div>
          <div className="mt-1 flex items-center gap-x-2">
            <p className="text-gray-500">Quantity:</p>
            <Button
              size="icon"
              variant="outline"
              onClick={() => onUpdateQuantity(Math.max(1, data.quantity - 1))}
            >
              -
            </Button>
            <span className="text-lg">{data.quantity}</span>
            <Button
              size="icon"
              variant="outline"
              onClick={() => onUpdateQuantity(Math.min(data.stock, data.quantity + 1))}
            >
              +
            </Button>
          </div>
          <div className="mt-1 flex items-center">
            <p className="font-semibold text-black">
              {formatter.format(data.price * data.quantity)}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}