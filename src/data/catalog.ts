import type {
  StoreProduct,
  StoreCategory,
  StoreVoucher,
  ProductReviewComment,
  CuratedBundle,
  LookbookHotspot,
  JournalArticle,
  FaqItem,
  StoreOrder,
} from "../types/store";

export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_FEE = 12;
export const EXPRESS_SHIPPING_FEE = 24;

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    id: "coffee",
    title: "قهوه صبحگاهی",
    subtitle: "کتری‌های دقیق، قوری‌ها و فنجان‌های دست‌ساز",
    countLabel: "۰۳ محصول",
    imageUrl: "/images/prod-kettle.jpg",
  },
  {
    id: "lighting",
    title: "زندگی و نور",
    subtitle: "چراغ‌های رومیزی بی‌سیم با فلز برس‌خورده و شیشه اوپال",
    countLabel: "۰۲ محصول",
    imageUrl: "/images/prod-lamp.jpg",
  },
  {
    id: "botanical",
    title: "رایحه گیاهی",
    subtitle: "دیفیوزرهای پرس‌سرد و عودهای آرام‌بخش",
    countLabel: "۰۲ محصول",
    imageUrl: "/images/prod-botanical.jpg",
  },
  {
    id: "textiles",
    title: "کتان بافت‌دار",
    subtitle: "پتوهای کتان بلژیکی سنگین و پارچه‌های حمام",
    countLabel: "۰۲ محصول",
    imageUrl: "/images/prod-linen.jpg",
  },
];

