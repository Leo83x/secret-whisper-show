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
  Lightbulb,
  Layers,
  X,
  Link2,
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

interface PinNodeLayout {
  // Position of the brass pushpin on the 16:9 3D table (% of stage)
  pinX: number;
  pinY: number;
  // Position of the compact translucent card (% of stage)
  cardLeft: number;
  cardTop: number;
  cardWidth: number;
  skewDeg: number;
}

// Coordinates calibrated to the physical documents on the 3D desk (DOC-01..DOC-04)
const FOUR_NODE_LAYOUT: PinNodeLayout[] = [
  { pinX: 25.5, pinY: 62.5, cardLeft: 6.5, cardTop: 64.0, cardWidth: 20.5, skewDeg: -6 },
  { pinX: 48.8, pinY: 57.5, cardLeft: 29.5, cardTop: 63.0, cardWidth: 21.0, skewDeg: -2 },
  { pinX: 64.8, pinY: 52.0, cardLeft: 53.0, cardTop: 62.5, cardWidth: 21.0, skewDeg: 3 },
  { pinX: 83.0, pinY: 58.0, cardLeft: 76.0, cardTop: 63.5, cardWidth: 19.0, skewDeg: 7 },
];

const SIX_NODE_LAYOUT: PinNodeLayout[] = [
  // Row 1 (Upper desk surface over folder, tablet & map)
  { pinX: 26.5, pinY: 53.0, cardLeft: 7.0, cardTop: 48.0, cardWidth: 24.0, skewDeg: -5 },
  { pinX: 49.0, pinY: 48.5, cardLeft: 36.5, cardTop: 46.5, cardWidth: 25.0, skewDeg: 0 },
  { pinX: 68.5, pinY: 51.0, cardLeft: 66.5, cardTop: 48.0, cardWidth: 24.5, skewDeg: 5 },
  // Row 2 (Lower desk surface near front edge of documents)
  { pinX: 23.0, pinY: 71.5, cardLeft: 6.0, cardTop: 68.0, cardWidth: 25.0, skewDeg: -6 },
  { pinX: 49.5, pinY: 70.5, cardLeft: 36.5, cardTop: 67.5, cardWidth: 25.5, skewDeg: -1 },
  { pinX: 79.5, pinY: 70.0, cardLeft: 67.0, cardTop: 68.0, cardWidth: 25.0, skewDeg: 6 },
];

const FRONT_EDGE_BADGES = [
  { label: 'DOC-01', left: 19.5, top: 86.2 },
  { label: 'DOC-02', left: 49.5, top: 86.2 },
  { label: 'DOC-03', left: 68.8, top: 86.2 },
  { label: 'DOC-04', left: 90.2, top: 86.2 },
];

