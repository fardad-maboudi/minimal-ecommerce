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
    title: "Morning Coffee",
    subtitle: "Precision kettles, carafes & hand-thrown cups",
    countLabel: "03 objects",
    imageUrl: "/images/prod-kettle.jpg",
  },
  {
    id: "lighting",
    title: "Living & Light",
    subtitle: "Cordless brushed-metal & opal table lamps",
    countLabel: "02 objects",
    imageUrl: "/images/prod-lamp.jpg",
  },
  {
    id: "botanical",
    title: "Botanical Scent",
    subtitle: "Cold-pressed reed diffusers & slow incense",
    countLabel: "02 objects",
    imageUrl: "/images/prod-botanical.jpg",
  },
  {
    id: "textiles",
    title: "Tactile Linen",
    subtitle: "Heavyweight Belgian flax throws & bath weave",
    countLabel: "02 objects",
    imageUrl: "/images/prod-linen.jpg",
  },
];

export const CURATED_PRODUCTS: StoreProduct[] = [
  {
    id: "solen-kanso-kettle",
    title: "Kanso Gooseneck Kettle & Carafe",
    titleEn: "Kanso Gooseneck Kettle & Carafe",
    subtitle: "Matte 304 steel · Smoked walnut · Borosilicate server",
    description:
      "Weighted to pour a calm, unbroken 0.9mm vertical ribbon across fresh grounds. Spun from powder-coated architectural stainless steel with a hand-turned Portuguese walnut handle, brass ferrule, and paired fluted borosilicate server.",
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
      { name: "Obsidian Matte", hex: "#23211F" },
      { name: "Raw Chalk", hex: "#E7E1D7" },
      { name: "Burnished Clay", hex: "#9E5338" },
    ],
    properties: {
      origin: "Kyoto & Lisbon",
      weight: "1,180 g",
      material: "304 Stainless, Smoked Walnut, Borosilicate Glass",
      dimensions: "29 × 14.5 × 17 cm · 900 ml",
    },
    brandId: "solen-atelier",
    categoryId: "coffee",
    badge: "Bestseller",
    bestsellerRank: 1,
    bundleSlot: "morning",
    notes: [
      "Counterbalanced handle keeps wrists effortlessly neutral",
      "Compatible with induction, gas, and ceramic ranges",
      "Replaceable silicone collar and walnut grip for life",
    ],
    createdAt: "2026-01-12T08:00:00Z",
    updatedAt: "2026-03-02T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-lume-lamp",
    title: "Lume Cordless Opal Lamp",
    titleEn: "Lume Cordless Opal Lamp",
    subtitle: "Brushed aluminum · Hand-blown mouth-frosted glass",
    description:
      "Warm dusk illumination with zero visual cords. Machined from a single solid cylinder of sandblasted aluminum and crowned with fluted opal glass. Three-stage warm rotary dimmer shifts softly from 2700K dinner light to 2000K candlelight.",
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
      { name: "Champagne Anodized", hex: "#C8BFA8" },
      { name: "Aged Bronze", hex: "#5C4E41" },
      { name: "Brushed Pewter", hex: "#8B8A86" },
    ],
    properties: {
      origin: "Milan, Italy",
      weight: "1,420 g",
      material: "Anodized Aluminum, Hand-Blown Opal Glass",
      dimensions: "Ø 16.5 × 26 cm · 48 hr battery",
    },
    brandId: "solen-atelier",
    categoryId: "lighting",
    badge: "Bestseller",
    bestsellerRank: 2,
    bundleSlot: "ambient",
    notes: [
      "Up to 48 hours wireless run on low candlelight setting",
      "Hidden recessed USB-C braided linen charger included",
      "Serviceable replaceable lithium cell rated for 10+ years",
    ],
    createdAt: "2026-01-18T08:00:00Z",
    updatedAt: "2026-03-04T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-sabi-cups",
    title: "Sabi Raw Stoneware Cup Set",
    titleEn: "Sabi Raw Stoneware Cup Set",
    subtitle: "Set of 4 tumblers + tasting pitcher · Wheel-thrown",
    description:
      "High-fired twice at 1,260°C in small wood-gas kiln runs. Unfinished iron-speckled oat exterior catches natural shadow while a satin ivory food-safe interior holds morning heat gently against cupped hands.",
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
      { name: "Speckled Oat", hex: "#DED4C6" },
      { name: "Warm Clay", hex: "#B98A6F" },
      { name: "Ash Charcoal", hex: "#4A4642" },
    ],
    properties: {
      origin: "Caldas da Rainha, Portugal",
      weight: "1,340 g (set)",
      material: "Local Iron-Rich Raw Stoneware, Satin Ash Glaze",
      dimensions: "4 × 240 ml cups + 420 ml pitcher",
    },
    brandId: "solen-atelier",
    categoryId: "coffee",
    badge: "Bestseller",
    bestsellerRank: 3,
    bundleSlot: "morning",
    notes: [
      "Dishwasher safe & thermal-shock tested for boiling pours",
      "Subtle finger-throw ripples make every single vessel singular",
      "Nesting profile frees up clean pantry shelf vertical space",
    ],
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-figue-diffuser",
    title: "No. 04 Wild Fig & Cedar Scent Duo",
    titleEn: "No. 04 Wild Fig & Cedar Scent Duo",
    subtitle: "Reed diffuser 200ml + room mist 100ml · Apothecary amber",
    description:
      "Formulated without synthetics or heavy base alcohols. Opens with crushed green fig leaf and crushed cardamom over dry Atlas cedarwood, wet limestone, and lingering white vetiver. Housed in UV-protective Italian amber glass.",
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
      { name: "No. 04 Fig & Cedar", hex: "#7A5234" },
      { name: "No. 07 Hinoki Smoke", hex: "#4D4942" },
      { name: "No. 11 Neroli Plaster", hex: "#C4A882" },
    ],
    properties: {
      origin: "Grasse, France",
      weight: "740 g",
      material: "Cold-Pressed Essential Oils, UV Amber Glass, Charcoal Reeds",
      dimensions: "200 ml diffuser + 100 ml fine atomizer",
    },
    brandId: "solen-atelier",
    categoryId: "botanical",
    badge: "New",
    bestsellerRank: 4,
    bundleSlot: "tactile",
    notes: [
      "Continuous 5-month quiet throw with reversible charcoal reeds",
      "100% phthalate-free, vegan botanical concentration",
      "Refillable amber glass bottles with ceramic drip collar",
    ],
    createdAt: "2026-02-02T08:00:00Z",
    updatedAt: "2026-03-08T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-flax-linen",
    title: "Kortrijk Heavyweight Linen Throw",
    titleEn: "Kortrijk Heavyweight Linen Throw",
    subtitle: "380 GSM stonewashed organic Belgian flax · Hand-fringed",
    description:
      "Loomed slowly on heritage shuttle frames in Flanders from long-staple rain-fed European flax. Softened exclusively with mountain water and tumbled smooth — crisp in July, indulgently grounding beside an autumn fire.",
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
      { name: "Natural Oat", hex: "#D9CFC0" },
      { name: "Sienna Earth", hex: "#A8664B" },
      { name: "Chalk Sand", hex: "#EDE8DF" },
    ],
    properties: {
      origin: "Kortrijk, Belgium",
      weight: "1,120 g",
      material: "100% OEKO-TEX Certified Belgian Flax Linen (380 GSM)",
      dimensions: "150 × 210 cm · Mitered & raw eyelash fringe",
    },
    brandId: "solen-atelier",
    categoryId: "textiles",
    bestsellerRank: 5,
    bundleSlot: "tactile",
    notes: [
      "Pre-washed for relaxed architectural drape right out of box",
      "Grows noticeably loftier and softer across every wash cycle",
      "Wrapped in reusable braided raw cotton ribbon band",
    ],
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-03-03T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-travertine-tray",
    title: "Tivoli Travertine Plinth & Burner",
    titleEn: "Tivoli Travertine Plinth & Burner",
    subtitle: "Honed Roman limestone · Solid cast unlacquered brass",
    description:
      "Turned from porous vein-cut Roman travertine with naturally open mineral pockets and softly bullnosed rims. Paired with a precision monolithic solid brass cone burner that accumulates a living, luminous amber patina over time.",
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
      { name: "Ivory Travertine", hex: "#E0D6C6" },
      { name: "Noce Walnut Stone", hex: "#B09A82" },
    ],
    properties: {
      origin: "Tivoli, Italy",
      weight: "2,260 g",
      material: "Unfilled Vein-Cut Travertine, Cast Solid Brass",
      dimensions: "Ø 26 × 6.5 cm · Protective cork underside",
    },
    brandId: "solen-atelier",
    categoryId: "objects",
    badge: "Limited Run",
    bestsellerRank: 6,
    bundleSlot: "ambient",
    notes: [
      "Includes 24 hand-rolled Kyoto hinoki incense cones",
      "Recessed cork base protects oiled wood and stone counters",
      "Natural porous veins make no two stone pedestals identical",
    ],
    createdAt: "2026-02-09T08:00:00Z",
    updatedAt: "2026-03-07T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-solstice-vase",
    title: "Arched Clay Botanical Vessel",
    titleEn: "Arched Clay Botanical Vessel",
    subtitle: "Hand-coiled unglazed stoneware · Sculptural silhouette",
    description:
      "Watertight interior glazing meets a tactile raw mineral facade conceived to hold cut olive branches, magnolia boughs, or stand empty in a quiet corridor catching shifting late-day sunlight.",
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
      { name: "Raw Sand", hex: "#D6C5B2" },
      { name: "Roasted Ochre", hex: "#9E6E4F" },
    ],
    properties: {
      origin: "Oaxaca & Porto",
      weight: "1,560 g",
      material: "Hand-Coiled Stoneware, Sealed Waterproof Interior",
      dimensions: "Ø 18 × 28 cm · Mouth 6.5 cm",
    },
    brandId: "solen-atelier",
    categoryId: "objects",
    badge: "New",
    bestsellerRank: 7,
    bundleSlot: "ambient",
    notes: [
      "Weighted flat foot anchors tall heavy floral branches safely",
      "Hand-stamped edition mark on each ceramic base",
      "Ships double-boxed in molded recycled wood-pulp cradle",
    ],
    createdAt: "2026-02-14T08:00:00Z",
    updatedAt: "2026-03-09T10:00:00Z",
    source: "curated",
  },
  {
    id: "solen-drip-server",
    title: "Atelier Cloth-Filter Pour-Over",
    titleEn: "Atelier Cloth-Filter Pour-Over",
    subtitle: "Laboratory borosilicate · Unbleached organic flannel",
    description:
      "For slow Sunday brews that carry remarkable clarity and velvety body. Reusable organic Japanese cotton-flannel filter keeps aromatic coffee oils paper would strip away, cradled in a flared blown-glass carafe.",
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
      { name: "Clear Glass + Ash Collar", hex: "#D4C6B4" },
      { name: "Smoked Glass + Walnut", hex: "#5C4B3E" },
    ],
    properties: {
      origin: "Tokyo, Japan",
      weight: "580 g",
      material: "Heatproof Borosilicate, Organic Unbleached Flannel, Oak",
      dimensions: "Ø 12 × 21 cm · 600 ml (2–4 cups)",
    },
    brandId: "solen-atelier",
    categoryId: "coffee",
    bestsellerRank: 8,
    bundleSlot: "morning",
    notes: [
      "Zero daily paper waste — includes 3 stitched cloth filters",
      "Removable turned ash wood grip keeps pour cool to touch",
      "Compatible with standard Hario 02 paper filters if desired",
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
    label: "15% off first order",
  },
  {
    code: "SOLEN25",
    type: "FIXED",
    value: 25,
    expiresAt: "2027-12-31T23:59:59Z",
    label: "$25 off orders over $150",
    minSubtotal: 150,
  },
  {
    code: "ATELIER10",
    type: "PERCENTAGE",
    value: 10,
    expiresAt: "2027-12-31T23:59:59Z",
    label: "10% VIP studio credit",
  },
];

