import React from "react";
import { ArrowRight } from "lucide-react";

const PILLARS = [
  { label: "Small-batch craft", note: "Kyoto, Lisbon, Grasse & Kortrijk" },
  { label: "Free express shipping", note: "On every order over $150" },
  { label: "60-day home trial", note: "Prepaid, effortless returns" },
  { label: "5-year repair care", note: "Spare parts held permanently" },
];

export const Hero: React.FC = () => {
  return (
    <section id="top" className="w-full">
      {/* Full-bleed architectural hero */}
      <div className="relative h-[78vh] min-h-[540px] max-h-[820px] w-full overflow-hidden bg-[#26211D]">
        <img
          src="/images/hero-main.jpg"
          alt="Sunlit limestone table styled with Solèn matte pour-over kettle, speckled raw stoneware cups, and Belgian flax linen"
          className="h-full w-full object-cover object-center"
        />
        {/* Crisp editorial scrim tuned for clean text contrast while leaving photo radiant */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(96deg, rgba(24,20,17,0.68) 0%, rgba(24,20,17,0.38) 48%, rgba(24,20,17,0.12) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181411]/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1380px] flex-col justify-end px-5 pb-14 sm:justify-center sm:px-8 sm:pb-0 lg:px-12">
          <div className="max-w-[560px]">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-[#EDE5DA]/90">
              Autumn Edition · 2026
            </p>
            <h1 className="font-serif-display text-[46px] font-normal leading-[1.03] tracking-[-0.01em] text-[#FAF8F5] sm:text-[62px] lg:text-[72px]">
              Objects shaped for{" "}
              <em className="font-normal italic">slower</em> mornings.
            </h1>
            <p className="mt-5 max-w-[440px] text-[15px] leading-[1.68] text-[#EFE9E1]/90 sm:text-[16px]">
              Architectural stoneware, weighted pour-over tools, cordless warm
              lighting, and cold-pressed home botanicals — crafted directly with
              family ateliers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#catalog"
                className="group inline-flex items-center gap-2.5 bg-[#FAF8F5] px-7 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-[#1B1917] transition hover:bg-[#EFE8DF]"
              >
                Shop Collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#bundles"
                className="border-b border-[#FAF8F5]/65 pb-1 text-[12.5px] font-medium uppercase tracking-[0.14em] text-[#FAF8F5] transition hover:border-[#FAF8F5]"
              >
                Build a Set · Save 22%
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quiet hairline reassurance ribbon */}
      <div className="border-b border-[#E5DED4] bg-[#FAF8F5]">
        <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-y divide-[#E5DED4] px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-12">
          {PILLARS.map((item) => (
            <div
              key={item.label}
              className="py-5 pr-4 lg:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              <p className="text-[12.5px] font-medium tracking-[0.02em] text-[#1B1917]">
                {item.label}
              </p>
              <p className="mt-0.5 text-[12px] text-[#665F57]">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
