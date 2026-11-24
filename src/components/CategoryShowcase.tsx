import React from "react";
import { ArrowUpRight } from "lucide-react";
import { STORE_CATEGORIES } from "../data/catalog";
import { useStore } from "../context/StoreContext";

export const CategoryShowcase: React.FC = () => {
  const { jumpToCategory } = useStore();

  return (
    <section
      id="collections"
      className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5DED4] pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
            فضاهای منتخب
          </p>
          <h2 className="font-serif-display mt-2 text-[36px] font-normal leading-[1.08] text-[#1B1917] sm:text-[46px]">
            خرید بر اساس آیین روزمره
          </h2>
        </div>
        <button
          type="button"
          onClick={() => jumpToCategory("all")}
          className="self-start text-[12px] font-medium uppercase tracking-[0.14em] text-[#453F3A] transition hover:text-[#1B1917] sm:self-end"
        >
          مشاهده همه محصولات ←
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STORE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => jumpToCategory(category.id)}
            className="group text-right focus:outline-none"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EDE7DE]">
              <img
                src={category.imageUrl}
                alt={category.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/45 via-transparent to-transparent opacity-80 transition group-hover:opacity-90" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#FAF8F5]">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#F2ECE3]/90">
                  {category.countLabel}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FAF8F5]/45 bg-[#1A1816]/25 backdrop-blur-xs transition group-hover:bg-[#FAF8F5] group-hover:text-[#1B1917]">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
            <h3 className="font-serif-display mt-4 text-[25px] font-normal leading-tight text-[#1B1917] transition group-hover:text-[#A64B2A]">
              {category.title}
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-[#665F57]">
              {category.subtitle}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};
