import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CartItem,
  CustomerUser,
  JoorchinConfig,
  JoorchinConnectionMode,
  JournalArticle,
  OrderShippingAddress,
  ProductCategoryId,
  ProductReviewComment,
  PushState,
  SdkCallLog,
  StoreOrder,
  StoreProduct,
  StoreVoucher,
} from "../types/store";
import {
  CURATED_PRODUCTS,
  FREE_SHIPPING_THRESHOLD,
  INITIAL_REVIEWS,
  SAMPLE_ORDERS,
} from "../data/catalog";
import {
  JoorchinStoreService,
  loadSavedJoorchinConfig,
} from "../lib/joorchin";

const CART_STORAGE_KEY = "solen_cart_v1";
const WISHLIST_STORAGE_KEY = "solen_wishlist_v1";
const ORDERS_STORAGE_KEY = "solen_orders_v1";

export function getEffectivePrice(product: StoreProduct): number {
  return product.discountedPrice != null && product.discountedPrice < product.price
    ? product.discountedPrice
    : product.price;
}

export function formatMoney(amount: number): string {
  const hasCents = Math.abs(amount % 1) > 0.005;
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(amount);
}

interface ToastMessage {
  id: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface StoreContextValue {
  // Catalog
  products: StoreProduct[];
  catalogLoading: boolean;
  isLiveCatalog: boolean;
  selectedCategory: ProductCategoryId;
  setSelectedCategory: (cat: ProductCategoryId) => void;
  jumpToCategory: (cat: ProductCategoryId) => void;
  refreshCatalog: () => Promise<void>;

  // Cart & Vouchers
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  voucher: StoreVoucher | null;
  voucherDiscount: number;
  freeShippingUnlocked: boolean;
  amountToFreeShipping: number;
  addToCart: (
    product: StoreProduct,
    options?: {
      quantity?: number;
      color?: string;
      openDrawer?: boolean;
      bundleLabel?: string;
      overrideUnitPrice?: number;
    }
  ) => void;
  addBundleToCart: (
    items: StoreProduct[],
    discountPercent: number,
    bundleName: string
  ) => void;
  updateCartQty: (itemId: string, quantity: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => Promise<{ ok: boolean; error?: string }>;
  removeVoucher: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders & Checkout
  orders: StoreOrder[];
  placeOrder: (payload: {
    shippingAddress: OrderShippingAddress;
    shippingMethod: "standard" | "express";
    shippingCost: number;
  }) => Promise<StoreOrder>;

  // Reviews
  reviews: ProductReviewComment[];
  addReview: (input: {
    productId: string;
    customerName: string;
    location: string;
    comment: string;
    rating: number;
    qualities: string[];
  }) => Promise<void>;

  // Customer Auth (Joorchin client.auth)
  user: CustomerUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomerUser | null>>;
  logoutUser: () => Promise<void>;

  // Hosted Web Push (client.site.push)
  pushState: PushState;
  subscribePush: () => Promise<string>;
  unsubscribePush: () => Promise<void>;

  // Drawers & Modals
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  accountOpen: boolean;
  accountTab: "signin" | "orders" | "wishlist";
  openAccount: (tab?: "signin" | "orders" | "wishlist") => void;
  setAccountOpen: (open: boolean) => void;
  joorchinOpen: boolean;
  setJoorchinOpen: (open: boolean) => void;
  activeProduct: StoreProduct | null;
  setActiveProduct: (p: StoreProduct | null) => void;
  activeArticle: JournalArticle | null;
  setActiveArticle: (a: JournalArticle | null) => void;

  // Joorchin Backend SDK Service & Telemetry
  service: JoorchinStoreService;
  joorchinConfig: JoorchinConfig;
  connectionMode: JoorchinConnectionMode;
  connectionStatusText: string;
  connectJoorchin: (config: JoorchinConfig) => Promise<{ ok: boolean; message: string }>;
  disconnectJoorchin: () => Promise<void>;
  sdkLogs: SdkCallLog[];
  clearSdkLogs: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, actionLabel?: string, onAction?: () => void) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sdkLogs, setSdkLogs] = useState<SdkCallLog[]>([]);
  const pushLog = useCallback((entry: Omit<SdkCallLog, "id" | "timestamp">) => {
    const item: SdkCallLog = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    setSdkLogs((prev) => [item, ...prev].slice(0, 40));
  }, []);

