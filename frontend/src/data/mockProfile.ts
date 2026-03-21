export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  total: number;
  items: OrderItem[];
}

export interface Address {
  id: string;
  label: "Home" | "Work" | "Other";
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export const mockCustomer: Customer = {
  id: "CUST-8392",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://i.pravatar.cc/150?img=5",
  memberSince: "2021-03-15T00:00:00Z",
};

export const mockOrders: Order[] = [
  {
    id: "ORD-99381-A",
    date: "2023-11-20T14:30:00Z",
    status: "Delivered",
    paymentStatus: "Paid",
    total: 245.5,
    items: [
      {
        id: "P1",
        name: "Wireless Noise-Cancelling Headphones",
        quantity: 1,
        price: 199.0,
      },
      { id: "P2", name: "Premium Headphone Stand", quantity: 1, price: 46.5 },
    ],
  },
  {
    id: "ORD-99402-B",
    date: "2023-12-05T09:15:00Z",
    status: "Shipped",
    paymentStatus: "Paid",
    total: 89.99,
    items: [
      { id: "P3", name: "Ergonomic Desk Mousepad", quantity: 1, price: 29.99 },
      {
        id: "P4",
        name: "Mechanical Keyboard Keycaps",
        quantity: 1,
        price: 60.0,
      },
    ],
  },
  {
    id: "ORD-99510-C",
    date: "2023-12-28T16:45:00Z",
    status: "Pending",
    paymentStatus: "Unpaid",
    total: 1299.0,
    items: [
      {
        id: "P5",
        name: 'Ultra-Wide Curved Monitor 34"',
        quantity: 1,
        price: 1299.0,
      },
    ],
  },
  {
    id: "ORD-99120-D",
    date: "2023-09-12T11:20:00Z",
    status: "Cancelled",
    paymentStatus: "Refunded",
    total: 45.0,
    items: [
      {
        id: "P6",
        name: "USB-C Hub Multiport Adapter",
        quantity: 1,
        price: 45.0,
      },
    ],
  },
  {
    id: "ORD-98845-E",
    date: "2023-08-01T10:00:00Z",
    status: "Delivered",
    paymentStatus: "Paid",
    total: 12.99,
    items: [
      { id: "P7", name: "Screen Cleaning Kit", quantity: 1, price: 12.99 },
    ],
  },
];

export const mockAddresses: Address[] = [
  {
    id: "ADDR-1",
    label: "Home",
    street: "1234 Blossom Hill Rd, Apt 4B",
    city: "San Jose",
    state: "CA",
    zip: "95123",
    country: "United States",
    isDefault: true,
  },
  {
    id: "ADDR-2",
    label: "Work",
    street: "900 Tech Innovation Blvd, Floor 12",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    country: "United States",
    isDefault: false,
  },
  {
    id: "ADDR-3",
    label: "Other",
    street: "442 Alpine Way",
    city: "Lake Tahoe",
    state: "CA",
    zip: "96150",
    country: "United States",
    isDefault: false,
  },
];

export const mockWishlist: WishlistItem[] = [
  {
    id: "W-1",
    name: "Minimalist Ceramic Watch",
    price: 185.0,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    inStock: true,
  },
  {
    id: "W-2",
    name: "Handcrafted Leather Wallet",
    price: 65.0,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
    inStock: true,
  },
  {
    id: "W-3",
    name: "Smart Desk Lamp with Qi Charger",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=500&h=500&fit=crop",
    inStock: false,
  },
  {
    id: "W-4",
    name: "Premium Coffee Dripper Set",
    price: 95.0,
    image:
      "https://images.unsplash.com/photo-1495474472205-51f750c07c16?w=500&h=500&fit=crop",
    inStock: true,
  },
  {
    id: "W-5",
    name: "Acoustic Wood Panel (Pack of 4)",
    price: 210.0,
    image:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=500&h=500&fit=crop",
    inStock: true,
  },
  {
    id: "W-6",
    name: "Matte Black Sunglasses",
    price: 145.0,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop",
    inStock: true,
  },
];

export const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Classic White Sneakers",
    variant: "Size 10 · White",
    price: 89.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Essential Cotton T-Shirt",
    variant: "Size M · Navy",
    price: 34.99,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Leather Crossbody Bag",
    variant: "Black",
    price: 129.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Silver Wristwatch",
    variant: "41mm · Stainless Steel",
    price: 249.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop",
  },
];
