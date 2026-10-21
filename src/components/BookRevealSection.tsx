import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import bookCover from "/capa_ush.jpg";
import { Moon, Type, BookMarked, ArrowRight, Sparkles } from "lucide-react";

interface BookRevealSectionProps {
  onOpenRegister?: () => void;
}

const BookRevealSection = ({ onOpenRegister }: BookRevealSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleStartReading = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      window.location.href = '/reader/';
    }
  };

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-visible touch-pan-y">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Capa do Livro */}
          <motion.div
            className="relative w-full max-w-sm sm:max-w-md shrink-0"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-background/80 blur-xl rounded-full" />
              <img
                src={bookCover}
                alt="O Último Segredo da Humanidade — Capa do livro"
                className="relative z-10 w-full h-auto rounded-lg shadow-2xl border border-gold/25"
              />
            </div>
          </motion.div>

          {/* Conteúdo: E-reader e Recursos (Limpo e Arejado) */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold tracking-wider text-gold uppercase bg-gold/10 border border-gold/30 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Leitura Digital Imersiva
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Uma experiência feita para a sua mente
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed font-light">
              Leia direto no seu navegador com nosso e-reader nativo. Sem precisar baixar aplicativos, sem distrações e com carregamento instantâneo no celular, tablet ou computador.
            </p>

            {/* 3 Recursos Chave do E-reader */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
              <div className="p-4 rounded-2xl bg-card/50 border border-gold/15 hover:border-gold/35 transition-colors">
                <Moon className="w-5 h-5 text-gold mb-2.5" />
                <h4 className="text-sm font-semibold text-foreground mb-1">Modo Noturno</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Temas escuro, claro e sépia para leitura confortável em qualquer horário.</p>
              </div>
              <div className="p-4 rounded-2xl bg-card/50 border border-gold/15 hover:border-gold/35 transition-colors">
                <Type className="w-5 h-5 text-gold mb-2.5" />
                <h4 className="text-sm font-semibold text-foreground mb-1">Tipografia Ajustável</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Altere o tamanho das fontes e o espaçamento para o seu ritmo ideal.</p>
              </div>
              <div className="p-4 rounded-2xl bg-card/50 border border-gold/15 hover:border-gold/35 transition-colors">
                <BookMarked className="w-5 h-5 text-gold mb-2.5" />
                <h4 className="text-sm font-semibold text-foreground mb-1">Marcador Automático</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Retorne exatamente para o parágrafo onde parou, em qualquer tela.</p>
              </div>
            </div>

            {/* Link de Ação Direta */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={handleStartReading}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-gold hover:text-gold/80 transition-colors uppercase tracking-wider py-2 group cursor-pointer"
              >
                <span>Experimentar o e-reader agora</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookRevealSection;
