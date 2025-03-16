import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"

import { ProductList } from "@/components/product-list"
import type { Product } from "@/types"

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 pb-10">
      <div className="p-4 sm:p-6 lg:p-8 rounded-lg overflow-hidden">
        {/* Cambiamos el fondo a los colores del logo TIENDITA */}
        <div className="rounded-lg relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-gradient-to-r from-[#457b9d] to-[#3aaae3]">
          <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
            {/* Añadimos el logo */}
            <div className="mb-4">
              <Image 
                src="/assets/tiendita.png" 
                alt="Logo Tiendita" 
                width={400} 
                height={200} 
                className="drop-shadow-xl"
              />
            </div>
            <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs text-white">
              <div className="text-base sm:text-xl mt-2">
               Encontrá aquí tu merch normalina
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
        <ProductList items={featuredProducts as Product[]} />
      </div>
    </div>
  )
}