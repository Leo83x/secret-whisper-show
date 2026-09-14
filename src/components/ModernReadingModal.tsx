import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, BookOpen, Smartphone, ShieldCheck, Moon, ArrowRight, ExternalLink, Play } from "lucide-react";

interface ModernReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernReadingModal: React.FC<ModernReadingModalProps> = ({ isOpen, onClose }) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* Backdrop escuro com desfoque cinematográfico */}
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowVideo(false);
            onClose();
          }}
        />

        {/* Modal Container */}
        <motion.div
          className="relative w-full max-w-3xl bg-[#090e17] border border-gold/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(201,169,98,0.25)] z-10 overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Efeito de luz dourada interna */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          {/* Botão Fechar */}
          <button
            onClick={() => {
              setShowVideo(false);
              onClose();
            }}
            className="absolute top-4 right-4 text-muted-foreground hover:text-gold transition-colors p-2 rounded-full hover:bg-white/5"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Título */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs tracking-widest uppercase font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Uma Nova Era na Leitura Digital
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              A Revolução da <span className="text-gradient-gold">Leitura Moderna</span>
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg mx-auto">
              Muito além de um simples texto estático. Uma experiência imersiva com trilha, reconstituições visuais e interatividade.
            </p>
          </div>

          {/* TEASER EM VÍDEO CINEMATOGRÁFICO */}
          <div className="mb-8 rounded-xl overflow-hidden border border-gold/30 bg-black/60 shadow-2xl relative">
            {showVideo ? (
              <div className="relative w-full pb-[56.25%] h-0">
                <iframe
                  src="https://www.youtube.com/embed/NPOIMTcfisg?autoplay=1&rel=0&modestbranding=1"
                  title="Teaser Cinematográfico - Roma 49 a.C."
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div 
                onClick={() => setShowVideo(true)}
                className="group relative cursor-pointer aspect-video w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden"
              >
                {/* Imagem de Fundo do Vídeo */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                  style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(9,14,23,0.95) 100%)" }}
                />
                
                {/* Botão Play Pulsante */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-[0_0_30px_rgba(201,169,98,0.6)] group-hover:scale-110 group-hover:bg-gold transition-all duration-300 mb-3">
                  <Play className="w-7 h-7 fill-black ml-1" />
                </div>
                <span className="relative z-10 font-display text-sm uppercase tracking-[0.2em] text-gold font-semibold">
                  Assistir Teaser Oficial (Roma — 49 a.C.)
                </span>
                <span className="relative z-10 text-xs text-muted-foreground mt-1">
                  Reconstituição visual da decisão de Júlio César no Rubicão
                </span>
              </div>
            )}
          </div>

          {/* Grid de Recursos Interativos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold/20 transition-all">
              <div className="p-2 rounded-lg bg-gold/10 text-gold shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Mobile-First por Gestos</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Folheie e deslize com o polegar suavemente no smartphone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold/20 transition-all">
              <div className="p-2 rounded-lg bg-gold/10 text-gold shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Modo Zen & 4 Temas</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Dossiê Gold, Neon, Sépia ou Escuro com foco total na história.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold/20 transition-all">
              <div className="p-2 rounded-lg bg-gold/10 text-gold shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Tipografia Confortável</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Fonte Inter sem serifa otimizada para leitura prolongada em telas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold/20 transition-all">
              <div className="p-2 rounded-lg bg-gold/10 text-gold shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Dossiês & Vídeos Históricos</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Reconstituições visuais integradas aos pontos de virada dos capítulos.
                </p>
              </div>
            </div>
          </div>

          {/* Ações / CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {/* Botão de Degustação no E-Reader */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-black font-display font-semibold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(201,169,98,0.3)] hover:shadow-[0_0_35px_rgba(201,169,98,0.5)] hover:scale-[1.02] transition-all duration-200"
            >
              <span>Experimentar Degustação</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Botão de Compra da Obra Completa */}
            <button
              onClick={() => {
                setShowVideo(false);
                onClose();
                const formSection = document.getElementById("pre-launch");
                if (formSection) {
                  formSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gold/40 hover:border-gold text-gold font-display font-semibold text-sm tracking-wider uppercase hover:bg-gold/10 transition-all duration-200"
            >
              <span>Comprar Obra Completa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rodapé sutil */}
          <p className="text-center text-[11px] text-muted-foreground/70 mt-5 font-mono">
            * Degustação gratuita inclui o Prólogo e o Capítulo 1 completo.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModernReadingModal;
