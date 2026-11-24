import React from "react";
import { useStore } from "../context/StoreContext";

export const Footer: React.FC = () => {
  const {
    jumpToCategory,
    openAccount,
    setJoorchinOpen,
    connectionMode,
    joorchinConfig,
  } = useStore();

  return (
    <footer className="bg-[#1A1816] text-[#C8BFB4]">
      <div className="mx-auto max-w-[1380px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand overview */}
          <div className="lg:col-span-4">
            <p className="font-serif-display text-[32px] tracking-[0.22em] text-[#FAF8F5]">
              SOLÈN
            </p>
            <p className="mt-4 max-w-[310px] text-[13.5px] leading-[1.7] text-[#9E948A]">
              Architectural home objects shaped alongside independent
              family workshops across Kyoto, Caldas da Rainha, Milan, Grasse,
              and Kortrijk.
            </p>
            <p className="mt-6 text-[12px] text-[#7D746B]">
              Rua da Escola Politécnica 68, Lisbon
            </p>
          </div>

          {/* Column 1: Shop */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAF8F5]">
              Shop
            </p>
            <ul className="mt-5 space-y-3 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("all")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  All Objects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("coffee")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  Morning Coffee
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("lighting")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  Living & Light
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("botanical")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  Botanical Scent
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToCategory("textiles")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  Tactile Linen
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAF8F5]">
              Client Care
            </p>
            <ul className="mt-5 space-y-3 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => openAccount("orders")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  Track an Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAccount("signin")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  Member Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAccount("wishlist")}
                  className="transition hover:text-[#FAF8F5]"
                >
                  Saved Pieces
                </button>
              </li>
              <li>
                <a href="#bundles" className="transition hover:text-[#FAF8F5]">
                  Ritual Gift Sets
                </a>
              </li>
              <li>
                <a href="#journal" className="transition hover:text-[#FAF8F5]">
                  The Studio Journal
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Backend Studio Link */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAF8F5]">
              Commerce Platform
            </p>
            <p className="mt-5 text-[13px] leading-relaxed text-[#9E948A]">
              Wired natively to{" "}
              <code className="font-mono-tech text-[11.5px] text-[#DED5CA]">
                @joorchin/client-sdk
              </code>{" "}
              for catalog, auth, checkout, push alerts, and back-office
              fulfillment.
            </p>
            <button
              type="button"
              onClick={() => setJoorchinOpen(true)}
              className="mt-4 inline-flex items-center gap-2 border border-[#F5F1EB]/25 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-[#FAF8F5] transition hover:border-[#FAF8F5]"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  connectionMode === "connected"
                    ? "bg-emerald-400"
                    : "bg-[#D79272]"
                }`}
              />
              {connectionMode === "connected"
                ? `Connected · ${joorchinConfig.appId}`
                : "Connect Joorchin App"}
            </button>
          </div>
        </div>

        {/* Bottom hairline bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#F5F1EB]/12 pt-8 text-[12px] text-[#7F766D] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SOLÈN Atelier. All rights reserved.</p>
          <p className="tracking-[0.06em]">
            Visa · Mastercard · Apple Pay · Direct Transfer · Encrypted via Joorchin
          </p>
        </div>
      </div>
    </footer>
  );
};
