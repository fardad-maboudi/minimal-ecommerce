import React, { useState } from "react";
import { Star, PenLine, X } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { toPersianDigits } from "../utils/localization";

const QUALITY_TAGS = [
  "حس بافتی دلنشین",
  "بسته‌بندی شایسته هدیه",
  "همراه هر روز",
  "همانند تصاویر",
  "ماندگار برای سال‌ها",
];

export const ReviewsSection: React.FC = () => {
  const { reviews, products, addReview, setActiveProduct, user } = useStore();
  const [composerOpen, setComposerOpen] = useState(false);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [customerName, setCustomerName] = useState(user?.fullName ?? "");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["همراه هر روز"]);
  const [submitting, setSubmitting] = useState(false);

  const avgScore = (
    reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length)
  ).toFixed(1);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 3)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;
    setSubmitting(true);
    await addReview({
      productId: productId || products[0]?.id || "",
      customerName,
      location,
      comment,
      rating,
      qualities: selectedTags,
    });
    setSubmitting(false);
    setComment("");
    setLocation("");
    setComposerOpen(false);
  };

  return (
    <section className="border-t border-[#E5DED4] bg-[#FAF8F5] py-20 sm:py-24">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Summary headline with grounded social-proof metrics */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#E5DED4] pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
              در خانه‌های واقعی
            </p>
            <h2 className="font-serif-display mt-2 text-[36px] font-normal leading-[1.08] text-[#1B1917] sm:text-[46px]">
              تجربه مشتریان تأییدشده
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-baseline gap-2.5 tabular-nums">
              <span className="font-serif-display text-[40px] leading-none text-[#1B1917]">
                {toPersianDigits(avgScore)}
              </span>
              <div>
                <div className="flex items-center gap-0.5 text-[#A64B2A]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-[11.5px] text-[#665F57]">
                  ۹۸٪ پیشنهاد می‌کنند · {toPersianDigits(1838 + reviews.length)} خانه
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setComposerOpen((v) => !v)}
              className="inline-flex items-center gap-2 border border-[#D4C9BC] px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#1B1917] transition hover:border-[#1B1917]"
            >
              {composerOpen ? (
                <>
                  <X className="h-3.5 w-3.5" /> بستن
                </>
              ) : (
                <>
                  <PenLine className="h-3.5 w-3.5" /> ثبت دیدگاه
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional expandable review submission form (calls client.site.plugin('ecommerce').action('comments')) */}
        {composerOpen && (
          <form
            onSubmit={handleSubmit}
            className="animate-fade-slide mt-8 border border-[#DFD7CB] bg-[#F5F1EB] p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                  محصول موردنظر
                </label>
                <select
                  value={productId || products[0]?.id || ""}
                  onChange={(e) => setProductId(e.target.value)}
                  className="mt-1.5 h-10 w-full border border-[#D7CEC2] bg-[#FAF8F5] px-3 text-[13px] text-[#1B1917] focus:border-[#1B1917] focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                  نام شما *
                </label>
                <input
                  type="text"
                  required
                  placeholder="النا روستوا"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1.5 h-10 w-full border border-[#D7CEC2] bg-[#FAF8F5] px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                  شهر
                </label>
                <input
                  type="text"
                  placeholder="استکهلم"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 h-10 w-full border border-[#D7CEC2] bg-[#FAF8F5] px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="mr-2 text-[11px] uppercase tracking-[0.14em] text-[#665F57]">
                  امتیاز
                </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`امتیاز ${star} از ۵`}
                    onClick={() => setRating(star)}
                    className={
                      star <= rating ? "text-[#A64B2A]" : "text-[#CFC6BA]"
                    }
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUALITY_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 text-[11px] transition ${
                        active
                          ? "bg-[#1B1917] text-[#FAF8F5]"
                          : "border border-[#D8CFC3] bg-[#FAF8F5] text-[#665F57]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="از تجربه استفاده روزمره‌تان از این محصول بگویید..."
                className="w-full border border-[#D7CEC2] bg-[#FAF8F5] p-3 text-[13.5px] focus:border-[#1B1917] focus:outline-none"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#1B1917] px-6 py-3 text-[11.5px] font-medium uppercase tracking-[0.15em] text-[#FAF8F5] transition hover:bg-[#332E2A] disabled:opacity-60"
              >
                {submitting ? "در حال انتشار…" : "ثبت دیدگاه"}
              </button>
            </div>
          </form>
        )}

        {/* Editorial 4-column hairline reviews */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reviews.slice(0, 4).map((rev) => {
            const linkedProduct = products.find((p) => p.id === rev.productId);
            return (
              <article
                key={rev.id}
                className="flex flex-col justify-between border-t border-[#E5DED4] pt-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-[#A64B2A]">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8E847A]">{rev.date}</span>
                  </div>
                  <blockquote className="font-serif-display mt-4 text-[21px] leading-[1.36] text-[#1B1917]">
                    “{rev.comment}”
                  </blockquote>
                </div>

                <div className="mt-6">
                  <p className="text-[12.5px] font-medium text-[#1B1917]">
                    {rev.customerName}
                    <span className="font-normal text-[#7A7168]">
                      {" "}
                      · {rev.location}
                    </span>
                  </p>
                  {linkedProduct ? (
                    <button
                      type="button"
                      onClick={() => setActiveProduct(linkedProduct)}
                      className="mt-1 text-right text-[11.5px] text-[#A64B2A] underline-offset-4 hover:underline"
                    >
                      تأییدشده · {rev.productTitle}
                    </button>
                  ) : (
                    <p className="mt-1 text-[11.5px] text-[#7A7168]">
                      تأییدشده · {rev.productTitle}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
