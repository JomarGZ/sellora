export interface CartItemData {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export const mockCartItems: CartItemData[] = [
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
