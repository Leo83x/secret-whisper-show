import React, { useState, useEffect, useRef } from 'react';
import {
  HistoricalNode,
  EvidenceDocument,
  ConnectionChallenge,
  HypothesisThesis,
  SimulationChoice,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import {
  Award,
  FolderOpen,
  ArrowRight,
  Volume2,
  VolumeX,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { ExtractedClueItem } from './CrossExamination3DStage';

interface AuditReport3DStageProps {
  selectedCase: HistoricalNode;
  documents: EvidenceDocument[];
  challenges: ConnectionChallenge[];
  theses: HypothesisThesis[];
  simChoices: SimulationChoice[];
  extractedCluesList: ExtractedClueItem[];
  allCaseClues: ExtractedClueItem[];
  solvedConnectionIds: string[];
  selectedThesisId: string | undefined;
  hypothesisScore: 'forte' | 'parcial' | 'fraca' | undefined;
  hypothesisReasoning: string | undefined;
  selectedDecisionId: string | undefined;
  mapConnectionsUnlocked: boolean;
  xpBreakdown: {
    cluesXp: number;
    connectionsXp: number;
    hypothesisXp: number;
    decisionXp: number;
    totalCaseXp: number;
  };
  onReturnToMap: () => void;
  onOpenArchiveDrawer: () => void;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onSwitchTo2D?: () => void;
}

export const AuditReport3DStage: React.FC<AuditReport3DStageProps> = ({
  selectedCase,
  challenges,
  theses,
  simChoices,
  extractedCluesList,
  allCaseClues,
  solvedConnectionIds,
  selectedThesisId,
  hypothesisScore,
  selectedDecisionId,
  mapConnectionsUnlocked,
  xpBreakdown,
  onReturnToMap,
  onOpenArchiveDrawer,
  onSelectStep,
  onSwitchTo2D,
}) => {
  const [camRotX, setCamRotX] = useState<number>(3);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.03);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
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

  const registeredThesis = theses.find(t => t.id === selectedThesisId);
  const registeredDecision = simChoices.find(c => c.id === selectedDecisionId);
  const validatedChallenges = challenges.filter(ch => solvedConnectionIds.includes(ch.id));

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
      className="fixed inset-0 top-0 left-0 !mt-0 !m-0 z-50 w-screen h-[100dvh] overflow-hidden bg-[#04060B] select-none font-sans flex flex-col justify-between"
      style={{ perspective: '1300px' }}
    >
      {/* 1. CENÁRIO 3D REALISTA DE FUNDO (CÂMARA DE AUDITORIA HISTÓRICA) */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
        }}
      >
        <img
          src="/dossiers/audit_chamber_3d_clean.webp"
          alt="Câmara de Auditoria Histórica 3D"
          draggable={false}
          className="w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-500"
          style={{ filter: 'brightness(0.95) contrast(1.06)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.14) 0%, rgba(245, 158, 11, 0.08) 38%, transparent 75%)',
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

            <div className="relative">
              <button
                type="button"
                onClick={() => setStageMenuOpen(o => !o)}
                className="px-2.5 py-1 rounded bg-[#090D16]/80 hover:bg-[#111827]/90 border border-amber-500/40 text-[11px] font-mono text-slate-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-md"
              >
                <span className="text-emerald-400 font-bold">5. Câmara de Auditoria</span>
                <span className="text-slate-300 hidden sm:inline">(Laudo Final)</span>
                <Award className="w-3 h-3 text-amber-400 ml-0.5" />
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
                        st.num === 5
                          ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-400/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span>{st.label}</span>
                      {st.num === 5 && <span className="text-[10px] text-amber-400">ATUAL</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
            {onSwitchTo2D && (
              <button
                type="button"
                onClick={onSwitchTo2D}
                className="px-2.5 py-1.5 rounded bg-[#090D16]/75 hover:bg-[#131C2E]/90 border border-slate-600/80 hover:border-amber-400/60 text-[11px] font-mono text-slate-200 hover:text-white cursor-pointer backdrop-blur-md transition-all"
              >
                [ Alternar: <span className="text-amber-300 font-semibold">3D</span> / Leitura 2D ]
              </button>
            )}

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
          </div>
        </div>
      </div>

      {/* 3. FICHAS DE AUDITORIA TRANSLÚCIDAS E COMPACTAS (SEM SCROLL) */}
      <div
        data-hud="true"
        className="relative z-30 flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 flex flex-col justify-start md:justify-center gap-2.5 overflow-y-auto md:overflow-hidden py-2 md:py-0"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1320]/45 backdrop-blur-sm border border-amber-400/40 space-y-3 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>LAUDO OFICIAL DE AUDITORIA HISTÓRICA // STRATA ARCHIVES</span>
              </div>
              <h2 className="font-sans text-base sm:text-xl font-bold text-white">
                {selectedCase.fullName} ({selectedCase.year})
              </h2>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-[#090D16]/75 border border-amber-400/50 text-center">
              <div className="text-[9px] font-mono uppercase text-slate-300">Mérito no Caso</div>
              <div className="text-base sm:text-lg font-mono font-bold text-amber-300">
                +{xpBreakdown.totalCaseXp} XP
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#090D16]/60 border border-slate-700/70">
              <div className="text-[9px] font-mono uppercase text-slate-300">Pistas Extraídas</div>
              <div className="text-sm sm:text-base font-bold text-emerald-300 mt-0.5">
                {extractedCluesList.length}/{allCaseClues.length}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090D16]/60 border border-slate-700/70">
              <div className="text-[9px] font-mono uppercase text-slate-300">Vínculos Comprovados</div>
              <div className="text-sm sm:text-base font-bold text-cyan-300 mt-0.5">
                {validatedChallenges.length}/{challenges.length}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090D16]/60 border border-slate-700/70">
              <div className="text-[9px] font-mono uppercase text-slate-300">Consistência</div>
              <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5 uppercase">
                {hypothesisScore === 'forte'
                  ? 'Alta (+100 XP)'
                  : hypothesisScore === 'parcial'
                  ? 'Parcial (+60 XP)'
                  : hypothesisScore === 'fraca'
                  ? 'Baixa (+25 XP)'
                  : 'Registrada'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090D16]/60 border border-slate-700/70">
              <div className="text-[9px] font-mono uppercase text-slate-300">Elos Históricos</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {mapConnectionsUnlocked ? 'Desbloqueados' : 'Em Aberto'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-700/70 space-y-1">
              <div className="text-[10px] font-mono uppercase text-amber-300 font-bold">
                Hipótese Registrada:
              </div>
              <div className="text-xs sm:text-sm font-sans font-bold text-white line-clamp-2">
                {registeredThesis ? registeredThesis.title : 'Nenhuma hipótese formal selecionada.'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16]/60 border border-slate-700/70 space-y-1">
              <div className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Ordem Assinada em Campo:
              </div>
              <div className="text-xs sm:text-sm font-sans font-bold text-white line-clamp-2">
                {registeredDecision ? registeredDecision.title : 'Decisão estratégica em aberto.'}
              </div>
            </div>
          </div>
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
            onClick={() => onSelectStep(1)}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            Revisar Arquivo (Etapa 1)
          </button>
        </div>

        <button
          type="button"
          onClick={onReturnToMap}
          className="pointer-events-auto px-6 sm:px-8 py-2.5 rounded-lg font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#e3c485] via-[#cfa75b] to-[#b08639] hover:from-[#ebd098] hover:to-[#c29746] text-slate-950 border border-amber-200/70"
        >
          <Globe className="w-4 h-4" />
          <span>RETORNAR AO MAPA MUNDIAL</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
