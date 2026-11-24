import React, { useMemo, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import {
  formatMoney,
  getEffectivePrice,
  useStore,
} from "../context/StoreContext";
import {
  EXPRESS_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "../data/catalog";
import type { StoreOrder } from "../types/store";
import { localizeOrderStatus, toPersianDigits } from "../utils/localization";

type DrawerStep = "bag" | "checkout" | "confirmed";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartCount,
    cartSubtotal,
    voucher,
    voucherDiscount,
    freeShippingUnlocked,
    amountToFreeShipping,
    products,
    addToCart,
    updateCartQty,
    removeCartItem,
    applyVoucher,
    removeVoucher,
    placeOrder,
    openAccount,
    user,
  } = useStore();

  const [step, setStep] = useState<DrawerStep>("bag");
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  // Checkout state aligned with order request + shipping
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [mobile, setMobile] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<StoreOrder | null>(null);

  const crossSell = useMemo(() => {
    const inBag = new Set(cart.map((c) => c.productId));
    return products.filter((p) => !inBag.has(p.id)).slice(0, 2);
  }, [cart, products]);

  if (!cartOpen) return null;

  const standardCost = freeShippingUnlocked ? 0 : STANDARD_SHIPPING_FEE;
  const shippingCost =
    shippingMethod === "express" ? EXPRESS_SHIPPING_FEE : standardCost;
  const grandTotal = Math.max(0, cartSubtotal - voucherDiscount + shippingCost);
  const progressPct = Math.min(
    100,
    Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const closeDrawer = () => {
    setCartOpen(false);
    window.setTimeout(() => {
      if (step === "confirmed") setStep("bag");
    }, 200);
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoLoading(true);
    const res = await applyVoucher(promoInput);
    setPromoLoading(false);
    if (res.ok) {
      setPromoInput("");
    } else if (res.error) {
      setPromoError(res.error);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    const created = await placeOrder({
      shippingMethod,
      shippingCost,
      shippingAddress: {
        full_name: fullName.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        building_number: buildingNumber.trim(),
        unit: unit.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        note: giftNote.trim() || undefined,
      },
    });
    setPlacing(false);
    setConfirmedOrder(created);
    setStep("confirmed");
  };

  return (
    <div dir="ltr" className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#1A1816]/45 backdrop-blur-[2px]"
        onClick={closeDrawer}
      />

      <aside
        aria-label="سبد خرید"
        dir="rtl" className="animate-drawer-in relative z-10 flex h-full w-full max-w-[460px] flex-col bg-[#FAF8F5] shadow-2xl"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E5DED4] px-6 py-5">
          <div className="flex items-center gap-3">
            {step === "checkout" && (
              <button
                type="button"
                onClick={() => setStep("bag")}
                aria-label="بازگشت به سبد"
                className="p-1 text-[#665F57] hover:text-[#1B1917]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="font-serif-display text-[26px] font-normal text-[#1B1917]">
              {step === "bag"
                ? `سبد خرید شما (${toPersianDigits(cartCount)})`
                : step === "checkout"
                  ? "پرداخت سریع"
                  : "سفارش تأیید شد"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="بستن سبد"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#665F57] transition hover:bg-[#EFE9E0] hover:text-[#1B1917]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Free shipping incentive meter */}
        {step === "bag" && cart.length > 0 && (
          <div className="border-b border-[#EAE3D9] bg-[#F4EFE8] px-6 py-3">
            <p className="flex items-center justify-between text-[12px] text-[#453F3A]">
              {freeShippingUnlocked ? (
                <span className="flex items-center gap-1.5 font-medium text-[#1B1917]">
                  <Truck className="h-3.5 w-3.5 text-[#A64B2A]" />
                  ارسال رایگان برای سفارش شما فعال شد
                </span>
              ) : (
                <span>
                  افزودن{" "}
                  <strong className="font-medium text-[#1B1917] tabular-nums">
                    {formatMoney(amountToFreeShipping)}
                  </strong>{" "}
                  تا ارسال رایگان
                </span>
              )}
              <span className="tabular-nums text-[11px] text-[#7A7168]">
                {toPersianDigits(progressPct)}٪
              </span>
            </p>
            <div className="mt-2 h-[3px] w-full overflow-hidden bg-[#DFD7CC]">
              <div
                className="h-full bg-[#A64B2A] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: BAG */}
        {step === "bag" && (
          <>
            <div className="subtle-scroll flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <p className="font-serif-display text-[30px] text-[#1B1917]">
                    سبد خرید شما خالی است
                  </p>
                  <p className="mt-2 max-w-[260px] text-[13.5px] leading-relaxed text-[#665F57]">
                    از سرامیک‌های دست‌ساز، چراغ‌های قابل‌حمل و کتان بلژیکی دیدن کنید؛ برای خریدهای بالای ۱۵۰ دلار ارسال رایگان است.
                  </p>
                  <a
                    href="#catalog"
                    onClick={closeDrawer}
                    className="mt-7 bg-[#1B1917] px-7 py-3.5 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] transition hover:bg-[#332E2A]"
                  >
                    مشاهده محصولات
                  </a>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-[#EAE3D9]">
                    {cart.map((item) => {
                      const unit =
                        item.overrideUnitPrice ?? getEffectivePrice(item.product);
                      const basePrice = getEffectivePrice(item.product);
                      return (
                        <li key={item.id} className="flex gap-4 py-5 first:pt-1">
                          <img
                            src={item.product.images.main}
                            alt={item.product.title}
                            className="h-24 w-20 shrink-0 object-cover bg-[#EFEAE2]"
                          />
                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-[13.5px] font-medium leading-snug text-[#1B1917]">
                                  {item.product.title}
                                </p>
                                <button
                                  type="button"
                                  aria-label={`حذف ${item.product.title}`}
                                  onClick={() => removeCartItem(item.id)}
                                  className="text-[#9E958B] transition hover:text-[#A64B2A]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <p className="mt-0.5 text-[12px] text-[#7A7168]">
                                {item.selectedColor}
                              </p>
                              {item.bundleLabel && (
                                <p className="mt-0.5 text-[11px] font-medium text-[#A64B2A]">
                                  {item.bundleLabel}
                                </p>
                              )}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="inline-flex items-center border border-[#DDD4C8]">
                                <button
                                  type="button"
                                  aria-label="کاهش تعداد"
                                  onClick={() =>
                                    updateCartQty(item.id, item.quantity - 1)
                                  }
                                  className="flex h-7 w-7 items-center justify-center text-[#453F3A] hover:bg-[#F0EAE1]"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-7 text-center tabular-nums text-[12px] font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="افزایش تعداد"
                                  onClick={() =>
                                    updateCartQty(item.id, item.quantity + 1)
                                  }
                                  className="flex h-7 w-7 items-center justify-center text-[#453F3A] hover:bg-[#F0EAE1]"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="tabular-nums text-right text-[13.5px]">
                                <span className="font-medium text-[#1B1917]">
                                  {formatMoney(unit * item.quantity)}
                                </span>
                                {item.overrideUnitPrice != null &&
                                  item.overrideUnitPrice < basePrice && (
                                    <span className="ml-1.5 text-[11.5px] text-[#9A9086] line-through">
                                      {formatMoney(basePrice * item.quantity)}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Subtle Voucher Input */}
                  <div className="mt-4 border-t border-[#EAE3D9] pt-5">
                    {voucher ? (
                      <div className="flex items-center justify-between bg-[#F2EDE6] px-3.5 py-2.5 text-[12px]">
                        <span className="flex items-center gap-2 font-medium text-[#1B1917]">
                          <Tag className="h-3.5 w-3.5 text-[#A64B2A]" />
                          <span className="font-mono-tech">{voucher.code}</span>
                          <span className="font-normal text-[#665F57]">
                            ({voucher.label})
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={removeVoucher}
                          className="text-[11px] underline text-[#665F57] hover:text-[#1B1917]"
                        >
                          حذف
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            if (promoError) setPromoError("");
                          }}
                          placeholder="کد تخفیف (مثلاً WELCOME15)"
                          className="h-10 flex-1 border border-[#D8CFC3] bg-white px-3 text-[12.5px] uppercase tracking-[0.06em] placeholder:normal-case placeholder:tracking-normal placeholder:text-[#968D83] focus:border-[#1B1917] focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={promoLoading || !promoInput.trim()}
                          className="h-10 border border-[#1B1917] px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#1B1917] transition hover:bg-[#1B1917] hover:text-[#FAF8F5] disabled:opacity-40"
                        >
                          {promoLoading ? "…" : "اعمال"}
                        </button>
                      </form>
                    )}
                    {promoError && (
                      <p className="mt-1.5 text-[11.5px] text-[#A64B2A]">
                        {promoError}
                      </p>
                    )}
                  </div>

                  {/* Subtle high-converting cross-sell */}
                  {crossSell.length > 0 && (
                    <div className="mt-6 border-t border-[#EAE3D9] pt-5">
                      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7168]">
                        <Sparkles className="h-3 w-3 text-[#A64B2A]" />
                        پیشنهادهایی هماهنگ با سبد شما
                      </p>
                      <div className="mt-3 space-y-2.5">
                        {crossSell.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex items-center gap-3 bg-[#F3EEE7] p-2.5"
                          >
                            <img
                              src={rec.images.main}
                              alt={rec.title}
                              className="h-12 w-12 shrink-0 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12.5px] font-medium text-[#1B1917]">
                                {rec.title}
                              </p>
                              <p className="tabular-nums text-[11.5px] text-[#665F57]">
                                {formatMoney(getEffectivePrice(rec))}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                addToCart(rec, { openDrawer: true })
                              }
                              className="border border-[#C9BFB2] bg-[#FAF8F5] px-3 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-[#1B1917] transition hover:border-[#1B1917]"
                            >
                              افزودن
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#E5DED4] bg-[#FAF8F5] px-6 py-5">
                <div className="space-y-1.5 text-[13px] tabular-nums">
                  <div className="flex justify-between text-[#665F57]">
                    <span>جمع جزء</span>
                    <span>{formatMoney(cartSubtotal)}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between font-medium text-[#A64B2A]">
                      <span>کد تخفیف ({voucher?.code})</span>
                      <span>−{formatMoney(voucherDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#665F57]">
                    <span>ارسال معمولی</span>
                    <span>
                      {freeShippingUnlocked
                        ? "رایگان"
                        : formatMoney(STANDARD_SHIPPING_FEE)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#ECE5DC] pt-2.5 text-[15.5px] font-semibold text-[#1B1917]">
                    <span>مبلغ نهایی</span>
                    <span>
                      {formatMoney(
                        Math.max(0, cartSubtotal - voucherDiscount + standardCost)
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (user && !fullName) setFullName(user.fullName);
                    if (user && !mobile) setMobile(user.phone);
                    setStep("checkout");
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-[#1B1917] py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] transition hover:bg-[#322D29]"
                >
                  ادامه برای پرداخت
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-[#7A7168]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ۶۰ روز فرصت تجربه · تعویض رایگان کالای آسیب‌دیده
                </p>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT (Submits to Joorchin ecommerce action: orders) */}
        {step === "checkout" && (
          <form
            onSubmit={handleCheckout}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="subtle-scroll flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#A64B2A]">
                  ۱. اطلاعات ارسال
                </p>
                <div className="space-y-3">
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="نام و نام خانوادگی *"
                    className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                  />
                  <input
                    required
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="شماره موبایل (برای پیامک پیک) *"
                    className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                  />
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="نشانی خیابان *"
                    className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={buildingNumber}
                      onChange={(e) => setBuildingNumber(e.target.value)}
                      placeholder="پلاک / شماره ساختمان"
                      className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="واحد"
                      className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="شهر *"
                      className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                    />
                    <input
                      required
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="کد پستی *"
                      className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#A64B2A]">
                  ۲. روش ارسال
                </p>
                <div className="space-y-2">
                  <label
                    className={`flex cursor-pointer items-center justify-between border p-3.5 text-[13px] ${
                      shippingMethod === "standard"
                        ? "border-[#1B1917] bg-[#F3EEE7]"
                        : "border-[#DFD7CC] bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="ship"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="accent-[#1B1917]"
                      />
                      <span>
                        <strong className="font-medium text-[#1B1917]">
                          ارسال استانداردِ کربن‌خنثی
                        </strong>
                        <span className="block text-[11.5px] text-[#7A7168]">
                          ۲ تا ۴ روز کاری · پیک قابل‌پیگیری
                        </span>
                      </span>
                    </span>
                    <span className="tabular-nums font-medium">
                      {freeShippingUnlocked
                        ? "رایگان"
                        : formatMoney(STANDARD_SHIPPING_FEE)}
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between border p-3.5 text-[13px] ${
                      shippingMethod === "express"
                        ? "border-[#1B1917] bg-[#F3EEE7]"
                        : "border-[#DFD7CC] bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="ship"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="accent-[#1B1917]"
                      />
                      <span>
                        <strong className="font-medium text-[#1B1917]">
                          ارسال هوایی سریع
                        </strong>
                        <span className="block text-[11.5px] text-[#7A7168]">
                          ۱ تا ۲ روز کاری · بسته‌بندی ویژه الیاف چوب
                        </span>
                      </span>
                    </span>
                    <span className="tabular-nums font-medium">
                      {formatMoney(EXPRESS_SHIPPING_FEE)}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7168]">
                  ۳. پیام کارت هدیه (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="پیام دست‌نویس روی کارت کتان داخل بسته…"
                  className="w-full border border-[#D8CFC3] bg-white p-3 text-[12.5px] focus:border-[#1B1917] focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-[#E5DED4] bg-[#FAF8F5] px-6 py-5">
              <div className="mb-4 flex items-baseline justify-between tabular-nums">
                <span className="text-[13px] text-[#665F57]">
                  مجموع ({toPersianDigits(cartCount)} محصول)
                </span>
                <span className="text-[20px] font-semibold text-[#1B1917]">
                  {formatMoney(grandTotal)}
                </span>
              </div>
              <button
                type="submit"
                disabled={placing}
                className="w-full bg-[#A64B2A] py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] transition hover:bg-[#8A3B1F] disabled:opacity-60"
              >
                {placing
                  ? "در حال ثبت سفارش…"
                  : `ثبت سفارش · ${formatMoney(grandTotal)}`}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER CONFIRMED */}
        {step === "confirmed" && confirmedOrder && (
          <div className="flex flex-1 flex-col justify-between px-6 py-8">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1B1917] text-[#FAF8F5]">
                <Check className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-[#A64B2A]">
                {confirmedOrder.syncedToJoorchin
                  ? "همگام‌سازی زنده با فروشگاه"
                  : "سفارش ثبت شد"}
              </p>
              <h3 className="font-serif-display mt-1 text-[34px] leading-tight text-[#1B1917]">
                سپاسگزاریم، {confirmedOrder.shippingAddress.full_name.split(" ")[0]}.
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[#665F57]">
                محصولات شما با دقت بررسی و در بسته‌بندی کاغذی محافظ قرار می‌گیرند. جزئیات ارسال از طریق پیامک اطلاع‌رسانی می‌شود.
              </p>

              <div className="mt-6 space-y-2.5 border border-[#E5DED4] bg-[#F4EFE8] p-5 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#665F57]">شماره سفارش</span>
                  <span className="font-mono-tech font-medium text-[#1B1917]">
                    {confirmedOrder.orderCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#665F57]">وضعیت</span>
                  <span className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#A64B2A]">
                    {localizeOrderStatus(confirmedOrder.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#665F57]">گیرنده</span>
                  <span className="text-right text-[#1B1917]">
                    {confirmedOrder.shippingAddress.city}{" "}
                    {confirmedOrder.shippingAddress.postal_code}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E0D8CD] pt-2.5 font-semibold text-[#1B1917] tabular-nums">
                  <span>مبلغ پرداخت‌شده</span>
                  <span>{formatMoney(confirmedOrder.amount)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  openAccount("orders");
                }}
                className="w-full bg-[#1B1917] py-3.5 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] transition hover:bg-[#332E2A]"
              >
                پیگیری سفارش من
              </button>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full py-2.5 text-[12px] text-[#665F57] hover:text-[#1B1917]"
              >
                ادامه خرید
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
