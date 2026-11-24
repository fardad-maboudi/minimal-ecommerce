import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  formatMoney,
  getEffectivePrice,
  useStore,
} from "../context/StoreContext";

const SUGGESTED = ["Kettle", "Stoneware", "Lamp", "Wild Fig", "Linen", "Travertine"];

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, products, setActiveProduct, addToCart } =
    useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 4);
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryId.toLowerCase().includes(q) ||
        p.properties.material.toLowerCase().includes(q) ||
        p.properties.origin.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:pt-24">
      <div
        className="fixed inset-0 bg-[#1A1816]/50 backdrop-blur-[2px]"
        onClick={() => setSearchOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search catalog"
        className="animate-fade-slide relative z-10 w-full max-w-[680px] bg-[#FAF8F5] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[#E5DED4] px-5 py-4">
          <Search className="h-4 w-4 text-[#7A7168]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, materials, or origins…"
            className="flex-1 bg-transparent text-[15px] text-[#1B1917] placeholder:text-[#968D83] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="p-1 text-[#665F57] hover:text-[#1B1917]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Popular search pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#EFE8DF] px-5 py-3">
          <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#8E847A] mr-1">
            Popular:
          </span>
          {SUGGESTED.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="border border-[#E2D9CE] px-2.5 py-1 text-[11.5px] text-[#4C4640] transition hover:border-[#1B1917] hover:text-[#1B1917]"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="subtle-scroll max-h-[55vh] divide-y divide-[#EFE9E0] overflow-y-auto px-5 py-2">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif-display text-[24px] text-[#1B1917]">
                No matches for “{query}”
              </p>
              <p className="mt-1 text-[13px] text-[#7A7168]">
                Try coffee, lamp, ceramic, Belgian linen, or cedar.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveProduct(item);
                  }}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left group"
                >
                  <img
                    src={item.images.main}
                    alt={item.title}
                    className="h-14 w-12 shrink-0 object-cover bg-[#EFE9E0]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-[#1B1917] group-hover:text-[#A64B2A]">
                      {item.title}
                    </p>
                    <p className="truncate text-[12px] text-[#7A7168]">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="tabular-nums text-[13.5px] font-medium text-[#1B1917]">
                    {formatMoney(getEffectivePrice(item))}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      addToCart(item, { openDrawer: true });
                    }}
                    className="border border-[#1B1917] px-3 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#1B1917] transition hover:bg-[#1B1917] hover:text-[#FAF8F5]"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
