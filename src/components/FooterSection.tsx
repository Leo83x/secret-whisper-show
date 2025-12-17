import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="relative py-20 px-6 border-t border-border/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          className="font-display text-2xl md:text-3xl text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          O Último Segredo da Humanidade
        </motion.p>
        <motion.p
          className="text-sm text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          © 2024 Sociedade Silenciosa · Todos os direitos reservados
        </motion.p>
      </div>
    </footer>
  );
};

export default FooterSection;
