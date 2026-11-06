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
  FileSearch,
  Lightbulb,
} from 'lucide-react';

interface ExtractedClueItem extends EvidenceClue {
  docTitle: string;
  docCode: string;
}

interface EvidenceBoard3DStageProps {
  selectedCase: HistoricalNode;
  challenges: ConnectionChallenge[];
  activeChallenge: ConnectionChallenge | undefined;
  solvedConnectionIds: string[];
  extractedCluesList: ExtractedClueItem[];
  allCaseCluesCount: number;
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

export const EvidenceBoard3DStage: React.FC<EvidenceBoard3DStageProps> = ({
  selectedCase,
  challenges,
  activeChallenge,
  solvedConnectionIds,
  extractedCluesList,
  allCaseCluesCount,
  boardSelectedClues,
  connectionFeedback,
  activeStep,
  onSelectStep,
  onSelectChallenge,
  onToggleBoardClue,
  onValidateConnection,
  onOpenArchiveDrawer,
  onSwitchTo2D,
  onRequestExit,
}) => {
  // 3D Camera Tilt, Orbit & Zoom State
  const [camRotX, setCamRotX] = useState<number>(8);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.03);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);

  // HUD Sub-levels
  const [briefingOpen, setBriefingOpen] = useState<boolean>(false);
  const [stepMenuOpen, setStepMenuOpen] = useState<boolean>(false);
  const [expandedClueId, setExpandedClueId] = useState<string | null>(null);
  const [muted, setMuted] = useState<boolean>(() => soundEngine.getSettings().mutedAll);

  // Dynamic SVG string line coordinates between selected cards on the 3D board
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

  // Automatic camera orbit when [ Orbitar Câmera ] is toggled
  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 5.5);
      setCamRotX(8 + Math.cos(elapsed * 0.8) * 3.5);
      setCamScale(1.05 + Math.sin(elapsed * 0.5) * 0.02);
      frameId = requestAnimationFrame(animateOrbit);
    };

    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const isActiveChallengeSolved = Boolean(
    activeChallenge && solvedConnectionIds.includes(activeChallenge.id)
  );

  // Compute red/gold thread coordinates between the 2 selected cards (or the 2 solved cards)
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
        y1: ((rA.top + 14 - cRect.top) / cRect.height) * 100,
        x2: ((rB.left + rB.width / 2 - cRect.left) / cRect.width) * 100,
        y2: ((rB.top + 14 - cRect.top) / cRect.height) * 100,
        isSolved: isActiveChallengeSolved,
      });
    };

    const timer = setTimeout(updateThread, 60);
    window.addEventListener('resize', updateThread);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateThread);
    };
  }, [
    boardSelectedClues,
    activeChallenge,
    isActiveChallengeSolved,
    extractedCluesList.length,
    expandedClueId,
  ]);

  const resetCamera = () => {
    setIsAutoOrbiting(false);
    setCamRotX(8);
    setCamRotY(0);
    setCamScale(1.03);
  };

  const slotAClue = extractedCluesList.find(c => c.id === boardSelectedClues[0]);
  const slotBClue = extractedCluesList.find(c => c.id === boardSelectedClues[1]);

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  return (
    <div className="fixed inset-0 z-40 w-screen h-[100dvh] bg-[#04060B] overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* =====================================================================
          1. CAMADA DE FUNDO 3D REALISTA (MESA TOPOGRÁFICA DE INVESTIGAÇÃO)
         ===================================================================== */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        <div
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 55%',
            transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          <img
            src="/dossiers/evidence_board_3d_clean.webp"
            onError={e => {
              const img = e.currentTarget;
              if (!img.src.endsWith('/dossiers/archive_room_3d_clean.webp')) {
                img.src = '/dossiers/archive_room_3d_clean.webp';
              }
            }}
            alt="Mesa Topográfica de Investigação 3D"
            draggable={false}
            className="w-full h-full object-cover object-center transition-all duration-500"
            style={{
              filter: bankerLampOn
                ? 'brightness(0.88) contrast(1.08)'
                : 'brightness(0.55) contrast(1.12) saturate(0.8)',
            }}
          />

          {/* Iluminação Volumétrica Quente sobre a Mesa */}
          {bankerLampOn && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.16) 0%, rgba(6, 182, 212, 0.06) 42%, rgba(4, 6, 11, 0.72) 90%)',
              }}
            />
          )}
        </div>
      </div>

      {/* =====================================================================
          2. HUD SUPERIOR UNIFICADO (SEM SOBREPOSIÇÃO NO MOBILE OU DESKTOP)
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-30 w-full p-2.5 sm:p-4 md:p-5 shrink-0"
      >
        {/* --- VERSÃO MOBILE (< md): 2 Linhas Compactas --- */}
        <div className="md:hidden rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-slate-800/90 p-2.5 shadow-2xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
                MESA 3D // {selectedCase.name}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setBankerLampOn(v => !v)}
                className="p-1.5 rounded-lg bg-[#0B111E] border border-slate-700/80 text-amber-300 cursor-pointer"
                title="Alternar Luz da Mesa"
              >
                <Lightbulb className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
                className="p-1.5 rounded-lg bg-[#0B111E] border border-slate-700/80 text-cyan-300 cursor-pointer"
              >
                {muted ? (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={onRequestExit}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-b from-[#DFBF76] to-[#B69146] text-slate-950 font-sans font-bold text-[11px] border border-amber-200/60 shadow-md cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setBriefingOpen(o => !o);
                setStepMenuOpen(false);
              }}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-sans flex items-center justify-center gap-1 cursor-pointer truncate ${
                briefingOpen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#0B111E] border-slate-700/80 text-slate-200'
              }`}
            >
              <Info className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Briefing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setStepMenuOpen(o => !o);
                setBriefingOpen(false);
              }}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-sans flex items-center justify-center gap-1 cursor-pointer truncate ${
                stepMenuOpen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#0B111E] border-amber-500/40 text-amber-300 font-semibold'
              }`}
            >
              <span className="truncate">2. Conectar</span>
              <Layers className="w-3 h-3 text-amber-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-2 py-1.5 rounded-lg bg-[#0B111E] border border-cyan-500/40 text-[11px] font-sans text-cyan-300 font-semibold flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              <span className="truncate">Modo 2D</span>
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-2 py-1.5 rounded-lg bg-[#0B111E] border border-slate-700/80 text-[11px] font-sans text-amber-300 font-bold flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              <FolderOpen className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                {extractedCluesList.length}/{allCaseCluesCount}
              </span>
            </button>
          </div>

          {briefingOpen && (
            <div className="p-3 rounded-xl bg-[#0B1324] border border-amber-500/40 text-xs text-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  BRIEFING // {selectedCase.location} ({selectedCase.year})
                </span>
                <button
                  type="button"
                  onClick={() => setBriefingOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="leading-relaxed text-slate-300">{selectedCase.PeriodSummary}</p>
            </div>
          )}

          {stepMenuOpen && (
            <div className="p-1.5 rounded-xl bg-[#0B1324] border border-slate-700 grid grid-cols-1 gap-1">
              {(
                [
                  { id: 1, label: '1. Observar — Arquivo Histórico (3D)' },
                  { id: 2, label: '2. Conectar — Mesa Topográfica (3D)' },
                  { id: 3, label: '3. Hipótese — Sala de Análise' },
                  { id: 4, label: '4. Decidir — Ponto de Decisão' },
                  { id: 5, label: '5. Consequências — Relatório Final' },
                ] as const
              ).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStepMenuOpen(false);
                    onSelectStep(s.id);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-sans flex items-center justify-between cursor-pointer ${
                    activeStep === s.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{s.label}</span>
                  {activeStep === s.id && (
                    <span className="text-[10px] font-mono text-amber-400">ATIVA</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- VERSÃO DESKTOP (>= md): HUD Diegético Esquerda/Direita --- */}
        <div className="hidden md:flex items-start justify-between gap-4">
          <div className="flex flex-col items-start gap-2 max-w-xl">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#080C14]/90 backdrop-blur-md border border-amber-500/35 shadow-lg">
              <h1 className="font-serif text-base lg:text-lg font-bold tracking-wide text-[#EAD29C] uppercase">
                {caseShortHeader} — MESA TOPOGRÁFICA 3D
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setBriefingOpen(o => !o);
                  setStepMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0B111E]/90 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-amber-400/60 text-xs font-sans text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span className="text-amber-400 font-serif italic font-bold">[ i</span>
                <span>Briefing</span>
                <span className="text-amber-400 font-serif">]</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setStepMenuOpen(o => !o);
                  setBriefingOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#0B111E]/90 hover:bg-[#131D31] backdrop-blur-md border border-amber-500/40 text-xs font-sans text-slate-200 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>
                  <strong className="text-amber-400">2. Conectar</strong> Evidências (Mesa 3D)
                </span>
                <Layers className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {briefingOpen && (
              <div className="mt-1 p-4 rounded-xl bg-[#080D18]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    BRIEFING DA OPERAÇÃO // {selectedCase.location} ({selectedCase.year})
                  </span>
                  <button
                    type="button"
                    onClick={() => setBriefingOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p>{selectedCase.PeriodSummary}</p>
              </div>
            )}

            {stepMenuOpen && (
              <div className="mt-1 p-2 rounded-xl bg-[#080D18]/95 backdrop-blur-xl border border-slate-700 shadow-2xl w-72 space-y-1">
                {(
                  [
                    { id: 1, label: '1. Observar — Arquivo Histórico (3D)' },
                    { id: 2, label: '2. Conectar — Mesa Topográfica (3D)' },
                    { id: 3, label: '3. Hipótese — Sala de Análise' },
                    { id: 4, label: '4. Decidir — Ponto de Decisão' },
                    { id: 5, label: '5. Consequências — Relatório Final' },
                  ] as const
                ).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStepMenuOpen(false);
                      onSelectStep(s.id);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-sans flex items-center justify-between cursor-pointer ${
                      activeStep === s.id
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <span>{s.label}</span>
                    {activeStep === s.id && (
                      <span className="text-[10px] font-mono text-amber-400">ATIVA</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B111E]/90 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-amber-400/60 text-xs sm:text-sm font-sans text-slate-200 cursor-pointer shadow-lg"
            >
              <span className="text-amber-400">[</span> Alternar:{' '}
              <strong className="text-amber-300">Mesa 3D</strong> / Modo 2D{' '}
              <span className="text-amber-400">]</span>
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B111E]/90 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-cyan-400/60 text-xs sm:text-sm font-sans text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <span className="text-amber-400">[</span>
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Arquivo Pessoal:{' '}
                <strong className="text-amber-300">
                  {extractedCluesList.length}/{allCaseCluesCount}
                </strong>{' '}
                Pistas
              </span>
              <span className="text-amber-400">]</span>
            </button>

            <button
              type="button"
              onClick={() => setBankerLampOn(v => !v)}
              className="p-2 rounded-lg bg-[#0B111E]/90 hover:bg-[#131D31] backdrop-blur-md border border-slate-700/80 text-amber-300 cursor-pointer shadow-lg"
              title="Alternar Luminária da Mesa"
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="p-2 rounded-lg bg-[#0B111E]/90 hover:bg-[#131D31] backdrop-blur-md border border-slate-700/80 text-cyan-300 cursor-pointer shadow-lg"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onRequestExit}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-[#DFBF76] to-[#B69146] hover:from-[#EAD08E] hover:to-[#C8A252] text-slate-950 font-sans font-bold text-xs sm:text-sm border border-amber-200/60 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              Sair da Operação
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. SUPERFÍCIE INTERATIVA DA MESA TOPOGRÁFICA 3D (FICHAS + FIOS)
         ===================================================================== */}
      <div className="relative z-20 flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-6 overflow-y-auto py-1 flex flex-col justify-between gap-3">
        {/* Seletor de Vínculos (1, 2, 3) + Pergunta Ativa na Borda Superior da Mesa */}
        <div className="rounded-2xl bg-[#070B14]/90 backdrop-blur-md border border-amber-500/35 p-3 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.85)] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <GitCommit className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                Vínculos da Operação ({solvedConnectionIds.length}/{challenges.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
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
                    className={`px-2.5 sm:px-3 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.45)]'
                        : isSolved
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#0C1322] border-slate-700 text-slate-300 hover:border-amber-400/50'
                    }`}
                  >
                    <span>Vínculo #{ch.stepNumber}</span>
                    {isSolved && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs sm:text-base font-sans font-bold text-white leading-snug">
            {activeChallenge?.question}
          </div>
        </div>

        {/* Tabuleiro Físico 3D Onde as Fichas e os Fios Luminosos São Posicionados */}
        <div
          ref={boardContainerRef}
          style={{ perspective: '1000px' }}
          className="relative flex-1 flex flex-col justify-center"
        >
          {/* SVG Dinâmico de Fio de Investigação (Conecta Fisicamente os 2 Pinos na Mesa) */}
          {threadCoords && (
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full z-30 overflow-visible"
               preserveAspectRatio="none"
            >
              <defs>
                <filter id="glow-thread" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Sombra projetada do fio sobre a madeira da mesa */}
              <line
                x1={`${threadCoords.x1}%`}
                y1={`${threadCoords.y1 + 2}%`}
                x2={`${threadCoords.x2}%`}
                y2={`${threadCoords.y2 + 2}%`}
                stroke="rgba(0,0,0,0.75)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Fio físico esticado entre os 2 pinos */}
              <line
                x1={`${threadCoords.x1}%`}
                y1={`${threadCoords.y1}%`}
                x2={`${threadCoords.x2}%`}
                y2={`${threadCoords.y2}%`}
                stroke={threadCoords.isSolved ? '#34d399' : '#f59e0b'}
                strokeWidth="3"
                strokeDasharray={threadCoords.isSolved ? 'none' : '8 5'}
                filter="url(#glow-thread)"
                strokeLinecap="round"
              />
              <circle
                cx={`${threadCoords.x1}%`}
                cy={`${threadCoords.y1}%`}
                r="6"
                fill={threadCoords.isSolved ? '#10b981' : '#fbbf24'}
                stroke="#04060B"
                strokeWidth="2"
              />
              <circle
                cx={`${threadCoords.x2}%`}
                cy={`${threadCoords.y2}%`}
                r="6"
                fill={threadCoords.isSolved ? '#10b981' : '#22d3ee'}
                stroke="#04060B"
                strokeWidth="2"
              />
            </svg>
          )}

          {/* Caso o vínculo atual já esteja comprovado, mostra o selo de síntese + fichas */}
          {isActiveChallengeSolved && activeChallenge && (
            <div className="mb-3 p-3.5 sm:p-4 rounded-2xl bg-emerald-950/80 backdrop-blur-md border border-emerald-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.85)] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  VÍNCULO COMPROVADO NA MESA (+{activeChallenge.xpReward} XP)
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {activeChallenge.successTitle}
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {activeChallenge.conclusionText}
              </p>
            </div>
          )}

          {/* Se o jogador ainda não extraiu 2 pistas na Etapa 1 */}
          {extractedCluesList.length < 2 ? (
            <div className="p-6 rounded-2xl bg-[#070B14]/90 backdrop-blur-md border border-amber-500/40 text-center space-y-3 max-w-lg mx-auto shadow-2xl">
              <FileSearch className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-sm sm:text-base font-bold text-white">
                Você possui {extractedCluesList.length} pista(s) posicionada(s) na mesa
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para esticar o fio de conexão entre 2 evidências físicas, inspecione os documentos no{' '}
                <strong>Arquivo Histórico 3D (Etapa 1)</strong> e guarde pelo menos 2 pistas.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectStep(1)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  ← Voltar ao Arquivo 3D (Etapa 1)
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStep(3)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                >
                  Avançar sem comprovar →
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                transform: `rotateX(${Math.max(0, camRotX * 0.45)}deg)`,
                transformStyle: 'preserve-3d',
              }}
              className="space-y-3"
            >
              {/* Grade de Fichas Físicas Pregadas com Pino sobre a Mesa 3D */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                {extractedCluesList.map((clue, idx) => {
                  const slotIdx = boardSelectedClues.indexOf(clue.id);
                  const isPicked = slotIdx !== -1;
                  const isSolvedClue =
                    isActiveChallengeSolved &&
                    activeChallenge?.requiredClueIds?.includes(clue.id);
                  const isExpanded = expandedClueId === clue.id;
                  const tiltAngles = [-1.2, 1.0, -0.8, 1.3, -1.0, 0.9];
                  const tilt = tiltAngles[idx % tiltAngles.length];

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
                        transform: `rotateZ(${isPicked ? 0 : tilt}deg)`,
                      }}
                      className={`relative pt-4 pb-3 px-3 sm:px-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-[0_12px_28px_rgba(0,0,0,0.85)] ${
                        isSolvedClue
                          ? 'bg-[#0B1E1A]/95 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                          : isPicked
                          ? slotIdx === 0
                            ? 'bg-[#17130A]/95 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.45)] -translate-y-1'
                            : 'bg-[#091821]/95 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.45)] -translate-y-1'
                          : 'bg-[#0B111E]/92 border-slate-700/90 hover:border-amber-400/60 hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Pino Metálico 3D no Topo da Ficha */}
                      <div
                        className={`absolute top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-slate-950 shadow-md ${
                          isSolvedClue
                            ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                            : isPicked
                            ? slotIdx === 0
                              ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                              : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                            : 'bg-amber-600/80'
                        }`}
                      />

                      <div className="flex items-center justify-between gap-1 text-[10px] font-mono uppercase text-amber-400/90 mb-1">
                        <span className="truncate">{clue.docCode.split('//')[0]}</span>
                        {isPicked && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              slotIdx === 0
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-cyan-400 text-slate-950'
                            }`}
                          >
                            PINO {slotIdx === 0 ? 'A' : 'B'}
                          </span>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm font-sans font-bold text-white leading-snug line-clamp-2">
                        {clue.title}
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setExpandedClueId(isExpanded ? null : clue.id);
                          }}
                          className="text-[10px] font-mono text-cyan-300 hover:text-amber-300 underline cursor-pointer"
                        >
                          {isExpanded ? 'Ocultar trecho' : 'Ler trecho'}
                        </button>
                        <span className="text-[10px] font-mono text-slate-400">
                          {isPicked ? 'Conectada' : 'Toque p/ pinçar'}
                        </span>
                      </div>

                      {isExpanded && (
                        <p className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-200 leading-relaxed">
                          "{clue.excerpt}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Barra Diegética de Conexão [ Pino A ] ─── 🔗 ─── [ Pino B ] */}
              {!isActiveChallengeSolved && (
                <div className="p-3 sm:p-4 rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-amber-500/40 shadow-2xl space-y-2.5">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    <div
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs truncate ${
                        slotAClue
                          ? 'bg-amber-500/15 border-amber-400 text-white font-semibold'
                          : 'bg-[#0B111E] border-dashed border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-amber-400 font-mono text-[10px] mr-1.5">PINO A:</span>
                      {slotAClue ? slotAClue.title : 'Toque na 1ª ficha na mesa'}
                    </div>

                    <div className="hidden sm:flex items-center justify-center px-1 text-amber-400">
                      <Link2 className="w-4 h-4" />
                    </div>

                    <div
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs truncate ${
                        slotBClue
                          ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold'
                          : 'bg-[#0B111E] border-dashed border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-cyan-400 font-mono text-[10px] mr-1.5">PINO B:</span>
                      {slotBClue ? slotBClue.title : 'Toque na 2ª ficha na mesa'}
                    </div>

                    <button
                      type="button"
                      onClick={onValidateConnection}
                      disabled={boardSelectedClues.length !== 2}
                      className={`px-4 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all shrink-0 ${
                        boardSelectedClues.length === 2
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Validar Fio 🔗
                    </button>
                  </div>

                  {connectionFeedback && (
                    <div
                      className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs ${
                        connectionFeedback.type === 'success'
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100'
                          : 'bg-red-950/60 border-red-500/50 text-red-100'
                      }`}
                    >
                      {connectionFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        {connectionFeedback.title && (
                          <div className="font-bold">{connectionFeedback.title}</div>
                        )}
                        <p>{connectionFeedback.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          4. BARRA FLUTUANTE INFERIOR — ÓRBITA 3D & AVANÇO PARA ETAPA 3
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-30 w-full px-2.5 pb-2.5 pt-1 shrink-0 flex flex-wrap items-center justify-between md:justify-center gap-2"
      >
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#0B111E]/90 backdrop-blur-md border border-amber-500/40 shadow-lg text-[11px] sm:text-xs font-sans text-slate-200 flex items-center gap-2">
          <span className="hidden sm:inline">
            Conecte 2 fichas na mesa para esticar o fio de investigação
          </span>
          <span className="sm:hidden text-slate-300">Toque em 2 fichas</span>
          <span className="text-amber-400">•</span>
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className={`font-semibold cursor-pointer ${
              isAutoOrbiting ? 'text-amber-300 underline' : 'text-cyan-300 hover:text-amber-300'
            }`}
          >
            [ {isAutoOrbiting ? 'Pausar' : 'Orbitar Mesa 3D'} ]
          </button>
          {(camRotX !== 8 || camRotY !== 0 || camScale !== 1.03) && (
            <button
              type="button"
              onClick={resetCamera}
              className="text-slate-400 hover:text-white ml-0.5 cursor-pointer"
              title="Centralizar Mesa"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playDocumentOpen();
            onSelectStep(3);
          }}
          className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer shrink-0"
        >
          <span>Formular Hipótese</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
