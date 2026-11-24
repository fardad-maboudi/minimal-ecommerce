import React from "react";
import { useStore } from "../context/StoreContext";

export const Footer: React.FC = () => {
  const {
    jumpToCategory,
    openAccount,
    setJoorchinOpen,
    connectionMode,
    joorchinConfig,
  } = useStore();

  return (
    <footer className="bg-[#1A1816] text-[#C8BFB4]">
      <div className="mx-auto max-w-[1380px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand overview */}
          <div className="lg:col-span-4">
            <p className="font-serif-display text-[32px] tracking-[0.22em] text-[#FAF8F5]">
              SOLÈN
            </p>
            <p className="mt-4 max-w-[310px] text-[13.5px] leading-[1.7] text-[#9E948A]">
              اشیای کاربردی و ماندگار برای خانه، ساخته‌شده با کارگاه‌های خانوادگی مستقل در کیوتو، کالداس، میلان، گراس و کورتریک.
            </p>
            <p className="mt-6 text-[12px] text-[#7D746B]">
              لیسبون، خیابان اسکولا پلی‌تکنیکا، پلاک ۶۸
            </p>
          </div>

          {/* Column 1: فروشگاه */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAF8F5]">
              فروشگاه
            </p>
            <ul className="mt-5 space-y-3 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("all")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  همه محصولات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("coffee")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  قهوه صبحگاهی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("lighting")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  زندگی و نور
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("botanical")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  رایحه گیاهی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("textiles")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  کتان بافت‌دار
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAF8F5]">
              خدمات مشتریان
            </p>
            <ul className="mt-5 space-y-3 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => openAccount("orders")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  پیگیری سفارش
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAccount("signin")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  ورود اعضا
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAccount("wishlist")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  علاقه‌مندی‌ها
                </button>
              </li>
              <li>
                <a href="#bundles" className="transition hover:text-[#FAF8F5]">
                  ست‌های هدیه
                </a>
              </li>
              <li>
                <a href="#journal" className="transition hover:text-[#FAF8F5]">
                  مجله استودیو
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Backend Studio Link */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAF8F5]">
              زیرساخت فروشگاه
            </p>
            <p className="mt-5 text-[13px] leading-relaxed text-[#9E948A]">
              متصل مستقیم به{" "}
              <code className="font-mono-tech text-[11.5px] text-[#DED5CA]">
                @joorchin/client-sdk
              </code>{" "}
              برای مدیریت محصولات، ورود، پرداخت، اعلان‌ها و پردازش سفارش‌ها.
            </p>
            <button
              type="button"
              onClick={() => setJoorchinOpen(true)}
              className="mt-4 inline-flex items-center gap-2 border border-[#F5F1EB]/25 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-[#FAF8F5] transition hover:border-[#FAF8F5]"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  connectionMode === "connected"
                    ? "bg-emerald-400"
                    : "bg-[#D79272]"
                }`}
              />
              {connectionMode === "connected"
                ? `متصل · ${joorchinConfig.appId}`
                : "اتصال به فروشگاه"}
            </button>
          </div>
        </div>

        {/* Bottom hairline bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#F5F1EB]/12 pt-8 text-[12px] text-[#7F766D] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()}، آتلیه سولن. تمامی حقوق محفوظ است.</p>
          <p className="tracking-[0.06em]">
            ویزا · مسترکارت · اپل‌پی · انتقال مستقیم · پرداخت امن
          </p>
        </div>
      </div>
    </footer>
  );
};
