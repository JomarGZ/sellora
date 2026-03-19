import type { ProductDetail, ProductItem, ReviewsResponse } from "@/types";
import type { Address, CartItem, ShippingMethod } from "@/types/checkout";

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    product_item_id: 1,
    name: "Classic Cotton T-Shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    price: 29.99,
    quantity: 2,
    variant: "Size: M | Color: Black",
    selected: false,
  },
  {
    product_item_id: 2,
    name: "Slim Fit Denim Jeans",
    image:
      "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=200&h=200&fit=crop",
    price: 79.99,
    quantity: 1,
    variant: "Size: 32 | Color: Indigo",
    selected: false,
  },
  {
    product_item_id: 3,
    name: "Leather Crossbody Bag",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
    price: 149.99,
    quantity: 1,
    variant: "Color: Tan",
    selected: false,
  },
  {
    product_item_id: 4,
    name: "Running Sneakers Pro",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    price: 119.99,
    quantity: 1,
    variant: "Size: 10 | Color: White",
    selected: false,
  },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    full_name: "John Doe",
    phone: "+1 (555) 123-4567",
    address_line: "123 Main Street, Apt 4B, New York, NY 10001",
    is_default: true,
  },
  {
    id: 2,
    full_name: "John Doe",
    phone: "+1 (555) 987-6543",
    address_line: "456 Oak Avenue, Suite 200, Los Angeles, CA 90001",
    is_default: false,
  },
];

export const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  { id: 1, name: "Standard Shipping", price: 4.99, estimated_days: 7 },
  { id: 2, name: "Express Shipping", price: 12.99, estimated_days: 3 },
  { id: 3, name: "Overnight Shipping", price: 24.99, estimated_days: 1 },
];

const tenDaysAgo = new Date(
  Date.now() - 10 * 24 * 60 * 60 * 1000,
).toISOString();
const sixtyDaysAgo = new Date(
  Date.now() - 60 * 24 * 60 * 60 * 1000,
).toISOString();

export const MOCK_PRODUCTS: Record<number, ProductDetail> = {
  1: {
    id: 1,
    name: "Nike Air Max 270",
    description:
      "The Nike Air Max 270 delivers incredible comfort for all-day wear. Featuring the largest Air heel unit ever in a lifestyle shoe, it provides an exceptionally smooth ride that works overtime to cushion your every step. The breathable mesh upper keeps you cool, while the sleek design ensures you look great no matter where you go. Perfect for casual wear, light workouts, or everyday adventures.",
    createdAt: tenDaysAgo,
    brand: {
      id: 1,
      name: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    },
    categories: [
      { id: 2, name: "Clothing", parentId: null },
      { id: 5, name: "Footwear", parentId: 2 },
      { id: 6, name: "Sneakers", parentId: 5 },
    ],
    images: [
      {
        id: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        altText: "Nike Air Max 270 - Main View",
        displayOrder: 0,
      },
      {
        id: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
        altText: "Nike Air Max 270 - Side View",
        displayOrder: 1,
      },
      {
        id: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
        altText: "Nike Air Max 270 - Top View",
        displayOrder: 2,
      },
      {
        id: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
        altText: "Nike Air Max 270 - Back View",
        displayOrder: 3,
      },
    ],
    attributes: [
      {
        id: 1,
        name: "Color",
        values: [
          { id: 1, value: "Black/White" },
          { id: 2, value: "Triple White" },
          { id: 3, value: "Navy Blue" },
          { id: 4, value: "Red/Black" },
        ],
      },
      {
        id: 2,
        name: "Size",
        values: [
          { id: 5, value: "US 7" },
          { id: 6, value: "US 8" },
          { id: 7, value: "US 9" },
          { id: 8, value: "US 10" },
          { id: 9, value: "US 11" },
          { id: 10, value: "US 12" },
        ],
      },
    ],
    ordersCount: 142,
  },
  2: {
    id: 2,
    name: "MacBook Pro 14-inch",
    description:
      "The most powerful MacBook Pro ever is here. With the blazing-fast M3 chip, a stunning Liquid Retina XDR display, and all-day battery life, it is the ideal laptop for professionals. Create, collaborate, and do more with the pro-level performance you need. Featuring up to 22 hours of battery life and a redesigned MagSafe connector.",
    createdAt: sixtyDaysAgo,
    brand: {
      id: 3,
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/814px-Apple_logo_black.svg.png",
    },
    categories: [
      { id: 1, name: "Electronics", parentId: null },
      { id: 3, name: "Computers", parentId: 1 },
      { id: 4, name: "Laptops", parentId: 3 },
    ],
    images: [
      {
        id: 5,
        imageUrl:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        altText: "MacBook Pro - Open",
        displayOrder: 0,
      },
      {
        id: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1611186871525-2a3f3bcef68f?w=800&q=80",
        altText: "MacBook Pro - Side",
        displayOrder: 1,
      },
      {
        id: 7,
        imageUrl:
          "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
        altText: "MacBook Pro - Keyboard",
        displayOrder: 2,
      },
    ],
    attributes: [
      {
        id: 3,
        name: "Storage",
        values: [
          { id: 11, value: "512GB SSD" },
          { id: 12, value: "1TB SSD" },
          { id: 13, value: "2TB SSD" },
        ],
      },
      {
        id: 4,
        name: "RAM",
        values: [
          { id: 14, value: "16GB" },
          { id: 15, value: "32GB" },
          { id: 16, value: "64GB" },
        ],
      },
    ],
    ordersCount: 28,
  },
};

