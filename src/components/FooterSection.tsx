import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="relative py-16 px-6 border-t border-border/30 bg-background/50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="space-y-3 mb-10 text-lg md:text-xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p>A História já aconteceu.</p>
          <p>Mas os padrões continuam acontecendo.</p>
          <p className="text-gold font-medium">E talvez alguém esteja observando.</p>
        </motion.div>

        <motion.div
          className="my-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-display text-2xl md:text-3xl text-foreground mb-2">
            O Último Segredo da Humanidade
          </p>
          <p className="text-sm md:text-base text-muted-foreground/80 italic max-w-xl mx-auto">
            O que você faria se descobrisse que algumas das suas escolhas já foram vistas antes?
          </p>
        </motion.div>

        {/* --- DADOS LEGAIS E INSTITUCIONAIS --- */}
        <motion.div
          className="pt-8 border-t border-border/20 text-xs md:text-sm text-muted-foreground/70 space-y-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-muted-foreground/80">
            <span><strong>Razão Social:</strong> LTL EMPREENDIMENTOS</span>
            <span className="hidden sm:inline">•</span>
            <span><strong>Registro de Obra:</strong> nº 312254601</span>
            <span className="hidden sm:inline">•</span>
            <a 
              href="https://www.instagram.com/oultimosegredodahumanidade" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground transition-colors underline underline-offset-4"
            >
              Suporte no Instagram
            </a>
            <span className="hidden sm:inline">•</span>
            <a 
              href="/reader/terms.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground transition-colors underline underline-offset-4"
            >
              Termos de Uso & Proteção Autoral (Lei nº 9.610/98)
            </a>
          </div>

          <p className="text-xs text-muted-foreground/50 pt-2">
            © {new Date().getFullYear()} LTL EMPREENDIMENTOS. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