export const CURATED_PRODUCTS: StoreProduct[] = [
  {
    id: "solen-kanso-kettle",
    title: "کتری گردن‌غازی و قوری کانسو",
    titleEn: "Kanso Gooseneck Kettle & Carafe",
    subtitle: "فولاد مات ۳۰۴ · گردوی دودی · قوری بوروسیلیکات",
    description:
      "طراحی شده تا جریان آبی یکنواخت و آرام با پهنای ۰٫۹ میلی‌متر روی قهوه تازه ایجاد کند. بدنه از فولاد ضدزنگ معماری با پوشش پودری ساخته شده و دسته گردوی پرتغالیِ دست‌تراش، حلقه برنجی و قوری بوروسیلیکات شیاردار آن را کامل می‌کند.",
    slug: "kanso-gooseneck-kettle-carafe",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 248,
    discountedPrice: 218,
    discountPercent: 12,
    stock: 14,
    images: {
      main: "/images/prod-kettle.jpg",
      gallery: [
        "/images/prod-kettle.jpg",
        "/images/spotlight-drop.jpg",
        "https://images.pexels.com/photos/29498509/pexels-photo-29498509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ],
    },
    rating: { count: 312, average: 4.9 },
    colors: [
      { name: "مشکی آبسیدین مات", hex: "#23211F" },
      { name: "گچی خام", hex: "#E7E1D7" },
      { name: "خاک رس پرداخت‌شده", hex: "#9E5338" },
    ],
    properties: {
      origin: "کیوتو و لیسبون",
      weight: "۱٬۱۸۰ گرم",
      material: "فولاد ضدزنگ ۳۰۴، گردوی دودی، شیشه بوروسیلیکات",
      dimensions: "۲۹ × ۱۴٫۵ × ۱۷ سانتی‌متر · ۹۰۰ میلی‌لیتر",
    },
    brandId: "solen-atelier",
    categoryId: "coffee",
    badge: "Bestseller",
    bestsellerRank: 1,
    bundleSlot: "morning",
    notes: [
      "دسته متعادل‌شده، مچ دست را در وضعیت راحت نگه می‌دارد",
      "مناسب اجاق‌های القایی، گازی و سرامیکی",
      "یقه سیلیکونی و دسته گردویی قابل‌تعویض برای عمر طولانی",
    ],
    createdAt: "2026-01-12T08:00:00Z",
    updatedAt: "2026-03-02T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-lume-lamp",
    title: "چراغ اوپال بی‌سیم لوم",
    titleEn: "Lume Cordless Opal Lamp",
    subtitle: "آلومینیوم برس‌خورده · شیشه دست‌دمیده مات",
    description:
      "نوری گرم و دلنشین، بدون سیم‌های مزاحم. بدنه از یکپارچه آلومینیوم سندبلاست ساخته شده و با شیشه اوپال شیاردار پوشیده می‌شود. دیمر چرخشی سه‌مرحله‌ای، نور شامگاهی ۲۷۰۰ کلوین را تا نور شمع ۲۰۰۰ کلوین نرم و پیوسته تغییر می‌دهد.",
    slug: "lume-cordless-opal-lamp",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 265,
    discountedPrice: null,
    discountPercent: 0,
    stock: 19,
    images: {
      main: "/images/prod-lamp.jpg",
      gallery: [
        "/images/prod-lamp.jpg",
        "https://images.pexels.com/photos/14781780/pexels-photo-14781780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "/images/lookbook-room.jpg",
      ],
    },
    rating: { count: 248, average: 4.9 },
    colors: [
      { name: "شامپاینی آنودایزشده", hex: "#C8BFA8" },
      { name: "برنز کهنه", hex: "#5C4E41" },
      { name: "قلع برس‌خورده", hex: "#8B8A86" },
    ],
    properties: {
      origin: "میلان، ایتالیا",
      weight: "۱٬۴۲۰ گرم",
      material: "آلومینیوم آنودایزشده، شیشه اوپال دست‌دمیده",
      dimensions: "قطر ۱۶٫۵ × ۲۶ سانتی‌متر · باتری ۴۸ساعته",
    },
    brandId: "solen-atelier",
    categoryId: "lighting",
    badge: "Bestseller",
    bestsellerRank: 2,
    bundleSlot: "ambient",
    notes: [
      "تا ۴۸ ساعت شارژدهی بی‌سیم در حالت نور شمعی",
      "شارژر USB-C بافته‌شده از کتان، همراه محصول",
      "باتری لیتیومی قابل‌تعویض و تعمیر با عمر بیش از ۱۰ سال",
    ],
    createdAt: "2026-01-18T08:00:00Z",
    updatedAt: "2026-03-04T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-sabi-cups",
    title: "ست فنجان سرامیکی خام سابی",
    titleEn: "Sabi Raw Stoneware Cup Set",
    subtitle: "۴ لیوان و پارچ چشیدن · ساخته‌شده روی چرخ سفالگری",
    description:
      "این فنجان‌ها در کوره‌های کوچک چوب‌سوز، دو بار و در دمای ۱۲۶۰ درجه پخته می‌شوند. نمای بیرونیِ نخودی با خال‌های آهنی، سایه‌های طبیعی را به خود می‌گیرد و لعاب عاجیِ ساتن و ایمن برای مواد غذایی، گرمای صبح را در دستان شما نگه می‌دارد.",
    slug: "sabi-raw-stoneware-cups",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 118,
    discountedPrice: 96,
    discountPercent: 19,
    stock: 27,
    images: {
      main: "/images/prod-ceramics.jpg",
      gallery: [
        "/images/prod-ceramics.jpg",
        "/images/craft-artisan.jpg",
        "/images/hero-main.jpg",
      ],
    },
    rating: { count: 429, average: 5.0 },
    colors: [
      { name: "جو دوسر خال‌دار", hex: "#DED4C6" },
      { name: "خاک رس گرم", hex: "#B98A6F" },
      { name: "زغالی خاکستر", hex: "#4A4642" },
    ],
    properties: {
      origin: "کالداس دا راینیا، پرتغال",
      weight: "۱٬۳۴۰ گرم (مجموعه)",
      material: "سرامیک خام آهن‌دار محلی، لعاب خاکستر ساتن",
      dimensions: "۴ فنجان ۲۴۰ میلی‌لیتری + پارچ ۴۲۰ میلی‌لیتری",
    },
    brandId: "solen-atelier",
    categoryId: "coffee",
    badge: "Bestseller",
    bestsellerRank: 3,
    bundleSlot: "morning",
    notes: [
      "قابل شست‌وشو در ماشین ظرف‌شویی و آزموده‌شده برای شوک حرارتی",
      "رد ظریف انگشت سفالگر، هر ظرف را منحصربه‌فرد می‌کند",
      "فرم تو‌در‌تو فضای عمودی قفسه را آزاد می‌کند",
    ],
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-figue-diffuser",
    title: "شماره ۰۴؛ رایحه انجیر وحشی و سدر",
    titleEn: "No. 04 Wild Fig & Cedar Scent Duo",
    subtitle: "دیفیوزر ۲۰۰ میلی‌لیتری و اسپری ۱۰۰ میلی‌لیتری · شیشه کهربایی",
    description:
      "ترکیبی طبیعی، بدون مواد مصنوعی و الکل‌های سنگین. رایحه با برگ انجیر سبز و هل کوبیده آغاز می‌شود و در ادامه به چوب سدر اطلس، سنگ آهک باران‌خورده و خس‌خس سفید می‌رسد. در شیشه کهربایی ایتالیاییِ محافظ در برابر فرابنفش نگهداری می‌شود.",
    slug: "no-04-wild-fig-cedar-duo",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 112,
    discountedPrice: 94,
    discountPercent: 16,
    stock: 34,
    images: {
      main: "/images/prod-botanical.jpg",
      gallery: [
        "/images/prod-botanical.jpg",
        "https://images.pexels.com/photos/28912723/pexels-photo-28912723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
    },
    rating: { count: 287, average: 4.9 },
    colors: [
      { name: "شماره ۰۴؛ انجیر و سدر", hex: "#7A5234" },
      { name: "شماره ۰۷؛ دود هینوکی", hex: "#4D4942" },
      { name: "شماره ۱۱؛ نرولی", hex: "#C4A882" },
    ],
    properties: {
      origin: "گراس، فرانسه",
      weight: "۷۴۰ گرم",
      material: "روغن‌های اسانسی پرس‌سرد، شیشه کهربایی ضدفرابنفش، نی‌های زغالی",
      dimensions: "دیفیوزر ۲۰۰ میلی‌لیتری + اسپری ۱۰۰ میلی‌لیتری",
    },
    brandId: "solen-atelier",
    categoryId: "botanical",
    badge: "New",
    bestsellerRank: 4,
    bundleSlot: "tactile",
    notes: [
      "پخش رایحه آرام و پیوسته تا ۵ ماه با نی‌های زغالیِ دوطرفه",
      "ترکیب گیاهی وگان، بدون فتالات",
      "بطری‌های شیشه‌ای کهرباییِ قابل‌پرکردن با یقه سرامیکی ضدچکه",
    ],
    createdAt: "2026-02-02T08:00:00Z",
    updatedAt: "2026-03-08T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-flax-linen",
    title: "پتوی کتان سنگین کورتریک",
    titleEn: "Kortrijk Heavyweight Linen Throw",
    subtitle: "کتان ارگانیک بلژیکی ۳۸۰ گرمی، شسته‌شده و ریشه‌دار",
    description:
      "آهسته و با دستگاه‌های سنتی فلاندر، از الیاف بلند کتان اروپاییِ دیم بافته شده است. تنها با آب کوهستان نرم و لطیف شده؛ خنک و سبک در تابستان و گرم و آرامش‌بخش کنار آتش پاییزی.",
    slug: "kortrijk-heavyweight-linen-throw",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 185,
    discountedPrice: null,
    discountPercent: 0,
    stock: 22,
    images: {
      main: "/images/prod-linen.jpg",
      gallery: [
        "/images/prod-linen.jpg",
        "/images/lookbook-room.jpg",
      ],
    },
    rating: { count: 194, average: 4.8 },
    colors: [
      { name: "جو دوسر طبیعی", hex: "#D9CFC0" },
      { name: "خاک اخرایی", hex: "#A8664B" },
      { name: "شن گچی", hex: "#EDE8DF" },
    ],
    properties: {
      origin: "کورتریک، بلژیک",
      weight: "۱٬۱۲۰ گرم",
      material: "کتان بلژیکی با گواهی OEKO-TEX، وزن ۳۸۰ گرم",
      dimensions: "۱۵۰ × ۲۱۰ سانتی‌متر · لبه‌دوزی و ریشه‌دار",
    },
    brandId: "solen-atelier",
    categoryId: "textiles",
    bestsellerRank: 5,
    bundleSlot: "tactile",
    notes: [
      "پیش‌شسته برای ایستایی نرم و زیبا از همان ابتدا",
      "با هر بار شست‌وشو نرم‌تر و لطیف‌تر می‌شود",
      "بسته‌بندی‌شده با نوار پنبه‌ای بافته‌شده و قابل‌استفاده مجدد",
    ],
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-03-03T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-travertine-tray",
    title: "پایه تراورتن و عودسوز تیوولی",
    titleEn: "Tivoli Travertine Plinth & Burner",
    subtitle: "سنگ آهک رومی پرداخت‌شده · برنج یکپارچه بدون روکش",
    description:
      "از تراورتن رگه‌دار رومی با حفره‌های معدنی طبیعی تراش خورده و لبه‌هایی نرم و گرد دارد. همراه با عودسوز مخروطیِ برنجیِ یکپارچه و دقیق؛ برنج با گذر زمان پتینه‌ای کهربایی و زنده پیدا می‌کند.",
    slug: "tivoli-travertine-plinth-burner",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 164,
    discountedPrice: 138,
    discountPercent: 16,
    stock: 11,
    images: {
      main: "/images/prod-tray.jpg",
      gallery: [
        "/images/prod-tray.jpg",
        "/images/prod-botanical.jpg",
      ],
    },
    rating: { count: 163, average: 4.9 },
    colors: [
      { name: "تراورتن عاجی", hex: "#E0D6C6" },
      { name: "سنگ گردویی", hex: "#B09A82" },
    ],
    properties: {
      origin: "تیوولی، ایتالیا",
      weight: "2,260 g",
      material: "تراورتن رگه‌دارِ پرنشده، برنج ریخته‌گری‌شده",
      dimensions: "Ø 26 × 6.5 cm · Protective cork underside",
    },
    brandId: "solen-atelier",
    categoryId: "objects",
    badge: "Limited Run",
    bestsellerRank: 6,
    bundleSlot: "ambient",
    notes: [
      "شامل ۲۴ مخروط عود هینوکیِ دست‌پیچ از کیوتو",
      "پایه چوب‌پنبه‌ای فرورفته از سطوح چوبی و سنگی محافظت می‌کند",
      "رگه‌های طبیعی سنگ، هر پایه را یگانه می‌کند",
    ],
    createdAt: "2026-02-09T08:00:00Z",
    updatedAt: "2026-03-07T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-solstice-vase",
    title: "گلدان قوسی سفالی",
    titleEn: "Arched Clay Botanical Vessel",
    subtitle: "سرامیک بدون لعاب، شکل‌داده‌شده با دست · فرمی مجسمه‌وار",
    description:
      "لعاب داخلیِ ضدآب با نمای بیرونیِ معدنی و خام همراه شده است؛ مناسب شاخه‌های زیتون و ماگنولیا یا حتی ایستادنِ تنها در راهرویی آرام و دریافت نور متغیر عصرگاهی.",
    slug: "arched-clay-botanical-vessel",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 142,
    discountedPrice: null,
    discountPercent: 0,
    stock: 9,
    images: {
      main: "https://images.pexels.com/photos/29904622/pexels-photo-29904622.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      gallery: [
        "https://images.pexels.com/photos/29904622/pexels-photo-29904622.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/19884207/pexels-photo-19884207.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
    },
    rating: { count: 118, average: 4.9 },
    colors: [
      { name: "شن خام", hex: "#D6C5B2" },
      { name: "اخرایی سوخته", hex: "#9E6E4F" },
    ],
    properties: {
      origin: "اوآخاکا و پورتو",
      weight: "1,560 g",
      material: "سرامیک دست‌پیچ با لعاب داخلی ضدآب",
      dimensions: "Ø 18 × 28 cm · Mouth 6.5 cm",
    },
    brandId: "solen-atelier",
    categoryId: "objects",
    badge: "New",
    bestsellerRank: 7,
    bundleSlot: "ambient",
    notes: [
      "پایه سنگین و تخت، شاخه‌های بلند و سنگین را ایمن نگه می‌دارد",
      "نشان نسخه با دست روی هر پایه سرامیکی مهر شده است",
      "ارسال در بسته‌بندی دولایه با محافظ الیاف چوب بازیافتی",
    ],
    createdAt: "2026-02-14T08:00:00Z",
    updatedAt: "2026-03-09T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-drip-server",
    title: "دم‌آور پارچه‌ای آتلیه",
    titleEn: "Atelier Cloth-Filter Pour-Over",
    subtitle: "بوروسیلیکات آزمایشگاهی · فلانل ارگانیک سفیدنشده",
    description:
      "برای دم‌آوری آرام یکشنبه‌ها با شفافیت چشمگیر و بافتی مخملی. فیلتر چندبارمصرف فلانل پنبه‌ای ارگانیک ژاپنی، روغن‌های معطر قهوه را که فیلتر کاغذی جذب می‌کند حفظ می‌کند؛ درون قوری شیشه‌ای دست‌دمیده و گشادشونده قرار می‌گیرد.",
    slug: "atelier-cloth-filter-pour-over",
    status: "MARKETABLE",
    productType: "PRODUCT",
    price: 88,
    discountedPrice: 74,
    discountPercent: 16,
    stock: 31,
    images: {
      main: "https://images.pexels.com/photos/4787606/pexels-photo-4787606.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      gallery: [
        "https://images.pexels.com/photos/4787606/pexels-photo-4787606.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        "https://images.pexels.com/photos/29507967/pexels-photo-29507967.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      ],
    },
    rating: { count: 141, average: 4.8 },
    colors: [
      { name: "شیشه شفاف و یقه زبان‌گنجشک", hex: "#D4C6B4" },
      { name: "شیشه دودی و گردو", hex: "#5C4B3E" },
    ],
    properties: {
      origin: "توکیو، ژاپن",
      weight: "580 g",
      material: "بوروسیلیکات مقاوم به حرارت، فلانل ارگانیک سفیدنشده، چوب بلوط",
      dimensions: "Ø 12 × 21 cm · 600 ml (2–4 cups)",
    },
    brandId: "solen-atelier",
    categoryId: "coffee",
    bestsellerRank: 8,
    bundleSlot: "morning",
    notes: [
      "بدون مصرف روزانه فیلتر کاغذی؛ همراه با ۳ فیلتر پارچه‌ای دوخته‌شده",
      "دسته چوب زبان‌گنجشکِ جداشدنی، هنگام ریختن خنک می‌ماند",
      "در صورت تمایل، سازگار با فیلتر کاغذی استاندارد Hario 02",
    ],
    createdAt: "2026-01-28T08:00:00Z",
    updatedAt: "2026-03-05T10:00:00Z",
    source: "curated",
  },
];

export const AVAILABLE_VOUCHERS: StoreVoucher[] = [
  {
    code: "WELCOME15",
    type: "PERCENTAGE",
    value: 15,
    expiresAt: "2027-12-31T23:59:59Z",
    label: "۱۵٪ تخفیف سفارش نخست",
  },
  {
    code: "SOLEN25",
    type: "FIXED",
    value: 25,
    expiresAt: "2027-12-31T23:59:59Z",
    label: "۲۵ دلار تخفیف برای سفارش‌های بالای ۱۵۰ دلار",
    minSubtotal: 150,
  },
  {
    code: "ATELIER10",
    type: "PERCENTAGE",
    value: 10,
    expiresAt: "2027-12-31T23:59:59Z",
    label: "اعتبار ۱۰٪ ویژه اعضا",
  },
];

export const CURATED_BUNDLES: CuratedBundle[] = [
  {
    id: "bundle-morning-table",
    title: "سه‌گانه صبح آرام",
    tagline: "۲۰٪ تخفیف · جعبه هدیه",
    description:
      "کتری کانسو، فنجان‌های سرامیکی خام سابی و کتان جو دوسری کورتریک؛ مجموعه‌ای هماهنگ برای صبحانه‌های بی‌عجله آخر هفته.",
    productIds: ["solen-kanso-kettle", "solen-sabi-cups", "solen-flax-linen"],
    discountPercent: 20,
    image: "/images/hero-main.jpg",
  },
  {
    id: "bundle-dusk-sanctuary",
    title: "مجموعه پناهگاه غروب",
    tagline: "۲۲٪ تخفیف · محبوب‌ترین هدیه",
    description:
      "فضای غروب را گرم و آرام کنید؛ چراغ اوپال بی‌سیم لوم، عودسوز تراورتن تیوولی و رایحه شماره ۰۴ انجیر و سدر.",
    productIds: ["solen-lume-lamp", "solen-travertine-tray", "solen-figue-diffuser"],
    discountPercent: 22,
    image: "/images/prod-tray.jpg",
  },
  {
    id: "bundle-housewarming",
    title: "هدیه کامل خانه‌نو",
    tagline: "۱۸٪ تخفیف · بسته‌بندی ویژه",
    description:
      "هدیه‌ای برای آغاز خانه‌ای تازه؛ فنجان‌های دست‌ساز، رایحه انجیر وحشی و کتان خام بلژیکی، برای آن‌که خانه از همان روز نخست جان بگیرد.",
    productIds: ["solen-sabi-cups", "solen-figue-diffuser", "solen-flax-linen"],
    discountPercent: 18,
    image: "/images/prod-linen.jpg",
  },
];

export const LOOKBOOK_HOTSPOTS: LookbookHotspot[] = [
  {
    id: "pin-1",
    number: 1,
    x: 15,
    y: 61,
    productId: "solen-lume-lamp",
    placementNote: "چراغ گنبدی بی‌سیم روی گوشه تراورتن صیقلی",
  },
  {
    id: "pin-2",
    number: 2,
    x: 31,
    y: 71,
    productId: "solen-figue-diffuser",
    placementNote: "ظرف کهرباییِ ضدفرابنفش با نی‌های زغالیِ دوطرفه",
  },
  {
    id: "pin-3",
    number: 3,
    x: 48,
    y: 76,
    productId: "solen-sabi-cups",
    placementNote: "کاسه‌های سرامیکی خال‌دارِ دوبارپخته و لیوان‌های تو‌در‌تو",
  },
  {
    id: "pin-4",
    number: 4,
    x: 75,
    y: 58,
    productId: "solen-flax-linen",
    placementNote: "کتان ارگانیک بلژیکی ۳۸۰ گرمی روی پارچه بوکله",
  },
];

export const INITIAL_REVIEWS: ProductReviewComment[] = [
  {
    id: "rev-1",
    productId: "solen-kanso-kettle",
    productTitle: "کتری گردن‌غازی و قوری کانسو",
    date: "مارس ۲۰۲۶",
    customerName: "کلر مورو",
    location: "کپنهاگ",
    comment:
      "فرم دهانه، دم‌آوری را کاملاً متحول می‌کند؛ جریان آب تا آخرین قطره یکدست است و دسته گردویی مات آن‌قدر زیباست که دوست دارید همیشه روی میز بماند.",
    isPositive: true,
    qualities: ["دقت جریان آب", "حس استوار و سنگین", "طراحی خلوت"],
    rating: 5,
    verified: true,
  },
  {
    id: "rev-2",
    productId: "solen-lume-lamp",
    productTitle: "چراغ اوپال بی‌سیم لوم",
    date: "فوریه ۲۰۲۶",
    customerName: "دنیل اوکافور",
    location: "لندن",
    comment:
      "دو چراغ رومیزی سیم‌دارمان را همان روز کنار گذاشتیم. هر شب لوم را از کتابخانه به میز شام می‌بریم؛ شیشه اوپال ماتش نوری طلایی و گرم می‌تاباند.",
    isPositive: true,
    qualities: ["درخشش گرم و واقعی", "شارژدهی چندروزه", "پرداخت دقیق"],
    rating: 5,
    verified: true,
  },
  {
    id: "rev-3",
    productId: "solen-sabi-cups",
    productTitle: "ست فنجان سرامیکی خام سابی",
    date: "فوریه ۲۰۲۶",
    customerName: "هانا تاکاهاشی",
    location: "تورنتو",
    comment:
      "در دست حتی از عکس‌ها هم دلنشین‌تر است؛ لبه‌ای گرم و خال‌دار، حفظ حرارت عالی و بسته‌بندی کاغذی طبیعی، بدون ذره‌ای فوم پلاستیکی.",
    isPositive: true,
    qualities: ["لعاب خوش‌حس", "بسته‌بندی بدون پلاستیک", "حفظ گرما"],
    rating: 5,
    verified: true,
  },
  {
    id: "rev-4",
    productId: "solen-figue-diffuser",
    productTitle: "شماره ۰۴؛ رایحه انجیر وحشی و سدر",
    date: "ژانویه ۲۰۲۶",
    customerName: "مارن لیندکویست",
    location: "آمستردام",
    comment:
      "هر مهمانی که وارد راهرو می‌شود از عطر شمع می‌پرسد؛ درحالی‌که فقط دو نی را هفته‌ای یک‌بار برمی‌گردانیم. انجیر تازه و سدر خشک، بدون شیرینی.",
    isPositive: true,
    qualities: ["رایحه ظریف و پیچیده", "ماندگار برای ماه‌ها", "شیشه قابل‌پرکردن"],
    rating: 5,
    verified: true,
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "art-stoneware",
    category: "روایت کارگاه · ۰۱",
    title: "چرا فنجان‌های قهوه را دوبار در دمای ۱۲۶۰ درجه می‌پزیم",
    excerpt:
      "درون کارگاه خانوادگی کالداس دا راینیا؛ جایی که سرامیک خام پرتغالی با سادگی سنجیده پیوند می‌خورد.",
    readTime: "۴ دقیقه مطالعه",
    date: "۱۴ مارس ۲۰۲۶",
    image: "/images/craft-artisan.jpg",
    featuredProductId: "solen-sabi-cups",
    paragraphs: [
      "چینی‌های انبوه معمولاً در قالب‌های نازک ریخته‌گری و با لعاب سفید یکنواختی ساخته می‌شوند که کیفیت پایین خاک را می‌پوشاند. پس از یک سال استفاده روزمره، لبه‌ها لب‌پر می‌شوند و فنجان‌ها توخالی به نظر می‌رسند.",
      "هر لیوان سابی از خاک سرامیک زبر و آهن‌دار آغاز می‌شود که با دست روی چرخ سفالگری شکل می‌گیرد. پس از یک شبانه‌روز خشک‌شدن در هوای آزاد، پایه‌ها پرداخت می‌شوند تا بافت خام و خوش‌حس سنگ زیر انگشتان باقی بماند.",
      "پخت دوم در دمای ۱۲۶۰ درجه، سیلیس را طبیعی و محکم می‌کند؛ ظرف‌ها را آب‌بند می‌سازد، بخار را نرم‌تر می‌کند و گرمای صبح را بیشتر نگه می‌دارد. گذر سال‌ها نیز پتینه‌ای آرام از قهوه و نور بر آن‌ها می‌نشاند.",
    ],
  },
  {
    id: "art-light",
    category: "فضاها · ۰۲",
    title: "نور گرم و کم‌ارتفاع؛ طراحی روشنایی زیر خط دید",
    excerpt:
      "معماران پس از غروب به‌ندرت چراغ سقفی را روشن می‌کنند. این سه نکته ساده، شب‌هایی روشن و آرام می‌سازند.",
    readTime: "۵ دقیقه مطالعه",
    date: "۲۷ فوریه ۲۰۲۶",
    image:
      "https://images.pexels.com/photos/14781780/pexels-photo-14781780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    featuredProductId: "solen-lume-lamp",
    paragraphs: [
      "دمای رنگ بیش از مبلمان بر حس فضا اثر می‌گذارد. نور روز پنجره‌های شمالی حدود ۵۲۰۰ کلوین است؛ اما فضای شبانه آرام در بازه ۲۰۰۰ تا ۲۴۰۰ کلوین جان می‌گیرد: نوری عسلی و گرم، نه درخشش تند و بی‌روح.",
      "سه منبع نور کم‌ارتفاع را کنار سنگ مات، دیوار آهکی یا پرده کتان قرار دهید تا نور از سطوح گرم بازتاب شود، نه آن‌که مستقیم به چشم بتابد.",
      "حذف کابل‌های آویزان از میز و قفسه، آرامشی محسوس به فضا می‌دهد؛ چراغ قابل‌حمل لوم نیز از میز شام تا تراس همراه شماست، بی‌آن‌که نظم اتاق را برهم بزند.",
    ],
  },
  {
    id: "art-scent",
    category: "گیاهان معطر · ۰۳",
    title: "یادداشت‌هایی برای فضاهای آرام؛ ساخت رایحه ۰۴ بدون مواد مصنوعی",
    excerpt:
      "برگ سبز کوبیده، سنگ رومی نم‌خورده و پوست سدر اطلس؛ رایحه‌ای برای خانه که آرام حضور دارد، نه آن‌که خودنمایی کند.",
    readTime: "۳ دقیقه مطالعه",
    date: "۱۱ فوریه ۲۰۲۶",
    image:
      "https://images.pexels.com/photos/19884207/pexels-photo-19884207.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    featuredProductId: "solen-figue-diffuser",
    paragraphs: [
      "رایحه لوکس خانه نباید در آستانه در به استقبال مهمان هجوم بیاورد؛ باید آرام در میانه راهرو آشکار شود، مانند گذر از حیاطی مدیترانه‌ای پس از باران بهاری.",
      "با همکاری مستقیم گیاه‌پژوهان پرس‌سرد در گراس، ترکیب دیفیوزر را به یازده ماده خامِ قابل‌ردیابی محدود کردیم؛ در روغن‌های حامل ارگانیک و خشک که به‌آرامی از نی‌های زغالی متخلخل عبور می‌کنند.",
      "ظرف را روی سینی و دور از تابش مستقیم یا گرمای شدید بگذارید؛ هر یکشنبه دو نی را برگردانید تا پنج ماه رایحه‌ای ملایم از سدر و برگ داشته باشید.",
    ],
  },
];

export const COMPARISON_ROWS = [
  {
    label: "قیمت‌گذاری مستقیم از کارگاه",
    solen: "مدل شفاف با ضریب ۲٫۲ برابر برای سازنده",
    luxury: "حاشیه فروش ۶ تا ۸ برابری گالری و خرده‌فروشی",
    mass: "هزینه اولیه کمتر، عمر کوتاه‌تر",
  },
  {
    label: "مواد و خاستگاه",
    solen: "کارگاه‌های مشخص · فولاد، سنگ و کتان بلژیکی",
    luxury: "کیفیت بالا، اغلب با برچسب اختصاصی",
    mass: "آلیاژهای روکش‌نازک، پلی‌استر و سرامیک قالبی توخالی",
  },
  {
    label: "قطعات یدکی و تعمیرپذیری",
    solen: "۵ سال پشتیبانی کارگاه + واشر، باتری و فیلتر موجود",
    luxury: "ضمانت محدود · قطعات گران",
    mass: "دور انداختن و جایگزینی",
  },
  {
    label: "فرصت تجربه و بسته‌بندی",
    solen: "۶۰ روز فرصت تجربه · محافظ الیاف چوب ۱۰۰٪",
    luxury: "مرجوعی ۱۴روزه · هزینه انبارداری",
    mass: "بسته‌بندی فوم پلی‌استایرن",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "سفارش‌ها چه زمانی ارسال می‌شوند و ظروف سرامیکی چگونه محافظت می‌شوند؟",
    answer:
      "سفارش‌های ثبت‌شده تا ساعت ۱۴ همان روز کاری ارسال می‌شوند. ارسال استانداردِ قابل‌پیگیری ۲ تا ۴ روز کاری و ارسال سریع ۱ تا ۲ روز طول می‌کشد. هر ظرف در محافظی سفارشی از خمیرکاغذ بازیافتی قرار می‌گیرد؛ اگر محصولی در مسیر آسیب ببیند، ظرف ۲۴ ساعت جایگزین رایگان می‌فرستیم و نیازی به مرجوعی نیست.",
  },
  {
    id: "faq-2",
    question: "فرصت ۶۰روزه تجربه محصول در خانه چگونه است؟",
    answer:
      "محصول را در نور واقعی صبح خانه‌تان تجربه کنید؛ با کتری قهوه دم کنید، لوم را از کنار تخت تا حیاط ببرید یا پتوی کتان را تا ۶۰ روز بیازمایید. اگر کاملاً راضی نبودید، از صفحه سفارش برچسب مرجوعی رایگان بگیرید و هزینه را کامل پس بگیرید.",
  },
  {
    id: "faq-3",
    question: "آیا کدهای تخفیف با قیمت ست‌های دلخواه ترکیب می‌شوند؟",
    answer:
      "سازنده ست آیینی پیش از پرداخت تا ۲۲٪ تخفیف خودکار اعمال می‌کند. کد خوش‌آمدگویی WELCOME15 (۱۵٪ تخفیف) یا SOLEN25 (۲۵ دلار تخفیف برای سفارش‌های بالای ۱۵۰ دلار) نیز برای محصولات واجد شرایط در سبد خرید قابل‌استفاده‌اند.",
  },
  {
    id: "faq-4",
    question: "سولن چگونه به فروشگاه آنلاین Joorchin متصل می‌شود؟",
    answer:
      "فروشگاه از بسته رسمی @joorchin/client-sdk برای دریافت محصولات، ورود مشتری با کد یک‌بارمصرف یا گذرواژه، بررسی کد تخفیف، ثبت سفارش، اعلان‌های وب و ابزارهای پردازش سفارش استفاده می‌کند. برای اتصال شناسه فروشگاه، نشان اتصال در نوار بالا یا پایین صفحه را انتخاب کنید.",
  },
  {
    id: "faq-5",
    question: "برای هتل‌ها، هدیه سازمانی یا خرید عمده خدمات دارید؟",
    answer:
      "بله؛ بیش از ۹۰ هتل بوتیک مستقل، دفتر معماری و کافه تخصصی از محصولات سولن استفاده می‌کنند. برای قیمت همکاری در سفارش‌های ۱۲ عدد به بالا و بسته‌بندی هدیه چوب سدر و روبان، با راهنمای خرید ما تماس بگیرید.",
  },
];

export const SAMPLE_ORDERS: StoreOrder[] = [
  {
    id: "1001",
    orderCode: "SLN-84920",
    amount: 218,
    subtotal: 218,
    discount: 0,
    shippingCost: 0,
    shippingMethod: "standard",
    status: "SHIPPED",
    items: [
      {
        productId: "solen-kanso-kettle",
        title: "کتری گردن‌غازی و قوری کانسو",
        image: "/images/prod-kettle.jpg",
        quantity: 1,
        unitPrice: 218,
        color: "مشکی آبسیدین مات",
      },
    ],
    shippingAddress: {
      full_name: "النا وسترگارد",
      mobile: "+45 31 20 88 14",
      address: "خیابان بردگاده، پلاک ۴۲",
      unit: "طبقه سوم",
      building_number: "42",
      city: "کپنهاگ",
      postal_code: "1260",
    },
    createdAt: "2026-03-10T09:24:00Z",
    updatedAt: "2026-03-12T15:10:00Z",
    syncedToJoorchin: false,
  },
];
