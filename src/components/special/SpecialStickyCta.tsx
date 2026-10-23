import { useState, useEffect } from "react";
import { Zap, ArrowRight } from "lucide-react";

interface SpecialStickyCtaProps {
  onCtaClick: () => void;
}

export const SpecialStickyCta = ({ onCtaClick }: SpecialStickyCtaProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Aparece após rolar 450px para baixo e se esconde perto do checkout
      const scrollY = window.scrollY;
      const checkoutEl = document.getElementById("checkout-section");
      let nearCheckout = false;

      if (checkoutEl) {
        const rect = checkoutEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.7) {
          nearCheckout = true;
        }
      }

      if (scrollY > 450 && !nearCheckout) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:hidden animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#090f1e]/95 backdrop-blur-xl border border-gold/40 shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
            Obra + 4 Dossiês
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-emerald-400 font-display">R$ 29,90</span>
            <span className="text-[10px] text-slate-400">à vista</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (typeof (window as any).fbq === "function") {
              try {
                (window as any).fbq("track", "InitiateCheckout", {
                  content_name: "Sticky Mobile CTA",
                  currency: "BRL",
                  value: 29.90
                });
              } catch(e) {}
            }
            onCtaClick();
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(201,169,98,0.4)] cursor-pointer active:scale-95 transition-transform"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
          <span>Desbloquear ⚡</span>
        </button>
      </div>
    </div>
  );
};
