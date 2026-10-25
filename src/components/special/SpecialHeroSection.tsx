import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface SpecialHeroProps {
  onCtaClick: () => void;
}

export const SpecialHeroSection = ({ onCtaClick }: SpecialHeroProps) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-8 pt-16 pb-20 overflow-visible text-center">
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-80" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full px-2">
        {/* Top Badge - Imediatamente visível */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(201,169,98,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Edição Especial Digital // Acesso Vitalício</span>
        </div>

        {/* Título Monumental - Renderização imediata para LCP / FCP instantâneo */}
        <h1 className="font-display font-bold leading-none mb-8 flex flex-col items-center justify-center space-y-2">
          <span className="block text-foreground tracking-normal text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            O ÚLTIMO
          </span>

          <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.45)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black">
            SEGREDO
          </span>

          <span className="block text-foreground tracking-normal text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            DA HUMANIDADE
          </span>
        </h1>

        {/* Frase de Impacto - Elemento LCP instantâneo */}
        <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mb-10">
          E se os grandes acontecimentos da História respondessem a <strong className="text-white font-medium">um mesmo padrão oculto</strong> que você nunca deveria descobrir?
        </p>

        {/* Botão de Ação Direta */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={onCtaClick}
            className="relative overflow-hidden inline-flex items-center justify-center gap-3.5 px-8 sm:px-14 min-h-[64px] sm:min-h-[72px] py-5 sm:py-6 bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:from-[#dfb76c] hover:to-[#dfb76c] text-slate-950 font-black tracking-wider rounded-2xl shadow-[0_0_40px_rgba(201,169,98,0.5)] hover:shadow-[0_0_55px_rgba(201,169,98,0.7)] active:scale-[0.99] transition-all duration-300 text-base sm:text-lg uppercase group cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>DESBLOQUEAR OBRA COMPLETA (R$ 29,90)</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Micro-selos */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400 font-light pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acesso Imediato</span>
            </span>
            <span>•</span>
            <span>Leitura Vitalícia</span>
            <span>•</span>
            <span>21 Capítulos + Prólogo & Epílogo + 4 Dossiês</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">PIX ou Cartão em 3x</span>
          </div>
        </div>
      </div>
    </section>
  );
};
