import React, { useState, useEffect } from 'react';
import {
  ConnectionChallenge,
  EvidenceClue,
  HistoricalNode,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Link2,
  GitCommit,
  Lightbulb,
  Sparkles,
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
  allCaseClues: ExtractedClueItem[];
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

// Fixed physical coordinates (% of the 16:9 wooden table surface) for up to 6 evidence pins
const TABLE_PIN_POSITIONS: { left: number; top: number; rot: number }[] = [
  { left: 23, top: 38, rot: -3 },
  { left: 50, top: 33, rot: 2 },
  { left: 77, top: 38, rot: -2 },
  { left: 25, top: 71, rot: 3 },
  { left: 52, top: 73, rot: -1.5 },
  { left: 78, top: 70, rot: 2.5 },
];

export const EvidenceBoard3DStage: React.FC<EvidenceBoard3DStageProps> = ({
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
}) => {
  const [camRotX, setCamRotX] = useState<number>(6);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.03);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);
  const [expandedClueId, setExpandedClueId] = useState<string | null>(null);

  // Automatic gentle camera orbit when [ Orbitar 3D ] is toggled
  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 5.0);
      setCamRotX(6 + Math.cos(elapsed * 0.8) * 3.0);
      setCamScale(1.05 + Math.sin(elapsed * 0.5) * 0.02);
      frameId = requestAnimationFrame(animateOrbit);
    };

    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const resetCamera = () => {
    setIsAutoOrbiting(false);
    setCamRotX(6);
    setCamRotY(0);
    setCamScale(1.03);
  };

  // Show extracted clues on the 3D table; if the user jumped straight to Stage 2 with < 2 clues,
  // display all dossier clues on the 3D table so the 3D board is ALWAYS rich, playable, and never blocked!
  const cluesOnTable = extractedCluesList.length >= 2 ? extractedCluesList : allCaseClues;

  const isActiveChallengeSolved = Boolean(
    activeChallenge && solvedConnectionIds.includes(activeChallenge.id)
  );

  const activePairIds =
    isActiveChallengeSolved && activeChallenge?.requiredClueIds?.length === 2
      ? activeChallenge.requiredClueIds
      : boardSelectedClues;

  const idxA = cluesOnTable.findIndex(c => c.id === activePairIds[0]);
  const idxB = cluesOnTable.findIndex(c => c.id === activePairIds[1]);
  const posA = idxA >= 0 ? TABLE_PIN_POSITIONS[idxA % TABLE_PIN_POSITIONS.length] : null;
  const posB = idxB >= 0 ? TABLE_PIN_POSITIONS[idxB % TABLE_PIN_POSITIONS.length] : null;

  const slotAClue = cluesOnTable.find(c => c.id === boardSelectedClues[0]);
  const slotBClue = cluesOnTable.find(c => c.id === boardSelectedClues[1]);

  return (
    <div className="space-y-4 select-none font-sans">
      {/* =====================================================================
          1. BARRA COMPACTA DE VÍNCULOS ACIMA DA MESA 3D (NÃO COBRE A IMAGEM 3D)
         ===================================================================== */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B1320]/95 border border-amber-500/35 space-y-2.5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              Vínculos na Mesa ({solvedConnectionIds.length}/{challenges.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
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
                  className={`px-2.5 sm:px-3 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
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

        <div className="text-sm sm:text-base font-sans font-bold text-white leading-snug">
          {activeChallenge?.question}
        </div>
      </div>

      {/* =====================================================================
          2. PALCO 3D DESOBSTRUÍDO DA MESA TOPOGRÁFICA (IMAGEM 100% VISÍVEL COM PINOS E FIOS)
         ===================================================================== */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-amber-500/40 bg-[#04060B] shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
        style={{ perspective: '1200px' }}
      >
        {/* Controles Discretos de Câmera e Luz no Canto Superior Direito da Mesa */}
        <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setBankerLampOn(v => !v);
            }}
            className={`px-2.5 py-1 rounded-lg backdrop-blur-md border text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
              bankerLampOn
                ? 'bg-[#0B111E]/85 border-amber-400/50 text-amber-300'
                : 'bg-[#0B111E]/85 border-slate-700 text-slate-400'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{bankerLampOn ? 'Luz Acesa' : 'Luz Baixa'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className={`px-2.5 py-1 rounded-lg backdrop-blur-md border text-[11px] font-mono cursor-pointer transition-all ${
              isAutoOrbiting
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                : 'bg-[#0B111E]/85 border-cyan-500/40 text-cyan-300 hover:border-amber-400/60'
            }`}
          >
            {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar 3D'}
          </button>

          {(camRotX !== 6 || camRotY !== 0 || camScale !== 1.03) && (
            <button
              type="button"
              onClick={resetCamera}
              className="p-1.5 rounded-lg bg-[#0B111E]/85 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Centralizar Mesa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Superfície Tridimensional da Mesa de Madeira com Pinos Físicos e Fios */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 55%',
            transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          <img
            src="/dossiers/evidence_board_3d_clean.webp"
            alt="Mesa Topográfica de Investigação 3D"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
            style={{
              filter: bankerLampOn
                ? 'brightness(1.04) contrast(1.05)'
                : 'brightness(0.7) contrast(1.1) saturate(0.85)',
            }}
          />

          {bankerLampOn && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 72% 28%, rgba(251, 191, 36, 0.18) 0%, rgba(16, 185, 129, 0.08) 35%, transparent 70%)',
              }}
            />
          )}

          {/* SVG Dinâmico do Fio de Investigação Esticado Entre os 2 Pinos Selecionados na Mesa */}
          {posA && posB && (
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full z-20 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="desk-thread-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Sombra projetada do fio sobre a madeira */}
              <line
                x1={`${posA.left}%`}
                y1={`${posA.top + 1.8}%`}
                x2={`${posB.left}%`}
                y2={`${posB.top + 1.8}%`}
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Fio Luminoso Dourado/Esmeralda */}
              <line
                x1={`${posA.left}%`}
                y1={`${posA.top}%`}
                x2={`${posB.left}%`}
                y2={`${posB.top}%`}
                stroke={isActiveChallengeSolved ? '#34d399' : '#f59e0b'}
                strokeWidth="3.5"
                strokeDasharray={isActiveChallengeSolved ? 'none' : '8 5'}
                filter="url(#desk-thread-glow)"
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* Pinos Físicos Compactos sobre o Tampo da Mesa 3D (Deixam a Mesa 3D Visível!) */}
          {cluesOnTable.slice(0, 6).map((clue, idx) => {
            const pos = TABLE_PIN_POSITIONS[idx % TABLE_PIN_POSITIONS.length];
            const slotIdx = boardSelectedClues.indexOf(clue.id);
            const isPicked = slotIdx !== -1;
            const isSolvedClue =
              isActiveChallengeSolved &&
              activeChallenge?.requiredClueIds?.includes(clue.id);

            return (
              <button
                key={clue.id}
                type="button"
                onClick={() => {
                  if (!isActiveChallengeSolved) {
                    soundEngine.playDocumentOpen();
                    onToggleBoardClue(clue.id);
                  }
                }}
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  transform: `translate(-50%, -50%) rotate(${isPicked ? 0 : pos.rot}deg)`,
                }}
                className={`absolute z-20 w-[28%] sm:w-[25%] max-w-[190px] pt-3 pb-1.5 px-2 sm:px-3 rounded-lg border text-left transition-all duration-200 cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.9)] ${
                  isSolvedClue
                    ? 'bg-[#0B221D]/95 border-2 border-emerald-400 scale-105 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                    : isPicked
                    ? slotIdx === 0
                      ? 'bg-[#1F1608]/95 border-2 border-amber-400 scale-105 shadow-[0_0_25px_rgba(245,158,11,0.55)]'
                      : 'bg-[#081C24]/95 border-2 border-cyan-400 scale-105 shadow-[0_0_25px_rgba(6,182,212,0.55)]'
                    : 'bg-[#0A101D]/90 border-amber-500/40 hover:border-amber-300 hover:scale-105'
                }`}
              >
                {/* Cabeça do Pino Metálico 3D */}
                <span
                  className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-slate-950 shadow ${
                    isSolvedClue
                      ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                      : isPicked
                      ? slotIdx === 0
                        ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                        : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                      : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  }`}
                />

                <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] font-mono uppercase text-amber-400 font-bold">
                  <span className="truncate">PINO 0{idx + 1}</span>
                  {isPicked && (
                    <span
                      className={`px-1 rounded text-[8px] sm:text-[9px] font-bold ${
                        slotIdx === 0
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-cyan-400 text-slate-950'
                      }`}
                    >
                      {slotIdx === 0 ? 'A' : 'B'}
                    </span>
                  )}
                </div>

                <div className="text-[10px] sm:text-xs font-sans font-bold text-white line-clamp-2 leading-tight mt-0.5">
                  {clue.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          3. PAINEL DE VALIDAÇÃO DO FIO E DETALHES DAS FICHAS (ABAIXO DA MESA 3D, COM SCROLL LIVRE)
         ===================================================================== */}
      {isActiveChallengeSolved && activeChallenge ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/35 border border-emerald-500/50 space-y-2 shadow-lg">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Vínculo Comprovado na Mesa (+{activeChallenge.xpReward} XP)</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white">
            {activeChallenge.successTitle}
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {activeChallenge.conclusionText}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#0B1320]/95 border border-amber-500/35 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                slotAClue
                  ? 'bg-amber-500/15 border-amber-400 text-white font-semibold'
                  : 'bg-[#060A12] border-dashed border-slate-700 text-slate-400'
              }`}
            >
              <span className="text-amber-400 font-mono text-[10px] block uppercase">
                Pino de Evidência A
              </span>
              <span className="line-clamp-1">
                {slotAClue ? slotAClue.title : 'Toque no 1º pino na mesa 3D acima'}
              </span>
            </div>

            <div className="hidden sm:flex items-center justify-center px-1 text-amber-400">
              <Link2 className="w-4 h-4" />
            </div>

            <div
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                slotBClue
                  ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold'
                  : 'bg-[#060A12] border-dashed border-slate-700 text-slate-400'
              }`}
            >
              <span className="text-cyan-400 font-mono text-[10px] block uppercase">
                Pino de Evidência B
              </span>
              <span className="line-clamp-1">
                {slotBClue ? slotBClue.title : 'Toque no 2º pino na mesa 3D acima'}
              </span>
            </div>

            <button
              type="button"
              onClick={onValidateConnection}
              disabled={boardSelectedClues.length !== 2}
              className={`px-5 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all shrink-0 ${
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
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm ${
                connectionFeedback.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100'
                  : 'bg-red-950/50 border-red-500/50 text-red-100'
              }`}
            >
              {connectionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                {connectionFeedback.title && (
                  <div className="font-bold mb-0.5">{connectionFeedback.title}</div>
                )}
                <p>{connectionFeedback.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista Compacta das Fichas Abaixo da Mesa (Permite ler os trechos com scroll livre) */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
          Detalhamento das Fichas na Mesa (Toque para pinçar ou ler o trecho):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {cluesOnTable.map((clue, idx) => {
            const slotIdx = boardSelectedClues.indexOf(clue.id);
            const isPicked = slotIdx !== -1;
            const isExpanded = expandedClueId === clue.id;

            return (
              <div
                key={clue.id}
                onClick={() => {
                  if (!isActiveChallengeSolved) {
                    soundEngine.playDocumentOpen();
                    onToggleBoardClue(clue.id);
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isPicked
                    ? slotIdx === 0
                      ? 'bg-amber-500/15 border-amber-400'
                      : 'bg-cyan-500/15 border-cyan-400'
                    : 'bg-[#0B111E] border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                  <span className="text-amber-400 font-bold">
                    PINO 0{idx + 1} • {clue.docCode.split('//')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setExpandedClueId(isExpanded ? null : clue.id);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white cursor-pointer"
                  >
                    {isExpanded ? 'Ocultar trecho' : 'Ler trecho'}
                  </button>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {clue.title}
                </div>
                {isExpanded && (
                  <p className="text-xs text-slate-300 leading-relaxed pt-1.5 border-t border-slate-800">
                    "{clue.excerpt}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          4. RODAPÉ DA ETAPA 2 (SEMPRE ACESSÍVEL COM SCROLL, NUNCA CORTADO)
         ===================================================================== */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B111E]/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelectStep(1)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
        >
          ← Voltar ao Arquivo (Etapa 1)
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playDocumentOpen();
            onSelectStep(3);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Formular Hipótese (Etapa 3)</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
