'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

import { CartItem } from "@/components/cart-item"
import { CartSummary } from "@/components/cart-sumary"
import type { CartItem as CartItemType } from "@/types"

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        // Obtener items del carrito desde localStorage
        const storedItems = localStorage.getItem('cart')
        const items = storedItems ? JSON.parse(storedItems) as CartItemType[] : []
        setCartItems(items)
      } catch (error: any) {
        console.error('Error loading cart:', error)
        toast.error('Error loading cart items')
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [router, supabase])

  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[600px]">Loading...</div>
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
          <div className="lg:col-span-7">
            {cartItems.length === 0 && (
              <p className="text-neutral-500">No items added to cart.</p>
            )}
            <ul>
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  data={item}
                  onRemove={() => removeFromCart(item.id)}
                  onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                />
              ))}
            </ul>
          </div>
          <CartSummary items={cartItems} />
        </div>
      </div>
    </div>
  )
}