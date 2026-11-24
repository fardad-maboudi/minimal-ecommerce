import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Database,
  Check,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { toPersianDigits } from "../utils/localization";

export const Header: React.FC = () => {
  const {
    cartCount,
    setCartOpen,
    setSearchOpen,
    openAccount,
    setJoorchinOpen,
    connectionMode,
    user,
    showToast,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyWelcomeCode = () => {
    navigator.clipboard?.writeText("WELCOME15").catch(() => undefined);
    setCopied(true);
    showToast("کد WELCOME15 کپی شد؛ برای دریافت ۱۵٪ تخفیف در سبد خرید وارد کنید");
    window.setTimeout(() => setCopied(false), 2200);
  };

  const navLinks = [
    { label: "فروشگاه", href: "#catalog" },
    { label: "مجموعه‌ها", href: "#collections" },
    { label: "ست‌های آیینی", href: "#bundles" },
    { label: "راهنمای چیدمان", href: "#lookbook" },
    { label: "مجله", href: "#journal" },
  ];

  const dotColor =
    connectionMode === "connected"
      ? "bg-emerald-600"
      : connectionMode === "connecting"
        ? "bg-amber-500 animate-pulse"
        : connectionMode === "error"
          ? "bg-[#A64B2A]"
          : "bg-[#9A9084]";

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Slim announcement ribbon */}
      <div className="bg-[#1A1816] text-[#EFEAE2] text-[11px] tracking-[0.14em] uppercase">
        <div className="mx-auto flex h-9 max-w-[1380px] items-center justify-center px-4 text-center">
          <span className="truncate">
            ارسال رایگان برای سفارش‌های بالای ۱۵۰ دلار
            <span className="mx-2.5 text-[#7B7268]">·</span>
            ۱۵٪ تخفیف سفارش اول با کد{" "}
            <button
              type="button"
              onClick={copyWelcomeCode}
              className="inline-flex items-center gap-1 border-b border-[#EFEAE2]/50 pb-px font-medium text-[#FAF8F5] transition hover:border-[#FAF8F5]"
              title="کپی کد تخفیف"
            >
              WELCOME15
              {copied && <Check className="h-3 w-3 text-emerald-300" />}
            </button>
          </span>
        </div>
      </div>

      {/* Main sticky editorial navigation */}
      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-[#E5DED4] bg-[#FAF8F5]/95 backdrop-blur-md"
            : "border-[#E5DED4]/80 bg-[#FAF8F5]/95 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Mobile trigger + Primary left nav */}
          <div className="flex items-center gap-6 lg:flex-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="باز کردن منو"
              className="inline-flex items-center justify-center p-1 text-[#1B1917] lg:hidden"
            >
              <Menu className="h-5 w-5 stroke-[1.5]" />
            </button>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="منوی اصلی">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[12.5px] font-medium tracking-[0.06em] text-[#453F3A] transition hover:text-[#1B1917]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Center wordmark */}
          <a
            href="#top"
            className="font-serif-display text-[28px] font-medium tracking-[0.22em] text-[#1B1917] sm:text-[31px]"
          >
            SOLÈN
          </a>

          {/* Right compact utilities */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:flex-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="جست‌وجو در فروشگاه"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#1B1917] transition hover:bg-[#EFE9E0]"
              title="جست‌وجو در محصولات (⌘K)"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => openAccount(user ? "orders" : "signin")}
              aria-label="حساب کاربری و پیگیری سفارش"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[#1B1917] transition hover:bg-[#EFE9E0]"
              title={user ? `${user.fullName} — حساب و سفارش‌ها` : "ورود و پیگیری سفارش"}
            >
              <User className="h-[18px] w-[18px] stroke-[1.5]" />
              {user && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#A64B2A]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setJoorchinOpen(true)}
              aria-label="تنظیم اتصال فروشگاه"
              className="relative inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[#453F3A] transition hover:bg-[#EFE9E0] hover:text-[#1B1917]"
              title="اتصال به زیرساخت فروشگاه"
            >
              <Database className="h-[15px] w-[15px] stroke-[1.5]" />
              <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
              <span className="hidden text-[11px] font-medium tracking-[0.04em] xl:inline">
                {connectionMode === "connected" ? "آنلاین" : "زیرساخت"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="سبد خرید"
              className="relative ml-0.5 inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[#1B1917] transition hover:bg-[#EFE9E0]"
            >
              <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
              <span className="tabular-nums text-[12px] font-medium">
                {toPersianDigits(cartCount)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#1A1816]/45 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col justify-between bg-[#FAF8F5] px-7 py-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5DED4] pb-5">
                <span className="font-serif-display text-2xl tracking-[0.2em]">
                  SOLÈN
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="بستن منو"
                  className="p-1 text-[#665F57] hover:text-[#1B1917]"
                >
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif-display text-3xl text-[#1B1917] transition hover:text-[#A64B2A]"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAccount("orders");
                  }}
                  className="pt-2 text-right text-sm font-medium text-[#665F57] hover:text-[#1B1917]"
                >
                  پیگیری سفارش
                </button>
              </nav>
            </div>
            <div className="border-t border-[#E5DED4] pt-5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setJoorchinOpen(true);
                }}
                className="flex w-full items-center justify-between text-right text-xs uppercase tracking-[0.14em] text-[#665F57] hover:text-[#1B1917]"
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                  زیرساخت فروشگاه
                </span>
                <span>تنظیمات ←</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
