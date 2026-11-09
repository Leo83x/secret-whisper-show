import React, { useState, useEffect, useRef } from 'react';
import {
  HypothesisThesis,
  HistoricalNode,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import { AmbientParticlesCanvas, DecisionStamp, GameButton, HistoricalCharacterPortrait, TypewriterText } from './GameInteractionSystem';
import { getEra3DTheme } from '../../utils/era3DTheme';
import {
  Info,
  FolderOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  ArrowRight,
  FileText,
  Check,
  Lightbulb,
  RotateCcw,
  Layers,
  X,
} from 'lucide-react';
import { ExtractedClueItem } from './CrossExamination3DStage';

interface ForensicAnalysis3DStageProps {
  selectedCase: HistoricalNode;
  theses: HypothesisThesis[];
  chosenThesisId: string;
  expandedThesisId: string | null;
  hypothesisClues: string[];
  reasoningText: string;
  isNotesOpen: boolean;
  hypothesisResult: {
    score: 'forte' | 'parcial' | 'fraca';
    feedback: string;
    xpAwarded: number;
  } | null;
  extractedCluesList: ExtractedClueItem[];
  allCaseClues: ExtractedClueItem[];
  allCaseCluesCount: number;
  onSelectThesis: (id: string) => void;
  onToggleExpandThesis: (id: string) => void;
  onToggleHypothesisClue: (clueId: string) => void;
  onUpdateReasoningText: (text: string) => void;
  onToggleNotesOpen: () => void;
  onSubmitHypothesis: () => void;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onOpenArchiveDrawer: () => void;
  onSwitchTo2D: () => void;
  onRequestExit?: () => void;
}

export const ForensicAnalysis3DStage: React.FC<ForensicAnalysis3DStageProps> = ({
  selectedCase,
  theses,
  chosenThesisId,
  expandedThesisId,
  hypothesisClues,
  reasoningText,
  isNotesOpen,
  hypothesisResult,
  extractedCluesList,
  allCaseClues,
  allCaseCluesCount,
  onSelectThesis,
  onToggleExpandThesis,
  onToggleHypothesisClue,
  onUpdateReasoningText,
  onToggleNotesOpen,
  onSubmitHypothesis,
  onSelectStep,
  onOpenArchiveDrawer,
  onSwitchTo2D,
  onRequestExit,
}) => {
  const eraTheme = getEra3DTheme(selectedCase.id);
  // Dolly-In Camera Zoom: Starts at normal scale and smoothly zooms into the open forensic folder
  const [camRotX, setCamRotX] = useState<number>(1);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.08);

  useEffect(() => {
    setCamScale(1.08);
    const timer = setTimeout(() => {
      setCamScale(1.22);
      setCamRotX(1);
    }, 60);
    return () => clearTimeout(timer);
  }, [selectedCase.id]);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [stageMenuOpen, setStageMenuOpen] = useState(false);
  const [muted, setMuted] = useState(() => soundEngine.getSettings().mutedAll);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 3,
    rotY: 0,
  });

  // Atmosfera Sonora Adaptativa e Assinatura da Etapa 3 (Incerteza, Análise e Hipótese)
  useEffect(() => {
    soundEngine.setCaseAtmosphere(selectedCase.id, 3);
    soundEngine.playStageIntroMotif(3);
  }, [selectedCase.id]);

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();
    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0011;
      setCamRotY(Math.sin(elapsed) * 4.5);
      setCamRotX(3 + Math.cos(elapsed * 0.8) * 2);
      frameId = requestAnimationFrame(animateOrbit);
    };
    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('textarea') || target.closest('[data-hud="true"]')) return;
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
      const nextY = Math.max(-9, Math.min(9, dragStartRef.current.rotY + dx * 0.04));
      const nextX = Math.max(-4, Math.min(10, dragStartRef.current.rotX - dy * 0.035));
      setCamRotY(nextY);
      setCamRotX(nextX);
    } else if (!isAutoOrbiting) {
      setCamRotY(nx * -2.2);
      setCamRotX(3 + ny * 1.5);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const availableClues = extractedCluesList.length > 0 ? extractedCluesList : allCaseClues;
  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  const stepsList: { num: 1 | 2 | 3 | 4 | 5; label: string }[] = [
    { num: 1, label: '1. Observar Evidências' },
    { num: 2, label: '2. Mesa de Conexões' },
    { num: 3, label: '3. Formular Hipótese' },
    { num: 4, label: '4. Tomar Decisão' },
    { num: 5, label: '5. Consequências' },
  ];

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed inset-0 top-0 left-0 !mt-0 !m-0 z-50 w-screen h-[100dvh] overflow-hidden bg-[#04060B] select-none font-sans flex flex-col justify-between cursor-game-grab"
      style={{ perspective: '1300px' }}
    >
      {/* 1. CENÁRIO 3D REALISTA DE FUNDO (SALA DE ANÁLISE & PASTA PERICIAL) */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
        }}
      >
        <img
          src="/dossiers/forensic_analysis_room_3d_clean.webp"
          alt="Sala de Análise e Pasta Pericial 3D"
          draggable={false}
          className="w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-500"
          style={{
            filter: bankerLampOn
              ? 'brightness(0.95) contrast(1.06)'
              : 'brightness(0.65) contrast(1.1) saturate(0.85)',
          }}
        />
        {bankerLampOn && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 75% 32%, rgba(251, 191, 36, 0.16) 0%, rgba(6, 182, 212, 0.05) 42%, transparent 72%)',
            }}
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 52%, rgba(4,6,11,0.08) 0%, rgba(4,6,11,0.68) 62%, rgba(4,6,11,0.95) 100%)',
          }}
        />
      </div>

      <AmbientParticlesCanvas tint="gold" />

      {/* 2. BARRA ÚNICA DE TOPO FLUTUANTE (SEM SEGUNDA BARRA DUPLICADA) */}
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
                
                <Info className="w-3 h-3 text-amber-400 italic" />
                <span>Briefing</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStageMenuOpen(o => !o)}
                  className="game-btn-capsule game-btn-capsule-active px-3.5 py-1.5 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-amber-400 font-bold">3. Formular Hipótese</span>
                  <span className="text-slate-300 hidden sm:inline">(Etapa Ativa)</span>
                  <FileText className="w-3 h-3 text-amber-400 ml-0.5" />
                </button>

                {stageMenuOpen && (
                  <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-[#090D16]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl p-1.5 z-50 space-y-1">
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
                          st.num === 3
                            ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-400/40'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span>{st.label}</span>
                        {st.num === 3 && <span className="text-[10px] text-amber-400">ATUAL</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onSwitchTo2D}
              className="game-btn-capsule px-3.5 py-1.5 text-[11px] font-mono cursor-pointer"
            >
              Alternar: <span className="text-amber-300 font-semibold">3D</span> / 2D
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="game-btn-capsule px-3.5 py-1.5 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
            >
              
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Arquivo Pessoal:{' '}
                <strong className="text-amber-300">
                  {extractedCluesList.length}/{allCaseCluesCount}
                </strong>{' '}
                Pistas ]
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBankerLampOn(v => !v)}
              className="game-btn-capsule p-2 text-amber-300 cursor-pointer"
              title="Luminária de Mesa"
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="game-btn-capsule p-2 text-cyan-300 cursor-pointer"
              title={muted ? 'Reativar áudio' : 'Silenciar'}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {onRequestExit && (
              <button
                type="button"
                onClick={onRequestExit}
                className="game-btn-capsule px-3.5 py-1.5 text-xs font-mono cursor-pointer"
              >
                Sair da Operação
              </button>
            )}
          </div>
        </div>

        {briefingOpen && (
          <div className="pointer-events-auto mt-2 max-w-xl p-3 rounded-xl bg-[#090D16]/90 backdrop-blur-xl border border-amber-500/40 text-xs text-slate-200 leading-relaxed shadow-2xl flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-0.5">
                BRIEFING // ETAPA 3 — FORMULAR HIPÓTESE
              </div>
              <p>
                Selecione a tese pericial que melhor explica o caso e marque as pistas de sustentação na pasta.
              </p>
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

      {/* 3. FICHAS NATURAIS TRANSLÚCIDAS SOBRE A MESA (SEM SCROLL E COM >60% DO CENÁRIO VISÍVEL) */}
      <div
        data-hud="true"
        className="relative z-30 flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 flex flex-col justify-start md:justify-center gap-2.5 overflow-y-auto md:overflow-hidden py-2 md:py-0"
      >
        {/* Pergunta com Ficha Pericial do Personagem e Typewriter */}
        <div className="px-3.5 py-2.5 rounded-xl bg-[#070B14]/94 backdrop-blur-md border border-amber-400/55 shadow-[0_8px_25px_rgba(0,0,0,0.9)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HistoricalCharacterPortrait
              image={selectedCase.image}
              name={selectedCase.name}
              year={selectedCase.year}
              variant="pericial-file"
              className="shrink-0"
            />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                PASTA PERICIAL ({selectedCase.location.toUpperCase()} • {selectedCase.year}) //
              </span>
              <TypewriterText
                text="Qual interpretação explica melhor o caso investigado?"
                speedMs={15}
                delayMs={50}
                className="text-sm sm:text-base font-sans font-bold text-white block mt-0.5"
              />
            </div>
          </div>
          {hypothesisResult && (
            <span className="px-2.5 py-1 rounded bg-emerald-500/25 border border-emerald-400/60 text-xs font-mono text-emerald-200 font-bold">
              Consistência {hypothesisResult.score.toUpperCase()} (+{hypothesisResult.xpAwarded} XP)
            </span>
          )}
        </div>

        {/* 3 Teses como Fichas Translúcidas Compactas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {theses.map(th => {
            const isSelected = chosenThesisId === th.id;
            const isExpanded = expandedThesisId === th.id;
            return (
              <div
                key={th.id}
                onClick={() => {
                  soundEngine.playWaxStamp();
                  onSelectThesis(th.id);
                }}
                className={`game-order-sheet p-3.5 rounded-xl backdrop-blur-md border transition-all cursor-game-pen flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0D1626]/95 border-amber-300 ring-2 ring-amber-400/40 shadow-[0_0_28px_rgba(245,158,11,0.5)]'
                    : 'bg-[#070B14]/92 border-amber-500/45 hover:bg-[#0A101D]/98 hover:border-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.9)]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300 uppercase">
                      {th.tag}
                    </span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleExpandThesis(th.id);
                      }}
                      className="text-[10px] font-mono text-cyan-300 hover:underline cursor-pointer"
                    >
                      {isExpanded ? '[ Ocultar ]' : '[ Ler detalhe ]'}
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-sans font-bold text-white leading-snug line-clamp-2">
                    {th.title}
                  </div>
                  {isExpanded && (
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed pt-1.5 border-t border-slate-700/60 line-clamp-3">
                      {th.description}
                    </p>
                  )}
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={isSelected ? 'text-amber-200 font-bold' : 'text-slate-300'}>
                    {isSelected ? '✓ TESE SELECIONADA' : 'Clique para selecionar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pistas de Sustentação em Chips Compactos Translúcidos */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#070B14]/92 backdrop-blur-md border border-amber-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.9)] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              Anexar Provas à Pasta ({hypothesisClues.length}/3):
            </span>
            <button
              type="button"
              onClick={onToggleNotesOpen}
              className="text-[11px] font-mono text-cyan-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              {isNotesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isNotesOpen ? 'Ocultar nota' : '+ Nota pericial (opcional)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {availableClues.slice(0, 6).map(clue => {
              const attached = hypothesisClues.includes(clue.id);
              return (
                <button
                  key={clue.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClueSaved();
                    onToggleHypothesisClue(clue.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    attached
                      ? 'bg-emerald-500/25 border-emerald-400 text-white'
                      : 'bg-[#0B1220]/95 border-slate-600/80 text-slate-100 hover:border-amber-400/50'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                      attached ? 'bg-emerald-400 border-emerald-300 text-slate-950' : 'border-slate-500'
                    }`}
                  >
                    {attached && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div className="min-w-0 truncate">
                    <span className="text-[11px] font-mono text-amber-400 font-extrabold mr-1.5">
                      {clue.docCode.split('//')[0].trim()}
                    </span>
                    <span className="text-xs font-sans font-semibold text-white truncate">{clue.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {isNotesOpen && (
            <textarea
              rows={2}
              value={reasoningText}
              onChange={e => onUpdateReasoningText(e.target.value)}
              placeholder="Registre uma nota curta de sustentação..."
              className="w-full p-2 rounded-lg bg-[#050811]/85 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          )}
        </div>
      </div>

      {/* 4. RODAPÉ FLUTUANTE COMPACTO */}
      <div
        data-hud="true"
        className="relative z-40 w-full px-3 sm:px-6 pb-2.5 sm:pb-4 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center gap-2 text-xs font-mono text-slate-200 bg-[#090D16]/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80">
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className="text-amber-300 hover:text-amber-200 font-semibold cursor-pointer"
          >
            [ {isAutoOrbiting ? 'Pausar Câmera' : 'Orbitar Câmera'} ]
          </button>
          <span className="text-slate-400">•</span>
          <button
            type="button"
            onClick={onSubmitHypothesis}
            disabled={!chosenThesisId}
            className={`font-bold cursor-pointer ${
              chosenThesisId ? 'text-cyan-300 hover:underline' : 'text-slate-500 cursor-not-allowed'
            }`}
          >
            [ Validar Hipótese ]
          </button>
        </div>

        <div className="pointer-events-auto">
          <GameButton
            onClick={() => {
              if (chosenThesisId && !hypothesisResult) {
                onSubmitHypothesis();
              }
              soundEngine.playDocumentOpen();
              onSelectStep(4);
            }}
            className="shrink-0"
          >
            AVANÇAR PARA SIMULAÇÃO (ETAPA 4)
          </GameButton>
        </div>
      </div>
    </div>
  );
};
