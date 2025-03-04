import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { CategoryCard } from "@/components/category-card"
import { Container } from "@/components/ui/container"
import type { Category } from "@/types"

// Actualizado el tipo PageProps para Next.js 15
type PageProps = {
  params: Promise<{}>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoriesPage({
  params,
  searchParams,
}: PageProps) {
  try {
    // Obtenemos las cookies de forma asíncrona
    const cookieStore = cookies()
    
    // Creamos el cliente de Supabase después de obtener las cookies
    const supabase = createServerComponentClient({
      cookies: () => cookieStore
    })

    // Realizamos la consulta a Supabase
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

    // Transformamos los datos para incluir el conteo de productos
    const categories = (categoriesWithCount || []).map(category => ({
      ...category,
      productCount: category.products?.[0]?.count || 0
    }))

    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="text-muted-foreground">
                Browse our collection by category
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category: Category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  productCount={category.productCount}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">
                Please try again later.
              </p>
            </div>
          </div>
        </Container>
      </div>
    )
  }
}