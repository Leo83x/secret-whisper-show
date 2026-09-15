import React, { useState, useEffect } from 'react';
import { Moon, Type, BookMarked, ArrowRight, X, Sparkles } from 'lucide-react';

interface ModernReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernReadingModal: React.FC<ModernReadingModalProps> = ({ isOpen, onClose }) => {
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('ereader:modal-open'));
      setVideoStarted(false);
    } else {
      window.dispatchEvent(new CustomEvent('ereader:modal-close'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartReading = () => {
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0b1120] border border-[#c9a962]/30 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-y-auto max-h-[90vh]">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#c9a962]/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-[#c9a962] uppercase bg-[#c9a962]/10 border border-[#c9a962]/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Experiência de Leitura Digital
          </span>
        </div>

        {/* Título com SEGREDO em azul */}
        <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-4 leading-snug">
          O Último <span className="text-sky-400">SEGREDO</span> da Humanidade
        </h3>

        {/* Vídeo com capa limpa + botão play dourado + iframe sem pointer-events para ocultar elementos ao maximo */}
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 mb-4 bg-black shadow-inner">
          {!videoStarted ? (
            <>
              <img
                src="https://img.youtube.com/vi/AskB3oknGnA/maxresdefault.jpg"
                alt="Teaser"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setVideoStarted(true)}
                className="absolute inset-0 flex items-center justify-center group bg-black/40 hover:bg-black/20 transition-colors"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110"
                     style={{ background: "linear-gradient(135deg, #c9a962, #e2c27b)", boxShadow: "0 0 30px rgba(201,169,98,0.6)" }}>
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-black ml-1">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </button>
            </>
          ) : (
            <iframe
              src="https://www.youtube.com/embed/AskB3oknGnA?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&playsinline=1"
              title="Teaser Oficial"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
            />
          )}
        </div>

        {/* Subtítulo */}
        <p className="text-sm text-slate-400 text-center mb-5 px-2">
          Experimente uma nova forma de ler com temas, fontes e progresso salvo.
        </p>

        {/* Diferenciais */}
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
            <Moon className="w-5 h-5 text-[#c9a962] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Modos Noturnos</h4>
              <p className="text-[11px] text-slate-400">Temático Gold, Escuro e Claro</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
            <Type className="w-5 h-5 text-[#c9a962] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Fontes Customizáveis</h4>
              <p className="text-[11px] text-slate-400">Serif, Inter e Cinzel — ajuste a seu gosto</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
            <BookMarked className="w-5 h-5 text-[#c9a962] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Continue de onde parou</h4>
              <p className="text-[11px] text-slate-400">O progresso da leitura é salvo automaticamente</p>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          onClick={handleStartReading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-[#c9a962] to-[#e2c27b] text-black font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c9a962]/20 group text-sm uppercase"
        >
          <span>Iniciar Leitura Degustação</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
