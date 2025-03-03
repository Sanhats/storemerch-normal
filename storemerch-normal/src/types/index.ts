export interface Category {
  id: string;
  name: string;
  created_at?: string;
  productCount?: number;
  products?: Array<{ count: number }>;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  created_at?: string;
}

export interface ProductImage {
  id: string
  url: string
  color?: {
    name: string
    hex: string
  }
}

export interface Product {
  id: string
  category: string
  name: string
  price: string
  isFeatured: boolean
  size: string
  color: string
  images: ProductImage[]
  description: string
  stock: number
}



export interface CartItem extends Product {
  quantity: number;
}

export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}