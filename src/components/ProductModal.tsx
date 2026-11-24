import React, { useEffect, useState } from "react";
import { X, Star, Heart, Minus, Plus, Check, ShieldCheck, Truck } from "lucide-react";
import {
  formatMoney,
  getEffectivePrice,
  useStore,
} from "../context/StoreContext";

export const ProductModal: React.FC = () => {
  const {
    activeProduct,
    setActiveProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
  } = useStore();

  const [photoIdx, setPhotoIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (activeProduct) {
      setPhotoIdx(0);
      setSelectedColor(activeProduct.colors[0]?.name ?? "Signature");
      setQty(1);
    }
  }, [activeProduct]);

  if (!activeProduct) return null;

  const isSaved = wishlist.includes(activeProduct.id);
  const effectivePrice = getEffectivePrice(activeProduct);
  const hasSale =
    activeProduct.discountedPrice != null &&
    activeProduct.discountedPrice < activeProduct.price;
  const gallery = activeProduct.images.gallery.length
    ? activeProduct.images.gallery
    : [activeProduct.images.main];
  const productReviews = reviews.filter((r) => r.productId === activeProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-[#1A1816]/55 backdrop-blur-[2px]"
        onClick={() => setActiveProduct(null)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={activeProduct.title}
        className="animate-fade-slide subtle-scroll relative z-10 max-h-[90vh] w-full max-w-[980px] overflow-y-auto bg-[#FAF8F5] shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setActiveProduct(null)}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1B1917] transition hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Gallery */}
          <div className="bg-[#F2EDE6] p-5 md:col-span-6">
            <div className="aspect-[4/5] w-full overflow-hidden bg-[#E7E0D5]">
              <img
                src={gallery[photoIdx] ?? activeProduct.images.main}
                alt={activeProduct.title}
                className="h-full w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2.5">
                {gallery.map((url, idx) => (
                  <button
                    key={url + idx}
                    type="button"
                    onClick={() => setPhotoIdx(idx)}
                    className={`h-16 w-16 overflow-hidden border transition ${
                      photoIdx === idx
                        ? "border-[#1B1917]"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${activeProduct.title} view ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#A64B2A]">
                <span>{activeProduct.categoryId}</span>
                <span>·</span>
                <span>{activeProduct.properties.origin}</span>
              </div>

              <h2 className="font-serif-display mt-2 pr-8 text-[34px] font-normal leading-[1.08] text-[#1B1917]">
                {activeProduct.title}
              </h2>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-2.5 tabular-nums">
                  <span className="text-[21px] font-semibold text-[#1B1917]">
                    {formatMoney(effectivePrice)}
                  </span>
                  {hasSale && (
                    <>
                      <span className="text-[14px] text-[#8E847A] line-through">
                        {formatMoney(activeProduct.price)}
                      </span>
                      <span className="text-[11.5px] font-medium text-[#A64B2A]">
                        Save {activeProduct.discountPercent}%
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[12px] text-[#665F57] tabular-nums">
                  <Star className="h-3.5 w-3.5 fill-[#A64B2A] text-[#A64B2A]" />
                  <span className="font-medium text-[#1B1917]">
                    {activeProduct.rating.average.toFixed(1)}
                  </span>
                  <span>({activeProduct.rating.count})</span>
                </div>
              </div>

              <p className="mt-4 text-[13.5px] leading-[1.7] text-[#5B544D]">
                {activeProduct.description}
              </p>

              {/* Color Swatches */}
              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                  Finish:{" "}
                  <span className="font-medium text-[#1B1917]">
                    {selectedColor}
                  </span>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {activeProduct.colors.map((c) => {
                    const active = c.name === selectedColor;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 border px-3 py-1.5 text-[12px] transition ${
                          active
                            ? "border-[#1B1917] bg-[#F2EDE6] text-[#1B1917]"
                            : "border-[#E1D9CE] text-[#665F57] hover:border-[#ADA397]"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/15"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Add to Bag */}
              <div className="mt-6 flex items-stretch gap-3">
                <div className="flex items-center border border-[#D8CFC3]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-12 w-10 items-center justify-center hover:bg-[#EFE9E0]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center tabular-nums text-[13px] font-medium">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(activeProduct.stock || 10, q + 1))}
                    className="flex h-12 w-10 items-center justify-center hover:bg-[#EFE9E0]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(activeProduct, {
                      quantity: qty,
                      color: selectedColor,
                      openDrawer: true,
                    });
                    setActiveProduct(null);
                  }}
                  className="flex-1 bg-[#1B1917] px-5 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] transition hover:bg-[#322D29]"
                >
                  Add to Bag · {formatMoney(effectivePrice * qty)}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(activeProduct.id)}
                  aria-label="Save piece"
                  className={`flex w-12 items-center justify-center border transition ${
                    isSaved
                      ? "border-[#A64B2A] text-[#A64B2A]"
                      : "border-[#D8CFC3] text-[#665F57] hover:border-[#1B1917]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Subtle stock + delivery hint */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[11.5px] text-[#665F57]">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#A64B2A]" />
                  {activeProduct.stock <= 15
                    ? `In stock · ${activeProduct.stock} remaining in batch`
                    : "In stock · Ships today"}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#A64B2A]" />
                  60-day trial · 5-year care
                </span>
              </div>

              {/* Material details aligned directly with EcommerceProduct.properties */}
              <div className="mt-6 border-t border-[#E5DED4] pt-5">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-[#8A8076]">
                      Material
                    </dt>
                    <dd className="mt-0.5 text-[#1B1917]">
                      {activeProduct.properties.material}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-[#8A8076]">
                      Dimensions
                    </dt>
                    <dd className="mt-0.5 text-[#1B1917]">
                      {activeProduct.properties.dimensions}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-[#8A8076]">
                      Weight
                    </dt>
                    <dd className="mt-0.5 text-[#1B1917]">
                      {activeProduct.properties.weight}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-[#8A8076]">
                      Origin
                    </dt>
                    <dd className="mt-0.5 text-[#1B1917]">
                      {activeProduct.properties.origin}
                    </dd>
                  </div>
                </dl>

                {activeProduct.notes.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-[#ECE5DC] pt-4 text-[12px] text-[#5B544D]">
                    {activeProduct.notes.map((n) => (
                      <li key={n} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A64B2A]" />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {productReviews.length > 0 && (
                <div className="mt-5 border-t border-[#E5DED4] pt-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                    Verified note
                  </p>
                  <p className="mt-1.5 font-serif-display text-[19px] leading-snug text-[#1B1917]">
                    “{productReviews[0].comment}”
                  </p>
                  <p className="mt-1 text-[11.5px] text-[#7A7168]">
                    — {productReviews[0].customerName}, {productReviews[0].location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArticleModal: React.FC = () => {
  const { activeArticle, setActiveArticle, products, setActiveProduct } =
    useStore();
  if (!activeArticle) return null;

  const featured = products.find((p) => p.id === activeArticle.featuredProductId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-[#1A1816]/55 backdrop-blur-[2px]"
        onClick={() => setActiveArticle(null)}
      />
      <article className="animate-fade-slide subtle-scroll relative z-10 max-h-[88vh] w-full max-w-[700px] overflow-y-auto bg-[#FAF8F5] shadow-2xl">
        <button
          type="button"
          onClick={() => setActiveArticle(null)}
          aria-label="Close journal entry"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1B1917] hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="aspect-[16/9] w-full overflow-hidden bg-[#E5DDD2]">
          <img
            src={activeArticle.image}
            alt={activeArticle.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-7 sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#A64B2A]">
            {activeArticle.category} · {activeArticle.date}
          </p>
          <h2 className="font-serif-display mt-2 text-[34px] leading-[1.12] text-[#1B1917] sm:text-[40px]">
            {activeArticle.title}
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-[#4C4640]">
            {activeArticle.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {featured && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#E5DED4] pt-6">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={featured.images.main}
                  alt={featured.title}
                  className="h-14 w-14 shrink-0 object-cover bg-[#EFEAE2]"
                />
                <div className="min-w-0">
                  <p className="text-[10.5px] uppercase tracking-[0.14em] text-[#8A8076]">
                    Mentioned in this note
                  </p>
                  <p className="truncate text-[14px] font-medium text-[#1B1917]">
                    {featured.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  setActiveProduct(featured);
                }}
                className="shrink-0 bg-[#1B1917] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#FAF8F5] hover:bg-[#332E2A]"
              >
                Shop · {formatMoney(getEffectivePrice(featured))}
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
