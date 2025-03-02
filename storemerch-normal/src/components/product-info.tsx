'use client'

import { useState } from "react"
import { ShoppingCart } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Currency } from "@/components/ui/currency"
import { Product } from "@/types"

interface ProductInfoProps {
  data: Product
}

export function ProductInfo({ data }: ProductInfoProps) {
  const [selectedImage, setSelectedImage] = useState(data.images[0])

  const onAddToCart = () => {
    // TODO: Implementar la funcionalidad del carrito
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-2xl text-gray-900">
          <Currency value={data.price} />
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Category:</h3>
          <div>{data?.category?.name}</div>
        </div>
        {data.images.length > 1 && (
          <div className="flex flex-col gap-y-4">
            <h3 className="font-semibold text-black">Colors:</h3>
            <div className="flex gap-x-4">
              {data.images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`
                    h-9 w-9 rounded-full border-2 cursor-pointer
                    ${selectedImage?.id === image.id ? 'border-black' : 'border-neutral-300'}
                  `}
                >
                  <div
                    className="h-full w-full rounded-full border border-neutral-200"
                    style={{ backgroundColor: image.color.hex }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 flex items-center gap-x-3">
          <Button onClick={onAddToCart} className="flex items-center gap-x-2">
            Add To Cart
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}