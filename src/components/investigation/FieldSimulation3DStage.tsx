import React, { useState, useEffect, useRef } from 'react';
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
  const [camRotX, setCamRotX] = useState<number>(3);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.03);
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
      className="fixed inset-0 z-40 w-screen h-[100dvh] overflow-hidden bg-[#04060B] select-none font-sans flex flex-col justify-between"
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
          src="/dossiers/field_simulation_3d_clean.webp"
          alt="Simulação de Campo Histórica 3D"
          draggable={false}
          className="w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-500"
          style={{ filter: 'brightness(0.92) contrast(1.08)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 68% 45%, rgba(251, 191, 36, 0.16) 0%, rgba(180, 83, 9, 0.08) 38%, transparent 75%)',
          }}
        />
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
            <h1 className="font-sans text-xs sm:text-base font-bold uppercase tracking-wide text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] truncate max-w-[92vw] sm:max-w-none">
              {caseShortHeader}{' '}
              <span className="text-amber-300/90 font-semibold">
                ({selectedCase.name.toUpperCase()})
              </span>
            </h1>

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
              <span>Arquivo Pessoal ]</span>
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="p-1.5 rounded bg-[#090D16]/75 border border-slate-600/70 text-cyan-300 hover:text-white cursor-pointer backdrop-blur-md"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {onRequestExit && (
              <button
                type="button"
                onClick={onRequestExit}
                className="px-3 py-1.5 rounded bg-gradient-to-b from-[#d8b878] to-[#b38e46] hover:from-[#e4c88c] hover:to-[#c49d52] text-slate-950 font-sans font-bold text-xs shadow-lg cursor-pointer transition-all border border-amber-200/50"
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
        className="relative z-30 flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 flex flex-col justify-center gap-3 overflow-hidden"
      >
        <div className="px-3.5 py-2 rounded-xl bg-[#0b1320]/45 backdrop-blur-sm border border-amber-400/35 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
              DILEMA ESTRATÉGICO DE CAMPO
            </span>
            <h2 className="text-xs sm:text-base font-sans font-bold text-white">
              Diante do padrão identificado, qual ordem tática você assina?
            </h2>
          </div>
          {selectedDecisionId && (
            <span className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> DECISÃO REGISTRADA
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
                onClick={() => onSelectDecision(choice.id)}
                className={`p-3.5 rounded-xl backdrop-blur-sm border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/25 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                    : 'bg-[#0b1320]/40 border-amber-400/30 hover:bg-[#0b1320]/60 hover:border-amber-300/60'
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
                  <div className="text-[11px] font-mono text-cyan-200/90 line-clamp-1">
                    {choice.subtitle}
                  </div>
                  {isExpanded && (
                    <p className="text-[11px] text-slate-200 leading-relaxed pt-1.5 border-t border-white/10 line-clamp-3">
                      {choice.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={isSelected ? 'text-amber-200 font-bold' : 'text-amber-300/90'}>
                    {isSelected ? '✓ ORDEM ASSINADA' : 'Clique para assinar ordem →'}
                  </span>
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

        <button
          type="button"
          onClick={() => {
            soundEngine.playCaseConclusion();
            onSelectStep(5);
          }}
          className="pointer-events-auto px-5 sm:px-7 py-2.5 rounded-lg font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#e3c485] via-[#cfa75b] to-[#b08639] hover:from-[#ebd098] hover:to-[#c29746] text-slate-950 border border-amber-200/70"
        >
          <span>VER LAUDO DE AUDITORIA (ETAPA 5)</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
