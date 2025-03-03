"use client"

import Image from "next/image"
import { Tab } from "@headlessui/react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import type { ProductImage } from "@/types"

export interface GalleryProps {
  images: ProductImage[]
  selectedColor?: string
}

export function Gallery({ images = [], selectedColor }: GalleryProps) {
  const [filteredImages, setFilteredImages] = useState<ProductImage[]>(images)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (selectedColor) {
      const filtered = images.filter((image) => image.color.hex === selectedColor)
      setFilteredImages(filtered.length > 0 ? filtered : [images[0]])
      setSelectedIndex(0) // Reset tab index when color changes
    } else {
      setFilteredImages(images)
    }
  }, [selectedColor, images])

  return (
    <Tab.Group as="div" className="flex flex-col-reverse" selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Tab
              key={image.id}
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white group"
            >
              {({ selected }) => (
                <div className="relative w-full h-full">
                  <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={image.url || "/placeholder.svg"}
                      alt=""
                      className="object-cover object-center"
                    />
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 rounded-md ring-2 ring-offset-2",
                      selected ? "ring-black" : "ring-transparent",
                    )}
                  />
                  {/* Color indicator */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 px-2 py-1 rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: image.color.hex }}
                      />
                      {image.color.name}
                    </div>
                  </div>
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {filteredImages.map((image, index) => (
          <Tab.Panel key={image.id}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden group">
              <Image
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={image.url || "/placeholder.svg"}
                alt="Product image"
                className="object-cover object-center"
              />
              {/* Color indicator for main image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 px-3 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: image.color.hex }}
                  />
                  {image.color.name}
                </div>
              </div>
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}