export const CURATED_BUNDLES: CuratedBundle[] = [
  {
    id: "bundle-morning-table",
    title: "The Slow Morning Trio",
    tagline: "Save 20% · Gift-boxed",
    description:
      "Our signature Kanso kettle, Sabi raw ceramic cups, and Kortrijk oatmeal linen — designed together for unhurried weekend tables.",
    productIds: ["solen-kanso-kettle", "solen-sabi-cups", "solen-flax-linen"],
    discountPercent: 20,
    image: "/images/hero-main.jpg",
  },
  {
    id: "bundle-dusk-sanctuary",
    title: "The Dusk Sanctuary Edit",
    tagline: "Save 22% · Most gifted",
    description:
      "Turn twilight rooms warm and quiet: cordless Lume opal lamp, sculpted Tivoli travertine incense plinth, and No. 04 Fig & Cedar duo.",
    productIds: ["solen-lume-lamp", "solen-travertine-tray", "solen-figue-diffuser"],
    discountPercent: 22,
    image: "/images/prod-tray.jpg",
  },
  {
    id: "bundle-housewarming",
    title: "The Complete Housewarming",
    tagline: "Save 18% · Collector wrap",
    description:
      "Elevated arrival set pairing tactile hand-thrown cups, wild fig apothecary scent, and raw Belgian flax to make a new apartment immediately feel lived in.",
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
    placementNote: "Cordless brushed dome resting on the honed travertine corner",
  },
  {
    id: "pin-2",
    number: 2,
    x: 31,
    y: 71,
    productId: "solen-figue-diffuser",
    placementNote: "UV-amber vessel with reversible black charcoal reeds",
  },
  {
    id: "pin-3",
    number: 3,
    x: 48,
    y: 76,
    productId: "solen-sabi-cups",
    placementNote: "Twice-fired speckled stoneware bowls & nesting tumblers",
  },
  {
    id: "pin-4",
    number: 4,
    x: 75,
    y: 58,
    productId: "solen-flax-linen",
    placementNote: "380 GSM stonewashed organic Belgian flax draped over bouclé",
  },
];

