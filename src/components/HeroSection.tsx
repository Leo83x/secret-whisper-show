import { motion } from "framer-motion";
import KineticText from "./KineticText";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Central content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Subtitle */}
        <motion.p
          className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          A revelação começa
        </motion.p>

        {/* Main title */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-bold leading-tight mb-8">
          <motion.span
            className="block text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            O Último
          </motion.span>
          <motion.span
            className="block text-gradient-gold glow-gold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Segredo
          </motion.span>
          <motion.span
            className="block text-foreground"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            da Humanidade
          </motion.span>
        </h1>

        {/* Tagline */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <KineticText delay={2.4} variant="blur">
            Como uma sociedade silenciosa decifrou os padrões ocultos da história
          </KineticText>
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { duration: 1, delay: 3 },
            y: { duration: 2, repeat: Infinity, delay: 3 }
          }}
        >
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gold rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
