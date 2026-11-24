import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { formatMoney, getEffectivePrice, useStore } from "../context/StoreContext";
import { toPersianDigits } from "../utils/localization";

function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((s) => (s > 0 ? s - 1 : initialSeconds));
    }, 1000);
    return () => window.clearInterval(id);
  }, [initialSeconds]);

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return { days, hours, minutes, seconds };
}

export const FlagshipDrop: React.FC = () => {
  const { products, addToCart, setActiveProduct } = useStore();
  const time = useCountdown(2 * 86400 + 14 * 3600 + 38 * 60 + 19);

  const flagship =
    products.find((p) => p.id === "solen-kanso-kettle") || products[0];
  if (!flagship) return null;

  const price = getEffectivePrice(flagship);
  const pad = (n: number) => toPersianDigits(String(n).padStart(2, "0"));

  return (
    <section className="w-full bg-[#1A1816] text-[#F5F1EB]">
      <div className="mx-auto grid max-w-[1380px] grid-cols-1 items-stretch lg:grid-cols-12">
        {/* Dramatic full-bleed dark photograph */}
        <div className="relative min-h-[400px] overflow-hidden lg:col-span-6 lg:min-h-[640px]">
          <img
            src="/images/spotlight-drop.jpg"
            alt="دم‌آور محدود کانسو با سرامیک آبسیدین و برنز، در نور عصرگاهی"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-5 right-5 bg-[#1A1816]/80 px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#E6DDD1] backdrop-blur-xs">
            سری ۰۴ · تنها {toPersianDigits(flagship.stock)} عدد شماره‌گذاری‌شده باقی مانده
          </div>
        </div>

        {/* High-converting story + offer right half */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:col-span-6 lg:px-16 lg:py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#D79272]">
            انتشار ویژه · تخفیف {formatMoney(flagship.price - price || 30)}
          </p>

          <h2 className="font-serif-display mt-3 text-[40px] font-normal leading-[1.06] text-[#FAF8F5] sm:text-[52px]">
            آیین <em className="italic">دم‌آوری</em> کانسو
          </h2>

          <p className="mt-5 max-w-[460px] text-[15px] leading-[1.72] text-[#C8BFB5]">
            این محصول طی هجده ماه و با همکاری کارگاه فلزکاری نسل‌سومی در کیوتو طراحی شد. چوب گردوی دودیِ متعادل‌شده، جریان آرام و باریک ۰٫۹ میلی‌متری آب و قوری بوروسیلیکات شیاردار، تجربه‌ای دلنشین برای هر روز می‌سازند.
          </p>

          {/* Compact architectural specs strip */}
          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-[#F5F1EB]/14 py-5">
            <div>
              <dt className="text-[10.5px] uppercase tracking-[0.16em] text-[#9E958B]">
                جریان خروجی
              </dt>
              <dd className="font-serif-display mt-1 text-[24px] text-[#FAF8F5]">
                ۰٫۹ میلی‌متر
              </dd>
            </div>
            <div>
              <dt className="text-[10.5px] uppercase tracking-[0.16em] text-[#9E958B]">
                گنجایش
              </dt>
              <dd className="font-serif-display mt-1 text-[24px] text-[#FAF8F5]">
                ۹۰۰ میلی‌لیتر
              </dd>
            </div>
            <div>
              <dt className="text-[10.5px] uppercase tracking-[0.16em] text-[#9E958B]">
                پشتیبانی
              </dt>
              <dd className="font-serif-display mt-1 text-[24px] text-[#FAF8F5]">
                ۵ سال
              </dd>
            </div>
          </dl>

          {/* Quiet live reservation window countdown */}
          <div className="mt-7 flex items-center gap-6">
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-[#9E958B]">
              پایان قیمت پاییزی
            </span>
            <div className="flex items-center gap-3 tabular-nums text-[15px] font-medium text-[#FAF8F5]">
              <span>
                {pad(time.days)}
                <span className="ml-0.5 text-[11px] font-normal text-[#9E958B]">روز</span>
              </span>
              <span className="text-[#595149]">:</span>
              <span>
                {pad(time.hours)}
                <span className="ml-0.5 text-[11px] font-normal text-[#9E958B]">ساعت</span>
              </span>
              <span className="text-[#595149]">:</span>
              <span>
                {pad(time.minutes)}
                <span className="ml-0.5 text-[11px] font-normal text-[#9E958B]">دقیقه</span>
              </span>
              <span className="text-[#595149]">:</span>
              <span>
                {pad(time.seconds)}
                <span className="ml-0.5 text-[11px] font-normal text-[#9E958B]">ثانیه</span>
              </span>
            </div>
          </div>

          {/* Primary conversion CTA */}
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() =>
                addToCart(flagship, {
                  quantity: 1,
                  color: flagship.colors[0]?.name,
                  openDrawer: true,
                })
              }
              className="group inline-flex items-center gap-3 bg-[#FAF8F5] px-7 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-[#1B1917] transition hover:bg-[#EDE5DB]"
            >
              افزودن نسخه ویژه — {formatMoney(price)}
              {flagship.discountedPrice != null && (
                <span className="text-[#877D72] line-through">
                  {formatMoney(flagship.price)}
                </span>
              )}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveProduct(flagship)}
              className="border-b border-[#F5F1EB]/45 pb-1 text-[12px] uppercase tracking-[0.15em] text-[#E6DDD1] transition hover:border-[#FAF8F5] hover:text-[#FAF8F5]"
            >
              مشخصات کامل
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
