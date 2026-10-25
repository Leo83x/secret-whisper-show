import { Sparkles, ArrowRight, ShieldCheck, BookOpen, Zap } from "lucide-react";

interface SpecialHeroProps {
  onCtaClick: () => void;
  onReadSampleClick?: () => void;
}

export const SpecialHeroSection = ({ onCtaClick, onReadSampleClick }: SpecialHeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-8 pt-10 pb-16 overflow-visible text-center">
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-80" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-2">
        {/* Top Badge - Imediatamente visível */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(201,169,98,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Thriller Histórico & Financeiro // Edição Interativa</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center text-center lg:text-left">
          {/* Coluna Principal: Título + Gancho + CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
            {/* Título Monumental - Renderização imediata para LCP / FCP instantâneo */}
            <h1 className="font-display font-bold leading-none mb-5 flex flex-col items-center lg:items-start justify-center space-y-1.5">
              <span className="block text-foreground tracking-normal text-2xl sm:text-4xl md:text-5xl">
                O ÚLTIMO
              </span>

              <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.45)] text-4xl sm:text-6xl md:text-7xl font-black">
                SEGREDO
              </span>

              <span className="block text-foreground tracking-normal text-2xl sm:text-4xl md:text-5xl">
                DA HUMANIDADE
              </span>
            </h1>

            {/* Frase de Impacto - Elemento LCP instantâneo */}
            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal max-w-xl leading-relaxed mb-6">
              Em uma madrugada na Faria Lima, um auditor descobre que as grandes crises da História respondem a <strong className="text-gold font-semibold">um mesmo padrão oculto</strong> — e que alguém está prestes a acioná-lo novamente.
            </p>

            {/* Capa compacta visível no mobile logo acima dos botões */}
            <div className="lg:hidden mb-6 flex flex-col items-center">
              <div className="relative w-36 sm:w-44 rounded-xl overflow-hidden border-2 border-gold/50 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(201,169,98,0.25)] bg-[#070b14]">
                <img
                  src="/capa_ush.webp"
                  alt="Capa do livro O Último Segredo da Humanidade"
                  className="w-full h-auto object-cover block"
                  loading="eager"
                  width="176"
                  height="264"
                />
              </div>
              <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/80 border border-gold/30 text-[10px] font-mono text-gold uppercase tracking-wider">
                📱 Leitor Nativo + 4 Dossiês Inclusos
              </span>
            </div>

            {/* Botões de Ação: 1º Experimentar Leitura (Sem Muro de Preço) / 2º Ir direto para compra */}
            <div className="w-full sm:w-auto flex flex-col items-center lg:items-start justify-center gap-3">
              <button
                type="button"
                onClick={onReadSampleClick || onCtaClick}
                className="w-full sm:w-auto relative overflow-hidden inline-flex items-center justify-center gap-3 px-7 sm:px-10 min-h-[60px] sm:min-h-[66px] py-4 bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:from-[#dfb76c] hover:to-[#dfb76c] text-slate-950 font-black tracking-wider rounded-2xl shadow-[0_0_35px_rgba(201,169,98,0.45)] hover:shadow-[0_0_50px_rgba(201,169,98,0.7)] active:scale-[0.99] transition-all duration-300 text-sm sm:text-base uppercase group cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-slate-950 shrink-0" />
                <span>LER AS PRIMEIRAS PÁGINAS AGORA</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-semibold py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>Já quero desbloquear a Edição Completa + 4 Dossiês (R$ 29,90)</span>
              </button>

              {/* Micro-selos */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-slate-400 font-normal pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Leitura direto no celular (sem PDF)</span>
                </span>
                <span>•</span>
                <span>21 Capítulos + 4 Dossiês</span>
                <span>•</span>
                <span className="text-slate-300">Acesso Vitalício</span>
              </div>
            </div>
          </div>

          {/* Coluna Direita (Desktop): Capa em Destaque 3D */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
            <div className="relative group max-w-[290px]">
              <div className="absolute -inset-2 bg-gradient-to-r from-gold/30 via-cyan/20 to-gold/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#070b14] transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                <img
                  src="/capa_ush.webp"
                  alt="Capa do livro O Último Segredo da Humanidade"
                  className="w-full h-auto object-cover block"
                  loading="eager"
                  width="290"
                  height="435"
                />
              </div>
              <div className="text-center mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-gold/40 text-[11px] font-mono text-gold tracking-widest uppercase shadow-md">
                  ★ Obra Completa + Leitor Imersivo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
