import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import type { Product } from "@/types"

type CategoryParams = {
  categoryId: string
}

async function getCategoryId(params: CategoryParams | Promise<CategoryParams>): Promise<string> {
  const resolvedParams = params instanceof Promise ? await params : params
  return resolvedParams.categoryId
}

export default async function CategoryPage({
  params,
}: {
  params: any
  searchParams: any
}) {
  try {
    const categoryId = await getCategoryId(params)
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const [{ data: category, error: categoryError }, { data: products, error: productsError }] = await Promise.all([
      supabase.from("categories").select("*").eq("id", categoryId).single(),
      supabase
        .from("products")
        .select(`
        *,
        category:categories(*),
        images:product_images(
          *,
          color:colors(*)
        )
      `)
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false }),
    ])

    if (categoryError || productsError) {
      throw categoryError || productsError
    }

    if (!category) {
      notFound()
    }

    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <Container>
          <div className="px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
            <nav className="mb-8">
              <Button
                variant="ghost"
                asChild
                className="group text-gray-600 hover:text-primary transition-colors duration-200"
              >
                <Link href="/categories" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span>All Categories</span>
                </Link>
              </Button>
            </nav>

            <header className="mb-10 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{category.name}</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our curated collection of {category.name.toLowerCase()} designed to elevate your style and meet
                your needs.
              </p>
            </header>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product: Product) => (
                  <div key={product.id} className="group transform transition-all duration-300 hover:scale-105">
                    <ProductCard data={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <span className="text-5xl">🔍</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 text-center max-w-md mb-8">
                  We're currently updating our collection. Check back soon for exciting new{" "}
                  {category.name.toLowerCase()}.
                </p>
                <Button asChild variant="default" size="lg">
                  <Link href="/categories">Explore Other Categories</Link>
                </Button>
              </div>
            )}
          </div>
        </Container>
      </div>
    )
  } catch (error) {
    console.error("Error:", error)
    return (
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow-sm p-10">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-8">
              <span className="text-5xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Oops! Something went wrong</h1>
            <p className="text-gray-600 text-center max-w-md mb-8">
              We're having trouble loading this category. Our team has been notified and is working on a fix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" size="lg">
                <Link href="/">Return to Homepage</Link>
              </Button>
              <Button asChild variant="default" size="lg">
                <Link href="/categories" className="flex items-center">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

