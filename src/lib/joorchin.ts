import {
  createClient,
  DEFAULT_SERVER_URL,
  JoorchinError,
  schemas,
  type JoorchinClient,
  type AuthLoginResult,
  type StoredSession,
} from "@joorchin/client-sdk";
import type {
  JoorchinConfig,
  PushState,
  SdkCallLog,
  StoreProduct,
  StoreOrder,
  StoreVoucher,
  ProductReviewComment,
  OrderShippingAddress,
  OrderStatus,
  ProductCategoryId,
} from "../types/store";
import { AVAILABLE_VOUCHERS, CURATED_PRODUCTS } from "../data/catalog";

const CONFIG_STORAGE_KEY = "solen_joorchin_config_v1";

export function loadSavedJoorchinConfig(): JoorchinConfig {
  const envAppId =
    (import.meta.env.VITE_JOORCHIN_APP_ID as string | undefined)?.trim() || "";
  const envServerUrl =
    (import.meta.env.VITE_JOORCHIN_SERVER_URL as string | undefined)?.trim() ||
    DEFAULT_SERVER_URL;

  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<JoorchinConfig>;
      const appId = (parsed.appId ?? envAppId).trim();
      const serverUrl = (parsed.serverUrl ?? envServerUrl).trim() || DEFAULT_SERVER_URL;
      const tokenStorageKey =
        (parsed.tokenStorageKey ?? "").trim() ||
        `joorchin_solen_${appId || "storefront"}`;
      return { appId, serverUrl, tokenStorageKey };
    }
  } catch {
    // ignore browser storage errors
  }

  return {
    appId: envAppId,
    serverUrl: envServerUrl,
    tokenStorageKey: `joorchin_solen_${envAppId || "storefront"}`,
  };
}

export function saveJoorchinConfig(config: JoorchinConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore private browsing quota errors
  }
}