export const INITIAL_REVIEWS: ProductReviewComment[] = [
  {
    id: "rev-1",
    productId: "solen-kanso-kettle",
    productTitle: "Kanso Gooseneck Kettle & Carafe",
    date: "March 2026",
    customerName: "Claire Moreau",
    location: "Copenhagen",
    comment:
      "The spout geometry changes pour-over completely — silky vertical flow right to the final drop, and the matte walnut grip still feels like furniture you leave out all day.",
    isPositive: true,
    qualities: ["Flow precision", "Heavy feel", "Zero clutter design"],
    rating: 5,
    verified: true,
  },
  {
    id: "rev-2",
    productId: "solen-lume-lamp",
    productTitle: "Lume Cordless Opal Lamp",
    date: "February 2026",
    customerName: "Daniel Okafor",
    location: "London",
    comment:
      "Replaced two corded side lamps immediately. We carry Lume from the bookshelf to the dinner table every night — the frosted opal diffuser casts genuinely golden restaurant warmth.",
    isPositive: true,
    qualities: ["True warm glow", "Multi-day charge", "Machined feel"],
    rating: 5,
    verified: true,
  },
  {
    id: "rev-3",
    productId: "solen-sabi-cups",
    productTitle: "Sabi Raw Stoneware Cup Set",
    date: "February 2026",
    customerName: "Hana Takahashi",
    location: "Toronto",
    comment:
      "Even better in the hand than in the photographs. Slightly warm speckled rim, surprising heat retention, and packaged in moulded natural paper with zero plastic foam anywhere.",
    isPositive: true,
    qualities: ["Tactile glaze", "Plastic-free pack", "Holds heat"],
    rating: 5,
    verified: true,
  },
  {
    id: "rev-4",
    productId: "solen-figue-diffuser",
    productTitle: "No. 04 Wild Fig & Cedar Scent Duo",
    date: "January 2026",
    customerName: "Maren Lindqvist",
    location: "Amsterdam",
    comment:
      "Every guest who walks through our corridor asks what candle is burning, yet it is purely two reeds flipped once a week. Crisp crushed fig leaf with dry cedar — zero sweetness.",
    isPositive: true,
    qualities: ["Subtle complex scent", "Lasts months", "Refillable glass"],
    rating: 5,
    verified: true,
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "art-stoneware",
    category: "Craft Dispatch · 01",
    title: "Why we fire our coffee vessels twice at 1,260 degrees",
    excerpt:
      "Inside the family studio in Caldas da Rainha where raw Portuguese stoneware meets deliberate minimal restraint.",
    readTime: "4 min read",
    date: "March 14, 2026",
    image: "/images/craft-artisan.jpg",
    featuredProductId: "solen-sabi-cups",
    paragraphs: [
      "Mass-market porcelain relies on thin slip-casting molds and uniform stark white glaze designed to mask low-mineral clay. After one year of daily rinsing, edges chip easily and cups feel noticeably hollow.",
      "Every Sabi tumbler begins instead with coarse wild iron-bearing stoneware wedged by hand on slow timber wheels. After twenty-four hours of ambient air drying beneath open louver windows, each foot is trimmed to leave raw textured stone intact beneath the fingertips.",
      "Our second reduction firing at 1,260°C tightens the silica naturally so vessels seal liquid cleanly, soften steam, and retain morning warmth minutes longer — building quiet patina from coffee and light across decades.",
    ],
  },
  {
    id: "art-light",
    category: "Spaces · 02",
    title: "Lowering the room: designing warm light below eye level",
    excerpt:
      "Architects almost never turn on overhead lights past sunset. Here is our quiet three-point checklist for luminous evenings.",
    readTime: "5 min read",
    date: "February 27, 2026",
    image:
      "https://images.pexels.com/photos/14781780/pexels-photo-14781780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    featuredProductId: "solen-lume-lamp",
    paragraphs: [
      "Color temperature drives pace faster than furniture ever will. While north-facing window daylight stretches toward 5,200K, quiet evening rooms come alive between 2,000K and 2,400K — warm honey glass rather than flat glare.",
      "Place three modest pools of low light against matte stone, limewash plaster, or linen drapes so illumination bounces horizontally off warm materials instead of striking eyes head-on.",
      "Eliminating hanging cables across coffee tables and timber shelving creates an unmistakable stillness — letting one portable Lume cylinder follow dinner to the terrace without disrupting room geometry.",
    ],
  },
  {
    id: "art-scent",
    category: "Botanical · 03",
    title: "Notes on quiet rooms: composing No. 04 without synthetics",
    excerpt:
      "Crushed green leaf, damp Roman stone, Atlas cedar bark — balancing residential scent that breathes instead of announcing itself.",
    readTime: "3 min read",
    date: "February 11, 2026",
    image:
      "https://images.pexels.com/photos/19884207/pexels-photo-19884207.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    featuredProductId: "solen-figue-diffuser",
    paragraphs: [
      "True luxury home scent should never ambush a visitor on the doormat. It reveals itself halfway down the hall — like passing an open Mediterranean courtyard right after late spring rain.",
      "Working directly with cold-press botanists in Grasse, we trimmed standard reed formulas back to eleven traceable raw fractions blended inside dry organic carrier oils that travel gracefully through porous black charcoal reeds.",
      "Set a tray beneath amber glass away from strong noon radiators; rotate two sticks on Sundays for five uninterrupted months of light cedar-and-leaf warmth.",
    ],
  },
];

