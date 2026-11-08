import React, { useState, useEffect, useRef } from 'react';
import {
  ConnectionChallenge,
  EvidenceClue,
  HistoricalNode,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import { getEra3DTheme } from '../../utils/era3DTheme';
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
  X,
  Link2,
  Eye,
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
    status: 'idle' | 'success' | 'error';
    message?: string;
    conclusion?: string;
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
  activeStep,
  onSelectStep,
  onSelectChallenge,
  onToggleBoardClue,
  onValidateConnection,
  onOpenArchiveDrawer,
  onSwitchTo2D,
  onRequestExit,
}) => {
  const eraTheme = getEra3DTheme(selectedCase.id);

  // Dynamic Camera Transition: Starts angled and automatically rises to Top-Down (Vista Superior)
  const [camRotX, setCamRotX] = useState<number>(0);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.06);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);
  const [briefingOpen, setBriefingOpen] = useState<boolean>(false);
  const [stageMenuOpen, setStageMenuOpen] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(() => soundEngine.getSettings().mutedAll);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 0,
    rotY: 0,
  });

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  // Smoothly animate camera from diagonal perspective up into Top-Down overhead view on mount/case change
  const activeChallengeIdx = Math.max(
    0,
    challenges.findIndex(ch => ch.id === activeChallenge?.id)
  );

  useEffect(() => {
    setCamRotX(0);
    setCamRotY(0);
    setCamScale(1.06);
  }, [selectedCase.id]);

  // Refoco tático sutil da câmera ao alternar entre Vínculo #1, #2 e #3
  useEffect(() => {
    if (!activeChallenge?.id) return;
    const offsets = [
      { rotX: 0, rotY: -1.2, scale: 1.06 },
      { rotX: 1.2, rotY: 1.2, scale: 1.075 },
      { rotX: -1.0, rotY: 0, scale: 1.065 },
    ];
    const target = offsets[activeChallengeIdx % offsets.length];
    setCamRotX(target.rotX);
    setCamRotY(target.rotY);
    setCamScale(target.scale);
  }, [activeChallenge?.id, activeChallengeIdx]);

  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0011;
      setCamRotY(Math.sin(elapsed) * 4.5);
      setCamRotX(Math.cos(elapsed * 0.8) * 2.5);
      frameId = requestAnimationFrame(animateOrbit);
    };

    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-hud="true"]')) return;
    setIsAutoOrbiting(false);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: camRotX,
      rotY: camRotY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setCamRotY(Math.max(-8, Math.min(8, dragStartRef.current.rotY + dx * 0.04)));
      setCamRotX(Math.max(-5, Math.min(8, dragStartRef.current.rotX - dy * 0.035)));
    } else if (!isAutoOrbiting) {
      setCamRotY(nx * -2.0);
      setCamRotX(ny * 1.4);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const activeCluesPool =
    extractedCluesList.length >= 4 ? extractedCluesList : allCaseClues;

  // Monta dinamicamente as 4 evidências da mesa para o Vínculo Ativo (#1, #2 ou #3),
  // garantindo que as 2 pistas exigidas pelo vínculo estejam sempre presentes na mesa
  // junto com 2 pistas de contraste que mudam a cada vínculo!
  const deskClues = React.useMemo(() => {
    const pool = activeCluesPool.length > 0 ? activeCluesPool : allCaseClues;
    if (!activeChallenge || pool.length <= 4) {
      // Mesmo quando há 4 pistas, rotaciona a disposição conforme o Vínculo (#1, #2, #3)
      const rotated = [...pool.slice(0, 4)];
      if (rotated.length > 1 && activeChallengeIdx > 0) {
        const shift = activeChallengeIdx % rotated.length;
        return [...rotated.slice(shift), ...rotated.slice(0, shift)];
      }
      return rotated;
    }

    const reqIds = activeChallenge.requiredClueIds || [];
    const requiredClues = pool.filter(c => reqIds.includes(c.id));
    const otherClues = pool.filter(c => !reqIds.includes(c.id));

    // Seleciona 2 pistas de contraste diferentes conforme o índice do Vínculo (#1, #2, #3)
    const startOffset = activeChallengeIdx % Math.max(1, otherClues.length);
    const rotatedOthers = [
      ...otherClues.slice(startOffset),
      ...otherClues.slice(0, startOffset),
    ];
    const combined = [...requiredClues, ...rotatedOthers].slice(0, 4);

    // Intercala a posição nas 4 áreas da mesa conforme o Vínculo para mudança visual clara
    if (combined.length === 4) {
      if (activeChallengeIdx % 3 === 1) {
        return [combined[2], combined[0], combined[3], combined[1]];
      }
      if (activeChallengeIdx % 3 === 2) {
        return [combined[1], combined[2], combined[0], combined[3]];
      }
    }
    return combined;
  }, [activeCluesPool, allCaseClues, activeChallenge, activeChallengeIdx]);

  const isCurrentSolved = Boolean(
    activeChallenge && solvedConnectionIds.includes(activeChallenge.id)
  );

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  const topDownSpots = eraTheme.hotspotsStage2TopDown;

  const getPinCoordsForClueId = (clueId: string, fallbackIdx: number) => {
    const idx = deskClues.findIndex(c => c.id === clueId);
    const resolvedIdx = idx >= 0 ? idx : fallbackIdx % topDownSpots.length;
    return topDownSpots[resolvedIdx] || topDownSpots[0];
  };

  const stepsList: { num: 1 | 2 | 3 | 4 | 5; label: string }[] = [
    { num: 1, label: '1. Observar Evidências' },
    { num: 2, label: '2. Mesa de Conexões (Top-Down)' },
    { num: 3, label: '3. Formular Hipótese (Dolly-In)' },
    { num: 4, label: '4. Tomar Decisão (Maquete 3D)' },
    { num: 5, label: '5. Consequências' },
  ];

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed inset-0 top-0 left-0 !mt-0 !m-0 z-50 w-screen h-[100dvh] overflow-hidden bg-[#04060B] select-none font-sans flex flex-col justify-between"
      style={{ perspective: '1300px' }}
    >
      {/* =====================================================================
          1. CAMADA DE CENÁRIO 3D EM VISTA SUPERIOR (TOP-DOWN ESPECÍFICA DA ERA)
         ===================================================================== */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
        }}
      >
        <img
          src={eraTheme.stage2TopDownBg}
          alt={`Mesa de Investigação Top-Down — ${eraTheme.eraName}`}
          draggable={false}
          className="w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-500"
          style={{
            filter: bankerLampOn
              ? eraTheme.stage2Filter
              : 'brightness(0.65) contrast(1.12) saturate(0.82)',
          }}
        />

        {/* Iluminação Volumétrica da Era sobre a Mesa */}
        {bankerLampOn && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{ background: eraTheme.ambientGlowCss }}
          />
        )}

        {/* Vinheta Cinematográfica Superior e Inferior para leitura limpa do HUD */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,6,11,0.72) 0%, rgba(4,6,11,0.08) 18%, rgba(4,6,11,0.08) 78%, rgba(4,6,11,0.85) 100%)',
          }}
        />

        {/* ===================================================================
            2. CAMADA SVG DE FEIXES LUMINOSOS E FIOS TÁTEIS (Z-30 ACIMA DOS DOCS)
           =================================================================== */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        >
          <defs>
            <filter id="goldLaserGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="0.65" result="blur1" />
              <feGaussianBlur stdDeviation="1.4" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cyanLaserGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="0.55" result="blur1" />
              <feGaussianBlur stdDeviation="1.2" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Feixes Ambiente Dinâmicos: mudam de geometria conforme o Vínculo Ativo (#1, #2 ou #3) */}
          {boardSelectedClues.length < 2 && topDownSpots.length >= 4 && (() => {
            const pairsByChallenge: [number, number, number][] = [
              [0, 1, 2],
              [1, 3, 0],
              [0, 3, 2],
            ];
            const [idxA, idxB, idxC] = pairsByChallenge[activeChallengeIdx % pairsByChallenge.length];
            const sA = topDownSpots[idxA] || topDownSpots[0];
            const sB = topDownSpots[idxB] || topDownSpots[1];
            const sC = topDownSpots[idxC] || topDownSpots[2];
            return (
              <g opacity="0.88">
                <line
                  x1={sA.pinX}
                  y1={sA.pinY}
                  x2={sB.pinX}
                  y2={sB.pinY}
                  stroke={eraTheme.primaryAccentHex}
                  strokeWidth="0.34"
                  strokeDasharray="1.1 0.6"
                  filter="url(#goldLaserGlow)"
                />
                <line
                  x1={sA.pinX}
                  y1={sA.pinY}
                  x2={50}
                  y2={31}
                  stroke={eraTheme.secondaryAccentHex}
                  strokeWidth="0.26"
                  strokeDasharray="0.8 0.5"
                  filter="url(#cyanLaserGlow)"
                />
                <line
                  x1={sB.pinX}
                  y1={sB.pinY}
                  x2={50}
                  y2={31}
                  stroke={eraTheme.secondaryAccentHex}
                  strokeWidth="0.26"
                  strokeDasharray="0.8 0.5"
                  filter="url(#cyanLaserGlow)"
                />
                <line
                  x1={sC.pinX}
                  y1={sC.pinY}
                  x2={50}
                  y2={31}
                  stroke={eraTheme.primaryAccentHex}
                  strokeWidth="0.2"
                  strokeDasharray="0.6 0.6"
                />
              </g>
            );
          })()}

          {/* Fios das Conexões Já Comprovadas */}
          {challenges
            .filter(ch => solvedConnectionIds.includes(ch.id))
            .map((ch, idx) => {
              const p1 = getPinCoordsForClueId(ch.requiredClueIds[0], idx);
              const p2 = getPinCoordsForClueId(ch.requiredClueIds[1], idx + 1);
              return (
                <g key={ch.id}>
                  <line
                    x1={p1.pinX}
                    y1={p1.pinY}
                    x2={p2.pinX}
                    y2={p2.pinY}
                    stroke="#fbbf24"
                    strokeWidth="0.42"
                    filter="url(#goldLaserGlow)"
                  />
                  <line
                    x1={p1.pinX}
                    y1={p1.pinY}
                    x2={p2.pinX}
                    y2={p2.pinY}
                    stroke="#ffffff"
                    strokeWidth="0.14"
                  />
                </g>
              );
            })}

          {/* Fio Intenso de Confronto Ativo (Quando o jogador seleciona 2 pistas/pinos) */}
          {boardSelectedClues.length === 2 && (() => {
            const pA = getPinCoordsForClueId(boardSelectedClues[0], 0);
            const pB = getPinCoordsForClueId(boardSelectedClues[1], 1);
            const isErr = connectionFeedback?.status === 'error';
            const isOk = connectionFeedback?.status === 'success' || isCurrentSolved;
            const mainStroke = isErr ? '#f87171' : isOk ? '#34d399' : '#fbbf24';
            return (
              <g>
                <line
                  x1={pA.pinX}
                  y1={pA.pinY}
                  x2={pB.pinX}
                  y2={pB.pinY}
                  stroke={mainStroke}
                  strokeWidth="0.5"
                  filter="url(#goldLaserGlow)"
                />
                <line
                  x1={pA.pinX}
                  y1={pA.pinY}
                  x2={pB.pinX}
                  y2={pB.pinY}
                  stroke="#fffbeb"
                  strokeWidth="0.18"
                />
                <line
                  x1={pA.pinX}
                  y1={pA.pinY}
                  x2={50}
                  y2={32}
                  stroke="#38bdf8"
                  strokeWidth="0.22"
                  strokeDasharray="0.7 0.5"
                  filter="url(#cyanLaserGlow)"
                />
                <line
                  x1={pB.pinX}
                  y1={pB.pinY}
                  x2={50}
                  y2={32}
                  stroke="#38bdf8"
                  strokeWidth="0.22"
                  strokeDasharray="0.7 0.5"
                  filter="url(#cyanLaserGlow)"
                />
              </g>
            );
          })()}

          {boardSelectedClues.length === 1 && (() => {
            const pA = getPinCoordsForClueId(boardSelectedClues[0], 0);
            return (
              <g>
                <line
                  x1={pA.pinX}
                  y1={pA.pinY}
                  x2={50}
                  y2={32}
                  stroke="#fbbf24"
                  strokeWidth="0.34"
                  strokeDasharray="0.9 0.5"
                  filter="url(#goldLaserGlow)"
                />
              </g>
            );
          })()}
        </svg>

        {/* Badge Horizontal Dinâmico do Vínculo Ativo (#1, #2 ou #3) no Centro da Mesa */}
        <div
          className={`hidden sm:flex absolute left-1/2 -translate-x-1/2 top-[31%] z-30 pointer-events-none items-center gap-2 px-4 py-1.5 rounded-full border shadow-[0_0_25px_rgba(0,0,0,0.9)] text-[11px] font-mono uppercase tracking-wider transition-all duration-300 ${
            isCurrentSolved
              ? 'bg-emerald-950/95 text-emerald-300 border-emerald-400/70'
              : 'bg-[#060A12]/95 text-amber-300 border-amber-400/60'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isCurrentSolved ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
            }`}
          />
          <span>
            VÍNCULO #{activeChallengeIdx + 1} DE {challenges.length} //{' '}
            {isCurrentSolved
              ? 'CONEXÃO COMPROVADA ✓'
              : `SELECIONE 2 PISTAS NA MESA (${boardSelectedClues.length}/2)`}
          </span>
        </div>

        {/* ===================================================================
            3. DOCUMENTOS FÍSICOS, ALFINETES METÁLICOS E FICHAS TRANSLÚCIDAS
           =================================================================== */}
        {topDownSpots.map((spot, idx) => {
          const clue = deskClues[idx];
          const isSelected = Boolean(clue && boardSelectedClues.includes(clue.id));
          const isPartOfCurrentSolved = Boolean(
            clue &&
              isCurrentSolved &&
              activeChallenge?.requiredClueIds.includes(clue.id)
          );
          const isPartOfSolved = Boolean(
            isPartOfCurrentSolved ||
              (clue &&
                challenges
                  .filter(ch => solvedConnectionIds.includes(ch.id))
                  .some(ch => ch.requiredClueIds.includes(clue.id)))
          );

          return (
            <React.Fragment key={spot.tag}>
              {/* Área Clicável sobre o Artefato Físico na Vista Top-Down */}
              <button
                type="button"
                onClick={() => {
                  if (clue) {
                    soundEngine.playClueSaved();
                    onToggleBoardClue(clue.id);
                  }
                }}
                style={{
                  left: spot.left,
                  top: spot.top,
                  width: spot.width,
                  height: spot.height,
                }}
                className={`hidden md:block absolute z-20 rounded-xl transition-all duration-200 cursor-pointer group ${
                  isSelected
                    ? 'ring-2 ring-amber-300/90 bg-amber-400/10 shadow-[0_0_35px_rgba(251,191,36,0.35)]'
                    : 'hover:ring-1 hover:ring-amber-300/50 hover:bg-amber-300/5'
                }`}
                title={
                  clue
                    ? `${spot.tag} (${spot.eraLabel}): ${clue.title} — Clique para confrontar`
                    : spot.eraLabel
                }
              >
                {/* Ficha Compacta Quase Transparente (bg-[#0b1320]/40 backdrop-blur-sm) */}
                {clue && (
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 bottom-2 w-[94%] px-2.5 py-1.5 rounded-lg backdrop-blur-sm border transition-all text-left pointer-events-none ${
                      isSelected
                        ? 'bg-[#0b1320]/70 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.45)]'
                        : isPartOfSolved
                        ? 'bg-[#0b1320]/50 border-emerald-400/60'
                        : 'bg-[#0b1320]/40 border-amber-400/35 group-hover:bg-[#0b1320]/65 group-hover:border-amber-300/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold text-amber-300">
                        {spot.tag}
                      </span>
                      <span
                        className={`text-[8px] sm:text-[9px] font-mono ${
                          isSelected
                            ? 'text-amber-200 font-bold'
                            : isPartOfSolved
                            ? 'text-emerald-300'
                            : 'text-cyan-300/90'
                        }`}
                      >
                        {isSelected
                          ? '● Selecionado'
                          : isPartOfSolved
                          ? '✓ Vinculado'
                          : 'Clique p/ confrontar'}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-sans font-semibold text-white truncate mt-0.5 drop-shadow">
                      {clue.title}
                    </div>
                  </div>
                )}
              </button>

              {/* ALFINETE / TACHA METÁLICA BRILHANTE (Z-35) */}
              <button
                type="button"
                onClick={() => {
                  if (clue) {
                    soundEngine.playClueSaved();
                    onToggleBoardClue(clue.id);
                  }
                }}
                style={{
                  left: `${spot.pinX}%`,
                  top: `${spot.pinY}%`,
                }}
                className="hidden md:flex absolute z-30 -translate-x-1/2 -translate-y-1/2 w-7 h-7 items-center justify-center cursor-pointer group focus:outline-none"
                title={clue ? `Conectar pino: ${clue.title}` : `Pino ${spot.tag}`}
              >
                <span
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-400/60 animate-ping scale-125'
                      : isPartOfSolved
                      ? 'bg-emerald-400/40 scale-110'
                      : 'bg-amber-300/30 group-hover:bg-amber-300/55 group-hover:scale-125'
                  }`}
                />
                <span
                  className={`relative w-3.5 h-3.5 rounded-full border-2 shadow-[0_2px_10px_rgba(0,0,0,0.95)] transition-transform ${
                    isSelected
                      ? 'bg-amber-300 border-white scale-125 shadow-[0_0_16px_#fbbf24]'
                      : isPartOfSolved
                      ? 'bg-emerald-400 border-emerald-100 shadow-[0_0_12px_#34d399]'
                      : 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 border-amber-100 group-hover:scale-110'
                  }`}
                />
              </button>


            </React.Fragment>
          );
        })}
      </div>

      {/* =====================================================================
          4. TOPO MINIMALISTA ÚNICO (SEM CABEÇALHOS DUPLICADOS)
         ===================================================================== */}
      <div
        data-hud="true"
        className="relative z-40 w-full px-3 sm:px-6 pt-2.5 sm:pt-4 pointer-events-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="pointer-events-auto flex flex-col items-start gap-1.5 max-w-full">
            <div className="px-3 py-1.5 rounded-lg bg-[#080C14]/85 backdrop-blur-md border border-amber-500/30 shadow-lg flex items-center gap-2">
              <img
                src="/reader/icons/icon-192.png"
                alt="O Último Segredo"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-md object-cover border border-amber-400/60 shrink-0"
              />
              <h1 className="font-sans text-[11px] sm:text-base lg:text-lg font-bold tracking-wide text-[#EAD29C] uppercase truncate max-w-[78vw] sm:max-w-none">
                {caseShortHeader} ({selectedCase.name.toUpperCase()})
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setBriefingOpen(o => !o);
                }}
                className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 ${
                  briefingOpen
                    ? 'bg-amber-500/30 border-amber-300 text-amber-100'
                    : 'bg-[#090D16]/75 border-slate-600/70 text-slate-200 hover:border-amber-400/60 hover:text-white'
                }`}
              >
                <span>[</span>
                <Info className="w-3 h-3 text-amber-400 italic" />
                <span>Briefing ]</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStageMenuOpen(o => !o)}
                  className="px-2.5 py-1 rounded bg-[#090D16]/80 hover:bg-[#111827]/90 border border-amber-500/40 text-[11px] font-mono text-slate-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-md"
                >
                  <span className="text-amber-400 font-bold">2. Mesa de Conexões</span>
                  <span className="text-slate-300 hidden sm:inline">(Vista Superior)</span>
                  <Link2 className="w-3 h-3 text-amber-400 ml-0.5" />
                </button>

                {stageMenuOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-[#090D16]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl p-1.5 z-50 space-y-1">
                    {stepsList.map(st => (
                      <button
                        key={st.num}
                        type="button"
                        onClick={() => {
                          setStageMenuOpen(false);
                          soundEngine.playDocumentOpen();
                          onSelectStep(st.num);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                          st.num === activeStep
                            ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-400/40'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span>{st.label}</span>
                        {st.num === activeStep && (
                          <span className="text-[10px] text-amber-400">ATUAL</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {challenges.length > 0 && (
                <div className="flex items-center gap-1 bg-[#090D16]/85 backdrop-blur-md px-1.5 py-1 rounded-lg border border-amber-500/35 shadow-md">
                  {challenges.map((ch, idx) => {
                    const solved = solvedConnectionIds.includes(ch.id);
                    const active = activeChallenge?.id === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playDocumentOpen();
                          onSelectChallenge(ch.id);
                        }}
                        className={`px-2.5 py-0.5 rounded text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                            : solved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }`}
                        title={ch.question}
                      >
                        {solved && <CheckCircle2 className="w-3 h-3" />}
                        <span>Vínculo #{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-2.5 py-1.5 rounded bg-[#090D16]/75 hover:bg-[#131C2E]/90 border border-slate-600/80 hover:border-amber-400/60 text-[11px] font-mono text-slate-200 hover:text-white cursor-pointer backdrop-blur-md transition-all"
            >
              [ Alternar: <span className="text-amber-300 font-semibold">3D</span> / Leitura 2D ]
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-2.5 py-1.5 rounded bg-[#090D16]/75 hover:bg-[#131C2E]/90 border border-slate-600/80 hover:border-amber-400/60 text-[11px] font-mono text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
            >
              <span>[</span>
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Arquivo Pessoal:{' '}
                <strong className="text-amber-300">
                  {extractedCluesList.length}/{allCaseClues.length}
                </strong>{' '}
                Pistas ]
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBankerLampOn(v => !v)}
              className="p-1.5 rounded bg-[#090D16]/75 border border-slate-600/70 text-amber-300 hover:text-white cursor-pointer backdrop-blur-md"
              title="Alternar Luminária da Mesa"
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="p-1.5 rounded bg-[#090D16]/75 border border-slate-600/70 text-cyan-300 hover:text-white cursor-pointer backdrop-blur-md"
              title={muted ? 'Reativar áudio' : 'Silenciar'}
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
              className="px-3 py-1.5 rounded bg-gradient-to-b from-[#d8b878] to-[#b38e46] hover:from-[#e4c88c] hover:to-[#c49d52] text-slate-950 font-sans font-bold text-xs shadow-lg cursor-pointer transition-all border border-amber-200/50"
            >
              Sair da Operação
            </button>
          </div>
        </div>

        {/* PAINEL PERMANENTE DO VÍNCULO ATIVO (#1, #2 OU #3) — Muda imediatamente ao clicar em Vínculo #1, #2 ou #3 */}
        {activeChallenge && (
          <div
            key={activeChallenge.id}
            className={`pointer-events-auto mt-2 max-w-2xl p-3 sm:p-3.5 rounded-xl backdrop-blur-xl border shadow-[0_12px_35px_rgba(0,0,0,0.85)] transition-all duration-200 ${
              isCurrentSolved
                ? 'bg-[#061E18]/92 border-emerald-400/60'
                : 'bg-[#090D16]/92 border-amber-400/55'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${
                    isCurrentSolved
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  VÍNCULO #{activeChallengeIdx + 1} DE {challenges.length}
                </span>
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                    isCurrentSolved ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {isCurrentSolved
                    ? '✓ Conexão Comprovada (+35 XP)'
                    : `Em Aberto • Selecione 2 evidências na mesa (${boardSelectedClues.length}/2)`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {challenges.map((ch, idx) => {
                  const isThisActive = ch.id === activeChallenge.id;
                  const isThisSolved = solvedConnectionIds.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playDocumentOpen();
                        onSelectChallenge(ch.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        isThisActive
                          ? 'bg-amber-400 text-slate-950 shadow'
                          : isThisSolved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800/90 text-slate-300 hover:text-white'
                      }`}
                    >
                      #{idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs sm:text-sm font-sans font-bold text-white leading-snug">
              {activeChallenge.question}
            </div>

            {isCurrentSolved && activeChallenge.conclusion ? (
              <div className="mt-1.5 pt-1.5 border-t border-emerald-500/30 text-xs font-sans text-emerald-200 leading-relaxed">
                <strong className="font-mono uppercase text-[10px] text-emerald-300 mr-1.5">
                  Conclusão Forense:
                </strong>
                {activeChallenge.conclusion}
              </div>
            ) : (
              activeChallenge.promptHint && (
                <div className="mt-1 text-[11px] font-mono text-cyan-300/95">
                  Dica Tática: {activeChallenge.promptHint}
                </div>
              )
            )}
          </div>
        )}

        {briefingOpen && (
          <div className="pointer-events-auto mt-2 max-w-xl p-3.5 rounded-xl bg-[#090D16]/95 backdrop-blur-xl border border-amber-500/40 text-xs text-slate-200 leading-relaxed shadow-2xl flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                CONTEXTO HISTÓRICO DO CASO — {eraTheme.eraName}
              </div>
              <p className="text-slate-300">{selectedCase.shortDescription}</p>
            </div>
            <button
              type="button"
              onClick={() => setBriefingOpen(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          5. FEEDBACK COMPACTO FLUTUANTE (APENAS QUANDO ACERTA OU ERRA VÍNCULO)
         ===================================================================== */}
      {connectionFeedback && connectionFeedback.status !== 'idle' && (
        <div
          data-hud="true"
          className="relative z-40 mx-auto max-w-lg px-4 py-2.5 rounded-xl backdrop-blur-xl border shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          style={{
            backgroundColor:
              connectionFeedback.status === 'success'
                ? 'rgba(6, 46, 34, 0.88)'
                : 'rgba(69, 10, 10, 0.88)',
            borderColor:
              connectionFeedback.status === 'success'
                ? 'rgba(52, 211, 153, 0.6)'
                : 'rgba(248, 113, 113, 0.6)',
          }}
        >
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
            {connectionFeedback.status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span
              className={
                connectionFeedback.status === 'success'
                  ? 'text-emerald-300'
                  : 'text-red-300'
              }
            >
              {connectionFeedback.message}
            </span>
          </div>
          {connectionFeedback.conclusion && (
            <p className="text-xs text-slate-100 mt-1 leading-relaxed">
              {connectionFeedback.conclusion}
            </p>
          )}
        </div>
      )}

      {/* =====================================================================
          5B. VISÃO MOBILE (< md): MESA PANORÂMICA 16:9 COMPLETA + GRADE 2x2
         ===================================================================== */}
      <div
        data-hud="true"
        className="md:hidden relative z-30 flex-1 w-full px-3 py-1.5 flex flex-col justify-center gap-2 overflow-y-auto"
      >
        {/* Pergunta do Vínculo Ativo no Mobile */}
        {activeChallenge && (
          <div className="p-2.5 rounded-xl bg-[#080D18]/90 backdrop-blur-md border border-amber-500/35 text-xs text-slate-100 leading-snug shadow-lg">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-0.5">
              VÍNCULO ATIVO ({solvedConnectionIds.length}/{challenges.length} COMPROVADOS) //
            </span>
            <span>{activeChallenge.question}</span>
          </div>
        )}

        {/* Quadro 16:9 Completo da Mesa Top-Down com Pinos e Fios Luminosos (Sem Corte Lateral) */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-amber-500/40 shadow-2xl shrink-0">
          <img
            src={eraTheme.stage2TopDownBg}
            alt="Mesa Top-Down 3D"
            className="w-full h-full object-cover object-center"
          />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {topDownSpots.length >= 3 && (
              <g opacity="0.9">
                <line x1={topDownSpots[0].pinX} y1={topDownSpots[0].pinY} x2={topDownSpots[1].pinX} y2={topDownSpots[1].pinY} stroke={eraTheme.primaryAccentHex} strokeWidth="0.6" />
                <line x1={topDownSpots[0].pinX} y1={topDownSpots[0].pinY} x2={topDownSpots[2].pinX} y2={topDownSpots[2].pinY} stroke={eraTheme.secondaryAccentHex} strokeWidth="0.5" />
                <line x1={topDownSpots[1].pinX} y1={topDownSpots[1].pinY} x2={topDownSpots[2].pinX} y2={topDownSpots[2].pinY} stroke={eraTheme.secondaryAccentHex} strokeWidth="0.45" strokeDasharray="1.2 0.8" />
              </g>
            )}
          </svg>
          <div className="absolute left-1/2 -translate-x-1/2 top-[24%] z-30 pointer-events-none flex items-center gap-1.5 bg-[#060A12]/90 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-lg text-[9px] font-mono uppercase tracking-wider whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>VÍNCULO TÁTICO // {eraTheme.eraName.toUpperCase()}</span>
          </div>
          {topDownSpots.map((spot, idx) => {
            const clue = deskClues[idx];
            const isSelected = Boolean(clue && boardSelectedClues.includes(clue.id));
            return (
              <button
                key={spot.tag}
                type="button"
                onClick={() => clue && onToggleBoardClue(clue.id)}
                style={{ left: `${spot.pinX}%`, top: `${spot.pinY}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#060A12]/90 border border-amber-400/60 text-[8px] font-mono font-bold text-amber-300 shadow-md flex items-center gap-1"
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300 animate-ping' : 'bg-amber-400'}`} />
                <span>{spot.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Grade 2x2 de Fichas Translúcidas no Mobile (Legibilidade Total Sem Espremer) */}
        <div className="grid grid-cols-2 gap-2">
          {topDownSpots.map((spot, idx) => {
            const clue = deskClues[idx];
            if (!clue) return null;
            const isSelected = boardSelectedClues.includes(clue.id);
            const isPartOfSolved = challenges
              .filter(ch => solvedConnectionIds.includes(ch.id))
              .some(ch => ch.requiredClueIds.includes(clue.id));

            return (
              <button
                key={spot.tag}
                type="button"
                onClick={() => {
                  soundEngine.playClueSaved();
                  onToggleBoardClue(clue.id);
                }}
                className={`p-2.5 rounded-xl backdrop-blur-md border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/25 border-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.35)]'
                    : isPartOfSolved
                    ? 'bg-emerald-950/50 border-emerald-400/60'
                    : 'bg-[#0b1320]/75 border-amber-400/35'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                    {spot.tag}
                  </span>
                  <span className="text-[9px] font-mono text-cyan-300">
                    {isSelected ? '● Ativo' : isPartOfSolved ? '✓ Elo' : 'Confrontar'}
                  </span>
                </div>
                <div className="text-xs font-sans font-semibold text-white line-clamp-2 mt-1">
                  {clue.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          6. BARRA INFERIOR COMPACTA
         ===================================================================== */}
      <div
        data-hud="true"
        className="relative z-40 w-full px-3 sm:px-6 pb-2.5 sm:pb-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 pointer-events-none"
      >
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-sans text-slate-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] bg-[#090D16]/65 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70">
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className={`font-mono transition-colors cursor-pointer ${
              isAutoOrbiting
                ? 'text-amber-300 font-bold'
                : 'text-amber-200/90 hover:text-amber-300'
            }`}
          >
            [ {isAutoOrbiting ? 'Pausar Câmera' : 'Orbitar Câmera'} ]
          </button>
          <span className="text-slate-400">•</span>
          <span className="text-slate-200 text-xs truncate max-w-[68vw] sm:max-w-md">
            {activeChallenge
              ? activeChallenge.question
              : 'Selecione os nós para validar conexões'}
          </span>
          {(camRotX !== 0 || camRotY !== 0) && (
            <button
              type="button"
              onClick={() => {
                setIsAutoOrbiting(false);
                setCamRotX(0);
                setCamRotY(0);
                setCamScale(1.06);
              }}
              className="ml-1 text-slate-400 hover:text-white cursor-pointer"
              title="Centralizar Vista Top-Down"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {boardSelectedClues.length === 2 && !isCurrentSolved ? (
            <button
              type="button"
              onClick={onValidateConnection}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#e3c485] via-[#cfa75b] to-[#b08639] hover:from-[#ebd098] hover:to-[#c29746] text-slate-950 border border-amber-200/70"
            >
              <span>CONFRONTAR EVIDÊNCIAS NA MESA</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (boardSelectedClues.length === 2) {
                  onValidateConnection();
                } else {
                  soundEngine.playDocumentOpen();
                  onSelectStep(3);
                }
              }}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#e3c485] via-[#cfa75b] to-[#b08639] hover:from-[#ebd098] hover:to-[#c29746] text-slate-950 border border-amber-200/70"
            >
              <span>CONFRONTAR EVIDÊNCIAS NA MESA</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        <div className="hidden xl:block w-64" />
      </div>
    </div>
  );
};
