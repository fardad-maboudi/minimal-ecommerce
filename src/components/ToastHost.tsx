import React from "react";
import { X } from "lucide-react";
import { useStore } from "../context/StoreContext";

export const ToastHost: React.FC = () => {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex max-w-[360px] flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-slide pointer-events-auto flex items-center justify-between gap-4 bg-[#1A1816] px-4 py-3 text-[12.5px] text-[#FAF8F5] shadow-xl"
        >
          <span className="leading-snug">{t.text}</span>
          <div className="flex shrink-0 items-center gap-2">
            {t.actionLabel && t.onAction && (
              <button
                type="button"
                onClick={() => {
                  t.onAction?.();
                  dismissToast(t.id);
                }}
                className="border-b border-[#D79272] text-[11px] font-medium uppercase tracking-[0.12em] text-[#E9B49A]"
              >
                {t.actionLabel}
              </button>
            )}
            <button
              type="button"
              aria-label="بستن اعلان"
              onClick={() => dismissToast(t.id)}
              className="text-[#8E847A] hover:text-[#FAF8F5]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
