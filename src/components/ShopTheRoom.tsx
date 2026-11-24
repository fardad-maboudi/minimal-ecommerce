import React, { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { LOOKBOOK_HOTSPOTS } from "../data/catalog";
import {
  formatMoney,
  getEffectivePrice,
  useStore,
} from "../context/StoreContext";
import type { StoreProduct } from "../types/store";

export const ShopTheRoom: React.FC = () => {
  const { products, addToCart, addBundleToCart, setActiveProduct } = useStore();
  const [activeId, setActiveId] = useState<string>(LOOKBOOK_HOTSPOTS[0].id);

  const activeSpot =
    LOOKBOOK_HOTSPOTS.find((h) => h.id === activeId) ?? LOOKBOOK_HOTSPOTS[0];
  const activeProduct =
    products.find((p) => p.id === activeSpot.productId) ?? products[0];

  const roomProducts = LOOKBOOK_HOTSPOTS.map((h) =>
    products.find((p) => p.id === h.productId)
  ).filter((p): p is StoreProduct => Boolean(p));

  const roomSum = roomProducts.reduce((s, p) => s + getEffectivePrice(p), 0);
  const roomDiscounted = Math.round(roomSum * 0.82);

  return (
    <section
      id="lookbook"
      className="scroll-mt-24 mx-auto max-w-[1380px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="flex flex-col justify-between gap-4 pb-10 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
            Shop the Room · Tap any point
          </p>
          <h2 className="font-serif-display mt-2 text-[36px] font-normal leading-[1.08] text-[#1B1917] sm:text-[48px]">
            The Lisbon living room
          </h2>
        </div>
        {roomProducts.length >= 2 && (
          <button
            type="button"
            onClick={() =>
              addBundleToCart(roomProducts, 18, "Complete Room Edit")
            }
            className="inline-flex items-center gap-2 self-start border border-[#1B1917] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#1B1917] transition hover:bg-[#1B1917] hover:text-[#FAF8F5] sm:self-end"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Shop all {roomProducts.length} · {formatMoney(roomDiscounted)} (Save 18%)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Interactive full lifestyle photograph with architectural pins */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E9E2D8] lg:col-span-8">
          <img
            src="/images/lookbook-room.jpg"
            alt="Minimalist European apartment styled with Lume table lamp, wild fig diffuser, speckled ceramic bowls, and draped Belgian linen throw"
            loading="lazy"
            className="h-full w-full object-cover"
          />

          {LOOKBOOK_HOTSPOTS.map((spot) => {
            const selected = spot.id === activeSpot.id;
            const prod = products.find((p) => p.id === spot.productId);
            return (
              <button
                key={spot.id}
                type="button"
                aria-label={`Inspect ${prod?.title ?? `object ${spot.number}`}`}
                onClick={() => setActiveId(spot.id)}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full text-[11.5px] font-medium transition duration-200 ${
                  selected
                    ? "bg-[#A64B2A] text-[#FAF8F5] scale-110 shadow-lg ring-4 ring-[#FAF8F5]/50"
                    : "hotspot-pulse bg-[#FAF8F5]/95 text-[#1B1917] shadow-md hover:scale-105"
                }`}
              >
                {spot.number}
              </button>
            );
          })}
        </div>

        {/* Focused docked object inspector card */}
        {activeProduct && (
          <div className="flex flex-col justify-between border border-[#E5DED4] bg-[#FAF8F5] p-6 sm:p-8 lg:col-span-4">
            <div>
              {/* Quick numbered pin index */}
              <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A7168]">
                  Piece 0{activeSpot.number} of 0{LOOKBOOK_HOTSPOTS.length}
                </span>
                <div className="flex gap-1.5">
                  {LOOKBOOK_HOTSPOTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveId(s.id)}
                      className={`h-6 w-6 tabular-nums text-[11px] transition ${
                        s.id === activeSpot.id
                          ? "bg-[#1B1917] text-[#FAF8F5]"
                          : "bg-[#F0EAE1] text-[#665F57] hover:text-[#1B1917]"
                      }`}
                    >
                      {s.number}
                    </button>
                  ))}
                </div>
              </div>

              <div
                key={activeProduct.id}
                className="animate-fade-slide mt-6"
              >
                <div
                  onClick={() => setActiveProduct(activeProduct)}
                  className="aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[#EFEAE2]"
                >
                  <img
                    src={activeProduct.images.main}
                    alt={activeProduct.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>

                <h3 className="font-serif-display mt-5 text-[27px] leading-tight text-[#1B1917]">
                  <button
                    type="button"
                    onClick={() => setActiveProduct(activeProduct)}
                    className="text-left hover:text-[#A64B2A]"
                  >
                    {activeProduct.title}
                  </button>
                </h3>
                <p className="mt-1 text-[13px] text-[#665F57]">
                  {activeSpot.placementNote}
                </p>

                <div className="mt-4 flex items-baseline gap-2 tabular-nums">
                  <span className="text-[18px] font-medium text-[#1B1917]">
                    {formatMoney(getEffectivePrice(activeProduct))}
                  </span>
                  {activeProduct.discountedPrice != null && (
                    <span className="text-[13px] text-[#8D847A] line-through">
                      {formatMoney(activeProduct.price)}
                    </span>
                  )}
                  <span className="ml-auto text-[11.5px] text-[#7A7168]">
                    {activeProduct.properties.origin}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  addToCart(activeProduct, { quantity: 1, openDrawer: true })
                }
                className="flex flex-1 items-center justify-center gap-2 bg-[#1B1917] py-3.5 text-[11.5px] font-medium uppercase tracking-[0.15em] text-[#FAF8F5] transition hover:bg-[#342F2A]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to Bag
              </button>
              <button
                type="button"
                onClick={() => setActiveProduct(activeProduct)}
                className="border border-[#D8CFC3] px-4 py-3.5 text-[11.5px] uppercase tracking-[0.14em] text-[#453F3A] transition hover:border-[#1B1917] hover:text-[#1B1917]"
              >
                Inspect
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
