import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Grid, List, AlertCircle } from 'lucide-react'

import { CategoryCard } from "@/components/category-card"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"

export default async function CategoriesPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({
      cookies: () => cookieStore
    })

    const { data: categoriesWithCount, error } = await supabase
      .from('categories')
      .select(`
        *,
        products(count)
      `)
      .order('name')

    if (error) {
      throw error
    }

    const categories = (categoriesWithCount || []).map(category => ({
      ...category,
      productCount: category.products?.[0]?.count || 0
    }))

    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen py-12">
        <Container>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Explore Our <span className="text-primary">Categories</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-xl text-gray-500 sm:text-2xl md:mt-5 md:max-w-3xl">
                Discover our wide range of products across various categories. Find exactly what you're looking for with ease.
              </p>
            </div>

            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-muted-foreground">
                Showing {categories.length} categories
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category: Category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  productCount={category.productCount}
                />
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">No categories found</h3>
                <p className="mt-1 text-gray-500">It seems we don't have any categories at the moment. Please check back later.</p>
              </div>
            )}
          </div>
        </Container>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex items-center justify-center">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">Oops! Something went wrong</h1>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              We're having trouble loading the categories. Please try again later or contact support if the problem persists.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-6"
            >
              Try Again
            </Button>
          </div>
        </Container>
      </div>
    )
  }
}