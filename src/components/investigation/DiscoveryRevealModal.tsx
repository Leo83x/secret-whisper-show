import React from 'react';
import { Sparkles, ArrowRight, GitCommit, X } from 'lucide-react';

interface DiscoveryRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  conclusion: string;
  sourceName: string;
  sourceYear: string;
  targetNames: string[];
  onInspectMap?: () => void;
}

export const DiscoveryRevealModal: React.FC<DiscoveryRevealModalProps> = ({
  isOpen,
  onClose,
  title,
  conclusion,
  sourceName,
  sourceYear,
  targetNames,
  onInspectMap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0B1320] border-2 border-amber-400/70 shadow-[0_0_60px_rgba(245,158,11,0.3)] overflow-hidden p-6 space-y-5 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono uppercase tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NOVA DESCOBERTA // RESSONÂNCIA IDENTIFICADA</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
          {title}
        </h3>

        {/* Mini-Mapa Visual com o Arco Sendo Desenhado Entre os Pontos */}
        <div className="relative h-36 rounded-xl bg-[#050811] border border-amber-500/30 overflow-hidden flex items-center justify-center">
          <img
            src="/dossiers/world_map_bg.webp"
            alt="Ressonância no Mapa"
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
          <svg viewBox="0 0 200 80" className="relative z-10 w-full h-full">
            <defs>
              <linearGradient id="revealArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <path
              d="M 45 52 Q 100 12 155 48"
              fill="none"
              stroke="url(#revealArcGrad)"
              strokeWidth="2.5"
              strokeDasharray="160"
              strokeDashoffset="0"
            />
            <circle cx="45" cy="52" r="5" fill="#F59E0B" />
            <circle cx="45" cy="52" r="10" fill="#F59E0B" opacity="0.25" />
            <circle cx="155" cy="48" r="5" fill="#06B6D4" />
            <circle cx="155" cy="48" r="10" fill="#06B6D4" opacity="0.25" />
          </svg>

          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/40">
              {sourceName} ({sourceYear})
            </span>
            <span className="text-cyan-300 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-cyan-500/40">
              <GitCommit className="w-3 h-3" /> {targetNames.join(' • ')}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed text-left bg-[#060A12] p-4 rounded-xl border border-slate-800">
          {conclusion}
        </p>

        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          NOVO REGISTRO SINCRONIZADO NO ARQUIVO PESSOAL E NO MAPA MUNDIAL
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {onInspectMap && (
            <button
              onClick={onInspectMap}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-sm cursor-pointer transition-all"
            >
              Ver Arco no Mapa Mundial
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all"
          >
            <span>CONTINUAR INVESTIGAÇÃO</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
