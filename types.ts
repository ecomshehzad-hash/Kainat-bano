export type Category =
  | "Abayas"
  | "Dresses"
  | "Formal Wear"
  | "Casual Wear"
  | "Hijabs"
  | "Accessories";

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}
