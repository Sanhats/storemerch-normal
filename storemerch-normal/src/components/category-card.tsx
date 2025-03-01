'use client'

import { useRouter } from "next/navigation"
import { ArrowRight } from 'lucide-react'
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
      className="group cursor-pointer rounded-lg border p-6 space-y-4 transition hover:border-black"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-black transition" />
      </div>
    </div>
  )
}