export const COMPARISON_ROWS = [
  {
    label: "Direct craft pricing",
    solen: "Transparent 2.2× maker model",
    luxury: "6–8× gallery & retail markup",
    mass: "Low upfront, short lifecycle",
  },
  {
    label: "Materials & provenance",
    solen: "Named ateliers · solid steel, stone & Belgian flax",
    luxury: "High quality, often private-label sourced",
    mass: "Thin plated alloys, polyester & hollow mold clay",
  },
  {
    label: "Spare parts & repairability",
    solen: "5-year studio care + stocked gaskets, cells & filters",
    luxury: "Limited warranty · costly parts",
    mass: "Discard and replace",
  },
  {
    label: "Home trial & packaging",
    solen: "60-day trial · 100% molded wood-pulp protection",
    luxury: "14-day return · restocking fee",
    mass: "Polystyrene foam packaging",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How fast do orders dispatch, and how are stoneware items protected?",
    answer:
      "Orders placed before 2 PM dispatch the same studio day with tracked carbon-neutral express delivery (2–4 business days standard, 1–2 days express). Every vessel travels suspended inside custom molded recycled wood-pulp cradles — if anything arrives damaged in transit, we send a complimentary replacement within 24 hours, no return hassle required.",
  },
  {
    id: "faq-2",
    question: "How does your 60-day live-with-it home trial work?",
    answer:
      "Objects deserve to be lived with inside your actual morning light. Brew with your kettle, carry Lume from bedside to patio, or drape our linen for up to 60 days. Not utterly delighted? Generate a free prepaid return label straight from your order page for a full, prompt refund.",
  },
  {
    id: "faq-3",
    question: "Can I stack voucher codes with custom Ritual Set bundle pricing?",
    answer:
      "Our Ritual Set builder automatically saves up to 22% before checkout. First-time studio voucher WELCOME15 (15% off) or SOLEN25 ($25 off orders above $150) also apply directly inside your shopping bag against full-price and eligible set pieces.",
  },
  {
    id: "faq-4",
    question: "How does SOLÈN connect to my live Joorchin ecommerce backend?",
    answer:
      "The entire storefront uses the official @joorchin/client-sdk package — powering product catalog reads via client.site.plugin('ecommerce').records('product').list(), customer OTP/password login via client.auth, voucher validation and order creation through ecommerce actions, native hosted Web Push alerts via client.site.push, and live back-office fulfillment tools under client.backoffice.ecommerce. Click the subtle connection icon in the navigation bar or footer to connect your App ID immediately.",
  },
  {
    id: "faq-5",
    question: "Do you offer hospitality, studio gifting, or trade orders?",
    answer:
      "Yes — over 90 independent boutique hotels, architectural practices, and specialty coffee bars stock SOLÈN tableware and lighting. Contact our Lisbon concierge for tailored pricing on orders starting at 12 pieces, with custom ribboned cedar gift packaging included.",
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
        title: "Kanso Gooseneck Kettle & Carafe",
        image: "/images/prod-kettle.jpg",
        quantity: 1,
        unitPrice: 218,
        color: "Obsidian Matte",
      },
    ],
    shippingAddress: {
      full_name: "Elena Vestergaard",
      mobile: "+45 31 20 88 14",
      address: "Bredgade 42",
      unit: "3. th",
      building_number: "42",
      city: "Copenhagen",
      postal_code: "1260",
    },
    createdAt: "2026-03-10T09:24:00Z",
    updatedAt: "2026-03-12T15:10:00Z",
    syncedToJoorchin: false,
  },
];
