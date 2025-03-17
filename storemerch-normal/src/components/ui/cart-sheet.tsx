"use client"

import { useState } from "react"
import { ShoppingCart, MessageCircle, AlertCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/components/cart-item"
import { formatPrice } from "@/lib/utils"

export function CartSheet() {
  const cart = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity
  }, 0)

  const formattedTotalPrice = formatPrice(totalPrice)

  const handleWhatsAppCheckout = () => {
    try {
      setIsProcessing(true)
      setErrorMessage(null)
      setSuccessMessage(null)
      
      // Obtener el número de WhatsApp de las variables de entorno
      const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      
      // Si no hay número configurado, mostrar un error
      if (!phoneNumber) {
        setErrorMessage("No se ha configurado un número de WhatsApp para realizar la compra. Por favor, contacta al administrador.")
        return
      }

      // Formatear los items del carrito para el mensaje
      const items = cart.items
        .map((item) => {
          return `• ${item.name} (${item.selectedColorName || 'Color estándar'}) x${item.quantity} - ${formatPrice(Number(item.price) * item.quantity)}`
        })
        .join("\n")

      // Crear el mensaje completo
      const message = `🛍️ *Nuevo Pedido*\n\n*Productos:*\n${items}\n\n*Total:* ${formattedTotalPrice}`

      // Crear la URL de WhatsApp
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      
      // Abrir WhatsApp en una nueva pestaña
      window.open(whatsappUrl, "_blank")
      
      // Opcional: limpiar el carrito después de enviar el pedido
      // cart.removeAll()
      
      setSuccessMessage("¡Pedido enviado! Te redirigimos a WhatsApp para finalizar tu compra.")
    } catch (error) {
      console.error("Error al procesar la compra:", error)
      setErrorMessage("Ocurrió un error al procesar tu compra. Por favor, inténtalo de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Verificar si el número de WhatsApp está configurado
  const isWhatsAppConfigured = !!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

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
              
              {/* Mensajes de error y éxito */}
              {errorMessage && (
                <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="mb-4 p-3 border border-green-200 rounded-lg bg-green-50 flex items-start gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              )}
              
              {!isWhatsAppConfigured && (
                <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    No se ha configurado un número de WhatsApp. Por favor, agrega la variable de entorno NEXT_PUBLIC_WHATSAPP_NUMBER.
                  </p>
                </div>
              )}
              
              <Button 
                className="w-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2" 
                onClick={handleWhatsAppCheckout}
                disabled={isProcessing || !isWhatsAppConfigured || cart.items.length === 0}
              >
                {isProcessing ? (
                  <>Procesando...</>
                ) : (
                  <>
                    Terminar compra por WhatsApp
                    <MessageCircle className="h-5 w-5" />
                  </>
                )}
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