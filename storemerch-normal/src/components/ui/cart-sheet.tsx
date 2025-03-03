"use client"

import { ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/components/cart-item"
import { formatPrice } from "@/lib/utils"

export function CartSheet() {
  const cart = useCart()

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity
  }, 0)

  const formattedTotalPrice = formatPrice(totalPrice)

  const handleWhatsAppCheckout = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    if (!phoneNumber) return

    const items = cart.items
      .map((item) => {
        return `• ${item.name} (${item.selectedColorName}) x${item.quantity} - ${formatPrice(Number(item.price) * item.quantity)}`
      })
      .join("\n")

    const message = `🛍️ *Nuevo Pedido*\n\n*Productos:*\n${items}\n\n*Total:* ${formattedTotalPrice}`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Cart">
          <ShoppingCart className="h-4 w-4" />
          {cart.items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-black text-xs text-white flex items-center justify-center">
              {cart.items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col pr-0">
        <SheetHeader className="px-6">
          <SheetTitle>Cart ({cart.items.length})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cart.items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-y-4 py-4">
                {cart.items.map((item) => (
                  <CartItem key={`${item.id}-${item.selectedColor}`} data={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="px-6 py-4">
              <Separator />
              <div className="flex items-center justify-between py-4">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">{formattedTotalPrice}</span>
              </div>
              <Button className="w-full" onClick={handleWhatsAppCheckout}>
                Checkout via WhatsApp
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 px-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No items in cart</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

