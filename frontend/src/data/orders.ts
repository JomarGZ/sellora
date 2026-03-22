import { OrderStatus, PaymentStatus, type Order } from "@/features/order/types";

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-12-15",
    status: OrderStatus.Delivered,
    paymentStatus: PaymentStatus.Paid,
    total: 129.97,
    items: [
      {
        id: "i1",
        name: "Classic White Sneakers",
        variant: "Size 10 / White",
        quantity: 1,
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
      {
        id: "i2",
        name: "Cotton Crew Socks (3-Pack)",
        variant: "M / Black",
        quantity: 2,
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: true,
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-12-20",
    status: OrderStatus.OutForDelivery,
    paymentStatus: PaymentStatus.Paid,
    total: 249.0,
    items: [
      {
        id: "i3",
        name: "Leather Weekender Bag",
        variant: "Brown",
        quantity: 1,
        price: 249.0,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2025-01-02",
    status: OrderStatus.Pending,
    paymentStatus: PaymentStatus.Unpaid,
    total: 59.99,
    items: [
      {
        id: "i4",
        name: "Wireless Earbuds Pro",
        variant: "Matte Black",
        quantity: 1,
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=120&h=120&fit=crop",
        inStock: false,
        reviewed: false,
      },
    ],
  },
  {
    id: "ORD-2024-004",
    date: "2025-01-10",
    status: OrderStatus.Cancelled,
    paymentStatus: PaymentStatus.Refunded,
    total: 175.5,
    items: [
      {
        id: "i5",
        name: "Merino Wool Sweater",
        variant: "L / Navy",
        quantity: 1,
        price: 95.5,
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
      {
        id: "i6",
        name: "Slim Fit Chinos",
        variant: "32 / Khaki",
        quantity: 1,
        price: 80.0,
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=120&h=120&fit=crop",
        inStock: false,
        reviewed: false,
      },
    ],
  },
  {
    id: "ORD-2025-005",
    date: "2025-02-14",
    status: OrderStatus.PreparingToShip,
    paymentStatus: PaymentStatus.Paid,
    total: 340.0,
    items: [
      {
        id: "i7",
        name: "Running Shoes Ultra",
        variant: "Size 11 / Red",
        quantity: 1,
        price: 180.0,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
      {
        id: "i8",
        name: "Sports Water Bottle",
        variant: "750ml / Blue",
        quantity: 2,
        price: 25.0,
        image:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
      {
        id: "i9",
        name: "Performance Shorts",
        variant: "M / Black",
        quantity: 2,
        price: 55.0,
        image:
          "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
    ],
  },
  {
    id: "ORD-2025-006",
    date: "2025-03-01",
    status: OrderStatus.Delivered,
    paymentStatus: PaymentStatus.Paid,
    total: 64.98,
    items: [
      {
        id: "i10",
        name: "Bamboo Sunglasses",
        variant: "Natural",
        quantity: 1,
        price: 44.99,
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
      {
        id: "i11",
        name: "Canvas Tote Bag",
        variant: "Natural",
        quantity: 1,
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&h=120&fit=crop",
        inStock: true,
        reviewed: false,
      },
    ],
  },
];
