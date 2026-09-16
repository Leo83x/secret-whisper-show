import { motion } from "framer-motion";

const IntroBridgeSection = () => {
  return (
    <div className="relative">
      {/* FRASE 1 */}
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 snap-center relative">
        <motion.p
          className="max-w-4xl text-2xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold/50 via-gold to-gold/50 text-center tracking-wide leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          POR MILÊNIOS, ALGUÉM OBSERVOU AS GRANDES DECISÕES HISTÓRICAS.
        </motion.p>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase text-gold/60">
          ROLE PARA DESCOBRIR
        </div>
      </div>

      {/* FRASE 2 */}
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 snap-center">
        <motion.p
          className="max-w-4xl text-2xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold/50 via-gold to-gold/50 text-center tracking-wide leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          UMA VERDADE PERMANECEU ESCONDIDA ENTRE GUERRAS, IMPÉRIOS, DESCOBERTAS, REVOLUÇÕES E QUEDAS.
        </motion.p>
      </div>

      {/* FRASE 3 */}
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 snap-center">
        <motion.p
          className="max-w-4xl text-3xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold/50 via-gold to-gold/50 text-center tracking-wide leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          ATÉ AGORA.
        </motion.p>
      </div>
    </div>
  );
};

export default IntroBridgeSection;
