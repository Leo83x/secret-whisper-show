import React, { useState, useEffect, useRef } from 'react';
import {
  ConnectionChallenge,
  EvidenceClue,
  HistoricalNode,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import {
  Info,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  ArrowRight,
  RotateCcw,
  Layers,
  X,
  Link2,
  GitCommit,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

export interface ExtractedClueItem extends EvidenceClue {
  docTitle: string;
  docCode: string;
}

interface CrossExamination3DStageProps {
  selectedCase: HistoricalNode;
  challenges: ConnectionChallenge[];
  activeChallenge: ConnectionChallenge | undefined;
  solvedConnectionIds: string[];
  extractedCluesList: ExtractedClueItem[];
  allCaseClues: ExtractedClueItem[];
  boardSelectedClues: string[];
  connectionFeedback: {
    type: 'success' | 'error';
    title?: string;
    message: string;
    unlockedMap?: boolean;
  } | null;
  activeStep: 1 | 2 | 3 | 4 | 5;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onSelectChallenge: (challengeId: string) => void;
  onToggleBoardClue: (clueId: string) => void;
  onValidateConnection: () => void;
  onOpenArchiveDrawer: () => void;
  onSwitchTo2D: () => void;
  onRequestExit: () => void;
}

export const CrossExamination3DStage: React.FC<CrossExamination3DStageProps> = ({
  selectedCase,
  challenges,
  activeChallenge,
  solvedConnectionIds,
  extractedCluesList,
  allCaseClues,
  boardSelectedClues,
  connectionFeedback,
  onSelectStep,
  onSelectChallenge,
  onToggleBoardClue,
  onValidateConnection,
  onOpenArchiveDrawer,
  onSwitchTo2D,
}) => {
  const [camRotX, setCamRotX] = useState<number>(8);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.02);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);

  const [briefingOpen, setBriefingOpen] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(() => soundEngine.getSettings().mutedAll);

  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [threadCoords, setThreadCoords] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isSolved: boolean;
  } | null>(null);

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 5.5);
      setCamRotX(8 + Math.cos(elapsed * 0.8) * 3.5);
      setCamScale(1.04 + Math.sin(elapsed * 0.5) * 0.02);
      frameId = requestAnimationFrame(animateOrbit);
    };

    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const isActiveChallengeSolved = Boolean(
    activeChallenge && solvedConnectionIds.includes(activeChallenge.id)
  );

  const availableClues = extractedCluesList.length >= 2 ? extractedCluesList : allCaseClues;

  useEffect(() => {
    const updateThread = () => {
      const container = boardContainerRef.current;
      if (!container) {
        setThreadCoords(null);
        return;
      }

      const activePairIds =
        isActiveChallengeSolved && activeChallenge?.requiredClueIds?.length === 2
          ? activeChallenge.requiredClueIds
          : boardSelectedClues;

      if (activePairIds.length !== 2) {
        setThreadCoords(null);
        return;
      }

      const elA = cardRefs.current[activePairIds[0]];
      const elB = cardRefs.current[activePairIds[1]];
      if (!elA || !elB) {
        setThreadCoords(null);
        return;
      }

      const cRect = container.getBoundingClientRect();
      const rA = elA.getBoundingClientRect();
      const rB = elB.getBoundingClientRect();

      if (cRect.width === 0 || cRect.height === 0) return;

      setThreadCoords({
        x1: ((rA.left + rA.width / 2 - cRect.left) / cRect.width) * 100,
        y1: ((rA.top + 16 - cRect.top) / cRect.height) * 100,
        x2: ((rB.left + rB.width / 2 - cRect.left) / cRect.width) * 100,
        y2: ((rB.top + 16 - cRect.top) / cRect.height) * 100,
        isSolved: isActiveChallengeSolved,
      });
    };

    const timer = setTimeout(updateThread, 80);
    window.addEventListener('resize', updateThread);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateThread);
    };
  }, [boardSelectedClues, activeChallenge, isActiveChallengeSolved, availableClues.length]);

  const resetCamera = () => {
    setIsAutoOrbiting(false);
    setCamRotX(8);
    setCamRotY(0);
    setCamScale(1.02);
  };

  const slotAClue = availableClues.find(c => c.id === boardSelectedClues[0]);
  const slotBClue = availableClues.find(c => c.id === boardSelectedClues[1]);

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  return (
    <div className="relative min-h-[92vh] w-full bg-[#04060B] select-none font-sans space-y-5 pb-12">
      {/* 1. HUD SUPERIOR DA MESA DE CRUZAMENTO */}
      <div className="rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-slate-800 p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Link2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
                {caseShortHeader} ({selectedCase.name})
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                Etapa 2 — Mesa de Cruzamento Tátil (Conectar Evidências)
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
              <span>Briefing</span>
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
              <span>
                Arquivo ({extractedCluesList.length}/{allCaseClues.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBankerLampOn(v => !v)}
              className="p-1.5 rounded-xl bg-[#0B1320] border border-slate-700 text-amber-300 hover:text-white cursor-pointer"
              title="Luminária de Mesa"
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="p-1.5 rounded-xl bg-[#0B1320] border border-slate-700 text-cyan-300 hover:text-white cursor-pointer"
              title={muted ? 'Reativar Áudio' : 'Silenciar'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {briefingOpen && (
          <div className="p-4 rounded-xl bg-[#050811] border border-amber-500/35 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start justify-between gap-4 animate-in fade-in duration-150">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                OBJETIVO TÁTICO DA ETAPA 2
              </div>
              <p>{selectedCase.PeriodSummary}</p>
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

      {/* 2. SELETOR DE VÍNCULOS DA OPERAÇÃO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1320]/95 border border-amber-500/35 space-y-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              Vínculos da Operação ({solvedConnectionIds.length}/{challenges.length} Comprovados)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {challenges.map(ch => {
              const isSolved = solvedConnectionIds.includes(ch.id);
              const isCurrent = activeChallenge?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playDocumentOpen();
                    onSelectChallenge(ch.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : isSolved
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-[#060A12] border-slate-700 text-slate-300 hover:border-amber-400/50'
                  }`}
                >
                  <span>Vínculo #{ch.stepNumber}</span>
                  {isSolved && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-base sm:text-lg font-sans font-bold text-white leading-relaxed">
          {activeChallenge?.question}
        </div>
      </div>

      {/* 3. MESA TRIDIMENSIONAL DE CRUZAMENTO TÁTIL COM FIOS E PINOS METÁLICOS */}
      <div
        ref={boardContainerRef}
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
            src="/dossiers/evidence_board_3d_clean.webp"
            alt="Mesa de Investigação"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
            style={{
              filter: bankerLampOn
                ? 'brightness(0.95) contrast(1.06)'
                : 'brightness(0.65) contrast(1.1) saturate(0.85)',
            }}
          />

          {bankerLampOn && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 75% 30%, rgba(251, 191, 36, 0.16) 0%, rgba(16, 185, 129, 0.06) 40%, transparent 75%)',
              }}
            />
          )}
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
            [ {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar Mesa 3D'} ]
          </button>

          {(camRotX !== 8 || camRotY !== 0 || camScale !== 1.02) && (
            <button
              type="button"
              onClick={resetCamera}
              className="p-1.5 rounded-xl bg-[#0B111E]/85 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Centralizar Mesa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {threadCoords && (
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full z-20 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="evidence-thread-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <line
              x1={`${threadCoords.x1}%`}
              y1={`${threadCoords.y1 + 2}%`}
              x2={`${threadCoords.x2}%`}
              y2={`${threadCoords.y2 + 2}%`}
              stroke="rgba(0,0,0,0.85)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1={`${threadCoords.x1}%`}
              y1={`${threadCoords.y1}%`}
              x2={`${threadCoords.x2}%`}
              y2={`${threadCoords.y2}%`}
              stroke={threadCoords.isSolved ? '#34d399' : '#f59e0b'}
              strokeWidth="3.5"
              strokeDasharray={threadCoords.isSolved ? 'none' : '8 5'}
              filter="url(#evidence-thread-glow)"
              strokeLinecap="round"
            />
          </svg>
        )}

        <div className="relative z-20 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {availableClues.map((clue, idx) => {
              const slotIdx = boardSelectedClues.indexOf(clue.id);
              const isPicked = slotIdx !== -1;
              const isSolvedClue =
                isActiveChallengeSolved &&
                activeChallenge?.requiredClueIds?.includes(clue.id);

              const tilts = [-1.5, 1.2, -0.8, 1.6, -1.2, 0.9];
              const rot = tilts[idx % tilts.length];

              return (
                <div
                  key={clue.id}
                  ref={el => {
                    cardRefs.current[clue.id] = el;
                  }}
                  onClick={() => {
                    if (!isActiveChallengeSolved) {
                      soundEngine.playDocumentOpen();
                      onToggleBoardClue(clue.id);
                    }
                  }}
                  style={{
                    transform: `rotate(${isPicked ? 0 : rot}deg)`,
                  }}
                  className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xl flex flex-col justify-between gap-3 ${
                    isSolvedClue
                      ? 'bg-[#0A221C]/95 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                      : isPicked
                      ? slotIdx === 0
                        ? 'bg-[#1C150A]/95 border-2 border-amber-400 scale-[1.02] shadow-[0_0_25px_rgba(245,158,11,0.45)]'
                        : 'bg-[#091C24]/95 border-2 border-cyan-400 scale-[1.02] shadow-[0_0_25px_rgba(6,182,212,0.45)]'
                      : 'bg-[#0D1524]/90 border-slate-700/80 hover:border-amber-400/60 hover:-translate-y-1'
                  }`}
                >
                  <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-950 shadow-md ${
                      isSolvedClue
                        ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                        : isPicked
                        ? slotIdx === 0
                          ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                          : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                        : 'bg-amber-600'
                    }`}
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono uppercase text-amber-400/90 font-bold">
                      <span className="truncate">{clue.docCode.split('//')[0]}</span>
                      {isPicked && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            slotIdx === 0
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-cyan-400 text-slate-950'
                          }`}
                        >
                          PINO {slotIdx === 0 ? 'A' : 'B'}
                        </span>
                      )}
                    </div>

                    <div className="text-base font-sans font-bold text-white leading-snug">
                      {clue.title}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1.5 border-t border-slate-800/80">
                      "{clue.excerpt}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{clue.analysisNote || 'Registro primário'}</span>
                    <span className={isPicked ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                      {isPicked ? 'Selecionada' : 'Toque para confrontar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. LIGAÇÃO VISUAL & BOTÃO: CONFRONTAR EVIDÊNCIAS NA MESA */}
          {!isActiveChallengeSolved && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div
                  className={`flex-1 p-3.5 rounded-xl border text-xs sm:text-sm ${
                    slotAClue
                      ? 'bg-amber-500/15 border-amber-400 text-white font-semibold'
                      : 'bg-[#0B1320] border-dashed border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-amber-400 font-mono text-[10px] block uppercase font-bold mb-0.5">
                    Evidência Posição A
                  </span>
                  <span className="line-clamp-1">
                    {slotAClue ? slotAClue.title : 'Selecione a 1ª evidência na mesa'}
                  </span>
                </div>

                <div className="hidden sm:flex items-center justify-center px-1 text-amber-400">
                  <Link2 className="w-5 h-5" />
                </div>

                <div
                  className={`flex-1 p-3.5 rounded-xl border text-xs sm:text-sm ${
                    slotBClue
                      ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold'
                      : 'bg-[#0B1320] border-dashed border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-cyan-400 font-mono text-[10px] block uppercase font-bold mb-0.5">
                    Evidência Posição B
                  </span>
                  <span className="line-clamp-1">
                    {slotBClue ? slotBClue.title : 'Selecione a 2ª evidência na mesa'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onValidateConnection}
                  disabled={boardSelectedClues.length !== 2}
                  className={`px-6 py-3.5 rounded-xl font-sans font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shrink-0 ${
                    boardSelectedClues.length === 2
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.45)] cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  CONFRONTAR EVIDÊNCIAS NA MESA
                </button>
              </div>

              {connectionFeedback && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 text-sm leading-relaxed ${
                    connectionFeedback.type === 'success'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100'
                      : 'bg-red-950/60 border-red-500/50 text-red-100'
                  }`}
                >
                  {connectionFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {connectionFeedback.title && (
                      <div className="font-bold text-white mb-0.5">
                        {connectionFeedback.title}
                      </div>
                    )}
                    <p>{connectionFeedback.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {isActiveChallengeSolved && activeChallenge && (
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 space-y-2 shadow-2xl">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vínculo Comprovado na Mesa (+{activeChallenge.xpReward} XP)</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {activeChallenge.successTitle}
              </div>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {activeChallenge.successConclusion}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. NAVEGAÇÃO & AVANÇO DE ETAPA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1320]/95 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => onSelectStep(1)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
        >
          ← Voltar ao Arquivo Histórico (Etapa 1)
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playDocumentOpen();
            onSelectStep(3);
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Avançar para Etapa 3: Formular Hipótese</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
