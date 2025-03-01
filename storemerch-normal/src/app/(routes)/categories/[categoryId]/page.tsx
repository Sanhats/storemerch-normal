import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.categoryId)
    .single()

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('category_id', params.categoryId)
    .order('created_at', { ascending: false })

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Button asChild>
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to categories
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to categories
            </Link>
          </Button>
        </div>
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">
            Browse our collection of {category.name.toLowerCase()}
          </p>
        </div>
        {products && products.length > 0 ? (
          <ProductList items={products as Product[]} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-y-4">
            <p className="text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}