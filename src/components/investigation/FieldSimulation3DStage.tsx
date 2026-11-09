import React, { useState, useEffect, useRef } from 'react';
import {
  SimulationChoice,
  HistoricalNode,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import { AmbientParticlesCanvas, DecisionStamp, SignatureStrokeSvg, GameButton, HistoricalCharacterPortrait, TypewriterText } from './GameInteractionSystem';
import { getEra3DTheme } from '../../utils/era3DTheme';
import {
  Info,
  FolderOpen,
  Volume2,
  VolumeX,
  ArrowRight,
  Scale,
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
  onRequestExit?: () => void;
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
  onRequestExit,
}) => {
  const eraTheme = getEra3DTheme(selectedCase.id);
  const [camRotX, setCamRotX] = useState<number>(5);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.08);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
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

  // Atmosfera Sonora Adaptativa e Assinatura da Etapa 4 (Queda Tensa no Volume e Urgência de Decisão)
  useEffect(() => {
    soundEngine.setCaseAtmosphere(selectedCase.id, 4);
    soundEngine.playStageIntroMotif(4);
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
      setCamRotY(Math.max(-9, Math.min(9, dragStartRef.current.rotY + dx * 0.04)));
      setCamRotX(Math.max(-4, Math.min(10, dragStartRef.current.rotX - dy * 0.035)));
    } else if (!isAutoOrbiting) {
      setCamRotY(nx * -2.2);
      setCamRotX(3 + ny * 1.5);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

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
      {/* 1. CENÁRIO 3D REALISTA DE FUNDO (SIMULAÇÃO DE CAMPO HISTÓRICA) */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
        }}
      >
        <img
          src={eraTheme.stage4SimulationBg}
          alt="Simulação de Campo Histórica 3D"
          draggable={false}
          className="w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-500"
          style={{ filter: 'brightness(0.62) contrast(1.14) saturate(0.95)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 54%, rgba(34, 211, 238, 0.24) 0%, rgba(245, 158, 11, 0.16) 26%, rgba(4, 6, 11, 0.88) 68%, rgba(4, 6, 11, 0.97) 100%)',
          }}
        />
        {/* Projetor de Maquete Tática 3D Iluminando o Quarto Escuro */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        >
          <defs>
            <radialGradient id="maquetteGlow" cx="50%" cy="55%" r="38%">
              <stop offset="0%" stopColor={eraTheme.primaryAccentHex} stopOpacity="0.42" />
              <stop offset="55%" stopColor={eraTheme.secondaryAccentHex} stopOpacity="0.16" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="58" rx="36" ry="22" fill="url(#maquetteGlow)" />
          <ellipse cx="50" cy="58" rx="28" ry="15" fill="none" stroke={eraTheme.primaryAccentHex} strokeWidth="0.18" strokeDasharray="1.2 0.8" />
          <ellipse cx="50" cy="58" rx="18" ry="9.5" fill="none" stroke={eraTheme.secondaryAccentHex} strokeWidth="0.22" />
          <line x1="22" y1="58" x2="78" y2="58" stroke={eraTheme.primaryAccentHex} strokeWidth="0.14" strokeOpacity="0.7" />
          <line x1="50" y1="38" x2="50" y2="78" stroke={eraTheme.secondaryAccentHex} strokeWidth="0.14" strokeOpacity="0.7" />
          {/* Feixes volumétricos 3D subindo da maquete sobre a mesa */}
          <polygon points="36,58 32,18 40,18" fill={eraTheme.primaryAccentHex} fillOpacity="0.09" />
          <polygon points="50,54 45,12 55,12" fill={eraTheme.secondaryAccentHex} fillOpacity="0.11" />
          <polygon points="64,58 60,18 68,18" fill={eraTheme.primaryAccentHex} fillOpacity="0.09" />
          <circle cx="36" cy="58" r="0.8" fill="#fef08a" />
          <circle cx="50" cy="54" r="1.0" fill="#67e8f9" />
          <circle cx="64" cy="58" r="0.8" fill="#fef08a" />
        </svg>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,6,11,0.72) 0%, rgba(4,6,11,0.12) 20%, rgba(4,6,11,0.18) 80%, rgba(4,6,11,0.85) 100%)',
          }}
        />
      </div>

      {/* 2. BARRA ÚNICA DE TOPO FLUTUANTE */}
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
                  <span className="text-amber-400 font-bold">4. Simulação de Campo</span>
                  <span className="text-slate-300 hidden sm:inline">(Etapa Ativa)</span>
                  <Scale className="w-3 h-3 text-amber-400 ml-0.5" />
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
                          st.num === 4
                            ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-400/40'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span>{st.label}</span>
                        {st.num === 4 && <span className="text-[10px] text-amber-400">ATUAL</span>}
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
              <span>Arquivo Pessoal</span>
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="game-btn-capsule p-2 text-cyan-300 cursor-pointer"
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
                CONTEXTO DE CAMPO // ETAPA 4
              </div>
              <p>{selectedCase.simulationPrompt}</p>
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

      {/* 3. ORDENS DE COMANDO EM FICHAS TRANSLÚCIDAS COMPACTAS */}
      <div
        data-hud="true"
        className="relative z-30 flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 flex flex-col justify-start md:justify-center gap-2.5 overflow-y-auto md:overflow-hidden py-2 md:py-0"
      >
        <div className="px-4 py-3 rounded-xl bg-[#070B14]/94 backdrop-blur-md border border-amber-400/55 shadow-[0_10px_30px_rgba(0,0,0,0.95)] flex flex-wrap items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <HistoricalCharacterPortrait
              image={selectedCase.image}
              name={selectedCase.name}
              year={selectedCase.year}
              variant="dramatic-bust"
              className="shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                DILEMA ESTRATÉGICO DE CAMPO // {eraTheme.eraName.toUpperCase()}
              </span>
              <h2 className="text-sm sm:text-lg font-sans font-bold text-white mt-0.5">
                Diante do padrão identificado, qual ordem tática você assina?
              </h2>
              <div className="text-slate-100 text-xs sm:text-sm mt-1.5 mb-1 leading-relaxed font-medium">
                <TypewriterText
                  text={selectedCase.simulationPrompt || "Diante do padrão identificado, qual ordem tática você assina?"}
                  speedMs={14}
                  delayMs={60}
                  className="text-slate-100"
                />
              </div>
            </div>
          </div>
          {selectedDecisionId && (
            <span className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase flex items-center gap-1 shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> DECISÃO REGISTRADA
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {choices.map(choice => {
            const isSelected = selectedDecisionId === choice.id;
            const isExpanded = expandedChoiceId === choice.id;

            return (
              <div
                key={choice.id}
                onClick={() => { soundEngine.playPenScratch(); setTimeout(() => soundEngine.playWaxStamp(), 180); onSelectDecision(choice.id); }}
                className={`game-order-sheet p-4 rounded-xl backdrop-blur-md border transition-all cursor-game-pen flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0D1626]/96 border-amber-300 ring-2 ring-amber-400/40 shadow-[0_0_28px_rgba(245,158,11,0.5)]'
                    : 'bg-[#070B14]/92 border-amber-500/45 hover:bg-[#0A101D]/98 hover:border-amber-300 shadow-[0_8px_25px_rgba(0,0,0,0.92)]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-[10px] font-mono font-bold text-amber-300 uppercase">
                      ORDEM {choice.tag}
                    </span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleExpandChoice(choice.id);
                      }}
                      className="text-[10px] font-mono text-cyan-300 hover:underline cursor-pointer"
                    >
                      {isExpanded ? '[ Ocultar ]' : '[ Consequências ]'}
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm font-sans font-bold text-white leading-snug">
                    {choice.title}
                  </div>
                  <div className="text-xs font-mono text-cyan-200/95 leading-snug">
                    {choice.subtitle}
                  </div>
                  {isExpanded && (
                    <p className="text-xs text-slate-200 leading-relaxed pt-2 border-t border-white/10">
                      {choice.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1.5 text-[10px] font-mono">
                  {isSelected ? (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <SignatureStrokeSvg />
                      <DecisionStamp label="ORDEM ASSINADA" tone="gold" />
                    </div>
                  ) : (
                    <span className="text-amber-300/90 flex items-center justify-between">
                      <span>Rubricar e assinar ordem operacional</span>
                      <span>→</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
          <span>Assine uma ordem tática na mesa de campanha</span>
        </div>

        <div className="pointer-events-auto">
          <GameButton
            onClick={() => {
              soundEngine.playCaseConclusion();
              onSelectStep(5);
            }}
            className="shrink-0"
          >
            VER LAUDO DE AUDITORIA (ETAPA 5)
          </GameButton>
        </div>
      </div>
    </div>
  );
};
