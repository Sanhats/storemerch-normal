"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Heart, Check, AlertCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Currency } from "@/components/ui/currency"
import type { Product, Color } from "@/types"
import { useCart } from "@/hooks/use-cart"

interface ProductInfoProps {
  data: Product
  selectedColorHex: string
  onColorChange: (colorHex: string) => void
}

export function ProductInfo({ data, selectedColorHex, onColorChange }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const cart = useCart()

  // Obtener colores únicos del producto con manejo seguro de tipos
  const uniqueColors = Array.from(new Set(data.images.map((image) => image.color.hex)))
    .map((hex, index) => {
      const image = data.images.find((img) => img.color.hex === hex)
      // Asegurarse de que el color tenga un id, o usar el índice como fallback
      return {
        ...image?.color,
        id: image?.color?.id || `color-${index}`,
        hex,
        name: image?.color?.name || `Color ${index + 1}`
      }
    })

  console.log("Unique colors:", uniqueColors) // Para depuración
  console.log("Selected color:", selectedColorHex) // Para depuración

  const selectedImage = data.images.find((image) => image.color.hex === selectedColorHex)

  // Reset animation state
  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isAdded])

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
    
    setIsAdded(true)
  }

  // Verificamos si category es un objeto o un string
  const categoryName = typeof data.category === 'object' && data.category 
    ? data.category.name 
    : typeof data.category === 'string' 
      ? data.category 
      : 'Uncategorized'

  return (
    <div className="space-y-6 bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{data.name}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-2xl md:text-3xl font-semibold text-primary">
            <Currency value={data.price} />
          </div>
          
        </div>
      </div>
      
      <hr className="border-t border-gray-200" />
      
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-x-4">
          <h3 className="font-medium text-gray-700 min-w-24">Categoria:</h3>
          <div className="text-gray-600 bg-gray-100 px-3 py-1 rounded-md">{categoryName}</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-x-2">
            <h3 className="font-medium text-gray-700">Colors:</h3>
            <span className="text-sm text-muted-foreground">({uniqueColors.length} available)</span>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {uniqueColors.map((color) => (
              <div key={color.id} className="flex flex-col items-center gap-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Clicking color:", color.hex) // Para depuración
                    onColorChange(color.hex)
                  }}
                  className={`
                    group relative h-14 w-14 rounded-full border-2 cursor-pointer transition-all duration-200
                    ${
                      selectedColorHex === color.hex
                        ? "border-primary ring-2 ring-primary/30 ring-offset-2 scale-110"
                        : "border-neutral-300 hover:border-neutral-400 hover:scale-105"
                    }
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                  `}
                  aria-label={`Select color: ${color.name}`}
                >
                  <div
                    className="h-full w-full rounded-full border border-neutral-200 overflow-hidden"
                    style={{ backgroundColor: color.hex }}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Indicador de selección */}
                  {selectedColorHex === color.hex && (
                    <div className="absolute -right-1 -top-1 bg-primary text-white rounded-full p-0.5 shadow-md">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded shadow-md whitespace-nowrap">
                      {color.name}
                    </div>
                  </div>
                </button>
                {selectedColorHex === color.hex && (
                  <span className="text-xs font-medium text-primary animate-fadeIn">
                    {color.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-x-4">
          <h3 className="font-medium text-gray-700 min-w-24">Cantidad:</h3>
          <div className="flex items-center gap-x-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200 w-fit">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="h-9 w-9 rounded-md transition-all hover:bg-primary hover:text-white disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              -
            </Button>
            <span className="w-10 text-center font-medium text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((prev) => Math.min(data.stock, prev + 1))}
              disabled={quantity >= data.stock}
              className="h-9 w-9 rounded-md transition-all hover:bg-primary hover:text-white disabled:opacity-50"
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
          
          {/* Mostrar stock disponible */}
          <div className="text-sm text-muted-foreground">
            {data.stock > 0 && `(${data.stock} available)`}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onAddToCart}
            className={`flex-1 sm:flex-none sm:min-w-40 flex items-center justify-center gap-x-2 py-6 px-8 text-base font-medium transition-all
              ${isAdded ? 'bg-green-600 hover:bg-green-700' : ''}
              active:scale-95 disabled:active:scale-100`}
            disabled={!selectedColorHex || data.stock === 0}
            aria-label="Add to cart"
          >
            {isAdded ? (
              <>
                <Check className="h-5 w-5 mr-1 animate-bounce" />
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-1" />
                Añadir al carrito
              </>
            )}
          </Button>
          
          
        </div>
        
        {!selectedColorHex && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center animate-pulse">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>Por favor elige un color antes de añadir al carrito</p>
          </div>
        )}
        
        {data.stock === 0 && (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>Sin stock.</p>
          </div>
        )}
      </div>
    </div>
  )
}