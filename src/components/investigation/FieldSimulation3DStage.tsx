import React, { useState, useEffect } from 'react';
import {
  SimulationChoice,
  HistoricalNode,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import {
  Info,
  FolderOpen,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  Scale,
  RotateCcw,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

interface FieldSimulation3DStageProps {
  selectedCase: HistoricalNode;
  choices: SimulationChoice[];
  selectedDecisionId: string | undefined;
  expandedChoiceId: string | null;
  onToggleExpandChoice: (id: string) => void;
  onSelectDecision: (choiceId: string) => void;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onOpenArchiveDrawer: () => void;
  onSwitchTo2D: () => void;
}

export const FieldSimulation3DStage: React.FC<FieldSimulation3DStageProps> = ({
  selectedCase,
  choices,
  selectedDecisionId,
  expandedChoiceId,
  onToggleExpandChoice,
  onSelectDecision,
  onSelectStep,
  onOpenArchiveDrawer,
  onSwitchTo2D,
}) => {
  const [camRotX, setCamRotX] = useState<number>(6);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.02);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [muted, setMuted] = useState(() => soundEngine.getSettings().mutedAll);

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();
    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 4.5);
      setCamRotX(6 + Math.cos(elapsed * 0.8) * 2.5);
      frameId = requestAnimationFrame(animateOrbit);
    };
    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  return (
    <div className="relative min-h-[92vh] w-full bg-[#04060B] select-none font-sans space-y-5 pb-12">
      {/* 1. HUD SUPERIOR DA SIMULAÇÃO DE CAMPO */}
      <div className="rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-slate-800 p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
                {caseShortHeader} ({selectedCase.name})
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                Etapa 4 — Simulação de Campo Histórica (Tomada de Decisão)
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setBriefingOpen(o => !o);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                briefingOpen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#0B1320] border-slate-700 text-slate-300 hover:border-amber-400/50'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Contexto</span>
            </button>

            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-3 py-1.5 rounded-xl bg-[#0B1320] hover:bg-[#131D31] border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>[ Modo 2D ]</span>
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-3 py-1.5 rounded-xl bg-[#0B1320] hover:bg-[#131D31] border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Arquivo</span>
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="p-1.5 rounded-xl bg-[#0B1320] border border-slate-700 text-cyan-300 hover:text-white cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {briefingOpen && (
          <div className="p-4 rounded-xl bg-[#050811] border border-amber-500/35 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start justify-between gap-4 animate-in fade-in duration-150">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                DILEMA HISTÓRICO DE CAMPO
              </div>
              <p>{selectedCase.simulationPrompt}</p>
            </div>
            <button
              type="button"
              onClick={() => setBriefingOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. CENÁRIO 3D: TENDA DE CAMPANHA MILITAR / MESA DE COMANDO NA LAMA */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-amber-500/40 bg-[#070B14] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          <img
            src="/dossiers/field_simulation_3d_clean.webp"
            alt="Simulação de Campo Histórica"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
            style={{
              filter: 'brightness(0.92) contrast(1.08)',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 68% 45%, rgba(251, 191, 36, 0.18) 0%, rgba(180, 83, 9, 0.08) 35%, transparent 75%)',
            }}
          />
        </div>

        <div className="relative z-30 p-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className={`px-3 py-1 rounded-xl backdrop-blur-md border text-xs font-mono cursor-pointer transition-all ${
              isAutoOrbiting
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                : 'bg-[#0B111E]/85 border-cyan-500/40 text-cyan-300 hover:border-amber-400/60'
            }`}
          >
            [ {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar Tenda 3D'} ]
          </button>

          {(camRotX !== 6 || camRotY !== 0 || camScale !== 1.02) && (
            <button
              type="button"
              onClick={() => {
                setIsAutoOrbiting(false);
                setCamRotX(6);
                setCamRotY(0);
                setCamScale(1.02);
              }}
              className="p-1.5 rounded-xl bg-[#0B111E]/85 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Centralizar Câmera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Ordens Militares de Campanha Sobre a Mesa */}
        <div className="relative z-20 p-5 sm:p-8 lg:p-10 space-y-6">
          <div className="border-b border-amber-500/30 pb-4 flex flex-wrap items-center justify-between gap-3 bg-[#0B1322]/85 backdrop-blur-md p-4 rounded-xl">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> DILEMA ESTRATÉGICO // PONTO DE DECISÃO
              </span>
              <h3 className="font-sans text-lg sm:text-2xl font-bold text-white">
                Diante do padrão identificado, qual ordem tática você assina?
              </h3>
              <p className="text-sm text-amber-100/90 leading-relaxed max-w-4xl pt-1">
                {selectedCase.simulationPrompt}
              </p>
            </div>

            {selectedDecisionId && (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                <span>DECISÃO REGISTRADA</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {choices.map(choice => {
              const isSelected = selectedDecisionId === choice.id;
              const isExpanded = expandedChoiceId === choice.id;

              return (
                <div
                  key={choice.id}
                  onClick={() => onSelectDecision(choice.id)}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)]'
                      : 'bg-[#080E1A]/90 backdrop-blur-md border-slate-700/80 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center font-sans font-bold text-base text-amber-300 shrink-0">
                        {choice.tag}
                      </span>
                      <div>
                        <span className="font-sans text-base sm:text-lg font-bold text-white block">
                          {choice.title}
                        </span>
                        <span className="text-xs sm:text-sm font-mono text-cyan-300">
                          {choice.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onToggleExpandChoice(choice.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                      >
                        {isExpanded ? 'Ocultar detalhes' : 'Ver consequências'}
                      </button>

                      {isSelected ? (
                        <span className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>DECISÃO REGISTRADA</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
                        >
                          Assinar Ordem {choice.tag} →
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                        {choice.description}
                      </p>
                      <div className="text-xs font-mono text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/25">
                        Impacto Simulado: Altera o vetor de decisão estratégica e atualiza as métricas do laudo final.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. NAVEGAÇÃO DE ETAPA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1320]/95 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => onSelectStep(3)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
        >
          ← Voltar à Sala de Análise (Etapa 3)
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playCaseConclusion();
            onSelectStep(5);
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Avançar para Etapa 5: Consequências & Laudo</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
