import React from "react";
import { COMPARISON_ROWS } from "../data/catalog";

const PRINCIPLES = [
  {
    num: "01",
    title: "مواد اولیه اصیل و بی‌پیرایه",
    body: "سرامیک آهن‌دار پخته‌شده در دمای بالا، فولاد ۳۰۴، کتان بلژیکی الیاف‌بلند، تراورتن رومی و روغن‌های پرس‌سرد؛ بدون روکش مصنوعی برای پنهان‌کردن فرسودگی.",
  },
  {
    num: "02",
    title: "قیمت‌گذاری مستقیم از کارگاه",
    body: "با یازده کارگاه خانوادگی در اروپا و ژاپن مستقیم همکاری می‌کنیم؛ بی‌واسطه و بدون حاشیه سود فروشگاه‌ها، با پرداخت منصفانه به سازندگان.",
  },
  {
    num: "03",
    title: "ساخته‌شده برای تعمیر، نه دور انداختن",
    body: "واشر سیلیکونی، لبه سرامیکی، فیلتر پارچه‌ای، دسته چوبی و باتری چراغ را دست‌کم تا ده سال جداگانه برای تعمیر و تعویض نگه می‌داریم.",
  },
];

export const CraftAndComparison: React.FC = () => {
  return (
    <section className="border-t border-[#E5DED4] bg-[#F6F2EC] py-20 sm:py-28">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {/* Story split: authentic portrait + 3 quiet craft pillars */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] w-full overflow-hidden bg-[#E5DDD2]">
              <img
                src="/images/craft-artisan.jpg"
                alt="سفالگری که ظرف سرامیکی دست‌ساز را روی میز چوبی، در نور نرم پنجره کارگاه پرداخت می‌کند"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
              فلسفه کارگاه
            </p>
            <h2 className="font-serif-display mt-3 text-[38px] font-normal leading-[1.07] text-[#1B1917] sm:text-[50px]">
              اشیای کمتر، ماندگار برای{" "}
              <em className="italic">دهه‌ها</em>.
            </h2>
            <p className="mt-5 max-w-[500px] text-[15px] leading-[1.72] text-[#665F57]">
              هر سال تنها دو مجموعه با طراحی آرام و ماندگار تولید می‌کنیم. هر محصول پیش از دریافت نشان کارگاه، نود روز در آشپزخانه، کنار میز مطالعه و زیر نور خورشید آزموده می‌شود.
            </p>

            <div className="mt-10 divide-y divide-[#E2D9CE] border-y border-[#E2D9CE]">
              {PRINCIPLES.map((item) => (
                <div
                  key={item.num}
                  className="grid grid-cols-12 gap-4 py-6"
                >
                  <span className="col-span-2 font-mono-tech text-[11.5px] text-[#A64B2A] pt-1">
                    {item.num}
                  </span>
                  <div className="col-span-10">
                    <h3 className="text-[15px] font-medium text-[#1B1917]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-[1.68] text-[#665F57]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crisp value-differentiation matrix */}
        <div className="mt-24 border-t border-[#E2D9CE] pt-16">
          <div className="max-w-[520px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A64B2A]">
              معیار ما
            </p>
            <h3 className="font-serif-display mt-2 text-[32px] font-normal leading-tight text-[#1B1917] sm:text-[40px]">
              مقایسه با دیگران
            </h3>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-right">
              <thead>
                <tr className="border-b border-[#D7CEC2]">
                  <th className="w-[24%] pb-4 pr-6 text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7168]">
                    معیار
                  </th>
                  <th className="w-[28%] bg-[#1A1816] px-5 py-4 font-serif-display text-[20px] font-normal tracking-[0.1em] text-[#FAF8F5]">
                    سولن، بی‌واسطه
                  </th>
                  <th className="w-[24%] px-5 pb-4 text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                    گالری‌های طراحی
                  </th>
                  <th className="w-[24%] pl-5 pb-4 text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#665F57]">
                    تولید انبوه
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DBD0] text-[13.5px]">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="py-5 pr-6 font-medium text-[#1B1917]">
                      {row.label}
                    </td>
                    <td className="bg-[#FAF8F5] px-5 py-5 font-medium text-[#1B1917] border-x border-[#E5DED4]">
                      {row.solen}
                    </td>
                    <td className="px-5 py-5 text-[#665F57]">{row.luxury}</td>
                    <td className="py-5 pl-5 text-[#857B71]">{row.mass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