export const MOCK_PRODUCT_ITEMS: Record<number, ProductItem[]> = {
  1: [
    // Black/White
    {
      id: 1,
      sku: "AM270-BW-7",
      price: 150,
      originalPrice: 180,
      qtyInStock: 8,
      images: [
        {
          id: 101,
          imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
          altText: "Black/White",
          displayOrder: 0,
        },
        {
          id: 102,
          imageUrl:
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
          altText: "Black/White Side",
          displayOrder: 1,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 1,
          value: "Black/White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 5, value: "US 7" },
      ],
    },
    {
      id: 2,
      sku: "AM270-BW-8",
      price: 150,
      originalPrice: 180,
      qtyInStock: 12,
      images: [
        {
          id: 101,
          imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
          altText: "Black/White",
          displayOrder: 0,
        },
        {
          id: 102,
          imageUrl:
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
          altText: "Black/White Side",
          displayOrder: 1,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 1,
          value: "Black/White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 6, value: "US 8" },
      ],
    },
    {
      id: 3,
      sku: "AM270-BW-9",
      price: 150,
      originalPrice: 180,
      qtyInStock: 15,
      images: [
        {
          id: 101,
          imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
          altText: "Black/White",
          displayOrder: 0,
        },
        {
          id: 102,
          imageUrl:
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
          altText: "Black/White Side",
          displayOrder: 1,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 1,
          value: "Black/White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 7, value: "US 9" },
      ],
    },
    {
      id: 4,
      sku: "AM270-BW-10",
      price: 150,
      originalPrice: 180,
      qtyInStock: 10,
      images: [
        {
          id: 101,
          imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
          altText: "Black/White",
          displayOrder: 0,
        },
        {
          id: 102,
          imageUrl:
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
          altText: "Black/White Side",
          displayOrder: 1,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 1,
          value: "Black/White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 8, value: "US 10" },
      ],
    },
    {
      id: 5,
      sku: "AM270-BW-11",
      price: 150,
      originalPrice: 180,
      qtyInStock: 6,
      images: [
        {
          id: 101,
          imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
          altText: "Black/White",
          displayOrder: 0,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 1,
          value: "Black/White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 9, value: "US 11" },
      ],
    },
    {
      id: 6,
      sku: "AM270-BW-12",
      price: 150,
      originalPrice: 180,
      qtyInStock: 0,
      images: [
        {
          id: 101,
          imageUrl:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
          altText: "Black/White",
          displayOrder: 0,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 1,
          value: "Black/White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 10, value: "US 12" },
      ],
    },
    // Triple White
    {
      id: 7,
      sku: "AM270-TW-7",
      price: 160,
      originalPrice: null,
      qtyInStock: 5,
      images: [
        {
          id: 201,
          imageUrl:
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
          altText: "Triple White",
          displayOrder: 0,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 2,
          value: "Triple White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 5, value: "US 7" },
      ],
    },
    {
      id: 8,
      sku: "AM270-TW-8",
      price: 160,
      originalPrice: null,
      qtyInStock: 9,
      images: [
        {
          id: 201,
          imageUrl:
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
          altText: "Triple White",
          displayOrder: 0,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 2,
          value: "Triple White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 6, value: "US 8" },
      ],
    },
    {
      id: 9,
      sku: "AM270-TW-9",
      price: 160,
      originalPrice: null,
      qtyInStock: 14,
      images: [
        {
          id: 201,
          imageUrl:
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
          altText: "Triple White",
          displayOrder: 0,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 2,
          value: "Triple White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 7, value: "US 9" },
      ],
    },
    {
      id: 10,
      sku: "AM270-TW-10",
      price: 160,
      originalPrice: null,
      qtyInStock: 7,
      images: [
        {
          id: 201,
          imageUrl:
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
          altText: "Triple White",
          displayOrder: 0,
        },
      ],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 2,
          value: "Triple White",
        },
        { attributeId: 2, attributeName: "Size", valueId: 8, value: "US 10" },
      ],
    },
    // Navy Blue
    {
      id: 11,
      sku: "AM270-NB-8",
      price: 155,
      originalPrice: 175,
      qtyInStock: 3,
      images: [],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 3,
          value: "Navy Blue",
        },
        { attributeId: 2, attributeName: "Size", valueId: 6, value: "US 8" },
      ],
    },
    {
      id: 12,
      sku: "AM270-NB-9",
      price: 155,
      originalPrice: 175,
      qtyInStock: 11,
      images: [],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 3,
          value: "Navy Blue",
        },
        { attributeId: 2, attributeName: "Size", valueId: 7, value: "US 9" },
      ],
    },
    {
      id: 13,
      sku: "AM270-NB-10",
      price: 155,
      originalPrice: 175,
      qtyInStock: 0,
      images: [],
      attributeValues: [
        {
          attributeId: 1,
          attributeName: "Color",
          valueId: 3,
          value: "Navy Blue",
        },
        { attributeId: 2, attributeName: "Size", valueId: 8, value: "US 10" },
      ],
    },
  ],
  2: [
    {
      id: 20,
      sku: "MBP14-512-16",
      price: 1999,
      originalPrice: null,
      qtyInStock: 5,
      images: [],
      attributeValues: [
        {
          attributeId: 3,
          attributeName: "Storage",
          valueId: 11,
          value: "512GB SSD",
        },
        { attributeId: 4, attributeName: "RAM", valueId: 14, value: "16GB" },
      ],
    },
    {
      id: 21,
      sku: "MBP14-512-32",
      price: 2399,
      originalPrice: null,
      qtyInStock: 3,
      images: [],
      attributeValues: [
        {
          attributeId: 3,
          attributeName: "Storage",
          valueId: 11,
          value: "512GB SSD",
        },
        { attributeId: 4, attributeName: "RAM", valueId: 15, value: "32GB" },
      ],
    },
    {
      id: 22,
      sku: "MBP14-1TB-16",
      price: 2399,
      originalPrice: 2599,
      qtyInStock: 7,
      images: [],
      attributeValues: [
        {
          attributeId: 3,
          attributeName: "Storage",
          valueId: 12,
          value: "1TB SSD",
        },
        { attributeId: 4, attributeName: "RAM", valueId: 14, value: "16GB" },
      ],
    },
    {
      id: 23,
      sku: "MBP14-1TB-32",
      price: 2799,
      originalPrice: 2999,
      qtyInStock: 4,
      images: [],
      attributeValues: [
        {
          attributeId: 3,
          attributeName: "Storage",
          valueId: 12,
          value: "1TB SSD",
        },
        { attributeId: 4, attributeName: "RAM", valueId: 15, value: "32GB" },
      ],
    },
    {
      id: 24,
      sku: "MBP14-1TB-64",
      price: 3199,
      originalPrice: null,
      qtyInStock: 2,
      images: [],
      attributeValues: [
        {
          attributeId: 3,
          attributeName: "Storage",
          valueId: 12,
          value: "1TB SSD",
        },
        { attributeId: 4, attributeName: "RAM", valueId: 16, value: "64GB" },
      ],
    },
    {
      id: 25,
      sku: "MBP14-2TB-32",
      price: 3199,
      originalPrice: null,
      qtyInStock: 1,
      images: [],
      attributeValues: [
        {
          attributeId: 3,
          attributeName: "Storage",
          valueId: 13,
          value: "2TB SSD",
        },
        { attributeId: 4, attributeName: "RAM", valueId: 15, value: "32GB" },
      ],
    },
    {
      id: 26,
      sku: "MBP14-2TB-64",
      price: 3599,
      originalPrice: null,
      qtyInStock: 0,
      images: [],
      attributeValues: [
        {
          attributeId: 3,
          attributeName: "Storage",
          valueId: 13,
          value: "2TB SSD",
        },
        { attributeId: 4, attributeName: "RAM", valueId: 16, value: "64GB" },
      ],
    },
  ],
};

export const MOCK_REVIEWS: Record<number, ReviewsResponse> = {
  1: {
    averageRating: 4.3,
    totalReviews: 6,
    reviews: [
      {
        id: 1,
        userName: "Alex Johnson",
        rating: 5,
        comment:
          "Absolutely love these shoes! Super comfortable for all-day wear and the cushioning is incredible. Got compliments everywhere I went.",
        verified: true,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 2,
        userName: "Maria Garcia",
        rating: 4,
        comment:
          "Great shoes overall. Runs slightly large so I recommend going half a size down. The Air unit feels amazing underfoot.",
        verified: true,
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
      {
        id: 3,
        userName: "James Wilson",
        rating: 5,
        comment:
          "Best sneakers I've owned. Worth every penny. The build quality is top-notch and they look even better in person.",
        verified: true,
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        id: 4,
        userName: "Sarah Chen",
        rating: 3,
        comment:
          "Nice shoe but the sole started separating after 3 months of light use. Customer service was helpful though.",
        verified: true,
        createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
      },
      {
        id: 5,
        userName: "Michael Torres",
        rating: 5,
        comment:
          "Perfect for everyday use. I wear them to work and the gym. The white colorway stays clean and is easy to wipe down.",
        verified: false,
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        id: 6,
        userName: "Emma Davis",
        rating: 4,
        comment:
          "Love the style, very modern and clean. The sizing was perfect. Would definitely buy another colorway.",
        verified: true,
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
    ],
  },
  2: {
    averageRating: 4.7,
    totalReviews: 3,
    reviews: [
      {
        id: 7,
        userName: "Kevin Park",
        rating: 5,
        comment:
          "The M3 chip is blazing fast. I run multiple VMs and it barely breaks a sweat. Battery life is unbelievable.",
        verified: true,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: 8,
        userName: "Laura Smith",
        rating: 4,
        comment:
          "Great machine for video editing. The display is gorgeous. Wish the port selection was better out of the box.",
        verified: true,
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
      {
        id: 9,
        userName: "Daniel Brown",
        rating: 5,
        comment:
          "Best laptop I have ever used. Switched from Windows and never looking back. The build quality is exceptional.",
        verified: false,
        createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
      },
    ],
  },
};
