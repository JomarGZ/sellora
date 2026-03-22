export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
}

export interface ProductItem {
  id: number;
  sku: string;
  price: number;
  originalPrice: number | null;
  qtyInStock: number;
  images: ProductImage[];
  attributeValues: AttributeValue[];
}

export interface AttributeValue {
  attributeId: number;
  attributeName: string;
  valueId: number;
  value: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  brand: Brand;
  categories: Category[];
  images: ProductImage[];
  attributes: AttributeGroup[];
  ordersCount: number;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  verified: boolean;
}

export interface AttributeGroup {
  id: number;
  name: string;
  values: AttributeValueSimple[];
}
export interface AttributeValueSimple {
  id: number;
  value: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface Brand {
  id: number;
  name: string;
  logo: string | null;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
}
