import React, { useMemo, useState } from "react";
import { Check, Gift, Sparkles } from "lucide-react";
import { CURATED_BUNDLES } from "../data/catalog";
import {
  formatMoney,
  getEffectivePrice,
  useStore,
} from "../context/StoreContext";
import type { StoreProduct } from "../types/store";

export const RitualBundleBuilder: React.FC = () => {
  const { products, addBundleToCart } = useStore();
  const [mode, setMode] = useState<"curated" | "custom">("curated");

  // Custom 3-piece picker (one per ritual pillar, pre-seeded for instant exploration)
  const slots = useMemo(() => {
    const morning = products.filter((p) => p.bundleSlot === "morning");
    const ambient = products.filter((p) => p.bundleSlot === "ambient");
    const tactile = products.filter((p) => p.bundleSlot === "tactile");
    return [
      {
        key: "morning",
        step: "01",
        title: "آیین قهوه صبحگاهی",
        options: morning.length ? morning : products.slice(0, 3),
      },
      {
        key: "ambient",
        step: "02",
        title: "نور و سنگ",
        options: ambient.length ? ambient : products.slice(1, 4),
      },
      {
        key: "tactile",
        step: "03",
        title: "رایحه و پارچه",
        options: tactile.length ? tactile : products.slice(3, 6),
      },
    ];
  }, [products]);

  const [picked, setPicked] = useState<Record<string, string>>({
    morning: "solen-kanso-kettle",
    ambient: "solen-lume-lamp",
    tactile: "solen-figue-diffuser",
  });

  const togglePick = (slotKey: string, id: string) => {
    setPicked((prev) => ({
      ...prev,
      [slotKey]: prev[slotKey] === id ? "" : id,
    }));
  };

  const selectedItems = useMemo(() => {
    return Object.values(picked)
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is StoreProduct => Boolean(p));
  }, [picked, products]);

  const customDiscount =
    selectedItems.length >= 3 ? 22 : selectedItems.length === 2 ? 15 : 0;
  const rawTotal = selectedItems.reduce((s, p) => s + getEffectivePrice(p), 0);
  const savedAmount = Math.round(rawTotal * (customDiscount / 100) * 100) / 100;
  const finalTotal = Math.max(0, rawTotal - savedAmount);

  return (
    <section id="bundles" className="scroll-mt-24 bg-[#F2EDE6] py-20 sm:py-24">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Header + clean two-mode toggle */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#DFD7CC] pb-8 md:flex-row md:items-end">
          <div className="max-w-[540px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
              ست بسازید و تا ۲۲٪ تخفیف بگیرید
            </p>
            <h2 className="font-serif-display mt-2 text-[36px] font-normal leading-[1.08] text-[#1B1917] sm:text-[48px]">
              ست‌های آیینی منتخب
            </h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#665F57]">
              محصولات هماهنگ را کنار هم انتخاب کنید؛ با نوار کتان خام و کارت هدیه دست‌نویس بسته‌بندی می‌شوند و ارسال سریع رایگان دارند.
            </p>
          </div>

          <div className="inline-flex self-start border border-[#D8CFC3] bg-[#FAF8F5] p-1 md:self-end">
            <button
              type="button"
              onClick={() => setMode("curated")}
              className={`px-4 py-2 text-[11.5px] font-medium uppercase tracking-[0.13em] transition ${
                mode === "curated"
                  ? "bg-[#1B1917] text-[#FAF8F5]"
                  : "text-[#665F57] hover:text-[#1B1917]"
              }`}
            >
              ست‌های منتخب
            </button>
            <button
              type="button"
              onClick={() => setMode("custom")}
              className={`px-4 py-2 text-[11.5px] font-medium uppercase tracking-[0.13em] transition ${
                mode === "custom"
                  ? "bg-[#1B1917] text-[#FAF8F5]"
                  : "text-[#665F57] hover:text-[#1B1917]"
              }`}
            >
              ست سه‌تایی خود را بسازید
            </button>
          </div>
        </div>

        {/* Mode 1: Curated Pre-Built High-Converting Sets */}
        {mode === "curated" ? (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {CURATED_BUNDLES.map((bundle) => {
              const bundleProducts = bundle.productIds
                .map((id) => products.find((p) => p.id === id))
                .filter((p): p is StoreProduct => Boolean(p));

              if (bundleProducts.length === 0) return null;

              const regular = bundleProducts.reduce(
                (s, p) => s + getEffectivePrice(p),
                0
              );
              const setPrice = Math.round(
                regular * ((100 - bundle.discountPercent) / 100)
              );
              const saved = regular - setPrice;

              return (
                <article
                  key={bundle.id}
                  className="group flex flex-col justify-between bg-[#FAF8F5]"
                >
                  <div>
                    <div className="relative aspect-[16/11] overflow-hidden bg-[#E9E2D7]">
                      <img
                        src={bundle.image}
                        alt={bundle.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="absolute right-4 top-4 bg-[#FAF8F5]/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#A64B2A]">
                        {bundle.tagline}
                      </span>
                    </div>

                    <div className="p-6 sm:p-7">
                      <h3 className="font-serif-display text-[28px] font-normal leading-tight text-[#1B1917]">
                        {bundle.title}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-[#665F57]">
                        {bundle.description}
                      </p>

                      {/* Included pieces */}
                      <ul className="mt-5 space-y-2 border-t border-[#EAE3D9] pt-4">
                        {bundleProducts.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between text-[12.5px] text-[#3F3A35]"
                          >
                            <span className="flex items-center gap-2 truncate pr-3">
                              <Check className="h-3.5 w-3.5 shrink-0 text-[#A64B2A]" />
                              <span className="truncate">{item.title}</span>
                            </span>
                            <span className="shrink-0 tabular-nums text-[#8A8177]">
                              {formatMoney(getEffectivePrice(item))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#EAE3D9] px-6 py-5 sm:px-7">
                    <div className="tabular-nums">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[18px] font-semibold text-[#1B1917]">
                          {formatMoney(setPrice)}
                        </span>
                        <span className="text-[13px] text-[#8E847A] line-through">
                          {formatMoney(regular)}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-[#A64B2A]">
                        صرفه‌جویی شما {formatMoney(saved)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addBundleToCart(
                          bundleProducts,
                          bundle.discountPercent,
                          bundle.title
                        )
                      }
                      className="bg-[#1B1917] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[#FAF8F5] transition hover:bg-[#332E2A]"
                    >
                      افزودن ست
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Mode 2: Interactive Custom 3-Step Bundle Configurator */
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              {slots.map((slot) => (
                <div key={slot.key} className="bg-[#FAF8F5] p-6">
                  <div className="mb-4 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono-tech text-[11px] text-[#A64B2A]">
                        {slot.step}
                      </span>
                      <h3 className="font-serif-display text-[25px] text-[#1B1917]">
                        انتخاب {slot.title}
                      </h3>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-[#7F766D]">
                      {picked[slot.key] ? "انتخاب‌شده" : "دلخواه"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {slot.options.slice(0, 3).map((option) => {
                      const active = picked[slot.key] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => togglePick(slot.key, option.id)}
                          className={`flex flex-col border text-left transition ${
                            active
                              ? "border-[#1B1917] bg-[#F7F3ED]"
                              : "border-[#E6DFD5] bg-white/60 hover:border-[#BEB4A8]"
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EDE6DC]">
                            <img
                              src={option.images.main}
                              alt={option.title}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                            {active && (
                              <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1B1917] text-[#FAF8F5]">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-1 text-[12.5px] font-medium text-[#1B1917]">
                              {option.title}
                            </p>
                            <p className="mt-0.5 tabular-nums text-[12px] text-[#665F57]">
                              {formatMoney(getEffectivePrice(option))}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Live dynamic bundle summary */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 bg-[#FAF8F5] p-7">
                <div className="flex items-center justify-between border-b border-[#E5DED4] pb-4">
                  <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#A64B2A]">
                    <Gift className="h-3.5 w-3.5" />
                    ست دلخواه شما
                  </span>
                  <span className="tabular-nums text-[12px] font-medium text-[#1B1917]">
                    {selectedItems.length} / 3 انتخاب‌شده
                  </span>
                </div>

                {/* Live tier progress */}
                <div className="mt-4 bg-[#F2EDE6] px-4 py-3 text-[12px] text-[#453F3A]">
                  {selectedItems.length >= 3 ? (
                    <span className="flex items-center gap-1.5 font-medium text-[#1B1917]">
                      <Sparkles className="h-3.5 w-3.5 text-[#A64B2A]" />
                      تخفیف ۲۲٪ ست سه‌تایی فعال شد؛ بسته‌بندی هدیه رایگان
                    </span>
                  ) : selectedItems.length === 2 ? (
                    <span>
                      تخفیف ۱۵٪ ست دوتایی فعال است؛ برای تخفیف بیشتر یک محصول دیگر انتخاب کنید{" "}
                      <strong className="text-[#A64B2A]">۲۲٪ تخفیف</strong>.
                    </span>
                  ) : (
                    <span>
                      با انتخاب ۲ محصول، <strong>۱۵٪ تخفیف</strong> می‌گیرید؛ برای ۳ محصول{" "}
                      <strong className="text-[#A64B2A]">۲۲٪ تخفیف</strong>.
                    </span>
                  )}
                </div>

                <ul className="mt-5 divide-y divide-[#ECE5DC]">
                  {selectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 py-3 text-[13px]"
                    >
                      <img
                        src={item.images.main}
                        alt={item.title}
                        className="h-12 w-12 shrink-0 object-cover bg-[#EDE6DC]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[#1B1917]">
                          {item.title}
                        </p>
                        <p className="tabular-nums text-[12px] text-[#7A7168]">
                          {formatMoney(getEffectivePrice(item))}
                        </p>
                      </div>
                    </li>
                  ))}
                  {selectedItems.length === 0 && (
                    <li className="py-8 text-center text-[13px] text-[#7A7168]">
                      برای ساخت جعبه هدیه، محصولات را از فهرست انتخاب کنید.
                    </li>
                  )}
                </ul>

                <div className="mt-4 space-y-2 border-t border-[#E5DED4] pt-4 text-[13px] tabular-nums">
                  <div className="flex justify-between text-[#665F57]">
                    <span>جمع محصولات</span>
                    <span>{formatMoney(rawTotal)}</span>
                  </div>
                  {customDiscount > 0 && (
                    <div className="flex justify-between font-medium text-[#A64B2A]">
                      <span>تخفیف ست ({customDiscount}%)</span>
                      <span>−{formatMoney(savedAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#ECE5DC] pt-3 text-[16px] font-semibold text-[#1B1917]">
                    <span>قیمت ست</span>
                    <span>{formatMoney(finalTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={selectedItems.length < 2}
                  onClick={() =>
                    addBundleToCart(
                      selectedItems,
                      customDiscount,
                      selectedItems.length === 3 ? "ست سه‌تایی دلخواه" : "ست دوتایی دلخواه"
                    )
                  }
                  className="mt-6 w-full bg-[#1B1917] py-4 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] transition hover:bg-[#342F2A] disabled:cursor-not-allowed disabled:bg-[#C7BEB2]"
                >
                  {selectedItems.length < 2
                    ? "دست‌کم ۲ محصول انتخاب کنید"
                    : `افزودن ست · Save ${formatMoney(savedAmount)}`}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};
