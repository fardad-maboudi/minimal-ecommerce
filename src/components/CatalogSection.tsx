import React, { useMemo, useState } from "react";
import { Heart, Plus, RefreshCw } from "lucide-react";
import {
  formatMoney,
  getEffectivePrice,
  useStore,
} from "../context/StoreContext";
import type { ProductCategoryId, StoreProduct } from "../types/store";
import { toPersianDigits } from "../utils/localization";

const FILTER_TABS: { id: ProductCategoryId; label: string }[] = [
  { id: "all", label: "همه محصولات" },
  { id: "coffee", label: "قهوه" },
  { id: "lighting", label: "روشنایی" },
  { id: "botanical", label: "رایحه گیاهی" },
  { id: "textiles", label: "کتان" },
  { id: "objects", label: "اکسسوری میز" },
];

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "sale";

const BADGE_LABELS: Record<string, string> = { Bestseller: "پرفروش", "Limited Run": "تولید محدود", New: "تازه" };

const ProductCard: React.FC<{ product: StoreProduct }> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setActiveProduct } = useStore();
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name ?? "ویژه"
  );
  const [justAdded, setJustAdded] = useState(false);

  const isSaved = wishlist.includes(product.id);
  const effectivePrice = getEffectivePrice(product);
  const hasSale = product.discountedPrice != null && product.discountedPrice < product.price;
  const altImage = product.images.gallery[1];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, { color: selectedColor, quantity: 1, openDrawer: true });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col">
      {/* Studio product image container */}
      <div
        onClick={() => setActiveProduct(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveProduct(product);
          }
        }}
        className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-[#F0EAE1]"
      >
        <img
          src={product.images.main}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-700 ease-out ${
            altImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"
          }`}
        />
        {altImage && (
          <img
            src={altImage}
            alt={`نمایی دیگر از ${product.title}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}

        {/* Single calm top-left marker */}
        {(hasSale || product.badge) && (
          <span
            className={`absolute right-3 top-3 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
              hasSale
                ? "bg-[#A64B2A] text-[#FAF8F5]"
                : "bg-[#FAF8F5]/92 text-[#1B1917]"
            }`}
          >
            {hasSale ? `−${toPersianDigits(product.discountPercent)}٪` : BADGE_LABELS[product.badge ?? ""] ?? product.badge}
          </span>
        )}

        {/* Subtle save toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isSaved ? `حذف ${product.title} از علاقه‌مندی‌ها` : `افزودن ${product.title} به علاقه‌مندی‌ها`}
          className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8F5]/85 backdrop-blur-xs transition ${
            isSaved
              ? "text-[#A64B2A] opacity-100"
              : "text-[#453F3A] opacity-0 hover:text-[#1B1917] group-hover:opacity-100 sm:focus:opacity-100"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Bottom quick-add reveal */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="flex w-full items-center justify-center gap-1.5 bg-[#1B1917]/95 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#FAF8F5] backdrop-blur-xs transition hover:bg-[#1B1917] disabled:bg-[#8E857B]"
          >
            <Plus className="h-3.5 w-3.5 stroke-[1.75]" />
            {product.stock <= 0
              ? "ناموجود"
              : justAdded
                ? "به سبد افزوده شد"
                : `افزودن سریع · ${formatMoney(effectivePrice)}`}
          </button>
        </div>
      </div>

      {/* Product caption */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[14.5px] font-medium leading-snug text-[#1B1917]">
              <button
                type="button"
                onClick={() => setActiveProduct(product)}
                className="text-right transition hover:text-[#A64B2A]"
              >
                {product.title}
              </button>
            </h3>
            <div className="flex shrink-0 items-baseline gap-1.5 tabular-nums text-[14px]">
              <span className="font-medium text-[#1B1917]">
                {formatMoney(effectivePrice)}
              </span>
              {hasSale && (
                <span className="text-[12px] text-[#8D847A] line-through">
                  {formatMoney(product.price)}
                </span>
              )}
            </div>
          </div>
          <p className="mt-1 line-clamp-1 text-[12.5px] text-[#665F57]">
            {product.subtitle}
          </p>
        </div>

        {/* رنگ‌بندی محصول + mobile quick add */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5" aria-label="رنگ‌بندی محصول">
            {product.colors.map((swatch) => {
              const active = swatch.name === selectedColor;
              return (
                <button
                  key={swatch.name}
                  type="button"
                  title={swatch.name}
                  aria-label={`رنگ ${swatch.name}`}
                  onClick={() => setSelectedColor(swatch.name)}
                  className={`h-3.5 w-3.5 rounded-full border transition ${
                    active
                      ? "ring-1 ring-[#1B1917] ring-offset-2 ring-offset-[#FAF8F5] border-black/15"
                      : "border-black/15 opacity-75 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#453F3A] underline underline-offset-4 lg:hidden"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export const CatalogSection: React.FC = () => {
  const {
    products,
    catalogLoading,
    isLiveCatalog,
    selectedCategory,
    setSelectedCategory,
    refreshCatalog,
    joorchinConfig,
  } = useStore();

  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filtered = useMemo(() => {
    let list =
      selectedCategory === "all"
        ? [...products]
        : products.filter((p) => p.categoryId === selectedCategory);

    if (sortBy === "price-asc") {
      list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating.average - a.rating.average || b.rating.count - a.rating.count);
    } else if (sortBy === "sale") {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    } else {
      list.sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99));
    }
    return list;
  }, [products, selectedCategory, sortBy]);

  return (
    <section
      id="catalog"
      className="scroll-mt-24 border-t border-[#E5DED4] bg-[#FAF8F5] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
              {isLiveCatalog
                ? `فهرست زنده محصولات · اپلیکیشن ${joorchinConfig.appId}`
                : "مجموعه پاییز"}
            </p>
            <h2 className="font-serif-display mt-2 text-[36px] font-normal leading-[1.08] text-[#1B1917] sm:text-[46px]">
              محصولات منتخب
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isLiveCatalog && (
              <button
                type="button"
                onClick={() => void refreshCatalog()}
                aria-label="همگام‌سازی محصولات"
                className="inline-flex h-9 items-center gap-1.5 border border-[#DDD4C8] px-3 text-[11px] uppercase tracking-[0.12em] text-[#453F3A] transition hover:border-[#1B1917] hover:text-[#1B1917]"
              >
                <RefreshCw
                  className={`h-3 w-3 ${catalogLoading ? "animate-spin" : ""}`}
                />
                همگام‌سازی
              </button>
            )}
            <label className="sr-only" htmlFor="catalog-sort">
              مرتب‌سازی محصولات
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 border border-[#DDD4C8] bg-transparent px-3 text-[12px] text-[#1B1917] focus:border-[#1B1917] focus:outline-none"
            >
              <option value="featured">مرتب‌سازی: منتخب</option>
              <option value="price-asc">قیمت: از کم به زیاد</option>
              <option value="price-desc">قیمت: از زیاد به کم</option>
              <option value="rating">بالاترین امتیاز</option>
              <option value="sale">تخفیف فصلی</option>
            </select>
          </div>
        </div>

        {/* Underline editorial filter bar */}
        <div className="mt-7 flex items-center justify-between gap-4 border-b border-[#E5DED4]">
          <div className="flex gap-6 overflow-x-auto pb-0 no-scrollbar">
            {FILTER_TABS.map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`relative shrink-0 pb-3.5 text-[12.5px] font-medium tracking-[0.04em] transition ${
                    active
                      ? "text-[#1B1917]"
                      : "text-[#7A7168] hover:text-[#1B1917]"
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#1B1917]" />
                  )}
                </button>
              );
            })}
          </div>
          <span className="hidden shrink-0 pb-3.5 tabular-nums text-[12px] text-[#7A7168] sm:inline">
            {toPersianDigits(filtered.length)} محصول
          </span>
        </div>

        {/* Product Grid */}
        {catalogLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="aspect-[4/5] w-full bg-[#ECE5DA]" />
                <div className="mt-3.5 h-4 w-2/3 bg-[#ECE5DA]" />
                <div className="mt-2 h-3 w-1/2 bg-[#F1ECE4]" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif-display text-2xl text-[#1B1917]">
              در این دسته هنوز محصولی وجود ندارد.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className="mt-4 border-b border-[#1B1917] pb-0.5 text-xs uppercase tracking-[0.14em]"
            >
              نمایش همه محصولات
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
