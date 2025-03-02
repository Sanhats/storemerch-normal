import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { Gallery } from "@/components/gallery"
import { ProductInfo } from "@/components/product-info"
import { Container } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  })

  try {
    const { data: product } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*, color:colors(*))
      `)
      .eq('id', params.productId)
      .single()

    if (!product) {
      return (
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
              <h1 className="text-2xl font-bold">Product not found</h1>
              <p className="text-muted-foreground">
                The product you are looking for does not exist.
              </p>
            </div>
          </div>
        </Container>
      )
    }

    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <Gallery images={product.images} />
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <ProductInfo data={product} />
              </div>
            </div>
            <Separator className="my-10" />
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Description</h2>
              <div className="prose max-w-none">
                {product.description}
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              Please try again later.
            </p>
          </div>
        </div>
      </Container>
    )
  }
}