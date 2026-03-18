export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  description?: string;
}

export const CATEGORIES = [
  "T-Shirts",
  "Hoodies",
  "Jackets",
  "Jeans",
  "Dresses",
  "Shoes",
  "Accessories",
  "Activewear",
  "Outerwear",
] as const;

export const BRANDS = [
  "Nike",
  "Adidas",
  "Zara",
  "H&M",
  "Uniqlo",
  "Levi’s",
] as const;

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Cotton T-Shirt",
    price: 29.99,
    oldPrice: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "T-Shirts",
    brand: "Uniqlo",
    rating: 4.7,
    reviewCount: 842,
    isBestSeller: true,
    description: "Soft breathable cotton t-shirt perfect for everyday wear.",
  },
  {
    id: "2",
    name: "Oversized Street Hoodie",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    category: "Hoodies",
    brand: "Nike",
    rating: 4.8,
    reviewCount: 523,
    isNew: true,
    description: "Trendy oversized hoodie with premium fleece fabric.",
  },
  {
    id: "3",
    name: "Slim Fit Blue Jeans",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    category: "Jeans",
    brand: "Levi’s",
    rating: 4.6,
    reviewCount: 1123,
    description: "Classic slim-fit denim jeans with stretch comfort.",
  },
  {
    id: "4",
    name: "Lightweight Bomber Jacket",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    category: "Jackets",
    brand: "Zara",
    rating: 4.7,
    reviewCount: 312,
    isBestSeller: true,
    description: "Minimal bomber jacket perfect for casual outfits.",
  },
  {
    id: "5",
    name: "Summer Floral Dress",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a75?w=400",
    category: "Dresses",
    brand: "H&M",
    rating: 4.5,
    reviewCount: 678,
    description: "Light floral dress designed for warm summer days.",
  },
  {
    id: "6",
    name: "Running Sneakers",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Shoes",
    brand: "Nike",
    rating: 4.8,
    reviewCount: 1452,
    isBestSeller: true,
    description: "Lightweight running shoes with breathable mesh.",
  },
  {
    id: "7",
    name: "Athletic Jogger Pants",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400",
    category: "Activewear",
    brand: "Adidas",
    rating: 4.6,
    reviewCount: 522,
    description: "Comfortable joggers perfect for workouts or casual wear.",
  },
  {
    id: "8",
    name: "Premium Leather Jacket",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    category: "Outerwear",
    brand: "Zara",
    rating: 4.9,
    reviewCount: 289,
    isBestSeller: true,
    description: "High-quality leather jacket with modern fit.",
  },
  {
    id: "9",
    name: "Basic Crew Neck Tee",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1583743814966-8936f37f4c84?w=400",
    category: "T-Shirts",
    brand: "H&M",
    rating: 4.3,
    reviewCount: 430,
    description: "Minimalist crew neck t-shirt for everyday wear.",
  },
  {
    id: "10",
    name: "Streetwear Graphic Hoodie",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400",
    category: "Hoodies",
    brand: "Adidas",
    rating: 4.6,
    reviewCount: 612,
    isNew: true,
    description: "Bold graphic hoodie designed for street style.",
  },
  {
    id: "11",
    name: "High Waist Denim Jeans",
    price: 94.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    category: "Jeans",
    brand: "Levi’s",
    rating: 4.7,
    reviewCount: 745,
    description: "Stylish high waist jeans with premium denim.",
  },
  {
    id: "12",
    name: "Minimalist White Sneakers",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
    category: "Shoes",
    brand: "Nike",
    rating: 4.8,
    reviewCount: 934,
    isBestSeller: true,
    description: "Clean minimalist sneakers perfect for any outfit.",
  },
];

export const newArrivals =
  products.filter((p) => p.isNew).length > 0
    ? products.filter((p) => p.isNew).slice(0, 4)
    : products.slice(0, 4);

export const bestSellers = products.filter((p) => p.isBestSeller);

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}

export function getBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))];
}
