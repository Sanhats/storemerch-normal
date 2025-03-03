'use client'

import { useRouter } from "next/navigation"
import { ArrowRight, Package } from 'lucide-react'
import type { Category } from "@/types"

interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

export function CategoryCard({ category, productCount = 0 }: CategoryCardProps) {
  const router = useRouter()

  return (
    <div 
      onClick={() => router.push(`/categories/${category.id}`)}
      className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/categories/${category.id}`)}
    >
      <div className="p-6 flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between group-hover:bg-primary/5 transition-colors duration-300">
        <span className="text-sm font-medium text-primary">Explore category</span>
        <ArrowRight className="h-5 w-5 text-primary transform group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  )
}