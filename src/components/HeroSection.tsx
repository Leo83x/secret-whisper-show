import { motion } from "framer-motion";
import KineticText from "./KineticText";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-visible touch-pan-y">
      {/* Cinematic vignette overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      
      {/* Central content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Subtitle */}
        <motion.p
          className="text-sm md:text-base tracking-[0.4em] uppercase text-gold/80 mb-8"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          A revelação começa
        </motion.p>

        {/* Main title with cinematic reveal */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-bold leading-tight mb-10">
          <motion.span
            className="block text-foreground"
            initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            O Último
          </motion.span>
          <motion.span
            className="block text-gradient-gold glow-gold relative"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(30px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(201, 169, 98, 0.5)",
                  "0 0 60px rgba(201, 169, 98, 0.8)",
                  "0 0 20px rgba(201, 169, 98, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Segredo
            </motion.span>
          </motion.span>
          <motion.span
            className="block text-foreground"
            initial={{ opacity: 0, y: -50, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            da Humanidade
          </motion.span>
        </h1>

        {/* Tagline */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.8 }}
        >
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            <KineticText delay={3} variant="blur">
              Como uma sociedade silenciosa decifrou os padrões ocultos da história
            </KineticText>
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="mt-12 mx-auto h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ duration: 1.5, delay: 3.5, ease: "easeOut" }}
        />

      </div>
    </section>
  );
};

export default HeroSection;
