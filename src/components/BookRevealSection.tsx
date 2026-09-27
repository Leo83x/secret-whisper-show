import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import bookCover from "/capa_ush.jpg";
import { Moon, Type, BookMarked, ArrowRight, Sparkles, Check } from "lucide-react";

const BookRevealSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleStartReading = () => {
    window.location.href = '/reader/';
  };

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-visible touch-pan-y">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl opacity-50" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Capa do Livro */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-background/80 blur-xl rounded-full" />
              <img
                src={bookCover}
                alt="O Último Segredo da Humanidade — Capa do livro"
                className="relative z-10 w-full h-auto rounded-lg shadow-2xl border border-gold/20"
              />
            </div>
          </motion.div>

          {/* Conteúdo */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold tracking-wider text-gold uppercase bg-gold/10 border border-gold/30 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Leitura Digital Imersiva
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Uma experiência feita para a sua mente
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg mb-6 leading-relaxed font-light">
              Leia em qualquer dispositivo com nosso e-reader nativo. Sem distração, com temas personalizados e navegação direta pelos capítulos.
            </p>

            {/* Bloco de Preço */}
            <div className="mb-8 p-5 rounded-2xl bg-card/60 border border-gold/30 max-w-md mx-auto lg:mx-0 shadow-lg">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs uppercase font-semibold text-gold tracking-wider">Acesso Vitalício Completo</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">R$ 49,00</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 text-left">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> E-reader nativo sem necessidade de aplicativo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Atualizações de capítulos e dossiês históricos</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Degustação gratuita liberada agora</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
              <div className="p-4 rounded-xl bg-card/40 border border-border/30">
                <Moon className="w-5 h-5 text-gold mb-2" />
                <h4 className="text-sm font-semibold text-foreground mb-1">Modo Noturno</h4>
                <p className="text-xs text-muted-foreground">Temas claro, escuro e sépia para leitura confortável em qualquer horário.</p>
              </div>
              <div className="p-4 rounded-xl bg-card/40 border border-border/30">
                <Type className="w-5 h-5 text-gold mb-2" />
                <h4 className="text-sm font-semibold text-foreground mb-1">Tipografia Ajustável</h4>
                <p className="text-xs text-muted-foreground">Altere o tamanho das fontes e o espaçamento para o seu estilo perfeito.</p>
              </div>
              <div className="p-4 rounded-xl bg-card/40 border border-border/30">
                <BookMarked className="w-5 h-5 text-gold mb-2" />
                <h4 className="text-sm font-semibold text-foreground mb-1">Marcador Automático</h4>
                <p className="text-xs text-muted-foreground">Retorne exatamente para a linha onde você parou de ler.</p>
              </div>
            </div>

            {/* Botão CTA Dourado Nobre #c9a962 */}
            <motion.button
              onClick={handleStartReading}
              className="relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:from-[#dfb76c] hover:to-[#dfb76c] text-slate-950 font-extrabold tracking-wider rounded-xl shadow-[0_0_25px_rgba(201,169,98,0.35)] hover:shadow-[0_0_35px_rgba(201,169,98,0.55)] transition-all duration-300 text-sm uppercase group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              <span>INICIAR LEITURA</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookRevealSection;
