"use client"

import { useState } from "react"
import { ShoppingCart, MessageCircle, AlertCircle, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
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
        setErrorMessage(
          "No se ha configurado un número de WhatsApp para realizar la compra. Por favor, contacta al administrador.",
        )
        return
      }

      // Formatear los items del carrito para el mensaje
      const items = cart.items
        .map((item) => {
          return `• ${item.name} (${item.selectedColorName || "Color estándar"}) x${item.quantity} - ${formatPrice(Number(item.price) * item.quantity)}`
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
      <SheetContent className="flex flex-col p-0 border-l-blue-700 w-full sm:max-w-md overflow-hidden">
        <SheetHeader className="px-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-b-none flex flex-row justify-between items-center">
          <SheetTitle className="text-white text-xl font-bold">Carrito ({cart.items.length})</SheetTitle>
          <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center bg-blue-500 hover:bg-blue-700 transition-colors">
            <X className="h-4 w-4" />
          </SheetClose>
        </SheetHeader>

        {cart.items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="flex flex-col py-4">
                {cart.items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedColor}`}
                    className="mb-4 bg-white rounded-lg shadow-sm p-3 border border-gray-100"
                  >
                    <CartItem data={item} />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between py-3 mb-2">
                <span className="font-bold text-lg text-gray-800">Total:</span>
                <span className="font-bold text-lg text-blue-700">{formattedTotalPrice}</span>
              </div>

              {/* Información de pago */}
              <div className="mb-4 p-4 border rounded-lg bg-blue-50 shadow-sm">
                <h3 className="font-bold text-blue-800 mb-3 text-base">Opciones de pago:</h3>

                <div className="mb-3">
                  <p className="font-semibold text-blue-700 text-base">-Para pagar por transferencia</p>
                  <div className="flex items-center mt-1">
                    <p className="font-medium">
                      Alias:{" "}
                      <span className="select-all bg-white px-2 py-1 rounded border border-blue-200">CEEN2025</span>
                    </p>
                  </div>
                  <p className="text-sm text-blue-700 italic mt-2">¡Envíanos el comprobante por WhatsApp!</p>
                </div>

                <div className="mb-1">
                  <p className="font-semibold text-blue-700 text-base">
                    -Si querés pagar con efectivo, comunicate con nosotros para realizar la compra.
                  </p>
                </div>
              </div>

              {/* Mensajes de error y éxito */}
              {errorMessage && (
                <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50 flex items-start gap-2 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 border border-green-200 rounded-lg bg-green-50 flex items-start gap-2 shadow-sm">
                  <MessageCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              )}

              {!isWhatsAppConfigured && (
                <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50 flex items-start gap-2 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    No se ha configurado un número de WhatsApp. Por favor, agrega la variable de entorno
                    NEXT_PUBLIC_WHATSAPP_NUMBER.
                  </p>
                </div>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-6 text-base font-bold rounded-lg shadow-md transition-colors"
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
          <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
            <div className="bg-blue-50 rounded-full p-4 mb-4">
              <ShoppingCart className="h-12 w-12 text-blue-500" />
            </div>
            <p className="text-blue-700 text-base text-center font-medium">No hay productos en el carrito</p>
            <SheetClose asChild>
              <Button variant="outline" className="mt-4 border-blue-300 text-blue-700">
                Seguir comprando
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

