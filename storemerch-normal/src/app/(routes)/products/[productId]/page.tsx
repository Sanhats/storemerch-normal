import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { Container } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ProductColorDisplay } from "./product-color-display"

interface PageProps {
  params: {
    productId: string
  }
}

export default async function ProductPage({ params }: PageProps) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    })

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        images:product_images(
          *,
          color:colors(*)
        )
      `)
      .eq("id", await params.productId)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    if (!product) {
      return notFound()
    }

    // Transformar hex_value a hex en los colores
    const transformedProduct = {
      ...product,
      images: product.images.map((image) => ({
        ...image,
        color: {
          ...image.color,
          hex: image.color.hex_value || image.color.hex,
        },
      })),
    }

    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4">
              <Button variant="outline" asChild>
                <Link href="/categories">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to categories
                </Link>
              </Button>
            </div>
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <ProductColorDisplay product={transformedProduct} />
            </div>
            <Separator className="my-10" />
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Description</h2>
              <div className="prose max-w-none">{product.description}</div>
            </div>
          </div>
        </Container>
      </div>
    )
  } catch (error) {
    console.error("Error:", error)
    return (
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">Please try again later.</p>
            <Button variant="outline" asChild>
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

