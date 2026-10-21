import { motion } from "framer-motion";

interface HeroSectionProps {
  onOpenRegister?: () => void;
}

const HeroSection = ({ onOpenRegister }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 overflow-visible touch-pan-y">
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Margens ajustadas para centralização perfeita no mobile */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full px-2 sm:px-6">
        <motion.p
          className="font-sans text-xs sm:text-sm md:text-base tracking-[0.4em] uppercase text-gold/80 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          A REVELAÇÃO
        </motion.p>

        <h1 className="font-display font-bold leading-none mb-8 sm:mb-10 text-center w-full flex flex-col items-center justify-center space-y-2">
          <motion.span
            className="block text-foreground text-center tracking-normal"
            style={{ fontSize: "clamp(2.2rem, 7.5vw, 6.5rem)" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            O ÚLTIMO
          </motion.span>

          <motion.span
            className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.4)] text-center tracking-normal"
            style={{ fontSize: "clamp(2.4rem, 8.5vw, 7.5rem)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            SEGREDO
          </motion.span>

          <motion.span
            className="block text-foreground text-center tracking-normal"
            style={{ fontSize: "clamp(2.2rem, 7.5vw, 6.5rem)" }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            DA
          </motion.span>

          <motion.span
            className="block text-foreground text-center tracking-normal"
            style={{ fontSize: "clamp(2rem, 6.5vw, 5.8rem)" }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            HUMANIDADE
          </motion.span>
        </h1>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.8 }}
        >
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed px-4 text-center">
            E se os grandes acontecimentos da História não fossem tão imprevisíveis quanto parecem?
          </p>
        </motion.div>

        {/* Botão CTA Principal da Hero */}
        <motion.div
          className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.2 }}
        >
          <button
            type="button"
            onClick={onOpenRegister}
            className="relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:from-[#dfb76c] hover:to-[#dfb76c] text-slate-950 font-extrabold tracking-wider rounded-xl shadow-[0_0_35px_rgba(201,169,98,0.45)] hover:shadow-[0_0_45px_rgba(201,169,98,0.65)] transition-all duration-300 text-sm sm:text-base uppercase group cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span>COMEÇAR DEGUSTAÇÃO GRATUITA</span>
            <span className="text-base group-hover:translate-x-1 transition-transform">➔</span>
          </button>
          <p className="text-xs text-muted-foreground/80 font-light flex items-center gap-1.5">
            <span className="text-gold">⚡</span>
            <span>Acesso instantâneo sem custo · Sem cartão de crédito</span>
          </p>
        </motion.div>

        <motion.div
          className="mt-10 sm:mt-12 mx-auto h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ duration: 1.5, delay: 3.6, ease: "easeOut" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
