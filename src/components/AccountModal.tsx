import React, { useEffect, useState } from "react";
import { X, Package, Heart, User, LogOut, Check, Trash2 } from "lucide-react";
import {
  formatMoney,
  getEffectivePrice,
  useStore,
} from "../context/StoreContext";
import { getSdkErrorMessage } from "../lib/joorchin";
import type { OrderStatus } from "../types/store";

const ORDER_STEPS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const AccountModal: React.FC = () => {
  const {
    accountOpen,
    setAccountOpen,
    accountTab,
    user,
    setUser,
    logoutUser,
    service,
    orders,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    setActiveProduct,
    showToast,
    joorchinConfig,
  } = useStore();

  const [tab, setTab] = useState<"signin" | "orders" | "wishlist">(accountTab);
  const [authMethod, setAuthMethod] = useState<"otp" | "password">("otp");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);

  // Profile edit
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Order quick lookup
  const [trackCode, setTrackCode] = useState("");

  useEffect(() => {
    setTab(accountTab);
  }, [accountTab, accountOpen]);

  useEffect(() => {
    if (user) {
      setEditName(user.fullName);
      setEditEmail(user.email);
    }
  }, [user]);

  if (!accountOpen) return null;

  const savedProducts = products.filter((p) => wishlist.includes(p.id));
  const displayedOrders = trackCode.trim()
    ? orders.filter((o) =>
        o.orderCode.toLowerCase().includes(trackCode.trim().toLowerCase())
      )
    : orders;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMsg("");
    setBusy(true);
    try {
      const res = await service.requestCustomerOtp(phone.trim());
      setOtpSent(true);
      setAuthMsg(res.message);
    } catch (err) {
      setAuthError(getSdkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setBusy(true);
    try {
      const res = await service.verifyCustomerOtp(phone.trim(), otpCode.trim());
      const u = res.result?.user as Record<string, unknown> | undefined;
      setUser({
        id: u?.id ? String(u.id) : undefined,
        phone: phone.trim(),
        fullName: String(u?.fullName || u?.name || "Studio Member"),
        email: String(u?.email || ""),
        role: "customer",
        isLiveSession: res.live,
      });
      setOtpSent(false);
      setOtpCode("");
      setAuthMsg("");
      showToast("Signed in to your SOLÈN account");
    } catch (err) {
      setAuthError(getSdkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setBusy(true);
    try {
      const res = await service.loginCustomerPassword(phone.trim(), password);
      const u = res.result?.user as Record<string, unknown> | undefined;
      setUser({
        id: u?.id ? String(u.id) : undefined,
        phone: phone.trim(),
        fullName: String(u?.fullName || u?.name || "Studio Member"),
        email: String(u?.email || ""),
        role: "customer",
        isLiveSession: res.live,
      });
      setPassword("");
      showToast("Welcome back to SOLÈN");
    } catch (err) {
      setAuthError(getSdkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setAuthError("");
    try {
      if (user.isLiveSession) {
        await service.updateMe({ fullName: editName.trim(), email: editEmail.trim() });
      }
      setUser({ ...user, fullName: editName.trim(), email: editEmail.trim() });
      showToast("Profile updated");
    } catch (err) {
      setAuthError(getSdkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#1A1816]/50 backdrop-blur-[2px]"
        onClick={() => setAccountOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Member account"
        className="animate-fade-slide relative z-10 flex max-h-[88vh] w-full max-w-[580px] flex-col bg-[#FAF8F5] shadow-2xl"
      >
        {/* Top title */}
        <div className="flex items-center justify-between border-b border-[#E5DED4] px-6 py-5">
          <h2 className="font-serif-display text-[28px] font-normal text-[#1B1917]">
            {user ? `Hello, ${user.fullName.split(" ")[0]}` : "SOLÈN Account"}
          </h2>
          <button
            type="button"
            onClick={() => setAccountOpen(false)}
            aria-label="Close account dialog"
            className="p-1 text-[#665F57] hover:text-[#1B1917]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Underline Tabs */}
        <div className="flex gap-6 border-b border-[#E5DED4] px-6">
          {[
            { id: "signin", label: user ? "Profile" : "Sign In", icon: User },
            { id: "orders", label: `Orders (${orders.length})`, icon: Package },
            { id: "wishlist", label: `Saved (${savedProducts.length})`, icon: Heart },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id as typeof tab)}
                className={`relative flex items-center gap-1.5 py-3.5 text-[12px] font-medium tracking-[0.04em] transition ${
                  active
                    ? "text-[#1B1917]"
                    : "text-[#7A7168] hover:text-[#1B1917]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#1B1917]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="subtle-scroll flex-1 overflow-y-auto p-6">
          {/* SIGN IN / PROFILE */}
          {tab === "signin" &&
            (user ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center justify-between bg-[#F2EDE6] px-4 py-3 text-[12px]">
                  <div>
                    <p className="font-medium text-[#1B1917]">{user.phone}</p>
                    <p className="text-[#665F57]">
                      {user.isLiveSession
                        ? `Live Joorchin customer session (${joorchinConfig.appId})`
                        : "Preview session · Connect App ID for live SMS auth"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void logoutUser()}
                    className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#A64B2A] hover:underline"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1.5 h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13.5px] focus:border-[#1B1917] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="mt-1.5 h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13.5px] focus:border-[#1B1917] focus:outline-none"
                  />
                </div>
                {authError && (
                  <p className="text-[12px] text-[#A64B2A]">{authError}</p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="bg-[#1B1917] px-6 py-3 text-[11.5px] font-medium uppercase tracking-[0.15em] text-[#FAF8F5] transition hover:bg-[#322D29]"
                >
                  {busy ? "Saving…" : "Save Profile"}
                </button>
              </form>
            ) : (
              <div>
                <p className="text-[13px] leading-relaxed text-[#665F57]">
                  Sign in or create your customer account automatically via{" "}
                  <code className="font-mono-tech text-[11.5px] text-[#1B1917]">
                    client.auth
                  </code>{" "}
                  — phone OTP or password supported.
                </p>

                <div className="mt-4 inline-flex border border-[#DDD4C8] bg-[#F3EEE7] p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("otp");
                      setAuthError("");
                    }}
                    className={`px-3.5 py-1.5 font-medium uppercase tracking-[0.12em] ${
                      authMethod === "otp"
                        ? "bg-[#FAF8F5] text-[#1B1917]"
                        : "text-[#665F57]"
                    }`}
                  >
                    Phone OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("password");
                      setAuthError("");
                    }}
                    className={`px-3.5 py-1.5 font-medium uppercase tracking-[0.12em] ${
                      authMethod === "password"
                        ? "bg-[#FAF8F5] text-[#1B1917]"
                        : "text-[#665F57]"
                    }`}
                  >
                    Password
                  </button>
                </div>

                {authMethod === "otp" ? (
                  !otpSent ? (
                    <form onSubmit={handleRequestOtp} className="mt-5 space-y-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                          Mobile Number
                        </label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="09120000000"
                          className="mt-1.5 h-11 w-full border border-[#D8CFC3] bg-white px-3.5 text-[14px] focus:border-[#1B1917] focus:outline-none"
                        />
                      </div>
                      {authError && (
                        <p className="text-[12px] text-[#A64B2A]">{authError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={busy}
                        className="w-full bg-[#1B1917] py-3.5 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] hover:bg-[#332E2A] disabled:opacity-60"
                      >
                        {busy ? "Sending code…" : "Send Verification Code"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
                      {authMsg && (
                        <p className="bg-[#F2EDE6] px-3.5 py-2.5 text-[12px] text-[#453F3A]">
                          {authMsg}
                        </p>
                      )}
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                          One-Time Code for {phone}
                        </label>
                        <input
                          required
                          type="text"
                          inputMode="numeric"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="font-mono-tech mt-1.5 h-11 w-full border border-[#D8CFC3] bg-white px-3.5 text-[16px] tracking-[0.25em] focus:border-[#1B1917] focus:outline-none"
                        />
                      </div>
                      {authError && (
                        <p className="text-[12px] text-[#A64B2A]">{authError}</p>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode("");
                          }}
                          className="border border-[#D8CFC3] px-4 py-3 text-[11.5px] uppercase tracking-[0.12em] text-[#665F57]"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={busy}
                          className="flex-1 bg-[#1B1917] py-3 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] hover:bg-[#332E2A]"
                        >
                          {busy ? "Verifying…" : "Verify & Sign In"}
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <form onSubmit={handlePasswordLogin} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                        Mobile Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09120000000"
                        className="mt-1.5 h-11 w-full border border-[#D8CFC3] bg-white px-3.5 text-[14px] focus:border-[#1B1917] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                        Password
                      </label>
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1.5 h-11 w-full border border-[#D8CFC3] bg-white px-3.5 text-[14px] focus:border-[#1B1917] focus:outline-none"
                      />
                    </div>
                    {authError && (
                      <p className="text-[12px] text-[#A64B2A]">{authError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full bg-[#1B1917] py-3.5 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#FAF8F5] hover:bg-[#332E2A]"
                    >
                      {busy ? "Signing in…" : "Sign In"}
                    </button>
                  </form>
                )}
              </div>
            ))}

          {/* ORDERS + STEP TRACKER */}
          {tab === "orders" && (
            <div className="space-y-4">
              <input
                type="search"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="Lookup order reference (e.g. SLN-84920)"
                className="h-10 w-full border border-[#D8CFC3] bg-white px-3.5 text-[13px] focus:border-[#1B1917] focus:outline-none"
              />

              {displayedOrders.length === 0 ? (
                <p className="py-10 text-center text-[13.5px] text-[#7A7168]">
                  No matching order found.
                </p>
              ) : (
                displayedOrders.map((order) => {
                  const stepIdx = Math.max(0, ORDER_STEPS.indexOf(order.status));
                  return (
                    <div
                      key={order.id + order.orderCode}
                      className="border border-[#E5DED4] bg-white/75 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono-tech text-[13px] font-medium text-[#1B1917]">
                            {order.orderCode}
                          </p>
                          <p className="text-[11.5px] text-[#7A7168]">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                            {order.shippingAddress.city
                              ? ` · ${order.shippingAddress.city}`
                              : ""}
                          </p>
                        </div>
                        <div className="text-right tabular-nums">
                          <p className="text-[14.5px] font-semibold text-[#1B1917]">
                            {formatMoney(order.amount)}
                          </p>
                          <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[#A64B2A]">
                            {order.status}
                          </p>
                        </div>
                      </div>

                      {/* Fulfillment progress stepper */}
                      <div className="mt-4 grid grid-cols-4 gap-1.5">
                        {ORDER_STEPS.map((st, idx) => {
                          const done = idx <= stepIdx;
                          return (
                            <div key={st}>
                              <div
                                className={`h-1 ${
                                  done ? "bg-[#A64B2A]" : "bg-[#E7E0D6]"
                                }`}
                              />
                              <p
                                className={`mt-1.5 flex items-center gap-0.5 text-[9.5px] uppercase tracking-[0.08em] ${
                                  done ? "text-[#1B1917]" : "text-[#A0978D]"
                                }`}
                              >
                                {done && <Check className="h-2.5 w-2.5 text-[#A64B2A]" />}
                                {st.slice(0, 1) + st.slice(1).toLowerCase()}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {order.items.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-2 border-t border-[#EFE9E0] pt-3">
                          {order.items.map((it) => (
                            <span
                              key={it.productId + it.color}
                              className="text-[12px] text-[#5B544D]"
                            >
                              {it.quantity}× {it.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SAVED WISHLIST */}
          {tab === "wishlist" &&
            (savedProducts.length === 0 ? (
              <p className="py-12 text-center text-[13.5px] text-[#7A7168]">
                Tap the heart on any object to keep it here for later.
              </p>
            ) : (
              <div className="divide-y divide-[#ECE5DC]">
                {savedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        setActiveProduct(p);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
                    >
                      <img
                        src={p.images.main}
                        alt={p.title}
                        className="h-16 w-14 shrink-0 object-cover bg-[#EFE9E0]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-[#1B1917]">
                          {p.title}
                        </p>
                        <p className="tabular-nums text-[12.5px] text-[#665F57]">
                          {formatMoney(getEffectivePrice(p))}
                        </p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          addToCart(p, { openDrawer: true });
                        }}
                        className="bg-[#1B1917] px-3.5 py-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#FAF8F5]"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        aria-label="Remove from saved"
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 text-[#8D847A] hover:text-[#A64B2A]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
