import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { soundEngine, AudioAndMotionSettings } from '../../utils/investigationAudio';
import { CinematicModal, GameButton, GameIconButton, SceneTransition } from './GameInteractionSystem';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  Sliders,
  Maximize2,
  Minimize2,
  LogOut,
  CheckCircle2,
  Sparkles,
  Activity,
  Compass,
  FolderArchive,
  GitCommit,
  FileCheck2,
} from 'lucide-react';

interface ImmersiveInvestigationLayoutProps {
  children: React.ReactNode;
  onBackToBriefing?: () => void;
  onOpenArchive?: () => void;
}

interface StageTransitionBanner {
  from: number;
  to: number;
  title: string;
  subtitle: string;
}

export const ImmersiveInvestigationLayout: React.FC<ImmersiveInvestigationLayoutProps> = ({
  children,
  onBackToBriefing,
  onOpenArchive,
}) => {
  const {
    state,
    selectedCase,
    isAuthenticated,
    setIsAuthModalOpen,
    setActiveTab,
    setActiveStep,
    getCasePlayProgress,
  } = useInvestigation();

  const progress = getCasePlayProgress(selectedCase.id);
  const documents = selectedCase.documents || [];
  const challenges = selectedCase.connectionChallenges || [];
  const allCluesCount = documents.reduce((acc, d) => acc + d.clues.length, 0);

  const [audioSettings, setAudioSettings] = useState<AudioAndMotionSettings>(() =>
    soundEngine.getSettings()
  );
  const [audioPopoverOpen, setAudioPopoverOpen] = useState<boolean>(false);
  const [exitModalOpen, setExitModalOpen] = useState<boolean>(false);

  // Fullscreen API state
  const [isFullscreenSupported, setIsFullscreenSupported] = useState<boolean>(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState<boolean>(false);

  // Opening operation transition + Stage transition choreography
  const [entryBannerVisible, setEntryBannerVisible] = useState<boolean>(
    () => !soundEngine.getSettings().reduceMotion
  );
  const [stageTransition, setStageTransition] = useState<StageTransitionBanner | null>(null);
  const prevStepRef = useRef<number>(state.activeStep);
  const prevCaseIdRef = useRef<string>(selectedCase.id);

  useEffect(() => {
    return soundEngine.subscribe(next => setAudioSettings(next));
  }, []);

  // Opening Operation Transition on mount or case change
  useEffect(() => {
    if (audioSettings.reduceMotion) {
      setEntryBannerVisible(false);
      return;
    }
    setEntryBannerVisible(true);
    const timer = setTimeout(() => {
      setEntryBannerVisible(false);
    }, 420);
    return () => clearTimeout(timer);
  }, [selectedCase.id, audioSettings.reduceMotion]);

  // Dedicated Transitions Between Stages (1->2, 2->3, 3->4, 4->5)
  useEffect(() => {
    if (prevCaseIdRef.current !== selectedCase.id) {
      prevCaseIdRef.current = selectedCase.id;
      prevStepRef.current = state.activeStep;
      return;
    }

    const from = prevStepRef.current;
    const to = state.activeStep;
    if (from === to) return;
    prevStepRef.current = to;

    if (audioSettings.reduceMotion) {
      setStageTransition(null);
      return;
    }

    let title = 'Alternando Etapa Operacional';
    let subtitle = 'Sincronizando registros da sessão...';

    if (from === 1 && to === 2) {
      title = 'ETAPA 1 → ETAPA 2 // MESA DE EVIDÊNCIAS';
      subtitle = 'Recolhendo peças documentais e posicionando pistas extraídas na mesa de cruzamento...';
    } else if (from === 2 && to === 3) {
      title = 'ETAPA 2 → ETAPA 3 // FORMULAÇÃO DE HIPÓTESE';
      subtitle = 'Reorganizando conexões analíticas e abrindo compêndio de interpretação...';
    } else if (from === 3 && to === 4) {
      title = 'ETAPA 3 → ETAPA 4 // AMBIENTE DE SIMULAÇÃO';
      subtitle = 'Hipótese indexada. Carregando dilema estratégico e vetores de decisão...';
    } else if (from === 4 && to === 5) {
      title = 'ETAPA 4 → ETAPA 5 // RELATÓRIO DE AUDITORIA';
      subtitle = 'Consolidando consequências históricas, mérito investigativo e conexões...';
    } else {
      const labels: Record<number, string> = {
        1: '1. Observar Documentos',
        2: '2. Conectar Evidências',
        3: '3. Formular Hipótese',
        4: '4. Tomar Decisão',
        5: '5. Relatório de Consequências',
      };
      title = `TRANSIÇÃO DE ETAPA // ${labels[to] || ''}`;
      subtitle = 'Estado da investigação preservado.';
    }

    soundEngine.playStageTransition();
    setStageTransition({ from, to, title, subtitle });
    const timer = setTimeout(() => {
      setStageTransition(null);
    }, 680);

    return () => clearTimeout(timer);
  }, [state.activeStep, selectedCase.id, audioSettings.reduceMotion]);

  // Browser Fullscreen API check & event listeners
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsFullscreenSupported(Boolean(document.fullscreenEnabled));
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    }

    const handleFsChange = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };

    const handleFsError = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('fullscreenerror', handleFsError);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('fullscreenerror', handleFsError);
    };
  }, []);

  const toggleBrowserFullscreen = useCallback(async () => {
    if (typeof document === 'undefined' || !document.fullscreenEnabled) return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    }
  }, []);

  // Contextual ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      if (audioPopoverOpen) {
        e.stopPropagation();
        setAudioPopoverOpen(false);
        return;
      }

      const activeChildModal = document.querySelector('[data-immersive-modal="true"]');
      if (activeChildModal) {
        return;
      }

      setExitModalOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioPopoverOpen]);

  const handleConfirmExitToMap = async () => {
    setExitModalOpen(false);
    soundEngine.playDocumentOpen();
    setActiveTab('mapa');
  };

  const handleUpdateAudio = (partial: Partial<AudioAndMotionSettings>) => {
    const next = soundEngine.updateSettings(partial);
    setAudioSettings(next);
  };

  const steps: { num: 1 | 2 | 3 | 4 | 5; short: string; label: string; done: boolean }[] = [
    {
      num: 1,
      short: '1. Observar',
      label: '1. Observar',
      done: progress.extractedClueIds.length > 0,
    },
    {
      num: 2,
      short: '2. Conectar',
      label: '2. Conectar',
      done:
        challenges.length > 0 &&
        progress.solvedConnectionIds.length >= challenges.length,
    },
    {
      num: 3,
      short: '3. Hipótese',
      label: '3. Hipótese',
      done: Boolean(progress.selectedThesisId),
    },
    {
      num: 4,
      short: '4. Decidir',
      label: '4. Decidir',
      done: Boolean(progress.selectedDecisionId),
    },
    {
      num: 5,
      short: '5. Resultado',
      label: '5. Consequências',
      done: progress.completed,
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full bg-[#050811] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* TRANSIÇÃO CURTA DE ABERTURA DA OPERAÇÃO */}
      {entryBannerVisible && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 pointer-events-none bg-[#050811]/90 backdrop-blur-md flex items-center justify-center animate-out fade-out duration-300"
        >
          <div className="px-6 py-4 rounded-2xl bg-[#0B1320] border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold flex items-center justify-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>MODO IMERSIVO // TERMINAL OPERACIONAL ISOLADO</span>
            </div>
            <div className="text-base sm:text-lg font-sans font-bold text-white">
              {selectedCase.missionCode || 'OPERAÇÃO ATIVA'} — {selectedCase.fullName} ({selectedCase.year})
            </div>
            <div className="text-xs font-mono text-amber-300/90">
              Retomando na Etapa {state.activeStep} de 5 • Estado sincronizado
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          BARRA ÚNICA DE HUD IMERSIVO (AREJADA NO MOBILE E DESKTOP)
         ======================================================================= */}
      <header
        aria-label="HUD Operacional de Investigação"
        className="sticky top-0 z-40 w-full bg-[#050811]/95 backdrop-blur-md border-b border-amber-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.85)] select-none"
      >
        <div className="max-w-[1520px] w-full mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 min-w-0">
          
          {/* Esquerda: Botão Voltar ao Briefing + Identidade do Caso */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
            {onBackToBriefing && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playMechanicalClick();
                  onBackToBriefing();
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2a1e08] via-[#1a1305] to-[#0a0702] border border-amber-500/60 text-amber-300 hover:text-amber-100 hover:border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.85)] cursor-pointer active:scale-95 transition-all shrink-0"
                title="Retornar ao Hub de Apresentação da Missão"
              >
                <span className="font-serif text-sm">←</span>
                <span className="hidden min-[400px]:inline">Briefing</span>
              </button>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-amber-400/60 bg-[#060a12] shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.25)]">
                <img
                  src={selectedCase.image}
                  alt={selectedCase.name}
                  className="w-full h-full object-cover object-top select-none"
                />
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold truncate">
                  {selectedCase.missionCode || "CASO ATIVO"}
                </div>
                <div className="text-xs sm:text-sm font-serif font-bold text-white truncate">
                  {selectedCase.name} ({selectedCase.year})
                </div>
              </div>
            </div>
          </div>

          {/* Centro: Indicador Minimalista da Etapa Ativa (Sem abas entulhadas) */}
          <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2 flex-1 min-w-0 max-w-md mx-auto">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
              <span className="font-serif font-bold text-xs sm:text-sm text-amber-200 tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate">
                Etapa {state.activeStep} de 5: {steps.find(s => s.num === state.activeStep)?.short || "Investigação"}
              </span>
            </div>
            {/* 5 marcadores metálicos sutis de progresso */}
            <div className="flex items-center gap-1 sm:gap-1.5 mt-1">
              {steps.map(st => {
                const isCurrent = state.activeStep === st.num;
                return (
                  <button
                    key={st.num}
                    onClick={() => {
                      soundEngine.playDocumentOpen();
                      setActiveStep(st.num);
                    }}
                    title={`Alternar para ${st.label}`}
                    className={`transition-all cursor-pointer rounded-full ${
                      isCurrent
                        ? "w-5 sm:w-7 h-1.5 sm:h-2 bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.85)]"
                        : st.done
                        ? "w-2 sm:w-2.5 h-1.5 sm:h-2 bg-emerald-400/80 hover:bg-emerald-300"
                        : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-700/80 hover:bg-slate-500"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Direita: Ações Rápidas (Arquivo Pessoal + Áudio + Tela Cheia + Sair) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botão de Arquivo Pessoal flutuante com badge de pistas */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playMechanicalClick();
                if (onOpenArchive) {
                  onOpenArchive();
                } else {
                  soundEngine.playDocumentOpen();
                }
              }}
              className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2a1e08] via-[#1a1305] to-[#0a0702] border border-amber-500/60 text-amber-300 hover:text-amber-100 hover:border-amber-300 text-xs font-serif font-extrabold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.85)] cursor-pointer active:scale-95 transition-all"
              title="Abrir Arquivo Pessoal de Evidências"
            >
              <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline uppercase tracking-wider">Arquivo</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-[10px] font-mono text-amber-200 border border-amber-400/50">
                {progress.extractedClueIds.length}
              </span>
            </button>

            {/* Toggle de Áudio */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playMechanicalClick();
                soundEngine.toggleMuteAll();
              }}
              className="w-8 h-8 rounded-xl bg-[#0B1320] border border-amber-500/40 text-amber-300 hover:border-amber-300 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              title={audioSettings.mutedAll ? "Reativar Áudio" : "Silenciar Áudio"}
            >
              {audioSettings.mutedAll ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>

            {/* Botão de Tela Cheia */}
            {isFullscreenSupported && (
              <button
                type="button"
                onClick={toggleBrowserFullscreen}
                className="w-8 h-8 rounded-xl bg-[#0B1320] border border-slate-700 text-slate-300 hover:border-amber-400 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
                title={isBrowserFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
              >
                {isBrowserFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* Botão Sair da Operação */}
            <button
              type="button"
              onClick={() => setExitModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer hover:bg-red-900/50 transition-all active:scale-95"
              title="Sair da Operação"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden lg:inline">Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* =======================================================================
          ÁREA PRINCIPAL DA SESSÃO DE INVESTIGAÇÃO (AMPLO RESPIRO)
         ======================================================================= */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 min-w-0 relative">
        
        {/* Banner Rápido de Coreografia de Transição entre Etapas */}
        {stageTransition && (
          <SceneTransition
            stepNumber={stageTransition.to}
            title={stageTransition.title}
            subtitle={stageTransition.subtitle}
            eraLabel={`${selectedCase.missionCode || 'OPERAÇÃO'} • ${selectedCase.location} (${selectedCase.year})`}
          />
        )}

        <div
          key={`${selectedCase.id}-step-${state.activeStep}`}
          className="min-w-0"
        >
          {children}
        </div>
      </main>

      {/* =======================================================================
          MODAL DE CONFIRMAÇÃO DE SAÍDA DA OPERAÇÃO (ESC OU BOTÃO SAIR)
         ======================================================================= */}
      {exitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-operation-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#101829] via-[#0A101D] to-[#060A12] border-2 border-amber-400/55 shadow-[0_25px_90px_rgba(0,0,0,0.95)] p-6 space-y-5 game-modal-object">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> PROGRESSO SALVO AUTOMATICAMENTE
                </div>
                <h2 id="exit-operation-title" className="font-sans text-lg font-bold text-white">
                  Pausar Operação Investigativa?
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Dossiê Ativo:</span>
                <span className="text-white font-bold">{selectedCase.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Etapa Atual Salva:</span>
                <span className="text-amber-300 font-bold">Etapa {state.activeStep} de 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pistas no Arquivo:</span>
                <span className="text-emerald-300 font-bold">
                  {progress.extractedClueIds.length}/{allCluesCount} extraídas
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Conexões Validadas:</span>
                <span className="text-cyan-300 font-bold">
                  {progress.solvedConnectionIds.length}/{challenges.length}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ao retornar ao <strong>Mapa Mundial</strong>, toda a sua sessão permanece preservada. Quando voltar a este dossiê, você continuará exatamente na <strong>Etapa {state.activeStep}</strong>.
            </p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 items-center">
              <button
                type="button"
                onClick={() => setExitModalOpen(false)}
                className="game-btn-capsule w-full py-2.5 px-4 text-xs font-mono font-semibold cursor-pointer flex items-center justify-center order-2 sm:order-1"
              >
                Continuar [Esc]
              </button>
              <div className="w-full order-1 sm:order-2">
                <GameButton
                  size="sm"
                  onClick={handleConfirmExitToMap}
                  className="w-full text-xs font-bold tracking-wider"
                  showMagnifier={false}
                >
                  VOLTAR AO MAPA
                </GameButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
