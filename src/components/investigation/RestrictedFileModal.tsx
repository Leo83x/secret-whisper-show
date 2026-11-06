import React, { useEffect } from 'react';
import { Lock, ShieldAlert, X } from 'lucide-react';
import { HistoricalNode } from '../../types/investigation';

interface RestrictedFileModalProps {
  node: HistoricalNode | null;
  onClose: () => void;
}

export const RestrictedFileModal: React.FC<RestrictedFileModalProps> = ({ node, onClose }) => {
  useEffect(() => {
    if (!node) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [node, onClose]);

  if (!node) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B1320] border border-red-500/40 shadow-[0_0_45px_rgba(239,68,68,0.2)] p-6 space-y-4 text-center">
        
        <button
          onClick={onClose}
          title="Fechar (Esc)"
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold">
            ACESSO RESTRITO // ARQUIVO CLASSIFICADO
          </div>
          <h3 className="font-sans text-lg font-bold text-white tracking-normal">
            {node.title} ({node.year})
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#060A12] border border-red-500/25 text-left space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">STATUS:</span>
            <span className="text-red-300 font-bold">ACESSO CONDICIONADO</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">CAMADA:</span>
            <span className="text-amber-300">EXPANSÃO VOLUME II</span>
          </div>
          <div className="pt-2 border-t border-slate-800 text-slate-300 font-sans leading-relaxed">
            Necessário concluir a auditoria dos 4 casos principais do Volume I (Júlio César, Napoleão, Alan Turing e Steve Jobs) para liberar a camada de expansão.
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono uppercase tracking-wider text-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Ciente — Retornar ao Terminal</span>
        </button>

      </div>
    </div>
  );
};
