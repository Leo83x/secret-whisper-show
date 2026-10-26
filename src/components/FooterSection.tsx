import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Instagram } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5511926949316?text=Ol%C3%A1!%20Estou%20na%20p%C3%A1gina%20do%20livro%20O%20%C3%9Altimo%20Segredo%20da%20Humanidade%20e%20preciso%20de%20suporte.";

const trackSupportClick = (canal: "whatsapp" | "instagram", origem: string) => {
  if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
    try {
      (window as any).fbq("trackCustom", "ContatoSuporte", { canal, origem });
    } catch (e) {}
  }
};

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="w-full bg-[#070b14] border-t border-border/30 pt-16 pb-24 sm:pb-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Frases Poéticas de Encerramento */}
        <motion.div
          className="space-y-4 mb-14"
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

        {/* --- RODAPÉ INSTITUCIONAL LARGURA TOTAL DE PONTA A PONTA --- */}
        <motion.div
          className="pt-10 border-t border-border/20 text-xs md:text-sm text-muted-foreground/80 space-y-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 font-medium">
            <span className="text-foreground/90">
              Registro de Obra: <strong className="font-semibold text-foreground">nº 312254601</strong>
            </span>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSupportClick("whatsapp", "rodape")}
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Suporte no WhatsApp: +55 11 92694-9316</span>
            </a>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <a
              href="https://www.instagram.com/oultimosegredodahumanidade"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSupportClick("instagram", "rodape")}
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Oficial (@oultimosegredodahumanidade)</span>
            </a>
            <span className="hidden sm:inline text-muted-foreground/30">•</span>
            <a
              href="/reader/terms.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 font-semibold"
            >
              Termos de Uso & Proteção Autoral (Lei nº 9.610/98)
            </a>
          </div>

          <p className="text-xs text-muted-foreground/50 pt-3">
            © {new Date().getFullYear()} LTL EMPREENDIMENTOS. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
