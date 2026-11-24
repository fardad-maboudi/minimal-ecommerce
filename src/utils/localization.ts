import type { OrderStatus, ProductCategoryId } from "../types/store";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "در انتظار",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELED: "لغوشده",
  RETURNED: "مرجوع‌شده",
  FAILED: "ناموفق",
};

const CATEGORY_LABELS: Record<ProductCategoryId, string> = {
  all: "همه محصولات",
  coffee: "قهوه",
  lighting: "روشنایی",
  botanical: "رایحه گیاهی",
  textiles: "پارچه",
  objects: "اکسسوری",
};

export const localizeOrderStatus = (status: OrderStatus | string) =>
  STATUS_LABELS[status as OrderStatus] ?? status;

export const localizeCategory = (category: ProductCategoryId | string) =>
  CATEGORY_LABELS[category as ProductCategoryId] ?? "محصولات منتخب";

export const toPersianDigits = (value: number | string) =>
  String(value).replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
