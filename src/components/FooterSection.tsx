import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="relative pt-20 pb-12 px-6 border-t border-border/30 bg-background/80">
      <div className="max-w-4xl mx-auto text-center">
        {/* Bloco Poético / Frases de Efeito do Livro */}
        <motion.div
          className="space-y-4 mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg md:text-2xl text-muted-foreground font-light tracking-wide">
            A História já aconteceu.
          </p>
          <p className="text-lg md:text-2xl text-muted-foreground font-light tracking-wide">
            Mas os padrões continuam acontecendo.
          </p>
          <p className="text-xl md:text-3xl text-gold font-serif font-medium tracking-wide pt-2">
            E talvez alguém esteja observando.
          </p>

          <div className="pt-8">
            <h3 className="font-display text-2xl md:text-4xl text-foreground mb-3">
              O ÚLTIMO SEGREDO DA HUMANIDADE
            </h3>
            <p className="text-sm md:text-base text-muted-foreground/80 italic max-w-xl mx-auto">
              O que você faria se descobrisse que algumas das suas escolhas já foram vistas antes?
            </p>
          </div>
        </motion.div>

        {/* --- CAIXA SEPARADA E DEMARCADA PARA INFORMAÇÕES INSTITUCIONAIS E LEGAIS --- */}
        <motion.div
          className="mt-12 pt-8 pb-6 px-6 rounded-2xl bg-card/40 border border-border/40 text-xs md:text-sm text-muted-foreground/70 space-y-4 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 font-medium">
            <span className="text-foreground/90">Razão Social: <strong className="font-semibold text-foreground">LTL EMPREENDIMENTOS</strong></span>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <span className="text-foreground/90">Registro de Obra: <strong className="font-semibold text-foreground">nº 312254601</strong></span>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <a 
              href="https://www.instagram.com/oultimosegredodahumanidade" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              Suporte no Instagram
            </a>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <a 
              href="/reader/terms.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              Termos de Uso & Proteção Autoral (Lei nº 9.610/98)
            </a>
          </div>

          <div className="pt-2 border-t border-border/20 text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} LTL EMPREENDIMENTOS. Todos os direitos reservados.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
