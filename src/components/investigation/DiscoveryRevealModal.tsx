import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 font-sans"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0B1320] border-2 border-amber-400/70 shadow-[0_0_60px_rgba(245,158,11,0.3)] overflow-hidden p-5 sm:p-6 space-y-5 text-center">
        
        <button
          onClick={onClose}
          title="Fechar (Esc)"
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono uppercase tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NOVA DESCOBERTA // ELO HISTÓRICO COMPROVADO</span>
        </div>

        <h3 className="font-sans text-lg sm:text-xl font-bold text-white tracking-normal">
          {title}
        </h3>

        {/* Mini-Mapa Visual de Ressonância com Arco Dourado Animado */}
        <div className="relative h-36 rounded-xl bg-[#060A12] border border-amber-500/30 overflow-hidden flex items-center justify-around px-6">
          <img
            src="/dossiers/world_map_bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
          />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 140">
            <path
              d="M 80 85 Q 200 15 320 85"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_15px_#fbbf24]" />
            <span className="text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded">
              {sourceName}
            </span>
            <span className="text-[10px] font-mono text-amber-300">{sourceYear}</span>
          </div>

          <GitCommit className="relative z-10 w-6 h-6 text-amber-400" />

          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
            <span className="text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded">
              {targetNames.join(' & ') || 'Ponto Conectado'}
            </span>
            <span className="text-[10px] font-mono text-cyan-300">Ressonância Ativa</span>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed text-left bg-[#060A12]/90 border border-slate-800 p-4 rounded-xl">
          {conclusion}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {onInspectMap && (
            <button
              onClick={onInspectMap}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
            >
              Ver Arco no Mapa Mundial
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)]"
          >
            <span>Continuar Investigação</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
