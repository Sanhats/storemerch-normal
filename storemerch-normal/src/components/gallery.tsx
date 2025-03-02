'use client'

import Image from "next/image"
import { Tab } from "@headlessui/react"

import { cn } from "@/lib/utils"
import { ProductImage } from "@/types"

export interface GalleryProps {
  images: ProductImage[];
}

export function Gallery({ images = [] }: GalleryProps) {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <Tab
              key={image.id}
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white"
            >
              {({ selected }) => (
                <div>
                  <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
                    <Image
                      fill
                      src={image.url || "/placeholder.svg"}
                      alt=""
                      className="object-cover object-center"
                    />
                  </span>
                  <span
                    className={cn(
                      'absolute inset-0 rounded-md ring-2 ring-offset-2',
                      selected ? 'ring-black' : 'ring-transparent',
                    )}
                  />
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <Image
                fill
                src={image.url || "/placeholder.svg"}
                alt="Product image"
                className="object-cover object-center"
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}