export function getSdkErrorMessage(err: unknown): string {
  if (err instanceof JoorchinError) {
    return err.message || "Joorchin backend returned an error.";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "پاسخ نامعتبر از سرور فروشگاه دریافت شد.";
}

function normalizeCategory(raw: unknown): Exclude<ProductCategoryId, "all"> {
  const s = String(raw || "").toLowerCase();
  if (s.includes("coffee") || s.includes("kettle") || s.includes("tea") || s.includes("brew"))
    return "coffee";
  if (s.includes("light") || s.includes("lamp")) return "lighting";
  if (s.includes("scent") || s.includes("botan") || s.includes("candle") || s.includes("diffus"))
    return "botanical";
  if (s.includes("textil") || s.includes("linen") || s.includes("towel") || s.includes("throw"))
    return "textiles";
  return "objects";
}

function resolveColorHex(value: string): { name: string; hex: string } {
  if (value.startsWith("#")) {
    return { name: value.toUpperCase(), hex: value };
  }
  const map: Record<string, string> = {
    black: "#23211F",
    obsidian: "#23211F",
    charcoal: "#3B3734",
    white: "#EDE9E1",
    ivory: "#ECE5D9",
    cream: "#E7DFD3",
    oat: "#D9CFC0",
    sand: "#D6C5B2",
    clay: "#A65A3E",
    terracotta: "#A64B2A",
    brass: "#B89A63",
    gold: "#C4A870",
    walnut: "#5C4738",
    olive: "#6B6F56",
    sage: "#8C957D",
    bronze: "#635142",
    brown: "#6E523D",
  };
  const key = value.toLowerCase();
  const matched = Object.keys(map).find((k) => key.includes(k));
  return { name: value, hex: matched ? map[matched] : "#8A8075" };
}

/**
 * Resolves either a remote URL, local path, or a Joorchin asset permalink using
 * the pure `client.assets(assetId, query)` builder from @joorchin/client-sdk.
 */
export function resolveAssetUrl(
  client: JoorchinClient | null,
  input: string | undefined,
  fallbackImage: string,
  width = 900
): string {
  if (!input || !input.trim()) return fallbackImage;
  const trimmed = input.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (client) {
    try {
      return client.assets(trimmed, { width, format: "webp", quality: 85 });
    } catch {
      return fallbackImage;
    }
  }
  return fallbackImage;
}

/**
 * Pure wrapper over schemas.buildAssetServePath for previewing Joorchin asset links.
 */
export function previewAssetServePath(permalink: string, width = 800): string {
  try {
    return schemas.buildAssetServePath(permalink, { width, format: "webp" });
  } catch {
    return `/assets/${permalink}?width=${width}&format=webp`;
  }
}

/**
 * Adapts a raw Joorchin plugin ecommerce `product` record into our unified StoreProduct type.
 */
export function mapRemoteProduct(
  raw: Record<string, unknown>,
  index: number,
  client: JoorchinClient | null
): StoreProduct {
  const fallback = CURATED_PRODUCTS[index % CURATED_PRODUCTS.length];
  const priceNum = Number(raw.price ?? fallback.price) || fallback.price;
  const discRaw = raw.discountedPrice != null ? Number(raw.discountedPrice) : null;
  const hasDiscount = discRaw !== null && discRaw > 0 && discRaw < priceNum;
  const discountPercent =
    typeof raw.discountPercent === "number" && raw.discountPercent > 0
      ? Math.round(raw.discountPercent)
      : hasDiscount && discRaw
        ? Math.round(((priceNum - discRaw) / priceNum) * 100)
        : 0;

  const imgsObj = (raw.images as Record<string, unknown> | undefined) ?? {};
  const mainImg = resolveAssetUrl(
    client,
    (imgsObj.main as string | undefined) ?? (raw.imageUrl as string | undefined),
    fallback.images.main
  );
  const galleryRaw = Array.isArray(imgsObj.gallery)
    ? (imgsObj.gallery as string[]).map((g) => resolveAssetUrl(client, g, mainImg))
    : [];
  const gallery = galleryRaw.length > 0 ? galleryRaw : [mainImg];

  const ratingObj = (raw.rating as Record<string, unknown> | undefined) ?? {};
  const rawColors = Array.isArray(raw.colors) ? (raw.colors as string[]) : [];
  const propsObj = (raw.properties as Record<string, unknown> | undefined) ?? {};
  const title = String(raw.title || raw.titleEn || fallback.title);

  return {
    id: String(raw.id ?? `jc-${index + 1}`),
    title,
    titleEn: String(raw.titleEn || title),
    subtitle: String(
      propsObj.material || raw.subtitle || "Studio Edition · Direct via Joorchin"
    ),
    description: String(raw.description || fallback.description),
    slug: String(raw.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
    status: raw.status === "UNMARKETABLE" ? "UNMARKETABLE" : "MARKETABLE",
    productType: raw.productType === "SERVICE" ? "SERVICE" : "PRODUCT",
    price: priceNum,
    discountedPrice: hasDiscount ? discRaw : null,
    discountPercent,
    stock: raw.stock != null ? Number(raw.stock) : 12,
    images: { main: mainImg, gallery },
    rating: {
      count: Number(ratingObj.count ?? 24),
      average: Number(ratingObj.average ?? 4.9),
    },
    colors:
      rawColors.length > 0
        ? rawColors.map(resolveColorHex)
        : [{ name: "Signature Finish", hex: "#4D463F" }],
    properties: {
      origin: String(propsObj.origin || "Verified Studio"),
      weight: String(propsObj.weight || "950 g"),
      material: String(propsObj.material || "Small-batch studio grade"),
      dimensions: String(propsObj.dimensions || "Standard edition"),
    },
    brandId: String(raw.brandId || "solen-atelier"),
    categoryId: normalizeCategory(raw.categoryId || raw.category || title),
    badge: index === 0 ? "Bestseller" : discountPercent >= 15 ? "Limited Run" : undefined,
    bundleSlot: fallback.bundleSlot,
    notes: fallback.notes,
    createdAt: String(raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
    source: "joorchin",
  };
}

export type LogFn = (entry: Omit<SdkCallLog, "id" | "timestamp">) => void;

/**
 * Full customer + staff service layer backed natively by `@joorchin/client-sdk`.
 * Executes real SDK requests whenever an App ID is configured and cleanly degrades
 * to storefront preview functionality when running offline or unconfigured.
 */
export class JoorchinStoreService {
  private client: JoorchinClient | null = null;
  private config: JoorchinConfig;
  private onLog: LogFn;

  constructor(config: JoorchinConfig, onLog: LogFn) {
    this.config = config;
    this.onLog = onLog;
    this.rebuildClient();
  }

  public getConfig(): JoorchinConfig {
    return this.config;
  }

  public isConfigured(): boolean {
    return Boolean(this.config.appId.trim());
  }

  public getClient(): JoorchinClient | null {
    return this.client;
  }

  public updateConfig(next: JoorchinConfig): void {
    if (this.client) {
      try {
        this.client.cleanup();
      } catch {
        // ignore cleanup error
      }
      this.client = null;
    }
    this.config = {
      appId: next.appId.trim(),
      serverUrl: next.serverUrl.trim() || DEFAULT_SERVER_URL,
      tokenStorageKey:
        next.tokenStorageKey.trim() ||
        `joorchin_solen_${next.appId.trim() || "storefront"}`,
    };
    saveJoorchinConfig(this.config);
    this.rebuildClient();
  }

  private rebuildClient(): void {
    const effectiveAppId = this.config.appId.trim();
    const serverUrl = this.config.serverUrl.trim() || DEFAULT_SERVER_URL;
    if (!effectiveAppId) {
      this.client = null;
      return;
    }
    this.client = createClient({
      appId: effectiveAppId,
      serverUrl,
      tokenStorageKey: this.config.tokenStorageKey,
    });
  }

  public buildAssetUrl(permalink: string, width = 800): string {
    if (this.client) {
      return this.client.assets(permalink, { width, format: "webp", quality: 85 });
    }
    const base = (this.config.serverUrl || DEFAULT_SERVER_URL).replace(/\/$/, "");
    const appId = this.config.appId || "your-app-id";
    return `${base}/api/v1/apps/${encodeURIComponent(appId)}/assets/${encodeURIComponent(permalink)}?width=${width}&format=webp`;
  }

  public getSession(): StoredSession | null {
    if (!this.client) return null;
    try {
      return this.client.auth.getSession();
    } catch {
      return null;
    }
  }

  /**
   * Lists storefront products via `client.site.plugin("ecommerce").records("product").list()`
   */
  public async listProducts(): Promise<{
    products: StoreProduct[];
    isLive: boolean;
    message: string;
  }> {
    const start = performance.now();
    if (!this.client) {
      this.onLog({
        method: "site.plugin('ecommerce').records('product').list",
        route: "sdk:standby",
        outcome: "fallback",
        durationMs: Math.round(performance.now() - start),
        detail: "App ID not set — showcasing curated SOLÈN catalog (8 products)",
      });
      return {
        products: CURATED_PRODUCTS,
        isLive: false,
        message: "به فهرست محلی محصولات منتخب متصل شد. برای دریافت محصولات زنده، شناسه Joorchin را وارد کنید.",
      };
    }

    try {
      const rows = await this.client.site
        .plugin("ecommerce")
        .records("product")
        .list<Record<string, unknown>>({
          filter: { active: true },
          limit: 48,
        });

      const list: Record<string, unknown>[] = Array.isArray(rows)
        ? [...rows]
        : [...((rows as { items?: Record<string, unknown>[] }).items ?? [])];
      const ms = Math.round(performance.now() - start);

      if (list.length === 0) {
        this.onLog({
          method: "site.plugin('ecommerce').records('product').list",
          route: `${this.config.serverUrl}/api/v1/apps/${this.config.appId}/plugins/ecommerce`,
          outcome: "live",
          durationMs: ms,
          detail: "Live API connected (0 remote products yet) — keeping curated preview items",
        });
        return {
          products: CURATED_PRODUCTS,
          isLive: true,
          message: "به فروشگاه Joorchin متصل شد؛ هنوز محصول فعالی وجود ندارد و مجموعه منتخب نمایش داده می‌شود.",
        };
      }

      const mapped = list.map((row, idx) => mapRemoteProduct(row, idx, this.client));
      this.onLog({
        method: "site.plugin('ecommerce').records('product').list",
        route: `${this.config.serverUrl}/api/v1/apps/${this.config.appId}/plugins/ecommerce`,
        outcome: "live",
        durationMs: ms,
        detail: `Loaded ${mapped.length} live catalog product(s) from Joorchin`,
      });
      return {
        products: mapped,
        isLive: true,
        message: `${mapped.length} محصول زنده از اپلیکیشن ${this.config.appId} همگام شد.`,
      };
    } catch (err) {
      const msg = getSdkErrorMessage(err);
      this.onLog({
        method: "site.plugin('ecommerce').records('product').list",
        route: `${this.config.serverUrl}/api/v1/apps/${this.config.appId}/plugins/ecommerce`,
        outcome: "error",
        durationMs: Math.round(performance.now() - start),
        detail: `${msg} — rendered showcase catalog as graceful fallback`,
      });
      return {
        products: CURATED_PRODUCTS,
        isLive: false,
        message: msg,
      };
    }
  }

  /**
   * Mirrors bag add/update operations to `client.site.plugin("ecommerce").action("cart/items")`
   */
  public async syncCartItem(productId: string, quantity: number): Promise<void> {
    if (!this.client) return;
    const start = performance.now();
    try {
      await this.client.site.plugin("ecommerce").action("cart/items", {
        method: "POST",
        body: { productId, quantity },
      });
      this.onLog({
        method: "site.plugin('ecommerce').action('cart/items')",
        route: "POST cart/items",
        outcome: "live",
        durationMs: Math.round(performance.now() - start),
        detail: `Synced product ${productId} ×${quantity}`,
      });
    } catch (err) {
      this.onLog({
        method: "site.plugin('ecommerce').action('cart/items')",
        route: "POST cart/items",
        outcome: "fallback",
        durationMs: Math.round(performance.now() - start),
        detail: `Kept in client bag (${getSdkErrorMessage(err)})`,
      });
    }
  }

  /**
   * Validates promo voucher through Joorchin ecommerce action, falling back to local studio vouchers.
   */
  public async validateVoucher(
    codeInput: string,
    subtotal: number
  ): Promise<{ voucher?: StoreVoucher; error?: string; synced: boolean }> {
    const code = codeInput.trim().toUpperCase();
    if (!code) return { error: "لطفاً کد تخفیف را وارد کنید.", synced: false };

    const start = performance.now();
    if (this.client) {
      try {
        const res = await this.client.site
          .plugin("ecommerce")
          .action<Record<string, unknown>>("vouchers/validate", {
            method: "POST",
            body: { code, subtotal },
          });
        if (res && (res.code || res.value)) {
          const v: StoreVoucher = {
            code: String(res.code || code),
            type: res.type === "FIXED" ? "FIXED" : "PERCENTAGE",
            value: Number(res.value || 10),
            expiresAt: String(res.expiresAt || "2027-12-31T23:59:59Z"),
            label:
              res.type === "FIXED"
                ? `$${Number(res.value)} off applied`
                : `${Number(res.value)}% off applied`,
          };
          this.onLog({
            method: "site.plugin('ecommerce').action('vouchers/validate')",
            route: "POST vouchers/validate",
            outcome: "live",
            durationMs: Math.round(performance.now() - start),
            detail: `Applied live voucher ${v.code}`,
          });
          return { voucher: v, synced: true };
        }
      } catch {
        // fall through to curated vouchers so demo storefront flows stay smooth
      }
    }

    const match = AVAILABLE_VOUCHERS.find((v) => v.code === code);
    if (!match) {
      return {
        error: "Code not found. Try WELCOME15, SOLEN25, or ATELIER10.",
        synced: false,
      };
    }
    if (match.minSubtotal && subtotal < match.minSubtotal) {
      return {
        error: `${match.code} unlocks at $${match.minSubtotal} minimum order.`,
        synced: false,
      };
    }

    this.onLog({
      method: "site.plugin('ecommerce').action('vouchers/validate')",
      route: "POST vouchers/validate",
      outcome: "fallback",
      durationMs: Math.round(performance.now() - start),
      detail: `Applied storefront code ${match.code} (${match.label})`,
    });
    return { voucher: match, synced: false };
  }

  /**
   * Creates a storefront order using `client.site.plugin("ecommerce").action("orders", { method: "POST" })`
   * formatted to EcommerceOrderCreateInput + AddAddressRequest contracts.
   */
  public async createOrder(input: {
    items: StoreOrder["items"];
    subtotal: number;
    discount: number;
    shippingCost: number;
    amount: number;
    voucherCode?: string;
    shippingMethod: "standard" | "express";
    shippingAddress: OrderShippingAddress;
  }): Promise<StoreOrder> {
    const start = performance.now();
    const fallbackCode = `SLN-${Math.floor(10000 + Math.random() * 89999)}`;
    const now = new Date().toISOString();

    if (this.client) {
      try {
        const res = await this.client.site
          .plugin("ecommerce")
          .action<Record<string, unknown>>("orders", {
            method: "POST",
            body: {
              orderProducts: input.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                color: item.color,
              })),
              amount: input.amount,
              discount: input.discount,
              voucherCode: input.voucherCode,
              shippingMethod: input.shippingMethod,
              shippingAddress: input.shippingAddress,
            },
          });

        const order: StoreOrder = {
          id: String(res?.id ?? Date.now()),
          orderCode: String(res?.orderCode ?? fallbackCode),
          amount: Number(res?.amount ?? input.amount),
          subtotal: input.subtotal,
          discount: Number(res?.discount ?? input.discount),
          shippingCost: input.shippingCost,
          voucherCode: input.voucherCode,
          shippingMethod: input.shippingMethod,
          status: (res?.status as OrderStatus) || "PENDING",
          items: input.items,
          shippingAddress: input.shippingAddress,
          createdAt: String(res?.createdAt ?? now),
          updatedAt: String(res?.updatedAt ?? now),
          syncedToJoorchin: true,
        };

        this.onLog({
          method: "site.plugin('ecommerce').action('orders')",
          route: "POST orders",
          outcome: "live",
          durationMs: Math.round(performance.now() - start),
          detail: `Created live order ${order.orderCode} ($${order.amount.toFixed(2)})`,
        });
        return order;
      } catch (err) {
        this.onLog({
          method: "site.plugin('ecommerce').action('orders')",
          route: "POST orders",
          outcome: "fallback",
          durationMs: Math.round(performance.now() - start),
          detail: `Saved preview order ${fallbackCode} (${getSdkErrorMessage(err)})`,
        });
      }
    } else {
      this.onLog({
        method: "site.plugin('ecommerce').action('orders')",
        route: "sdk:standby",
        outcome: "fallback",
        durationMs: Math.round(performance.now() - start),
        detail: `Recorded order ${fallbackCode} ($${input.amount.toFixed(2)})`,
      });
    }

    return {
      id: String(Date.now()),
      orderCode: fallbackCode,
      amount: input.amount,
      subtotal: input.subtotal,
      discount: input.discount,
      shippingCost: input.shippingCost,
      voucherCode: input.voucherCode,
      shippingMethod: input.shippingMethod,
      status: "PROCESSING",
      items: input.items,
      shippingAddress: input.shippingAddress,
      createdAt: now,
      updatedAt: now,
      syncedToJoorchin: false,
    };
  }

  /**
   * Lists customer's saved Joorchin ecommerce orders when signed in.
   */
  public async listCustomerOrders(): Promise<StoreOrder[]> {
    if (!this.client) return [];
    const start = performance.now();
    try {
      const rows = await this.client.site
        .plugin("ecommerce")
        .records("order")
        .list<Record<string, unknown>>({ limit: 25 });
      const items: Record<string, unknown>[] = Array.isArray(rows)
        ? [...rows]
        : [...((rows as { items?: Record<string, unknown>[] }).items ?? [])];
      this.onLog({
        method: "site.plugin('ecommerce').records('order').list",
        route: "GET orders",
        outcome: "live",
        durationMs: Math.round(performance.now() - start),
        detail: `Fetched ${items.length} customer order(s)`,
      });
      return items.map((r, idx) => ({
        id: String(r.id ?? idx),
        orderCode: String(r.orderCode ?? `JC-${r.id ?? idx}`),
        amount: Number(r.amount ?? 0),
        subtotal: Number(r.amount ?? 0) + Number(r.discount ?? 0),
        discount: Number(r.discount ?? 0),
        shippingCost: 0,
        shippingMethod: "standard",
        status: (r.status as OrderStatus) || "PENDING",
        items: [],
        shippingAddress: {
          full_name: "Customer",
          mobile: "",
          address: "",
          unit: "",
          building_number: "",
          city: "",
          postal_code: "",
        },
        createdAt: String(r.createdAt ?? new Date().toISOString()),
        updatedAt: String(r.updatedAt ?? new Date().toISOString()),
        syncedToJoorchin: true,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Submits a verified product comment via `client.site.plugin("ecommerce").action("comments")`
   */
  public async submitReview(review: Omit<ProductReviewComment, "id" | "date">): Promise<ProductReviewComment> {
    const start = performance.now();
    const record: ProductReviewComment = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString("fa-IR", { month: "long", year: "numeric" }),
    };
    if (this.client) {
      try {
        await this.client.site.plugin("ecommerce").action("comments", {
          method: "POST",
          body: {
            productId: review.productId,
            customerName: review.customerName,
            comment: review.comment,
            rating: review.rating,
            isPositive: review.rating >= 4,
            qualities: review.qualities,
          },
        });
        this.onLog({
          method: "site.plugin('ecommerce').action('comments')",
          route: "POST comments",
          outcome: "live",
          durationMs: Math.round(performance.now() - start),
          detail: `Published verified review on ${review.productTitle}`,
        });
        return record;
      } catch {
        // gracefully keep local
      }
    }
    this.onLog({
      method: "site.plugin('ecommerce').action('comments')",
      route: "sdk:standby",
      outcome: "fallback",
      durationMs: Math.round(performance.now() - start),
      detail: `Added review by ${review.customerName}`,
    });
    return record;
  }

  /**
   * Persists newsletter signup using `client.entities.NewsletterSubscriber.create`
   */
  public async subscribeNewsletter(email: string): Promise<{ synced: boolean }> {
    const start = performance.now();
    if (this.client) {
      try {
        await this.client.entities.NewsletterSubscriber.create({
          email,
          source: "solen_storefront",
          welcomeCode: "WELCOME15",
          subscribedAt: new Date().toISOString(),
        });
        this.onLog({
          method: "entities.NewsletterSubscriber.create",
          route: "POST entities/NewsletterSubscriber",
          outcome: "live",
          durationMs: Math.round(performance.now() - start),
          detail: `Subscribed ${email}`,
        });
        return { synced: true };
      } catch (err) {
        this.onLog({
          method: "entities.NewsletterSubscriber.create",
          route: "POST entities/NewsletterSubscriber",
          outcome: "fallback",
          durationMs: Math.round(performance.now() - start),
          detail: `Recorded ${email} locally (${getSdkErrorMessage(err)})`,
        });
      }
    } else {
      this.onLog({
        method: "entities.NewsletterSubscriber.create",
        route: "sdk:standby",
        outcome: "fallback",
        durationMs: Math.round(performance.now() - start),
        detail: `Captured ${email} · issued code WELCOME15`,
      });
    }
    return { synced: false };
  }

  /**
   * Real hosted BYF Web Push bindings via `client.site.push`
   */
  public async getPushStatus(): Promise<PushState> {
    if (!this.client) {
      if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
      if (Notification.permission === "denied") return "denied";
      return "default";
    }
    try {
      const state = await this.client.site.push.getStatus();
      return state as PushState;
    } catch {
      return "default";
    }
  }

  public async subscribePush(topics = ["orders", "drops"]): Promise<{
    state: PushState;
    detail: string;
  }> {
    const start = performance.now();
    if (this.client) {
      try {
        const res = await this.client.site.push.subscribe({ topics });
        this.onLog({
          method: "site.push.subscribe",
          route: `topics: ${topics.join(", ")}`,
          outcome: "live",
          durationMs: Math.round(performance.now() - start),
          detail: `Subscribed web push (${res.id})`,
        });
        return { state: "subscribed", detail: "اعلان مجموعه‌های جدید و سفارش‌ها فعال است." };
      } catch (err) {
        const msg = getSdkErrorMessage(err);
        this.onLog({
          method: "site.push.subscribe",
          route: `topics: ${topics.join(", ")}`,
          outcome: "fallback",
          durationMs: Math.round(performance.now() - start),
          detail: msg,
        });
        const nextStatus = await this.getPushStatus();
        return {
          state: nextStatus === "denied" ? "denied" : "subscribed",
          detail:
            nextStatus === "denied"
              ? "Notifications blocked in browser preferences."
              : "Drop alerts registered for this session (publish with Joorchin push plugin for live VAPID delivery).",
        };
      }
    }
    this.onLog({
      method: "site.push.subscribe",
      route: `topics: ${topics.join(", ")}`,
      outcome: "fallback",
      durationMs: Math.round(performance.now() - start),
      detail: "Subscribed preview alert state (connect Joorchin push plugin for live push)",
    });
    return {
      state: "subscribed",
      detail: "Limited-drop notifications active. Connect your Joorchin push plugin for native delivery.",
    };
  }

  public async unsubscribePush(): Promise<PushState> {
    if (this.client) {
      try {
        await this.client.site.push.unsubscribe();
      } catch {
        // ignore if no worker registered
      }
    }
    this.onLog({
      method: "site.push.unsubscribe",
      route: "push",
      outcome: this.client ? "live" : "fallback",
      durationMs: 12,
      detail: "Unsubscribed from drop push notifications",
    });
    return "default";
  }

  // --- Customer Auth (site_user) via client.auth ---

  public async requestCustomerOtp(phone: string): Promise<{ live: boolean; message: string }> {
    const start = performance.now();
    if (!this.client) {
      this.onLog({
        method: "auth.requestOtp",
        route: "sdk:standby",
        outcome: "fallback",
        durationMs: 15,
        detail: `Preview OTP dispatched for ${phone} (enter 123456)`,
      });
      return {
        live: false,
        message: "حالت پیش‌نمایش: برای ادامه کد ۱۲۳۴۵۶ را وارد کنید یا برای دریافت پیامک واقعی شناسه فروشگاه Joorchin را متصل کنید.",
      };
    }
    await this.client.auth.requestOtp(phone);
    this.onLog({
      method: "auth.requestOtp",
      route: "POST auth/request-otp",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Sent live SMS OTP to ${phone}`,
    });
    return { live: true, message: `کد تأیید برای ${phone} ارسال شد.` };
  }

  public async verifyCustomerOtp(
    phone: string,
    otpCode: string
  ): Promise<{ live: boolean; result?: AuthLoginResult }> {
    const start = performance.now();
    if (!this.client) {
      if (otpCode.trim().length < 4) {
        throw new Error("کد تأیید ۶ رقمی را وارد کنید (در پیش‌نمایش از ۱۲۳۴۵۶ استفاده کنید).");
      }
      this.onLog({
        method: "auth.loginViaPhoneOtp",
        route: "sdk:standby",
        outcome: "fallback",
        durationMs: 18,
        detail: `Signed in preview customer ${phone}`,
      });
      return { live: false };
    }
    const result = await this.client.auth.loginViaPhoneOtp(phone, otpCode);
    this.onLog({
      method: "auth.loginViaPhoneOtp",
      route: "POST auth/login-otp",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Authenticated customer ${phone} (session stored)`,
    });
    return { live: true, result };
  }

  public async loginCustomerPassword(
    phone: string,
    password: string
  ): Promise<{ live: boolean; result?: AuthLoginResult }> {
    const start = performance.now();
    if (!this.client) {
      if (password.length < 4) throw new Error("گذرواژه باید دست‌کم ۴ نویسه داشته باشد.");
      this.onLog({
        method: "auth.loginWithPassword",
        route: "sdk:standby",
        outcome: "fallback",
        durationMs: 14,
        detail: `Signed in preview customer ${phone}`,
      });
      return { live: false };
    }
    const result = await this.client.auth.loginWithPassword(phone, password);
    this.onLog({
      method: "auth.loginWithPassword",
      route: "POST auth/login-password",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Authenticated customer ${phone} via password`,
    });
    return { live: true, result };
  }

  public async fetchMe(): Promise<Record<string, unknown> | null> {
    if (!this.client) return null;
    try {
      const me = await this.client.auth.me();
      return me as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  public async updateMe(data: { fullName?: string; email?: string }): Promise<boolean> {
    if (!this.client) return false;
    const start = performance.now();
    await this.client.auth.updateMe(data);
    this.onLog({
      method: "auth.updateMe",
      route: "PUT users/me",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Updated profile (${data.fullName || data.email || "fields"})`,
    });
    return true;
  }

  public async logout(): Promise<void> {
    if (this.client) {
      try {
        await this.client.auth.logout();
      } catch {
        // clear local session regardless
      }
    }
    this.onLog({
      method: "auth.logout",
      route: "auth",
      outcome: this.client ? "live" : "fallback",
      durationMs: 8,
      detail: "Cleared end-user bearer + refresh session",
    });
  }

  // --- Staff / Merchant Back-Office via client.auth.*Staff* + client.backoffice.ecommerce ---

  public async requestStaffOtp(phone: string): Promise<void> {
    if (!this.client) {
      throw new Error("برای ورود کارکنان ابتدا شناسه فروشگاه Joorchin را متصل کنید.");
    }
    const start = performance.now();
    await this.client.auth.requestStaffOtp(phone);
    this.onLog({
      method: "auth.requestStaffOtp",
      route: "POST auth/admin/otp",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Dispatched staff OTP to ${phone}`,
    });
  }

  public async loginStaffOtp(phone: string, otpCode: string): Promise<AuthLoginResult> {
    if (!this.client) {
      throw new Error("ابتدا شناسه فروشگاه Joorchin را متصل کنید.");
    }
    const start = performance.now();
    const res = await this.client.auth.loginStaffViaPhoneOtp(phone, otpCode);
    this.onLog({
      method: "auth.loginStaffViaPhoneOtp",
      route: "POST auth/admin/login",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Staff signed in: ${phone}`,
    });
    return res;
  }

  public async loginStaffPassword(phone: string, password: string): Promise<AuthLoginResult> {
    if (!this.client) {
      throw new Error("ابتدا شناسه فروشگاه Joorchin را متصل کنید.");
    }
    const start = performance.now();
    const res = await this.client.auth.loginStaffWithPassword(phone, password);
    this.onLog({
      method: "auth.loginStaffWithPassword",
      route: "POST auth/admin/password",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Staff password sign-in succeeded for ${phone}`,
    });
    return res;
  }

  public async fetchBackofficeSnapshot(): Promise<{
    orders: Record<string, unknown>[];
    stats: Record<string, unknown> | null;
  }> {
    if (!this.client) {
      throw new Error("ابتدا فروشگاه Joorchin را متصل و به‌عنوان کارمند وارد شوید.");
    }
    const start = performance.now();
    const [ordersRows, statsRaw] = await Promise.all([
      this.client.backoffice.ecommerce.listShopOrders({ limit: 20 }),
      this.client.backoffice.ecommerce.getShopStats().catch(() => null),
    ]);
    const orders: Record<string, unknown>[] = Array.isArray(ordersRows)
      ? ([...ordersRows] as Record<string, unknown>[])
      : ([
          ...((ordersRows as { items?: Record<string, unknown>[] }).items ?? []),
        ] as Record<string, unknown>[]);
    this.onLog({
      method: "backoffice.ecommerce.listShopOrders + getShopStats",
      route: "GET backoffice/ecommerce",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Loaded ${orders.length} live back-office orders`,
    });
    return {
      orders,
      stats: (statsRaw as Record<string, unknown> | null) ?? null,
    };
  }

  public async fulfillBackofficeOrder(orderId: string): Promise<void> {
    if (!this.client) throw new Error("هیچ اپلیکیشن Joorchin تنظیم نشده است.");
    const start = performance.now();
    await this.client.backoffice.ecommerce.fulfillOrder(orderId);
    this.onLog({
      method: "backoffice.ecommerce.fulfillOrder",
      route: `POST orders/${orderId}/fulfill`,
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Fulfilled order #${orderId}`,
    });
  }

  public async saveBackofficeProduct(product: Record<string, unknown>): Promise<void> {
    if (!this.client) throw new Error("هیچ اپلیکیشن Joorchin تنظیم نشده است.");
    const start = performance.now();
    await this.client.backoffice.ecommerce.saveProduct(product);
    this.onLog({
      method: "backoffice.ecommerce.saveProduct",
      route: "POST backoffice/ecommerce/products",
      outcome: "live",
      durationMs: Math.round(performance.now() - start),
      detail: `Saved catalog product "${String(product.title || "")}"`,
    });
  }
}
