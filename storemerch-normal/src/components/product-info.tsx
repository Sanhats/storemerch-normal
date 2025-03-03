"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Currency } from "@/components/ui/currency"
import type { Product } from "@/types"
import { useCart } from "@/hooks/use-cart"

interface ProductInfoProps {
  data: Product
  selectedColorHex: string
  onColorChange: (colorHex: string) => void
}

export function ProductInfo({ data, selectedColorHex, onColorChange }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const cart = useCart()

  // Obtener colores únicos del producto
  const uniqueColors = Array.from(new Set(data.images.map((image) => image.color.hex)))
    .map((hex) => {
      const image = data.images.find((img) => img.color.hex === hex)
      return image?.color
    })
    .filter((color): color is NonNullable<typeof color> => color !== undefined)

  console.log("Unique colors:", uniqueColors) // Para depuración
  console.log("Selected color:", selectedColorHex) // Para depuración

  const selectedImage = data.images.find((image) => image.color.hex === selectedColorHex)

  const onAddToCart = () => {
    if (!selectedColorHex || !selectedImage) {
      console.log("Cannot add to cart:", { selectedColorHex, selectedImage }) // Para depuración
      return
    }

    cart.addItem({
      ...data,
      quantity,
      selectedColor: selectedColorHex,
      selectedColorName: selectedImage.color.name,
      imageUrl: selectedImage.url,
    })
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

        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <h3 className="font-semibold text-black">Colors:</h3>
            <span className="text-sm text-muted-foreground">({uniqueColors.length} available)</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color) => (
              <div key={color.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Clicking color:", color.hex) // Para depuración
                    onColorChange(color.hex)
                  }}
                  className={`
                    group relative h-10 w-10 rounded-full border-2 cursor-pointer
                    ${
                      selectedColorHex === color.hex
                        ? "border-black ring-2 ring-black ring-offset-1"
                        : "border-neutral-300 hover:border-neutral-400"
                    }
                  `}
                >
                  <div
                    className="h-full w-full rounded-full border border-neutral-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs px-2 py-1 rounded">{color.name}</div>
                  </div>
                </button>
                {selectedColorHex === color.hex && <span className="text-xs mt-1 font-medium">{color.name}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Quantity:</h3>
          <div className="flex items-center gap-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((prev) => Math.min(data.stock, prev + 1))}
              disabled={quantity >= data.stock}
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Available:</h3>
          <div>{data.stock} in stock</div>
        </div>

        <div className="mt-4 flex items-center gap-x-3">
          <Button
            onClick={onAddToCart}
            className="flex items-center gap-x-2"
            disabled={!selectedColorHex || data.stock === 0}
          >
            Add To Cart
            <ShoppingCart size={20} />
          </Button>
        </div>

        {!selectedColorHex && <p className="text-sm text-red-500">Please select a color before adding to cart</p>}
      </div>
    </div>
  )
}

