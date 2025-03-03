"use client"

import { useState, useEffect } from "react"
import { Gallery } from "@/components/gallery"
import { ProductInfo } from "@/components/product-info"
import type { Product } from "@/types"

interface ProductColorDisplayProps {
  product: Product
}

export function ProductColorDisplay({ product }: ProductColorDisplayProps) {
  const [selectedColorHex, setSelectedColorHex] = useState<string>("")

  // Inicializar con el primer color disponible
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const firstColor = product.images[0].color.hex
      console.log("Setting initial color:", firstColor)
      setSelectedColorHex(firstColor)
    }
  }, [product])

  const handleColorChange = (colorHex: string) => {
    console.log("Color changed to:", colorHex)
    setSelectedColorHex(colorHex)
  }

  return (
    <>
      <Gallery images={product.images} selectedColor={selectedColorHex} />
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <ProductInfo data={product} selectedColorHex={selectedColorHex} onColorChange={handleColorChange} />
      </div>
    </>
  )
}

