"use client"

import { ShoppingCart, MessageCircle } from 'lucide-react'
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
        <Button 
          variant="outline" 
          size="icon" 
          className="relative bg-gradient-to-r from-blue-700 to-sky-400 text-white hover:from-blue-800 hover:to-sky-500" 
          aria-label="Cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {cart.items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {cart.items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col pr-0 border-l-blue-700">
        <SheetHeader className="px-6 bg-gradient-to-r from-blue-700 to-sky-400 text-white py-2 rounded-b-lg">
          <SheetTitle className="text-white">Carrito ({cart.items.length})</SheetTitle>
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
              
              {/* Información de pago */}
              <div className="mb-4 p-4 border rounded-lg bg-blue-50">
                <h3 className="font-bold text-blue-800 mb-2">Opciones de pago:</h3>
                
                <div className="mb-3">
                  <p className="font-semibold text-blue-700">-Para pagar por transferencia</p>
                  <p className="font-medium">Alias: <span className="select-all">CEEN2025</span></p>
                  <p className="text-sm text-blue-700 italic mt-1">¡Envíanos el comprobante por WhatsApp!</p>
                </div>
                
                <div className="mb-3">
                  <p className="font-semibold text-blue-700">-Si querés pagar con efectivo, comunicate con nosotros para realizar la compra.</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2" 
                onClick={handleWhatsAppCheckout}
              >
                Terminar compra por WhatsApp
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 px-6">
            <ShoppingCart className="h-12 w-12 text-blue-400" />
            <p className="mt-4 text-blue-700">No hay productos en el carrito</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}