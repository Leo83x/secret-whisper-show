import { Sparkles, ArrowRight, BookOpen, FolderLock, Smartphone, Zap } from "lucide-react";

interface SpecialHeroProps {
  onCtaClick: () => void;
  onReadSampleClick?: () => void;
}

export const SpecialHeroSection = ({ onCtaClick, onReadSampleClick }: SpecialHeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-8 pt-8 pb-16 overflow-visible text-center">
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-80" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-2">
        {/* Top Badge alinhado ao anúncio */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-5 shadow-[0_0_20px_rgba(201,169,98,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Edição Especial Digital // Preço de Lançamento</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center text-center lg:text-left">
          {/* Coluna Esquerda: Gancho do Anúncio + Capa Mobile + 3 Pilares + CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
            {/* Pergunta Exata do Topo da Arte (Print 4) */}
            <p className="text-xs sm:text-sm font-mono font-bold text-gold uppercase tracking-widest mb-2">
              E SE AS GRANDES DECISÕES DA HISTÓRIA RESPONDEM A UM PADRÃO OCULTO?
            </p>

            {/* Título Monumental - Renderização imediata para LCP */}
            <h1 className="font-display font-bold leading-none mb-4 flex flex-col items-center lg:items-start justify-center space-y-1">
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

            {/* Subtítulo Exato da Arte (Print 4) */}
            <p className="text-base sm:text-lg text-slate-200 font-normal max-w-xl leading-relaxed mb-5">
              Uma investigação que atravessa séculos — de <strong className="text-white font-semibold">Júlio César, Cleópatra e Napoleão</strong> a <strong className="text-white font-semibold">Alan Turing e Steve Jobs</strong> — e conecta o passado aos bastidores do poder no presente.
            </p>

            {/* Bloco Visual Mobile: Capa + Os 3 Ícones do Anúncio Lado a Lado */}
            <div className="w-full max-w-md lg:max-w-xl mb-6 p-3.5 sm:p-4 rounded-2xl bg-[#091022]/90 border border-gold/35 shadow-xl flex items-center gap-4 text-left">
              <div className="lg:hidden shrink-0 w-24 sm:w-28 rounded-xl overflow-hidden border border-gold/50 shadow-lg bg-[#070b14]">
                <img
                  src="/capa_ush.webp"
                  alt="Capa do livro O Último Segredo da Humanidade"
                  className="w-full h-auto object-cover block"
                  loading="eager"
                  width="112"
                  height="168"
                />
              </div>

              {/* Os 3 Pilares Exatos do Anúncio ADS02_Img */}
              <div className="flex-1 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wide leading-tight">
                      Livro Completo
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300 leading-tight block">
                      Para celulares, tablets e PCs (21 Capítulos + Prólogo & Epílogo)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0 mt-0.5">
                    <FolderLock className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wide leading-tight">
                      4 Dossiês Exclusivos
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300 leading-tight block">
                      Relatórios confidenciais e materiais complementares ilustrados
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wide leading-tight">
                      Leitura Online Imersiva
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300 leading-tight block">
                      Com ajuste de tamanho de fonte e modos Escuro, Sépia e Claro
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="w-full sm:w-auto flex flex-col items-center lg:items-start justify-center gap-3">
              <button
                type="button"
                onClick={onCtaClick}
                className="w-full sm:w-auto relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 sm:px-12 min-h-[62px] sm:min-h-[68px] py-4 bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:from-[#dfb76c] hover:to-[#dfb76c] text-slate-950 font-black tracking-wider rounded-2xl shadow-[0_0_35px_rgba(201,169,98,0.5)] hover:shadow-[0_0_50px_rgba(201,169,98,0.75)] active:scale-[0.99] transition-all duration-300 text-sm sm:text-base uppercase group cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-slate-950 text-slate-950 shrink-0" />
                <span>EDIÇÃO ESPECIAL • R$ 29,90</span>
                <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {onReadSampleClick && (
                <button
                  type="button"
                  onClick={onReadSampleClick}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-gold hover:text-amber-300 font-semibold py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>Ler trecho real de Júlio César no Simulador Interativo ↓</span>
                </button>
              )}
            </div>
          </div>

          {/* Coluna Direita (Desktop): Capa em Destaque 3D */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
            <div className="relative group max-w-[300px]">
              <div className="absolute -inset-2 bg-gradient-to-r from-gold/30 via-cyan/20 to-gold/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#070b14] transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                <img
                  src="/capa_ush.webp"
                  alt="Capa do livro O Último Segredo da Humanidade"
                  className="w-full h-auto object-cover block"
                  loading="eager"
                  width="300"
                  height="450"
                />
              </div>
              <div className="text-center mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-gold/40 text-[11px] font-mono text-gold tracking-widest uppercase shadow-md">
                  ★ Acesso Vitalício Imediato • R$ 29,90
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
