import { StoreProvider } from "./context/StoreContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { CatalogSection } from "./components/CatalogSection";
import { FlagshipDrop } from "./components/FlagshipDrop";
import { RitualBundleBuilder } from "./components/RitualBundleBuilder";
import { ShopTheRoom } from "./components/ShopTheRoom";
import { CraftAndComparison } from "./components/CraftAndComparison";
import { ReviewsSection } from "./components/ReviewsSection";
import { JournalAndFaq } from "./components/JournalAndFaq";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { ProductModal, ArticleModal } from "./components/ProductModal";
import { SearchModal } from "./components/SearchModal";
import { AccountModal } from "./components/AccountModal";
import { JoorchinModal } from "./components/JoorchinModal";
import { ToastHost } from "./components/ToastHost";

export function App() {
  return (
    <StoreProvider>
      <div dir="rtl" className="min-h-screen bg-[#FAF8F5] text-[#1B1917]">
        <Header />

        <main>
          {/* 1. Attention: Full-bleed architectural hero + calm confidence pillars */}
          <Hero />

          {/* 2. Discovery: Shop by lifestyle ritual / collection */}
          <CategoryShowcase />

          {/* 3. Commerce core: Filterable, sortable catalog backed by @joorchin/client-sdk */}
          <CatalogSection />

          {/* 4. Focused desire & urgency: Signature limited-batch flagship drop */}
          <FlagshipDrop />

          {/* 5. AOV uplift: Curated & custom interactive Ritual Set bundles (save up to 22%) */}
          <RitualBundleBuilder />

          {/* 6. Visual aspiration: Interactive "Shop the Room" interior lookbook */}
          <ShopTheRoom />

          {/* 7. Brand depth & differentiation: Atelier philosophy + comparison table */}
          <CraftAndComparison />

          {/* 8. Social proof: Verified home reviews + interactive customer review composer */}
          <ReviewsSection />

          {/* 9. Story, objection removal & lead capture: Editorial journal, FAQ, VIP + web push */}
          <JournalAndFaq />
        </main>

        {/* 10. Grounded luxury footer with clean Joorchin platform hook */}
        <Footer />

        {/* Storefront interactive overlays */}
        <CartDrawer />
        <ProductModal />
        <ArticleModal />
        <SearchModal />
        <AccountModal />
        <JoorchinModal />
        <ToastHost />
      </div>
    </StoreProvider>
  );
}

export default App;
