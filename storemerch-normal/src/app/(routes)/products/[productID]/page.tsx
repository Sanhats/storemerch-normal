import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import type { Product } from "@/types"

interface ProductPageProps {
  params: {
    productId: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createServerComponentClient({ cookies })

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('id', params.productId)
    .single()

  if (!product) {
    return null
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <ProductGallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <ProductInfo data={product as Product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}