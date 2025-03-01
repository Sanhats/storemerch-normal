import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types"

interface ProductListProps {
  items: Product[]
}

export function ProductList({ items }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ProductCard key={item.id} data={item} />
      ))}
    </div>
  )
}