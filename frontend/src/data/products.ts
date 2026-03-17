export interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  image: string
  category: string
  brand: string
  rating: number
  reviewCount: number
  isBestSeller?: boolean
  isNew?: boolean
  description?: string
}

export const CATEGORIES = ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Wearables', 'Audio', 'Storage', 'Peripherals', 'Video'] as const
export const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Logitech', 'Other'] as const

export const products: Product[] = [
  { id: '1', name: 'Wireless Pro Headphones', price: 249.99, oldPrice: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: 'Audio', brand: 'Sony', rating: 4.8, reviewCount: 1247, isBestSeller: true, description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.' },
  { id: '2', name: 'Smart Watch Ultra', price: 399.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', category: 'Wearables', brand: 'Apple', rating: 4.9, reviewCount: 892, isBestSeller: true, isNew: true, description: 'Advanced health tracking, GPS, and always-on display.' },
  { id: '3', name: 'Portable SSD 1TB', price: 129.99, image: 'https://images.unsplash.com/photo-1597872200969-2b65d565e1c6?w=400&h=400&fit=crop', category: 'Storage', brand: 'Samsung', rating: 4.6, reviewCount: 534, description: 'Ultra-fast portable storage with USB-C connectivity.' },
  { id: '4', name: 'Mechanical Keyboard', price: 149.99, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop', category: 'Peripherals', brand: 'Logitech', rating: 4.7, reviewCount: 2103, isBestSeller: true, description: 'RGB backlit mechanical keyboard with hot-swappable switches.' },
  { id: '5', name: '4K Webcam Pro', price: 199.99, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop', category: 'Video', brand: 'Logitech', rating: 4.5, reviewCount: 678, description: 'Professional 4K webcam with auto-focus and built-in mic.' },
  { id: '6', name: 'Wireless Charging Pad', price: 49.99, image: 'https://images.unsplash.com/photo-1625842268584-b8f5a2e083b2?w=400&h=400&fit=crop', category: 'Accessories', brand: 'Samsung', rating: 4.4, reviewCount: 1203, isBestSeller: true, isNew: true, description: 'Fast wireless charging for phones and earbuds.' },
  { id: '7', name: 'Bluetooth Speaker', price: 89.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', category: 'Audio', brand: 'Sony', rating: 4.6, reviewCount: 445, description: 'Waterproof portable speaker with 20-hour playback.' },
  { id: '8', name: 'USB-C Hub 7-in-1', price: 79.99, image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop', category: 'Accessories', brand: 'Other', rating: 4.3, reviewCount: 892, description: 'HDMI, USB 3.0, SD card reader, and power delivery.' },
  { id: '9', name: 'iPhone 15 Pro', price: 999.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', category: 'Smartphones', brand: 'Apple', rating: 4.9, reviewCount: 3421, isBestSeller: true, description: 'Titanium design, A17 Pro chip, advanced camera system.' },
  { id: '10', name: 'Galaxy S24 Ultra', price: 1199.99, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop', category: 'Smartphones', brand: 'Samsung', rating: 4.8, reviewCount: 2156, isNew: true, description: 'S Pen included, 200MP camera, AI features.' },
  { id: '11', name: 'MacBook Pro 14"', price: 1999.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', category: 'Laptops', brand: 'Apple', rating: 4.9, reviewCount: 1876, isBestSeller: true, description: 'M3 Pro chip, Liquid Retina XDR display.' },
  { id: '12', name: 'XPS 15 Laptop', price: 1499.99, oldPrice: 1699.99, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop', category: 'Laptops', brand: 'Dell', rating: 4.7, reviewCount: 934, description: 'OLED display, 13th Gen Intel, premium build.' },
  { id: '13', name: 'iPad Pro 12.9"', price: 1099.99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', category: 'Tablets', brand: 'Apple', rating: 4.8, reviewCount: 1567, description: 'M2 chip, Liquid Retina XDR, ProMotion.' },
  { id: '14', name: 'Galaxy Tab S9', price: 799.99, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', category: 'Tablets', brand: 'Samsung', rating: 4.6, reviewCount: 623, isNew: true, description: 'AMOLED display, S Pen included, IP68.' },
  { id: '15', name: 'AirPods Pro 2', price: 249.99, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop', category: 'Accessories', brand: 'Apple', rating: 4.8, reviewCount: 4521, isBestSeller: true, description: 'Active Noise Cancellation, Adaptive Audio.' },
  { id: '16', name: 'MX Master 3S Mouse', price: 99.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', category: 'Peripherals', brand: 'Logitech', rating: 4.7, reviewCount: 2890, description: 'Ultra-fast scrolling, multi-device, ergonomic.' },
  { id: '17', name: 'Studio Monitors Pair', price: 299.99, image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop', category: 'Audio', brand: 'Sony', rating: 4.5, reviewCount: 412, description: 'Professional reference monitors, flat response.' },
  { id: '18', name: 'External SSD 2TB', price: 189.99, image: 'https://images.unsplash.com/photo-1597872200969-2b65d565e1c6?w=400&h=400&fit=crop', category: 'Storage', brand: 'Samsung', rating: 4.7, reviewCount: 756, description: 'NVMe speed, rugged design, USB 3.2.' },
  { id: '19', name: 'Fitness Tracker Band', price: 79.99, image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=400&fit=crop', category: 'Wearables', brand: 'Samsung', rating: 4.4, reviewCount: 2103, description: 'Heart rate, sleep, 50+ workout modes.' },
  { id: '20', name: 'Streaming Microphone', price: 129.99, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop', category: 'Video', brand: 'Logitech', rating: 4.6, reviewCount: 1189, description: 'Cardioid pickup, plug-and-play USB.' },
  { id: '21', name: 'Laptop Stand Aluminum', price: 59.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', category: 'Accessories', brand: 'Other', rating: 4.2, reviewCount: 567, description: 'Adjustable height, ventilation, portable.' },
  { id: '22', name: 'Noise Cancelling Earbuds', price: 179.99, image: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=400&h=400&fit=crop', category: 'Audio', brand: 'Sony', rating: 4.7, reviewCount: 2341, isNew: true, description: 'Industry-leading noise cancellation, 30h battery.' },
  { id: '23', name: 'UltraWide Monitor 34"', price: 549.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', category: 'Peripherals', brand: 'Dell', rating: 4.6, reviewCount: 678, description: 'Curved QHD, USB-C, 144Hz.' },
  { id: '24', name: 'Tablet Keyboard Case', price: 149.99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', category: 'Accessories', brand: 'Apple', rating: 4.5, reviewCount: 892, description: 'Magic Keyboard for iPad Pro, trackpad.' },
]

export const newArrivals = products.filter((p) => p.isNew).length > 0 ? products.filter((p) => p.isNew).slice(0, 4) : products.slice(0, 4)
export const bestSellers = products.filter((p) => p.isBestSeller)

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))]
}

export function getBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))]
}
