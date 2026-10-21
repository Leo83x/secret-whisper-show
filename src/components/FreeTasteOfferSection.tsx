import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, ArrowRight, Check, Clock } from "lucide-react";

interface FreeTasteOfferSectionProps {
  onOpenRegister?: () => void;
}

const FreeTasteOfferSection = ({ onOpenRegister }: FreeTasteOfferSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const handleStart = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      window.location.href = '/reader/';
    }
  };

  return (
    <section ref={ref} className="relative py-24 px-6 overflow-visible">
      {/* Glow suave centralizado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-gold/10 via-sky-500/10 to-teal-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        {/* Top Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2.5 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Degustação 100% Gratuita
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Lançamento Oficial
          </span>
        </motion.div>

        {/* Título Forte */}
        <motion.h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          Você só paga se a história te prender.
        </motion.h2>

        {/* Subtítulo Curto e Sem Enrolação */}
        <motion.p
          className="text-muted-foreground text-base sm:text-lg mb-8 max-w-2xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Leia os primeiros capítulos gratuitamente no e-reader, sem cadastrar cartão de crédito. Você só decide se quer a obra completa depois de degustar.
        </motion.p>

        {/* Card de Preço & Escassez Minimalista (Sem caixas aninhadas) */}
        <motion.div
          className="p-6 sm:p-8 rounded-3xl bg-[#0b1222]/90 border border-gold/35 shadow-[0_0_50px_rgba(0,0,0,0.65)] backdrop-blur-md mb-8 text-left"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold block mb-1">
                Oferta de Lançamento Digital
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                Acesso Vitalício Completo (22 Capítulos)
              </h3>
              <p className="text-xs text-slate-300 font-light mt-0.5">
                Inclui todos os dossiês históricos e futuras atualizações.
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-xs text-slate-400 line-through block">De R$ 49,90</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-display">
                R$ 29,90
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-300/95 font-medium">
            <span className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>Preço promocional travado para quem iniciar a degustação hoje.</span>
            </span>
            <span className="text-emerald-400 font-semibold">
              Economia de R$ 20,00
            </span>
          </div>
        </motion.div>

        {/* Botão Principal CTA Dourado Nobre */}
        <motion.div
          className="flex flex-col items-center justify-center gap-3.5"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <button
            type="button"
            onClick={handleStart}
            className="relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:from-[#dfb76c] hover:to-[#dfb76c] text-slate-950 font-extrabold tracking-wider rounded-2xl shadow-[0_0_35px_rgba(201,169,98,0.45)] hover:shadow-[0_0_45px_rgba(201,169,98,0.65)] transition-all duration-300 text-sm sm:text-base uppercase group cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span>COMEÇAR DEGUSTAÇÃO GRATUITA</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Micro-Garantias em linha com ícones */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sem cartão de crédito</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Leitura imediata no navegador</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acesso garantido a R$ 29,90</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeTasteOfferSection;
