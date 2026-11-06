import React from 'react';
import { Lock, ShieldAlert, X } from 'lucide-react';
import { HistoricalNode } from '../../types/investigation';

interface RestrictedFileModalProps {
  node: HistoricalNode | null;
  onClose: () => void;
}

export const RestrictedFileModal: React.FC<RestrictedFileModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B1320] border border-red-500/40 shadow-[0_0_45px_rgba(239,68,68,0.2)] p-6 space-y-4 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
            ACESSO RESTRITO // REGISTRO NÃO CLASSIFICADO
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {node.fullName} ({node.year})
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800 text-left space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">CÓDIGO DO ARQUIVO:</span>
            <span className="text-amber-300">{node.evidence.artifactCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">LOCALIZAÇÃO:</span>
            <span className="text-slate-200">{node.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">STATUS:</span>
            <span className="text-red-400 font-bold">ACESSO CONDICIONADO</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          O conteúdo integral deste arquivo depende da camada de <strong>Simulação Contrafactual (Volume II — Alterar o Passado)</strong>. Conclua os 4 casos fundamentais do Volume I para preparar sua matriz de decisão.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm cursor-pointer transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