  const initialConfig = useMemo(() => loadSavedJoorchinConfig(), []);
  const serviceRef = useRef<JoorchinStoreService | null>(null);
  if (!serviceRef.current) {
    serviceRef.current = new JoorchinStoreService(initialConfig, pushLog);
  }
  const service = serviceRef.current;

  const [joorchinConfig, setJoorchinConfig] = useState<JoorchinConfig>(initialConfig);
  const [connectionMode, setConnectionMode] = useState<JoorchinConnectionMode>(
    initialConfig.appId ? "connecting" : "standby"
  );
  const [connectionStatusText, setConnectionStatusText] = useState<string>(
    initialConfig.appId
      ? `در حال اتصال به ${initialConfig.appId}…`
      : "آماده‌به‌کار · فروشگاه نمونه فعال است (شناسه Joorchin را برای اتصال وارد کنید)"
  );

  const [products, setProducts] = useState<StoreProduct[]>(CURATED_PRODUCTS);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [isLiveCatalog, setIsLiveCatalog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryId>("all");

  // Persisted cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as CartItem[];
    } catch {
      // ignore
    }
    return [];
  });

  // Persisted wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as string[];
    } catch {
      // ignore
    }
    return ["solen-lume-lamp"];
  });

  // Persisted orders
  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as StoreOrder[];
    } catch {
      // ignore
    }
    return SAMPLE_ORDERS;
  });

  const [voucher, setVoucher] = useState<StoreVoucher | null>(null);
  const [reviews, setReviews] = useState<ProductReviewComment[]>(INITIAL_REVIEWS);
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [pushState, setPushState] = useState<PushState>("default");

  // Overlays
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<"signin" | "orders" | "wishlist">("signin");
  const [joorchinOpen, setJoorchinOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<StoreProduct | null>(null);
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, actionLabel?: string, onAction?: () => void) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, text, actionLabel, onAction }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    const configured = service.isConfigured();
    if (configured) setConnectionMode("connecting");

    const res = await service.listProducts();
    setProducts(res.products);
    setIsLiveCatalog(res.isLive);
    setConnectionStatusText(res.message);

    if (!configured) {
      setConnectionMode("standby");
    } else if (res.isLive) {
      setConnectionMode("connected");
    } else {
      setConnectionMode("error");
    }
    setCatalogLoading(false);
  }, [service]);

  // Hydrate catalog, saved Joorchin auth session & push status on mount
  useEffect(() => {
    let active = true;
    void (async () => {
      await refreshCatalog();
      const status = await service.getPushStatus();
      if (active) setPushState(status);

      const session = service.getSession();
      if (session?.access_token && active) {
        const me = await service.fetchMe();
        if (me && active) {
          setUser({
            id: me.id ? String(me.id) : undefined,
            phone: String(me.phone || me.username || ""),
            fullName: String(me.fullName || me.name || "عضو استودیو"),
            email: String(me.email || ""),
            role: "customer",
            isLiveSession: true,
          });
          const liveOrders = await service.listCustomerOrders();
          if (liveOrders.length > 0 && active) {
            setOrders((prev) => {
              const codes = new Set(liveOrders.map((o) => o.orderCode));
              return [...liveOrders, ...prev.filter((o) => !codes.has(o.orderCode))];
            });
          }
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshCatalog, service]);

  const connectJoorchin = useCallback(
    async (next: JoorchinConfig) => {
      service.updateConfig(next);
      setJoorchinConfig(service.getConfig());
      setCatalogLoading(true);
      setConnectionMode(next.appId.trim() ? "connecting" : "standby");

      const res = await service.listProducts();
      setProducts(res.products);
      setIsLiveCatalog(res.isLive);
      setConnectionStatusText(res.message);
      setCatalogLoading(false);

      if (!next.appId.trim()) {
        setConnectionMode("standby");
        return { ok: true, message: "حالت محلیِ محصولات منتخب فعال شد." };
      }

      if (res.isLive) {
        setConnectionMode("connected");
        const pushSt = await service.getPushStatus();
        setPushState(pushSt);
        showToast(`به فروشگاه Joorchin متصل شد: ${next.appId.trim()}`);
        return { ok: true, message: res.message };
      }

      setConnectionMode("error");
      return { ok: false, message: res.message };
    },
    [service, showToast]
  );

  const disconnectJoorchin = useCallback(async () => {
    await service.logout();
    service.updateConfig({
      appId: "",
      serverUrl: joorchinConfig.serverUrl,
      tokenStorageKey: "joorchin_solen_storefront",
    });
    setJoorchinConfig(service.getConfig());
    setUser(null);
    setProducts(CURATED_PRODUCTS);
    setIsLiveCatalog(false);
    setConnectionMode("standby");
    setConnectionStatusText(
      "آماده‌به‌کار · فروشگاه نمونه فعال است (شناسه Joorchin را برای اتصال وارد کنید)"
    );
    showToast("اتصال قطع شد؛ فهرست پیش‌نمایش محصولات بازیابی شد.");
  }, [joorchinConfig.serverUrl, service, showToast]);

  const jumpToCategory = useCallback((cat: ProductCategoryId) => {
    setSelectedCategory(cat);
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const addToCart = useCallback(
    (
      product: StoreProduct,
      options?: {
        quantity?: number;
        color?: string;
        openDrawer?: boolean;
        bundleLabel?: string;
        overrideUnitPrice?: number;
      }
    ) => {
      const qty = Math.max(1, options?.quantity ?? 1);
      const selectedColor = options?.color ?? product.colors[0]?.name ?? "ویژه";
      const key = `${product.id}__${selectedColor}__${options?.bundleLabel ?? "single"}`;

      setCart((prev) => {
        const existing = prev.find((i) => i.id === key);
        if (existing) {
          return prev.map((i) =>
            i.id === key ? { ...i, quantity: Math.min(20, i.quantity + qty) } : i
          );
        }
        return [
          ...prev,
          {
            id: key,
            productId: product.id,
            product,
            quantity: qty,
            selectedColor,
            bundleLabel: options?.bundleLabel,
            overrideUnitPrice: options?.overrideUnitPrice,
          },
        ];
      });

      void service.syncCartItem(product.id, qty);

      if (options?.openDrawer !== false) {
        setCartOpen(true);
      } else {
        showToast(`${product.title} به سبد خرید افزوده شد`, "مشاهده سبد", () => setCartOpen(true));
      }
    },
    [service, showToast]
  );

  const addBundleToCart = useCallback(
    (items: StoreProduct[], discountPercent: number, bundleName: string) => {
      const multiplier = (100 - discountPercent) / 100;
      setCart((prev) => {
        const next = [...prev];
        for (const product of items) {
          const base = getEffectivePrice(product);
          const discounted = Math.round(base * multiplier * 100) / 100;
          const color = product.colors[0]?.name ?? "ویژه";
          const key = `${product.id}__${color}__${bundleName}`;
          const existingIdx = next.findIndex((c) => c.id === key);
          if (existingIdx >= 0) {
            next[existingIdx] = {
              ...next[existingIdx],
              quantity: next[existingIdx].quantity + 1,
            };
          } else {
            next.push({
              id: key,
              productId: product.id,
              product,
              quantity: 1,
              selectedColor: color,
              bundleLabel: `${bundleName} (-${discountPercent}%)`,
              overrideUnitPrice: discounted,
            });
          }
          void service.syncCartItem(product.id, 1);
        }
        return next;
      });
      setCartOpen(true);
      showToast(`${bundleName} به سبد افزوده شد (${discountPercent}٪ تخفیف)`);
    },
    [service, showToast]
  );

  const updateCartQty = useCallback((itemId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== itemId);
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.min(20, quantity) } : i
      );
    });
  }, []);

  const removeCartItem = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setVoucher(null);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const unit = item.overrideUnitPrice ?? getEffectivePrice(item.product);
        return sum + unit * item.quantity;
      }, 0),
    [cart]
  );

  const voucherDiscount = useMemo(() => {
    if (!voucher || cartSubtotal <= 0) return 0;
    if (voucher.minSubtotal && cartSubtotal < voucher.minSubtotal) return 0;
    if (voucher.type === "PERCENTAGE") {
      return Math.round(cartSubtotal * (voucher.value / 100) * 100) / 100;
    }
    return Math.min(cartSubtotal, voucher.value);
  }, [voucher, cartSubtotal]);

  const freeShippingUnlocked = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const applyVoucher = useCallback(
    async (code: string) => {
      const res = await service.validateVoucher(code, cartSubtotal);
      if (res.voucher) {
        setVoucher(res.voucher);
        showToast(`کد ${res.voucher.code} اعمال شد — ${res.voucher.label}`);
        return { ok: true };
      }
      return { ok: false, error: res.error };
    },
    [cartSubtotal, service, showToast]
  );

  const removeVoucher = useCallback(() => {
    setVoucher(null);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        const prod = products.find((p) => p.id === productId);
        if (exists) {
          if (prod) showToast(`${prod.title} از علاقه‌مندی‌ها حذف شد`);
          return prev.filter((id) => id !== productId);
        }
        if (prod) {
          showToast(`${prod.title} ذخیره شد`, "علاقه‌مندی‌ها", () => {
            setAccountTab("wishlist");
            setAccountOpen(true);
          });
        }
        return [...prev, productId];
      });
    },
    [products, showToast]
  );

  const placeOrder = useCallback(
    async ({
      shippingAddress,
      shippingMethod,
      shippingCost,
    }: {
      shippingAddress: OrderShippingAddress;
      shippingMethod: "standard" | "express";
      shippingCost: number;
    }) => {
      const items = cart.map((item) => ({
        productId: item.productId,
        title: item.product.title,
        image: item.product.images.main,
        quantity: item.quantity,
        unitPrice: item.overrideUnitPrice ?? getEffectivePrice(item.product),
        color: item.selectedColor,
      }));
      const total = Math.max(0, Math.round((cartSubtotal - voucherDiscount + shippingCost) * 100) / 100);

      const created = await service.createOrder({
        items,
        subtotal: cartSubtotal,
        discount: voucherDiscount,
        shippingCost,
        amount: total,
        voucherCode: voucher?.code,
        shippingMethod,
        shippingAddress,
      });

      setOrders((prev) => [created, ...prev]);
      clearCart();
      return created;
    },
    [cart, cartSubtotal, clearCart, service, voucher?.code, voucherDiscount]
  );

  const addReview = useCallback(
    async (input: {
      productId: string;
      customerName: string;
      location: string;
      comment: string;
      rating: number;
      qualities: string[];
    }) => {
      const prod = products.find((p) => p.id === input.productId) || products[0];
      const saved = await service.submitReview({
        productId: prod.id,
        productTitle: prod.title,
        customerName: input.customerName.trim(),
        location: input.location.trim() || "خانه تأییدشده",
        comment: input.comment.trim(),
        rating: input.rating,
        isPositive: input.rating >= 4,
        qualities: input.qualities,
        verified: true,
      });
      setReviews((prev) => [saved, ...prev]);
      showToast("سپاس از شما؛ دیدگاهتان منتشر شد.");
    },
    [products, service, showToast]
  );

  const logoutUser = useCallback(async () => {
    await service.logout();
    setUser(null);
    showToast("با موفقیت خارج شدید.");
  }, [service, showToast]);

  const subscribePush = useCallback(async () => {
    const res = await service.subscribePush(["orders", "drops"]);
    setPushState(res.state);
    showToast(res.detail);
    return res.detail;
  }, [service, showToast]);

  const unsubscribePush = useCallback(async () => {
    const next = await service.unsubscribePush();
    setPushState(next);
    showToast("اعلان مجموعه‌های جدید خاموش شد.");
  }, [service, showToast]);

  const openAccount = useCallback((tab: "signin" | "orders" | "wishlist" = "signin") => {
    setAccountTab(tab);
    setAccountOpen(true);
  }, []);

  const clearSdkLogs = useCallback(() => setSdkLogs([]), []);

  // Global ESC closes open overlays & Cmd/Ctrl+K toggles search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setActiveProduct(null);
        setActiveArticle(null);
        setCartOpen(false);
        setAccountOpen(false);
        setJoorchinOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        catalogLoading,
        isLiveCatalog,
        selectedCategory,
        setSelectedCategory,
        jumpToCategory,
        refreshCatalog,
        cart,
        cartCount,
        cartSubtotal,
        voucher,
        voucherDiscount,
        freeShippingUnlocked,
        amountToFreeShipping,
        addToCart,
        addBundleToCart,
        updateCartQty,
        removeCartItem,
        clearCart,
        applyVoucher,
        removeVoucher,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        reviews,
        addReview,
        user,
        setUser,
        logoutUser,
        pushState,
        subscribePush,
        unsubscribePush,
        cartOpen,
        setCartOpen,
        searchOpen,
        setSearchOpen,
        accountOpen,
        accountTab,
        openAccount,
        setAccountOpen,
        joorchinOpen,
        setJoorchinOpen,
        activeProduct,
        setActiveProduct,
        activeArticle,
        setActiveArticle,
        service,
        joorchinConfig,
        connectionMode,
        connectionStatusText,
        connectJoorchin,
        disconnectJoorchin,
        sdkLogs,
        clearSdkLogs,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
