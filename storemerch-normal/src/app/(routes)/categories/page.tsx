import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { CategoryCard } from "@/components/category-card"
import type { Category } from "@/types"

export default async function CategoriesPage() {
  const cookieStore = cookies()
  
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  })

  try {
    const { data: categoriesWithCount } = await supabase
      .from('categories')
      .select(`
        *,
        products:products(count)
      `)
      .order('name')

    const categories = categoriesWithCount?.map(category => ({
      ...category,
      productCount: category.products?.[0]?.count || 0
    })) || []

    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Browse our collection by category
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                productCount={category.productCount}
              />
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          Please try again later.
        </p>
      </div>
    )
  }
}