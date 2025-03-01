import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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
        <div className="rounded-lg relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover">
          <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
            <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
              Featured Products
              <hr className="my-4" />
              <div className="text-base sm:text-xl">
                Check out our featured collection
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