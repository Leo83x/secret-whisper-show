import React from 'react';
import { Sparkles, ArrowRight, GitCommit, Globe } from 'lucide-react';
import {
  CinematicModal,
  DecisionStamp,
  DiscoveryAnimation,
  GameButton,
  GameIconButton,
} from './GameInteractionSystem';

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
    <CinematicModal
      isOpen={isOpen}
      onClose={onClose}
      variant="revelation"
      folderCode="DESCOBERTA DE CAMPO // RESSONÂNCIA HISTÓRICA REGISTRADA"
    >
      <div className="relative p-6 sm:p-8 space-y-6 text-center">
        <DiscoveryAnimation active={isOpen} />

        <div className="flex flex-col items-center gap-3 relative z-20">
          <DecisionStamp label="ELO HISTÓRICO COMPROVADO" tone="emerald" />
          <h3 className="font-sans text-xl sm:text-2xl font-extrabold text-white tracking-tight max-w-2xl">
            {title}
          </h3>
        </div>

        {/* Mapa Cinematográfico de Ressonância com Arco Luminoso */}
        <div className="relative h-44 sm:h-48 rounded-2xl bg-[#050811] border border-amber-400/45 overflow-hidden flex items-center justify-around px-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] z-20">
          <img
            src="/dossiers/world_map_bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
          />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 160">
            <defs>
              <filter id="revArcGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 75 100 Q 200 18 325 100"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeDasharray="7 4"
              filter="url(#revArcGlow)"
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_20px_#fbbf24] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-white bg-[#060A12]/90 border border-amber-400/40 px-3 py-1 rounded-full">
              {sourceName}
            </span>
            <span className="text-[11px] font-mono text-amber-300">{sourceYear}</span>
          </div>

          <div className="relative z-10 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]">
            <GitCommit className="w-5 h-5" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_20px_#22d3ee]" />
            <span className="text-xs sm:text-sm font-bold text-white bg-[#060A12]/90 border border-cyan-400/40 px-3 py-1 rounded-full">
              {targetNames.join(' & ') || 'Ponto Conectado'}
            </span>
            <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Conexão Ativa
            </span>
          </div>
        </div>

        {/* Síntese Progressiva da Descoberta */}
        <div className="relative z-20 text-left bg-[#060A12]/90 border border-amber-500/30 p-4 sm:p-5 rounded-xl shadow-inner space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300 font-bold">
            REGISTRO PERICIAL DO COMPÊNDIO
          </div>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed">
            {conclusion}
          </p>
        </div>

        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {onInspectMap && (
            <GameIconButton
              onClick={onInspectMap}
              icon={<Globe className="w-4 h-4 text-cyan-300" />}
              className="w-full sm:w-auto px-5 py-2.5"
            >
              Inspecionar Arco no Mapa
            </GameIconButton>
          )}
          <GameButton
            size="lg"
            soundType="discovery"
            onClick={onClose}
            rightIcon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            className="w-full sm:w-auto"
          >
            Prosseguir Operação
          </GameButton>
        </div>
      </div>
    </CinematicModal>
  );
};
