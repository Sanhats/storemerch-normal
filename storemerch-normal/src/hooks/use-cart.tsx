"use client"

import { create } from "zustand"
import { toast } from "react-hot-toast"
import { persist, createJSONStorage } from "zustand/middleware"

import type { Product } from "@/types"

interface CartStore {
  items: CartItem[]
  addItem: (data: CartItem) => void
  removeItem: (id: string) => void
  removeAll: () => void
}

export interface CartItem extends Product {
  selectedColor?: string
  selectedColorName?: string
  quantity: number
  imageUrl?: string
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem) => {
        const currentItems = get().items
        const existingItemIndex = currentItems.findIndex(
          (item) => item.id === data.id && item.selectedColor === data.selectedColor,
        )

        if (existingItemIndex !== -1) {
          const updatedItems = [...currentItems]
          updatedItems[existingItemIndex].quantity += data.quantity

          set({ items: updatedItems })
          toast.success("Item quantity updated in cart")
        } else {
          set({ items: [...get().items, data] })
          toast.success("Item added to cart")
        }
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] })
        toast.success("Item removed from cart")
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export { useCart }

