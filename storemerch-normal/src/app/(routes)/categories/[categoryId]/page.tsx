import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { notFound } from "next/navigation"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import type { Product } from "@/types"

type CategoryParams = {
  categoryId: string;
};

// Workaround for the type issue by using a function that handles both Promise and direct object
async function getCategoryId(params: CategoryParams | Promise<CategoryParams>): Promise<string> {
  const resolvedParams = params instanceof Promise ? await params : params;
  return resolvedParams.categoryId;
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: {
  params: any; // Using 'any' here to bypass the strict type checking
  searchParams: any; // Using 'any' here to bypass the strict type checking
}) {
  try {
    // Resolve the categoryId safely regardless of whether params is a Promise or direct object
    const categoryId = await getCategoryId(params);

    // Obtenemos las cookies de forma asíncrona
    const cookieStore = cookies()
    
    // Creamos el cliente de Supabase después de obtener las cookies
    const supabase = createServerComponentClient({
      cookies: () => cookieStore
    })

    // Realizamos las consultas en paralelo
    const [{ data: category, error: categoryError }, { data: products, error: productsError }] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single(),
      
      supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(
            *,
            color:colors(*)
          )
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })
    ])

    if (categoryError || productsError) {
      throw categoryError || productsError
    }

    if (!category) {
      notFound()
    }

    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-16 sm:px-6 lg:px-8">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-y-4">
                <p className="text-muted-foreground">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <Button asChild>
              <Link href="/categories">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to categories
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    )
  }
}