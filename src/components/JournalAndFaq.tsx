import React, { useState } from "react";
import {
  ArrowRight,
  Bell,
  BellOff,
  Check,
  ChevronDown,
} from "lucide-react";
import { FAQ_ITEMS, JOURNAL_ARTICLES } from "../data/catalog";
import { useStore } from "../context/StoreContext";

export const JournalAndFaq: React.FC = () => {
  const {
    setActiveArticle,
    service,
    showToast,
    pushState,
    subscribePush,
    unsubscribePush,
  } = useStore();

  const [openFaq, setOpenFaq] = useState<string>(FAQ_ITEMS[0].id);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    await service.subscribeNewsletter(email.trim());
    setSubmitting(false);
    setSubscribed(true);
    setEmail("");
    showToast("به سولن خوش آمدید؛ کد WELCOME15 را برای ۱۵٪ تخفیف در سبد خرید وارد کنید.");
  };

  const handlePushToggle = async () => {
    setPushBusy(true);
    if (pushState === "subscribed") {
      await unsubscribePush();
    } else {
      await subscribePush();
    }
    setPushBusy(false);
  };

  const pushButtonLabel = (() => {
    if (pushBusy) return "در حال به‌روزرسانی…";
    switch (pushState) {
      case "subscribed":
        return "اعلان مجموعه‌ها فعال است";
      case "denied":
        return "اعلان‌ها مسدود شده‌اند";
      case "unsupported":
        return "اعلان در دسترس نیست";
      case "needs-install":
        return "برای اعلان‌ها برنامه را نصب کنید";
      default:
        return "اعلان مجموعه‌های جدید";
    }
  })();

  return (
    <>
      {/* Editorial Journal */}
      <section
        id="journal"
        className="scroll-mt-24 border-t border-[#E5DED4] bg-[#F2EDE6] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-4 pb-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
                مجله استودیو
              </p>
              <h2 className="font-serif-display mt-2 text-[36px] font-normal leading-[1.08] text-[#1B1917] sm:text-[46px]">
                یادداشت‌هایی از کارگاه و آیین‌های آرام
              </h2>
            </div>
            <p className="text-[13px] text-[#665F57]">
              روایت‌هایی از کالداس، کیوتو و گراس
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {JOURNAL_ARTICLES.map((article) => (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/11] w-full overflow-hidden bg-[#E5DDD2]">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#7A7168]">
                  <span>{article.category}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-serif-display mt-2 text-[26px] font-normal leading-[1.2] text-[#1B1917] transition group-hover:text-[#A64B2A]">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[#665F57]">
                  {article.excerpt}
                </p>
                <span className="mt-3.5 inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#1B1917] transition group-hover:border-[#1B1917]">
                  مطالعه مطلب <ArrowRight className="h-3 w-3" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Questions / Risk-Reversal Accordion */}
      <section className="border-t border-[#E5DED4] bg-[#FAF8F5] py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
              خدمات مشتریان
            </p>
            <h2 className="font-serif-display mt-2 text-[36px] font-normal leading-[1.08] text-[#1B1917] sm:text-[44px]">
              پرسش‌های پرتکرار
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#665F57]">
              ارسال به ۳۸ کشور با بسته‌بندی محافظِ بدون پلاستیک و پشتیبانی مستقیم کارگاه ما در لیسبون.
            </p>
            <p className="mt-5 text-[12.5px] text-[#7A7168]">
              راهنمای خرید ·{" "}
              <a
                href="mailto:atelier@solenliving.com"
                className="text-[#1B1917] underline underline-offset-4 hover:text-[#A64B2A]"
              >
                atelier@solenliving.com
              </a>
            </p>
          </div>

          <div className="divide-y divide-[#E5DED4] border-y border-[#E5DED4] lg:col-span-8">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaq === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? "" : item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-right"
                  >
                    <span className="text-[15.5px] font-medium leading-snug text-[#1B1917]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#665F57] transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#A64B2A]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="animate-fade-slide pb-6 pr-8 text-[14px] leading-[1.72] text-[#665F57]">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Marketing Conversion Band: VIP Email Offer + Native Joorchin Hosted Web Push */}
      <section className="border-t border-[#E5DED4] bg-[#EFE9E0] py-20 sm:py-24">
        <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A64B2A]">
            باشگاه مشتریان · ۱۵٪ تخفیف
          </p>
          <h2 className="font-serif-display mt-3 text-[38px] font-normal leading-[1.08] text-[#1B1917] sm:text-[52px]">
            اولین نفر باشید از مجموعه‌های تازه
          </h2>
          <p className="mx-auto mt-4 max-w-[500px] text-[14.5px] leading-relaxed text-[#665F57]">
            به جمع ۱۹ هزار همراه ما بپیوندید؛ خبر انتشار مجموعه‌ها، یادداشت‌های فصلی و کد ۱۵٪ تخفیف سفارش نخست را زودتر دریافت کنید.
          </p>

          {subscribed ? (
            <div className="mx-auto mt-8 inline-flex items-center gap-2.5 border border-[#1B1917]/20 bg-[#FAF8F5] px-6 py-4 text-[13.5px] text-[#1B1917]">
              <Check className="h-4 w-4 text-[#A64B2A]" />
              <span>
                ثبت‌نام شما انجام شد. هنگام پرداخت کد{" "}
                <strong className="font-mono-tech tracking-wide">
                  WELCOME15
                </strong>{" "}
                را برای ۱۵٪ تخفیف وارد کنید.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletter}
              className="mx-auto mt-8 flex max-w-[480px] flex-col gap-3 sm:flex-row sm:gap-0"
            >
              <label htmlFor="vip-email" className="sr-only">
                نشانی ایمیل
              </label>
              <input
                id="vip-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="نشانی ایمیل خود را وارد کنید"
                className="h-12 flex-1 border border-[#C9BFB2] bg-[#FAF8F5] px-4 text-[13.5px] text-[#1B1917] placeholder:text-[#8E857B] focus:border-[#1B1917] focus:outline-none sm:border-r-0"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-12 shrink-0 bg-[#1B1917] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] transition hover:bg-[#332E2A] disabled:opacity-60"
              >
                {submitting ? "در حال ثبت‌نام…" : "دریافت ۱۵٪ تخفیف"}
              </button>
            </form>
          )}

          {/* Direct Web Push drop & order alerts connected to client.site.push */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12px] text-[#665F57]">
            <span>مایلید اعلان‌های سفارش و مجموعه‌های تازه را دریافت کنید؟</span>
            <button
              type="button"
              onClick={handlePushToggle}
              disabled={
                pushBusy ||
                pushState === "denied" ||
                pushState === "unsupported"
              }
              className="inline-flex items-center gap-1.5 border-b border-[#1B1917]/40 pb-0.5 font-medium text-[#1B1917] transition hover:border-[#A64B2A] hover:text-[#A64B2A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pushState === "subscribed" ? (
                <BellOff className="h-3.5 w-3.5 text-[#A64B2A]" />
              ) : (
                <Bell className="h-3.5 w-3.5" />
              )}
              {pushButtonLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