export const CrossExamination3DStage: React.FC<CrossExamination3DStageProps> = ({
  selectedCase,
  challenges,
  activeChallenge,
  solvedConnectionIds,
  extractedCluesList,
  allCaseClues,
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
  // 3D Camera Orbit & Tilt State
  const [camRotX, setCamRotX] = useState<number>(2);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camPanX, setCamPanX] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.05);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Diegetic HUD Sub-levels (Closed by default so zero extra boxes appear!)
  const [briefingOpen, setBriefingOpen] = useState<boolean>(false);
  const [stepMenuOpen, setStepMenuOpen] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(() => soundEngine.getSettings().mutedAll);

  const isDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  // Gentle 3D camera orbit animation
  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 5.5);
      setCamRotX(2 + Math.cos(elapsed * 0.7) * 2.5);
      setCamScale(1.07 + Math.sin(elapsed * 0.5) * 0.02);
      frameId = requestAnimationFrame(animateOrbit);
    };

    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setCamRotY(prev => Math.max(-8, Math.min(8, prev + dx * 0.045)));
      setCamRotX(prev => Math.max(-3, Math.min(6, prev - dy * 0.035)));
      setCamPanX(prev => Math.max(-12, Math.min(12, prev + dx * 0.06)));
    } else if (!isAutoOrbiting && !soundEngine.getSettings().reduceMotion && window.innerWidth >= 768) {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setCamRotY(nx * 3.8);
      setCamRotX(2 - ny * 2.2);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const resetCamera = () => {
    setIsAutoOrbiting(false);
    setCamRotX(2);
    setCamRotY(0);
    setCamPanX(0);
    setCamScale(1.05);
  };

  const isActiveChallengeSolved = Boolean(
    activeChallenge && solvedConnectionIds.includes(activeChallenge.id)
  );

  // Use extracted clues if >= 2, otherwise show all case clues so the 3D desk is always populated
  const availableClues = (
    extractedCluesList.length >= 2 ? extractedCluesList : allCaseClues
  ).slice(0, 6);

  const layoutNodes = availableClues.length <= 4 ? FOUR_NODE_LAYOUT : SIX_NODE_LAYOUT;

  const activePairIds =
    isActiveChallengeSolved && activeChallenge?.requiredClueIds?.length === 2
      ? activeChallenge.requiredClueIds
      : boardSelectedClues;

  const selectedIdxA = availableClues.findIndex(c => c.id === activePairIds[0]);
  const selectedIdxB = availableClues.findIndex(c => c.id === activePairIds[1]);

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  return (
    <div
      className="fixed inset-0 z-40 w-screen h-[100dvh] bg-[#04060B] overflow-hidden select-none font-sans flex flex-col justify-between"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* =====================================================================
          1. VIEWPORT 3D EM TELA CHEIA (MESA DE MADEIRA, MAPA, PINOS E RAIOS LUMINOSOS)
         ===================================================================== */}
      <div
        className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden z-10"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 62%',
            transform: `translateX(${camPanX}%) scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          {/* Imagem 3D Fotorrealista da Mesa com Dossiê, Tabuleta, Mapa e Prancheta */}
          <img
            src="/dossiers/archive_room_3d_clean.webp"
            alt="Mesa de Cruzamento Tátil 3D"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
            style={{
              filter: bankerLampOn
                ? 'brightness(1.03) contrast(1.05)'
                : 'brightness(0.72) contrast(1.08) saturate(0.85)',
            }}
          />

          {/* Feixe de Luz Quente da Luminária Verde sobre o Tampo da Mesa */}
          {bankerLampOn && (
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                background:
                  'radial-gradient(circle at 74% 48%, rgba(251, 191, 36, 0.18) 0%, rgba(16, 185, 129, 0.08) 30%, rgba(4, 6, 11, 0.35) 75%)',
              }}
            />
          )}

          {/* Luminária Verde de Banqueiro Interativa */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              soundEngine.playDocumentOpen();
              setBankerLampOn(v => !v);
            }}
            style={{ left: '69%', top: '26%', width: '16%', height: '27%' }}
            className="absolute z-20 rounded-full cursor-pointer focus:outline-none group"
            title="Alternar Luminária da Mesa"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-950/90 border border-emerald-400/50 text-[10px] font-mono text-emerald-300 whitespace-nowrap">
              <Lightbulb className="w-3 h-3 inline mr-1" />
              {bankerLampOn ? 'Apagar Luz' : 'Acender Luz'}
            </span>
          </button>

          {/* =================================================================
              CAMADA SVG DE FIOS LUMINOSOS DOURADOS/CIANO E PINOS (Z-30 POR CIMA DOS DOCUMENTOS!)
             ================================================================= */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full z-30 overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="laser-gold" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0.6" result="blur1" />
                <feGaussianBlur stdDeviation="1.4" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="laser-cyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0.6" result="blur1" />
                <feGaussianBlur stdDeviation="1.3" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Malha Tática Contínua entre os Alfinetes dos Documentos (Estilo Referência) */}
            <line
              x1="26.5"
              y1="62.5"
              x2="47.2"
              y2="39.8"
              stroke="rgba(251, 191, 36, 0.55)"
              strokeWidth="0.22"
              filter="url(#laser-gold)"
            />
            <line
              x1="26.5"
              y1="62.5"
              x2="48.8"
              y2="57.5"
              stroke="rgba(251, 191, 36, 0.7)"
              strokeWidth="0.28"
              filter="url(#laser-gold)"
            />
            <line
              x1="26.5"
              y1="62.5"
              x2="61.5"
              y2="49.2"
              stroke="rgba(56, 189, 248, 0.65)"
              strokeWidth="0.24"
              filter="url(#laser-cyan)"
            />
            <line
              x1="48.8"
              y1="57.5"
              x2="64.8"
              y2="52.0"
              stroke="rgba(56, 189, 248, 0.7)"
              strokeWidth="0.25"
              filter="url(#laser-cyan)"
            />
            <line
              x1="64.8"
              y1="52.0"
              x2="83.0"
              y2="58.0"
              stroke="rgba(251, 191, 36, 0.5)"
              strokeWidth="0.2"
              strokeDasharray="0.8 0.5"
              filter="url(#laser-gold)"
            />

            {/* Nó Óptico na Lupa Central da Mesa */}
            <circle
              cx="47.2"
              cy="39.8"
              r="0.45"
              fill="#fde68a"
              filter="url(#laser-gold)"
            />

            {/* 2. Fio Principal Intenso Conectando Diretamente os Alfinetes Selecionados (Pino A <-> Pino B) */}
            {selectedIdxA !== -1 && selectedIdxB !== -1 && (
              <g>
                {/* Sombra projetada sobre os documentos */}
                <line
                  x1={layoutNodes[selectedIdxA].pinX}
                  y1={layoutNodes[selectedIdxA].pinY + 0.8}
                  x2={layoutNodes[selectedIdxB].pinX}
                  y2={layoutNodes[selectedIdxB].pinY + 0.8}
                  stroke="rgba(0,0,0,0.85)"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                />
                {/* Halo Externo Intenso */}
                <line
                  x1={layoutNodes[selectedIdxA].pinX}
                  y1={layoutNodes[selectedIdxA].pinY}
                  x2={layoutNodes[selectedIdxB].pinX}
                  y2={layoutNodes[selectedIdxB].pinY}
                  stroke={isActiveChallengeSolved ? '#34d399' : '#fbbf24'}
                  strokeWidth="0.55"
                  filter="url(#laser-gold)"
                  strokeLinecap="round"
                />
                {/* Núcleo Brilhante Contínuo por cima dos documentos */}
                <line
                  x1={layoutNodes[selectedIdxA].pinX}
                  y1={layoutNodes[selectedIdxA].pinY}
                  x2={layoutNodes[selectedIdxB].pinX}
                  y2={layoutNodes[selectedIdxB].pinY}
                  stroke={isActiveChallengeSolved ? '#a7f3d0' : '#fef08a'}
                  strokeWidth="0.22"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 3. Alfinetes / Tachas Metálicas Brilhantes em Cada Evidência */}
            {availableClues.map((clue, idx) => {
              const node = layoutNodes[idx];
              if (!node) return null;
              const slotIdx = boardSelectedClues.indexOf(clue.id);
              const isPicked = slotIdx !== -1;
              const isSolvedPin =
                isActiveChallengeSolved &&
                activeChallenge?.requiredClueIds?.includes(clue.id);

              return (
                <g key={`pin-${clue.id}`}>
                  {/* Halo luminoso ao redor da tacha */}
                  <circle
                    cx={node.pinX}
                    cy={node.pinY}
                    r={isPicked || isSolvedPin ? '1.15' : '0.7'}
                    fill={
                      isSolvedPin
                        ? 'rgba(52, 211, 153, 0.45)'
                        : isPicked
                        ? slotIdx === 0
                          ? 'rgba(251, 191, 36, 0.55)'
                          : 'rgba(56, 189, 248, 0.55)'
                        : 'rgba(251, 191, 36, 0.28)'
                    }
                    filter="url(#laser-gold)"
                  />
                  {/* Cabeça metálica do alfinete */}
                  <circle
                    cx={node.pinX}
                    cy={node.pinY}
                    r={isPicked || isSolvedPin ? '0.55' : '0.4'}
                    fill={
                      isSolvedPin
                        ? '#34d399'
                        : isPicked
                        ? slotIdx === 0
                          ? '#fde047'
                          : '#38bdf8'
                        : '#f59e0b'
                    }
                    stroke="#04060B"
                    strokeWidth="0.12"
                  />
                </g>
              );
            })}
          </svg>

          {/* =================================================================
              FICHAS NATURAIS QUASE TRANSPARENTES (bg-[#0b1320]/40 backdrop-blur-sm)
              Apenas ID + Título + CTA discreto, liberando >60% da mesa 3D!
             ================================================================= */}
          {availableClues.map((clue, idx) => {
            const node = layoutNodes[idx];
            if (!node) return null;
            const slotIdx = boardSelectedClues.indexOf(clue.id);
            const isPicked = slotIdx !== -1;
            const isSolvedClue =
              isActiveChallengeSolved &&
              activeChallenge?.requiredClueIds?.includes(clue.id);
            const isHovered = hoveredIdx === idx;
            const docShortId = clue.docCode.split('//')[0]?.trim() || `DOC-0${idx + 1}`;

            return (
              <button
                key={clue.id}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  if (!isActiveChallengeSolved) {
                    soundEngine.playDocumentOpen();
                    onToggleBoardClue(clue.id);
                  }
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  left: `${node.cardLeft}%`,
                  top: `${node.cardTop}%`,
                  width: `${node.cardWidth}%`,
                  transform: `skewX(${node.skewDeg}deg)`,
                }}
                className={`hidden md:flex absolute z-20 p-2.5 lg:p-3 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer flex-col justify-between text-left focus:outline-none ${
                  isSolvedClue
                    ? 'bg-emerald-950/50 border border-emerald-400/90 shadow-[0_0_25px_rgba(16,185,129,0.4)] -translate-y-0.5'
                    : isPicked
                    ? slotIdx === 0
                      ? 'bg-[#0b1320]/65 border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] -translate-y-1'
                      : 'bg-[#0b1320]/65 border-2 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.5)] -translate-y-1'
                    : isHovered
                    ? 'bg-[#0b1320]/55 border border-amber-300/80 shadow-[0_0_20px_rgba(251,191,36,0.3)] -translate-y-0.5'
                    : 'bg-[#0b1320]/40 border border-amber-500/30 hover:border-amber-400/70'
                }`}
              >
                <div
                  style={{ transform: `skewX(${-node.skewDeg}deg)` }}
                  className="w-full space-y-1"
                >
                  <div className="flex items-center justify-between gap-1 text-[10px] font-mono uppercase tracking-wider">
                    <span className="text-amber-300 font-bold">{docShortId}</span>
                    {isPicked ? (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          slotIdx === 0
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-cyan-400 text-slate-950'
                        }`}
                      >
                        PINO {slotIdx === 0 ? 'A' : 'B'}
                      </span>
                    ) : isSolvedClue ? (
                      <span className="text-emerald-300 font-bold text-[9px]">✓ CONECTADO</span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" />
                    )}
                  </div>

                  <div className="text-xs lg:text-sm font-sans font-bold text-white leading-tight line-clamp-1 drop-shadow">
                    {clue.title}
                  </div>

                  <div className="text-[10px] font-mono text-cyan-300/90 flex items-center justify-between pt-0.5">
                    <span>
                      {isPicked ? 'Conectado ao fio' : 'Clique para confrontar'}
                    </span>
                    <span className="text-amber-400/80">→</span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Plaquetas Diegéticas DOC-01..04 na Borda Frontal da Mesa */}
          {FRONT_EDGE_BADGES.map((b, i) => (
            <div
              key={b.label}
              style={{ left: `${b.left}%`, top: `${b.top}%` }}
              className="hidden md:flex absolute z-20 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded bg-[#0C121E]/85 backdrop-blur-sm border border-slate-600/70 font-mono text-xs font-bold tracking-wider text-slate-200 uppercase shadow-lg"
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          2. TOPO MINIMALISTA DA APLICAÇÃO (SEM SEGUNDA BARRA DUPLICADA!)
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-30 w-full p-2.5 sm:p-5 pointer-events-none shrink-0"
      >
        {/* --- VERSÃO MOBILE (< md) --- */}
        <div className="md:hidden pointer-events-auto rounded-2xl bg-[#070B14]/80 backdrop-blur-md border border-slate-800/80 p-2.5 shadow-xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#EAD29C] font-bold truncate">
              {caseShortHeader} ({selectedCase.name})
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
                className="p-1.5 rounded-lg bg-[#0B111E]/80 border border-slate-700 text-cyan-300"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={onRequestExit}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-b from-[#DFBF76] to-[#B69146] text-slate-950 font-sans font-bold text-[11px]"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setBriefingOpen(o => !o);
                setStepMenuOpen(false);
              }}
              className="px-2 py-1 rounded-lg bg-[#0B111E]/80 border border-slate-700 text-[11px] text-slate-200 flex items-center justify-center gap-1 truncate"
            >
              <Info className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Briefing</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStepMenuOpen(o => !o);
                setBriefingOpen(false);
              }}
              className="px-2 py-1 rounded-lg bg-[#0B111E]/80 border border-amber-500/40 text-[11px] text-amber-300 font-semibold flex items-center justify-center gap-1 truncate"
            >
              <span className="truncate">2. Conexões</span>
              <Layers className="w-3 h-3 shrink-0" />
            </button>
            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-2 py-1 rounded-lg bg-[#0B111E]/80 border border-slate-700 text-[11px] text-cyan-300 font-semibold truncate"
            >
              Leitura 2D
            </button>
            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-2 py-1 rounded-lg bg-[#0B111E]/80 border border-slate-700 text-[11px] text-amber-300 font-bold flex items-center justify-center gap-1 truncate"
            >
              <FolderOpen className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                {extractedCluesList.length}/{allCaseClues.length}
              </span>
            </button>
          </div>

          {/* Seletor Compacto de Vínculo no Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
            {challenges.map(ch => {
              const isSolved = solvedConnectionIds.includes(ch.id);
              const isCurrent = activeChallenge?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onSelectChallenge(ch.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950'
                      : isSolved
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#0B111E] text-slate-300 border border-slate-700'
                  }`}
                >
                  Vínculo #{ch.stepNumber} {isSolved ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- VERSÃO DESKTOP (>= md): EXATAMENTE COMO NA IMAGEM DE REFERÊNCIA --- */}
        <div className="hidden md:flex items-start justify-between gap-4">
          {/* Topo Esquerdo Minimalista */}
          <div className="pointer-events-auto flex flex-col items-start gap-2 max-w-2xl">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#080C14]/80 backdrop-blur-md border border-amber-500/30 shadow-lg">
              <h1 className="font-serif text-base lg:text-lg font-bold tracking-wide text-[#EAD29C] uppercase">
                {caseShortHeader} ({selectedCase.name.toUpperCase()})
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
                className="px-3 py-1.5 rounded-lg bg-[#0B111E]/80 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-amber-400/60 text-xs font-sans text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all shadow-lg"
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
                className="px-3.5 py-1.5 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-amber-500/40 text-xs font-sans text-slate-200 flex items-center gap-2 cursor-pointer transition-all shadow-lg"
              >
                <span>
                  <strong className="text-amber-400">2. Mesa de Conexões</strong> (Etapa Ativa)
                </span>
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {/* Pílulas discretas de Vínculo #1..#3 na mesma linha */}
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
                    className={`px-2.5 py-1.5 rounded-lg backdrop-blur-md border text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all shadow-lg ${
                      isCurrent
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                        : isSolved
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#0B111E]/75 border-slate-700 text-slate-300 hover:border-amber-400/50'
                    }`}
                  >
                    <span>#{ch.stepNumber}</span>
                    {isSolved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Subnível de Briefing (Escondido atrás do botão [ i Briefing ]!) */}
            {briefingOpen && (
              <div className="mt-1 p-4 rounded-xl bg-[#080D18]/90 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg animate-in fade-in duration-150 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    QUESTÃO DO VÍNCULO ATIVO (#{activeChallenge?.stepNumber})
                  </span>
                  <button
                    type="button"
                    onClick={() => setBriefingOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-bold text-white">{activeChallenge?.question}</p>
                <p className="text-xs text-slate-300 pt-1 border-t border-slate-800">
                  {selectedCase.PeriodSummary}
                </p>
              </div>
            )}

            {stepMenuOpen && (
              <div className="mt-1 p-2 rounded-xl bg-[#080D18]/95 backdrop-blur-xl border border-slate-700 shadow-2xl w-72 space-y-1">
                {(
                  [
                    { id: 1, label: '1. Observar — Arquivo Histórico (3D)' },
                    { id: 2, label: '2. Mesa de Conexões (Etapa Ativa)' },
                    { id: 3, label: '3. Hipótese — Sala de Análise' },
                    { id: 4, label: '4. Decidir — Simulação de Campo' },
                    { id: 5, label: '5. Consequências — Laudo Final' },
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

          {/* Topo Direito Minimalista */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-amber-400/60 text-xs sm:text-sm font-sans text-slate-200 cursor-pointer transition-all shadow-lg"
            >
              <span className="text-amber-400">[</span> Alternar:{' '}
              <strong className="text-amber-300">3D</strong> / Leitura 2D{' '}
              <span className="text-amber-400">]</span>
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-3.5 py-1.5 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-cyan-400/60 text-xs sm:text-sm font-sans text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all shadow-lg"
            >
              <span className="text-amber-400">[</span>
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Arquivo Pessoal:{' '}
                <strong className="text-amber-300">
                  {extractedCluesList.length}/{allCaseClues.length}
                </strong>{' '}
                Pistas
              </span>
              <span className="text-amber-400">]</span>
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="p-2 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-slate-700/80 text-cyan-300 cursor-pointer shadow-lg"
              title={muted ? 'Reativar Áudio' : 'Silenciar Áudio'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onRequestExit}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-[#DFBF76] to-[#B69146] hover:from-[#EAD08E] hover:to-[#C8A252] text-slate-950 font-sans font-bold text-xs sm:text-sm border border-amber-200/60 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer transition-all"
            >
              Sair da Operação
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. RODAPÉ COMPACTO (FICHAS NO MOBILE + BOTÃO CONFRONTAR EVIDÊNCIAS NA MESA)
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-30 w-full px-3 pb-3 sm:pb-5 pt-1 pointer-events-none space-y-2 shrink-0"
      >
        {/* Feedback Analítico Flutuante (Aparece apenas após clicar em Confrontar) */}
        {connectionFeedback && (
          <div className="pointer-events-auto max-w-xl mx-auto px-4 py-2.5 rounded-xl bg-[#080D18]/90 backdrop-blur-md border border-amber-400/50 shadow-2xl flex items-center justify-between gap-3 text-xs text-slate-100 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 min-w-0">
              {connectionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="line-clamp-2">{connectionFeedback.message}</span>
            </div>
            {connectionFeedback.type === 'success' && (
              <button
                type="button"
                onClick={() => onSelectStep(3)}
                className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0 cursor-pointer"
              >
                Etapa 3 →
              </button>
            )}
          </div>
        )}

        {/* Grade Compacta Transparente para Telas Mobile (< md) */}
        <div className="md:hidden pointer-events-auto grid grid-cols-2 gap-1.5">
          {availableClues.slice(0, 4).map((clue, idx) => {
            const slotIdx = boardSelectedClues.indexOf(clue.id);
            const isPicked = slotIdx !== -1;
            const docShortId = clue.docCode.split('//')[0]?.trim() || `DOC-0${idx + 1}`;
            return (
              <button
                key={clue.id}
                type="button"
                onClick={() => onToggleBoardClue(clue.id)}
                className={`p-2 rounded-xl backdrop-blur-sm border text-left transition-all ${
                  isPicked
                    ? 'bg-[#0b1320]/75 border-amber-400 text-white'
                    : 'bg-[#0b1320]/45 border-amber-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono text-amber-300 font-bold">
                  <span>{docShortId}</span>
                  <span>{isPicked ? `PINO ${slotIdx === 0 ? 'A' : 'B'}` : 'Confrontar'}</span>
                </div>
                <div className="text-[11px] font-bold text-white truncate mt-0.5">
                  {clue.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Barra Inferior Idêntica à Referência: [ Orbitar Câmera ] + [ CONFRONTAR EVIDÊNCIAS NA MESA -> ] */}
        <div className="pointer-events-auto max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#080C14]/80 backdrop-blur-md border border-slate-700/80 text-xs sm:text-sm font-sans text-slate-300 flex items-center gap-2 shadow-lg">
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setIsAutoOrbiting(o => !o);
              }}
              className={`font-semibold cursor-pointer transition-colors ${
                isAutoOrbiting
                  ? 'text-amber-300 underline'
                  : 'text-amber-200 hover:text-amber-300'
              }`}
            >
              [ {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar Câmera'} ]
            </button>
            <span className="text-amber-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              {activeChallenge?.question
                ? `Vínculo #${activeChallenge.stepNumber}: ${activeChallenge.question}`
                : 'Selecione os nós para validar conexões'}
            </span>
            <span className="sm:hidden text-slate-300 text-[11px]">
              Selecione 2 nós ({boardSelectedClues.length}/2)
            </span>

            {(camRotX !== 2 || camRotY !== 0 || camPanX !== 0 || camScale !== 1.05) && (
              <button
                type="button"
                onClick={resetCamera}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
                title="Centralizar Câmera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              type="button"
              onClick={() => {
                if (boardSelectedClues.length === 2) {
                  onValidateConnection();
                } else {
                  setBriefingOpen(true);
                }
              }}
              className={`px-5 sm:px-6 py-2.5 rounded-xl font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.35)] ${
                boardSelectedClues.length === 2
                  ? 'bg-gradient-to-b from-[#E5C67B] to-[#B89244] hover:from-[#F0D58E] hover:to-[#C9A352] text-slate-950 border-amber-200/80 scale-105'
                  : 'bg-gradient-to-b from-[#DFBF76]/90 to-[#B69146]/90 text-slate-950 border-amber-200/50'
              }`}
            >
              <span>CONFRONTAR EVIDÊNCIAS NA MESA</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                onSelectStep(3);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-xs font-bold cursor-pointer shadow-lg"
              title="Avançar para Etapa 3: Formular Hipótese"
            >
              Etapa 3 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
