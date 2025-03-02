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
  id: string;
  url: string;
  color: Color;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  featured: boolean;
  images: ProductImage[];
  category?: Category;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}