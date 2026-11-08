import React from 'react';
import { CaseNode } from '../../types/investigation';
import { Lock, ShieldAlert } from 'lucide-react';
import { CinematicModal, DecisionStamp, GameIconButton } from './GameInteractionSystem';

interface RestrictedFileModalProps {
  node: CaseNode | null;
  onClose: () => void;
}

export const RestrictedFileModal: React.FC<RestrictedFileModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <CinematicModal
      isOpen={Boolean(node)}
      onClose={onClose}
      variant="restricted"
      folderCode={`PASTA CONFIDENCIAL // ${node.missionCode || 'ARQUIVO RESTRITO'}`}
    >
      <div className="p-6 sm:p-7 space-y-5 text-center relative">
        {/* Ícone de Lacre Físico + Carimbo de Sigilo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-red-950/70 border-2 border-red-500/60 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            <Lock className="w-7 h-7 text-red-300" />
          </div>
          <DecisionStamp label="ACESSO BLOQUEADO // NÍVEL II" tone="crimson" />
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300/90">
            {node.location} • {node.year}
          </div>
          <h3 className="font-sans text-lg sm:text-xl font-extrabold text-white">
            {node.title}
          </h3>
        </div>

        {/* Ficha de Quarentena com Linhas Redigidas */}
        <div className="p-4 rounded-xl bg-[#070508]/90 border border-red-500/30 text-left space-y-2.5 text-xs font-mono shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">CLASSIFICAÇÃO:</span>
            <span className="text-red-300 font-bold">QUARENTENA FORENSE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">CAMADA DE ARQUIVO:</span>
            <span className="text-amber-300 font-bold">EXPANSÃO VOLUME II</span>
          </div>
          <div className="py-1.5 space-y-1.5 opacity-55" aria-hidden="true">
            <div className="h-2 w-4/5 rounded bg-slate-700/80" />
            <div className="h-2 w-3/5 rounded bg-slate-700/60" />
          </div>
          <div className="pt-2 border-t border-red-950/80 text-slate-200 font-sans text-xs sm:text-sm leading-relaxed">
            Conclua a auditoria dos <strong>4 dossiês principais do Volume I</strong> (Júlio César, Napoleão, Alan Turing e Steve Jobs) para desbloquear esta pasta confidencial.
          </div>
        </div>

        <div className="pt-1 flex justify-center">
          <GameIconButton
            onClick={onClose}
            icon={<ShieldAlert className="w-4 h-4 text-amber-400" />}
            className="w-full py-2.5 text-xs uppercase tracking-wider"
          >
            Fechar Pasta Confidencial
          </GameIconButton>
        </div>
      </div>
    </CinematicModal>
  );
};
