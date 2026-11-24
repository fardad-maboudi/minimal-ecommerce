export type ProductCategoryId =
  | "all"
  | "coffee"
  | "lighting"
  | "botanical"
  | "textiles"
  | "objects";

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductProperties {
  origin: string;
  weight: string;
  material: string;
  dimensions: string;
}

/**
 * Storefront product aligned directly to @joorchin/client-sdk
 * schemas.EcommerceProduct contract.
 */
export interface StoreProduct {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  description: string;
  slug: string;
  status: "MARKETABLE" | "UNMARKETABLE";
  productType: "PRODUCT" | "SERVICE";
  price: number;
  discountedPrice: number | null;
  discountPercent: number;
  stock: number;
  images: {
    main: string;
    gallery: string[];
  };
  rating: {
    count: number;
    average: number;
  };
  colors: ProductColorOption[];
  properties: ProductProperties;
  brandId: string;
  categoryId: Exclude<ProductCategoryId, "all">;
  badge?: "Bestseller" | "Limited Run" | "New";
  bestsellerRank?: number;
  bundleSlot?: "morning" | "ambient" | "tactile";
  notes: string[];
  createdAt: string;
  updatedAt: string;
  source: "joorchin" | "curated";
}

export interface StoreCategory {
  id: Exclude<ProductCategoryId, "all">;
  title: string;
  subtitle: string;
  countLabel: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: StoreProduct;
  quantity: number;
  selectedColor: string;
  bundleLabel?: string;
  overrideUnitPrice?: number;
}

export interface StoreVoucher {
  code: string;
  type: "FIXED" | "PERCENTAGE";
  value: number;
  expiresAt: string;
  label: string;
  minSubtotal?: number;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "RETURNED"
  | "FAILED";

export interface OrderShippingAddress {
  full_name: string;
  mobile: string;
  address: string;
  unit: string;
  building_number: string;
  city: string;
  postal_code: string;
  note?: string;
}

export interface StoreOrder {
  id: string;
  orderCode: string;
  amount: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  voucherCode?: string;
  shippingMethod: "standard" | "express";
  status: OrderStatus;
  items: {
    productId: string;
    title: string;
    image: string;
    quantity: number;
    unitPrice: number;
    color: string;
  }[];
  shippingAddress: OrderShippingAddress;
  createdAt: string;
  updatedAt: string;
  syncedToJoorchin: boolean;
}

export interface ProductReviewComment {
  id: string;
  productId: string;
  productTitle: string;
  date: string;
  customerName: string;
  location: string;
  comment: string;
  isPositive: boolean;
  qualities: string[];
  rating: number;
  verified: boolean;
}

export interface CuratedBundle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  productIds: string[];
  discountPercent: number;
  image: string;
}

export interface LookbookHotspot {
  id: string;
  number: number;
  x: number; // percent
  y: number; // percent
  productId: string;
  placementNote: string;
}

export interface JournalArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
  paragraphs: string[];
  featuredProductId: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type PushState =
  | "unsupported"
  | "needs-install"
  | "default"
  | "denied"
  | "subscribed";

export type JoorchinConnectionMode = "connected" | "standby" | "connecting" | "error";

export interface JoorchinConfig {
  appId: string;
  serverUrl: string;
  tokenStorageKey: string;
}

export interface SdkCallLog {
  id: string;
  timestamp: string;
  method: string;
  route: string;
  outcome: "live" | "fallback" | "error";
  durationMs: number;
  detail: string;
}

export interface CustomerUser {
  id?: string;
  phone: string;
  fullName: string;
  email: string;
  role: "customer" | "staff";
  isLiveSession: boolean;
}
