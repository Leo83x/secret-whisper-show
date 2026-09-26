import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Sparkles, BookOpen, Play } from 'lucide-react';

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
    window.location.href = '/reader/';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0b1120] border border-[#c9a962]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100 overflow-y-auto max-h-[92vh]">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#c9a962]/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="mb-3 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-[#c9a962] uppercase bg-[#c9a962]/10 border border-[#c9a962]/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Reconstituição Histórica & Teaser
          </span>
        </div>

        {/* Título com SEGREDO em azul metálico */}
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 tracking-tight font-display">
          O ÚLTIMO <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">SEGREDO</span> DA HUMANIDADE
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 text-center mb-5 leading-relaxed font-light">
          Assista ao teaser cinematográfico da obra antes de iniciar a sua leitura.
        </p>

        {/* --- VÍDEO TEASER EMBEDADO DA OBRA --- */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-700/60 bg-black mb-6 shadow-lg">
          {!videoStarted ? (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-black/60 to-transparent cursor-pointer group"
              onClick={() => setVideoStarted(true)}
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/90 group-hover:bg-amber-400 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-all duration-300 mb-3">
                <Play className="w-7 h-7 fill-slate-950 ml-1" />
              </div>
              <span className="text-sm font-semibold tracking-wider uppercase text-amber-300">Assistir ao Teaser Cinematográfico</span>
            </div>
          ) : (
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Teaser Cinematográfico - Roma 49 a.C."
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* --- BOTÃO CTA PREMIUM CINEMATOGRÁFICO --- */}
        <div className="pt-1 pb-1">
          <button
            onClick={handleStartReading}
            className="relative overflow-hidden w-full py-4 px-6 rounded-xl font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_30px_rgba(234,179,8,0.45)] hover:shadow-[0_0_40px_rgba(234,179,8,0.65)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <BookOpen className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>INICIAR LEITURA GRATUITA</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400/70 mt-3">
          🔒 Acesso instantâneo no navegador · Obra Registrada nº 312254601
        </p>
      </div>
    </div>
  );
};
