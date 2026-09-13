import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="relative py-24 px-6 border-t border-border/30">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          className="space-y-4 mb-12 text-lg md:text-2xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <p>A História já aconteceu.</p>
          <p>Mas os padrões continuam acontecendo.</p>
          <p className="text-gold">E talvez alguém esteja observando.</p>
        </motion.div>

        <motion.p
          className="font-display text-2xl md:text-3xl text-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          O Último Segredo da Humanidade
        </motion.p>

        <motion.p
          className="text-base md:text-lg text-muted-foreground/80 italic mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          O que você faria se descobrisse que algumas das suas escolhas já foram vistas antes?
        </motion.p>

        <motion.p
          className="text-sm text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          © 2026 · Todos os direitos reservados
        </motion.p>
      </div>
    </footer>
  );
};

export default FooterSection;
