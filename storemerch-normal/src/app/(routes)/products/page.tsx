import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { ProductList } from "@/components/product-list"
import type { Product } from "@/types"

export default async function ProductsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <ProductList items={products as Product[]} />
    </div>
  )
}