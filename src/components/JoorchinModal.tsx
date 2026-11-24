import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Shield,
  Plug,
  Plus,
  Copy,
  Check,
} from "lucide-react";
import { DEFAULT_SERVER_URL } from "@joorchin/client-sdk";
import { useStore } from "../context/StoreContext";
import { getSdkErrorMessage, previewAssetServePath } from "../lib/joorchin";

export const JoorchinModal: React.FC = () => {
  const {
    joorchinOpen,
    setJoorchinOpen,
    joorchinConfig,
    connectionMode,
    connectionStatusText,
    connectJoorchin,
    disconnectJoorchin,
    refreshCatalog,
    sdkLogs,
    clearSdkLogs,
    service,
    showToast,
  } = useStore();

  const [tab, setTab] = useState<"connect" | "staff" | "logs">("connect");
  const [appId, setAppId] = useState(joorchinConfig.appId);
  const [serverUrl, setServerUrl] = useState(joorchinConfig.serverUrl);
  const [tokenKey, setTokenKey] = useState(joorchinConfig.tokenStorageKey);
  const [connecting, setConnecting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Staff Back-Office login & live ops state
  const [staffPhone, setStaffPhone] = useState("");
  const [staffAuthMode, setStaffAuthMode] = useState<"otp" | "password">("otp");
  const [staffOtpSent, setStaffOtpSent] = useState(false);
  const [staffOtp, setStaffOtp] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffAuthed, setStaffAuthed] = useState(false);
  const [staffBusy, setStaffBusy] = useState(false);
  const [staffError, setStaffError] = useState("");
  const [staffOrders, setStaffOrders] = useState<Record<string, unknown>[]>([]);
  const [staffStats, setStaffStats] = useState<Record<string, unknown> | null>(null);

  // Quick product creation form -> backoffice.ecommerce.saveProduct
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("15");

  useEffect(() => {
    setAppId(joorchinConfig.appId);
    setServerUrl(joorchinConfig.serverUrl || DEFAULT_SERVER_URL);
    setTokenKey(joorchinConfig.tokenStorageKey);
  }, [joorchinConfig, joorchinOpen]);

  if (!joorchinOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setFeedback("");
    const nextKey =
      tokenKey.trim() || `joorchin_solen_${appId.trim() || "storefront"}`;
    const res = await connectJoorchin({
      appId: appId.trim(),
      serverUrl: serverUrl.trim() || DEFAULT_SERVER_URL,
      tokenStorageKey: nextKey,
    });
    setFeedback(res.message);
    setConnecting(false);
  };

  const loadBackoffice = async () => {
    setStaffBusy(true);
    setStaffError("");
    try {
      const snap = await service.fetchBackofficeSnapshot();
      setStaffOrders(snap.orders);
      setStaffStats(snap.stats);
      setStaffAuthed(true);
    } catch (err) {
      setStaffError(getSdkErrorMessage(err));
    } finally {
      setStaffBusy(false);
    }
  };

  const handleStaffOtpStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffBusy(true);
    setStaffError("");
    try {
      await service.requestStaffOtp(staffPhone.trim());
      setStaffOtpSent(true);
    } catch (err) {
      setStaffError(getSdkErrorMessage(err));
    } finally {
      setStaffBusy(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffBusy(true);
    setStaffError("");
    try {
      if (staffAuthMode === "otp") {
        await service.loginStaffOtp(staffPhone.trim(), staffOtp.trim());
      } else {
        await service.loginStaffPassword(staffPhone.trim(), staffPassword);
      }
      setStaffAuthed(true);
      await loadBackoffice();
      showToast("Staff back-office authenticated via Joorchin");
    } catch (err) {
      setStaffError(getSdkErrorMessage(err));
    } finally {
      setStaffBusy(false);
    }
  };

  const handleFulfill = async (orderId: string) => {
    try {
      await service.fulfillBackofficeOrder(orderId);
      showToast(`Fulfilled order #${orderId}`);
      await loadBackoffice();
    } catch (err) {
      setStaffError(getSdkErrorMessage(err));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;
    setStaffBusy(true);
    setStaffError("");
    try {
      await service.saveBackofficeProduct({
        title: newTitle.trim(),
        titleEn: newTitle.trim(),
        price: Number(newPrice),
        stock: Number(newStock) || 10,
        status: "MARKETABLE",
        productType: "PRODUCT",
      });
      setNewTitle("");
      setNewPrice("");
      showToast("Product saved to Joorchin catalog");
      await refreshCatalog();
    } catch (err) {
      setStaffError(getSdkErrorMessage(err));
    } finally {
      setStaffBusy(false);
    }
  };

  const envSnippet = `VITE_JOORCHIN_APP_ID=${appId || "your-app-id"}\nVITE_JOORCHIN_SERVER_URL=${serverUrl || DEFAULT_SERVER_URL}`;

  const copyEnv = () => {
    navigator.clipboard?.writeText(envSnippet).catch(() => undefined);
    setCopiedEnv(true);
    window.setTimeout(() => setCopiedEnv(false), 1800);
  };

  const sampleAssetUrl = service.buildAssetUrl("hero-stoneware-01", 800);
  const sampleServePath = previewAssetServePath("hero-stoneware-01", 800);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#1A1816]/50 backdrop-blur-[2px]"
        onClick={() => setJoorchinOpen(false)}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Joorchin SDK Backend Studio"
        className="animate-drawer-in relative z-10 flex h-full w-full max-w-[540px] flex-col bg-[#FAF8F5] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5DED4] bg-[#1A1816] px-6 py-5 text-[#FAF8F5]">
          <div>
            <p className="font-mono-tech text-[10.5px] uppercase tracking-[0.18em] text-[#D79272]">
              @joorchin/client-sdk · v0.3.1
            </p>
            <h2 className="font-serif-display mt-1 text-[27px] font-normal leading-tight">
              Storefront Backend
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setJoorchinOpen(false)}
            aria-label="Close backend configuration"
            className="p-1 text-[#B6ACA1] hover:text-[#FAF8F5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status ribbon */}
        <div className="flex items-center justify-between border-b border-[#E5DED4] bg-[#F2EDE6] px-6 py-3 text-[12px]">
          <span className="flex items-center gap-2 text-[#1B1917]">
            <span
              className={`h-2 w-2 rounded-full ${
                connectionMode === "connected"
                  ? "bg-emerald-600"
                  : connectionMode === "error"
                    ? "bg-[#A64B2A]"
                    : "bg-[#8D8378]"
              }`}
            />
            <span className="truncate max-w-[330px]">{connectionStatusText}</span>
          </span>
          <button
            type="button"
            onClick={() => void refreshCatalog()}
            className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#453F3A] hover:text-[#1B1917]"
          >
            <RefreshCw className="h-3 w-3" /> Sync
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-6 border-b border-[#E5DED4] px-6">
          {[
            { id: "connect", label: "Connection", icon: Plug },
            { id: "staff", label: "Staff Back-Office", icon: Shield },
            { id: "logs", label: `SDK Trace (${sdkLogs.length})`, icon: Terminal },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id as typeof tab)}
                className={`relative flex items-center gap-1.5 py-3.5 text-[12px] font-medium transition ${
                  active ? "text-[#1B1917]" : "text-[#7A7168] hover:text-[#1B1917]"
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

        {/* Content */}
        <div className="subtle-scroll flex-1 overflow-y-auto p-6">
          {tab === "connect" && (
            <div className="space-y-6">
              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                    Joorchin App ID
                  </label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAppId(val);
                      setTokenKey(`joorchin_solen_${val.trim() || "storefront"}`);
                    }}
                    placeholder="e.g. app_solen_prod or numeric app ID"
                    className="font-mono-tech mt-1.5 h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                    Server URL
                  </label>
                  <input
                    type="url"
                    required
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder={DEFAULT_SERVER_URL}
                    className="font-mono-tech mt-1.5 h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px] focus:border-[#1B1917] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                    App-Scoped Token Storage Key
                  </label>
                  <input
                    type="text"
                    value={tokenKey}
                    onChange={(e) => setTokenKey(e.target.value)}
                    className="font-mono-tech mt-1.5 h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[12px] text-[#5B544D] focus:border-[#1B1917] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#8A8076]">
                    Isolated per app per SDK guidance so customer tokens never collide across apps.
                  </p>
                </div>

                {feedback && (
                  <p className="border border-[#E2D9CE] bg-[#F2EDE6] px-3.5 py-2.5 text-[12px] text-[#3B3530]">
                    {feedback}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={connecting}
                    className="flex-1 bg-[#1B1917] py-3 text-[11.5px] font-medium uppercase tracking-[0.15em] text-[#FAF8F5] transition hover:bg-[#332E2A] disabled:opacity-60"
                  >
                    {connecting ? "Connecting…" : "Connect & Fetch Store"}
                  </button>
                  {joorchinConfig.appId && (
                    <button
                      type="button"
                      onClick={() => void disconnectJoorchin()}
                      className="border border-[#D8CFC3] px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-[#665F57] hover:border-[#A64B2A] hover:text-[#A64B2A]"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>

              {/* Wired modules checklist */}
              <div className="border-t border-[#E5DED4] pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7168]">
                  Bound SDK Capabilities
                </p>
                <ul className="mt-3 space-y-2 text-[12px] text-[#453F3A]">
                  {[
                    ["Catalog", `client.site.plugin("ecommerce").records("product").list()`],
                    ["Bag & Orders", `client.site.plugin("ecommerce").action("cart/items" | "orders")`],
                    ["Vouchers & Reviews", `action("vouchers/validate") & action("comments")`],
                    ["Customer Auth", `client.auth.requestOtp / loginViaPhoneOtp / loginWithPassword`],
                    ["Newsletter", `client.entities.NewsletterSubscriber.create()`],
                    ["Web Push", `client.site.push.getStatus() / subscribe({ topics })`],
                    ["Staff Back-Office", `client.auth.*Staff* + client.backoffice.ecommerce`],
                  ].map(([name, api]) => (
                    <li key={name} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A64B2A]" />
                      <div>
                        <span className="font-medium text-[#1B1917]">{name}: </span>
                        <code className="font-mono-tech text-[11px] text-[#665F57]">
                          {api}
                        </code>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Asset URL helper & .env snippet */}
              <div className="space-y-3 border-t border-[#E5DED4] pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7168]">
                    Deploy .env Variables
                  </p>
                  <button
                    type="button"
                    onClick={copyEnv}
                    className="inline-flex items-center gap-1 text-[11px] text-[#453F3A] hover:text-[#1B1917]"
                  >
                    {copiedEnv ? <Check className="h-3 w-3 text-emerald-700" /> : <Copy className="h-3 w-3" />}
                    {copiedEnv ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="font-mono-tech overflow-x-auto bg-[#1A1816] p-3.5 text-[11px] leading-relaxed text-[#E6DDD1]">
                  {envSnippet}
                </pre>
                <div className="bg-[#F2EDE6] p-3 text-[11px] text-[#5B544D]">
                  <p className="font-medium text-[#1B1917]">Asset resolver preview</p>
                  <p className="font-mono-tech mt-1 break-all text-[10.5px]">
                    {sampleAssetUrl}
                  </p>
                  <p className="font-mono-tech mt-1 text-[10px] text-[#8A8076]">
                    schemas.buildAssetServePath → {sampleServePath}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SHOP STAFF BACK-OFFICE */}
          {tab === "staff" && (
            <div className="space-y-5">
              {!joorchinConfig.appId ? (
                <div className="border border-[#E2D9CE] bg-[#F2EDE6] p-5 text-[13px] text-[#5B544D]">
                  <p className="font-medium text-[#1B1917]">
                    Connect your Joorchin App ID first
                  </p>
                  <p className="mt-1.5 leading-relaxed">
                    Staff operations run strictly under site-member authority (
                    <code className="font-mono-tech text-[11px]">
                      requestStaffOtp
                    </code>{" "}
                    /{" "}
                    <code className="font-mono-tech text-[11px]">
                      loginStaffWithPassword
                    </code>
                    ) and bind directly to{" "}
                    <code className="font-mono-tech text-[11px]">
                      client.backoffice.ecommerce
                    </code>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("connect")}
                    className="mt-4 bg-[#1B1917] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#FAF8F5]"
                  >
                    Enter App ID →
                  </button>
                </div>
              ) : !staffAuthed ? (
                <div className="space-y-4">
                  <p className="text-[12.5px] leading-relaxed text-[#665F57]">
                    Sign in as an authorized owner or invited store member of{" "}
                    <span className="font-mono-tech text-[#1B1917]">
                      {joorchinConfig.appId}
                    </span>
                    . Customer tokens receive 403 by server policy.
                  </p>

                  <div className="inline-flex border border-[#DDD4C8] bg-[#F2EDE6] p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setStaffAuthMode("otp")}
                      className={`px-3 py-1.5 uppercase tracking-[0.12em] ${
                        staffAuthMode === "otp"
                          ? "bg-[#FAF8F5] font-medium text-[#1B1917]"
                          : "text-[#665F57]"
                      }`}
                    >
                      Staff OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffAuthMode("password")}
                      className={`px-3 py-1.5 uppercase tracking-[0.12em] ${
                        staffAuthMode === "password"
                          ? "bg-[#FAF8F5] font-medium text-[#1B1917]"
                          : "text-[#665F57]"
                      }`}
                    >
                      Staff Password
                    </button>
                  </div>

                  {staffAuthMode === "otp" && !staffOtpSent ? (
                    <form onSubmit={handleStaffOtpStart} className="space-y-3">
                      <input
                        required
                        type="tel"
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value)}
                        placeholder="Staff phone number (e.g. 09120000000)"
                        className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px]"
                      />
                      {staffError && (
                        <p className="text-[12px] text-[#A64B2A]">{staffError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={staffBusy}
                        className="w-full bg-[#1B1917] py-3 text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#FAF8F5]"
                      >
                        {staffBusy ? "Sending…" : "Request Staff OTP"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleStaffLogin} className="space-y-3">
                      <input
                        required
                        type="tel"
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value)}
                        placeholder="Staff phone"
                        className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px]"
                      />
                      {staffAuthMode === "otp" ? (
                        <input
                          required
                          type="text"
                          value={staffOtp}
                          onChange={(e) => setStaffOtp(e.target.value)}
                          placeholder="Staff OTP code"
                          className="font-mono-tech h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[14px] tracking-[0.2em]"
                        />
                      ) : (
                        <input
                          required
                          type="password"
                          value={staffPassword}
                          onChange={(e) => setStaffPassword(e.target.value)}
                          placeholder="Staff password"
                          className="h-10 w-full border border-[#D8CFC3] bg-white px-3 text-[13px]"
                        />
                      )}
                      {staffError && (
                        <p className="text-[12px] text-[#A64B2A]">{staffError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={staffBusy}
                        className="w-full bg-[#1B1917] py-3 text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#FAF8F5]"
                      >
                        {staffBusy ? "Signing in…" : "Open Staff Console"}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {staffStats && (
                    <pre className="font-mono-tech overflow-x-auto bg-[#F2EDE6] p-3 text-[11px] text-[#3B3530]">
                      {JSON.stringify(staffStats, null, 2)}
                    </pre>
                  )}

                  {/* Quick publish product */}
                  <form
                    onSubmit={handleCreateProduct}
                    className="space-y-3 border border-[#E5DED4] bg-white p-4"
                  >
                    <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#1B1917]">
                      <Plus className="h-3.5 w-3.5 text-[#A64B2A]" /> Quick Add Catalog Product
                    </p>
                    <input
                      required
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Product title"
                      className="h-9 w-full border border-[#D8CFC3] px-3 text-[12.5px]"
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        required
                        type="number"
                        min="1"
                        step="0.01"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="Price (USD)"
                        className="h-9 border border-[#D8CFC3] px-3 text-[12.5px]"
                      />
                      <input
                        type="number"
                        min="0"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="Stock"
                        className="h-9 border border-[#D8CFC3] px-3 text-[12.5px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={staffBusy}
                      className="w-full bg-[#1B1917] py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#FAF8F5]"
                    >
                      Save via backoffice.ecommerce.saveProduct
                    </button>
                  </form>

                  {/* Shop Orders */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A7168]">
                        Shop Orders ({staffOrders.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => void loadBackoffice()}
                        className="text-[11px] underline text-[#665F57]"
                      >
                        Reload
                      </button>
                    </div>
                    <div className="space-y-2">
                      {staffOrders.map((ord, idx) => {
                        const id = String(ord.id ?? idx);
                        const code = String(ord.orderCode ?? `#${id}`);
                        const status = String(ord.status ?? "PENDING");
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between border border-[#E5DED4] bg-white px-3.5 py-2.5 text-[12px]"
                          >
                            <div>
                              <p className="font-mono-tech font-medium text-[#1B1917]">
                                {code}
                              </p>
                              <p className="text-[11px] text-[#7A7168]">{status}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleFulfill(id)}
                              className="border border-[#1B1917] px-2.5 py-1 text-[10.5px] uppercase tracking-[0.12em] hover:bg-[#1B1917] hover:text-white"
                            >
                              Fulfill
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE SDK TRACE */}
          {tab === "logs" && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#7A7168]">
                  Recent SDK calls
                </p>
                {sdkLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSdkLogs}
                    className="text-[11px] text-[#665F57] hover:text-[#1B1917]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {sdkLogs.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-[#7A7168]">
                  Browse, apply a voucher, add to bag, or place an order to see live SDK activity.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {sdkLogs.map((log) => (
                    <li
                      key={log.id}
                      className="border border-[#E5DED4] bg-white p-3 text-[11.5px]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-mono-tech text-[10px] uppercase px-1.5 py-0.5 ${
                            log.outcome === "live"
                              ? "bg-emerald-50 text-emerald-800"
                              : log.outcome === "error"
                                ? "bg-amber-50 text-[#A64B2A]"
                                : "bg-[#F2EDE6] text-[#665F57]"
                          }`}
                        >
                          {log.outcome}
                        </span>
                        <span className="font-mono-tech text-[10.5px] text-[#8E847A]">
                          {log.durationMs}ms · {log.timestamp}
                        </span>
                      </div>
                      <p className="font-mono-tech mt-1.5 break-all text-[11px] font-medium text-[#1B1917]">
                        {log.method}
                      </p>
                      <p className="mt-1 text-[#665F57]">{log.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
