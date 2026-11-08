import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { soundEngine, AudioAndMotionSettings } from '../../utils/investigationAudio';
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
}

interface StageTransitionBanner {
  from: number;
  to: number;
  title: string;
  subtitle: string;
}

export const ImmersiveInvestigationLayout: React.FC<ImmersiveInvestigationLayoutProps> = ({
  children,
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

    setStageTransition({ from, to, title, subtitle });
    const timer = setTimeout(() => {
      setStageTransition(null);
    }, 280);

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
        className="sticky top-0 z-40 w-full bg-[#070C18]/95 backdrop-blur-md border-b border-amber-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.65)]"
      >
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 min-w-0">
          
          {/* Topo Mobile / Esquerda Desktop: Identificação Limpa e Sem Aglutinação */}
          <div className="flex items-center justify-between lg:justify-start gap-3 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-[#060A12] border border-amber-400/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                <img
                  src="/reader/icons/icon-192.png"
                  alt="O Último Segredo"
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="min-w-0">
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-cyan-400 truncate">
                  <span>{selectedCase.missionCode || 'CASO ATIVO'}</span>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{isAuthenticated ? 'Sincronizado' : 'Salvo Local'}</span>
                  </button>
                </div>
                <h1 className="font-sans text-sm sm:text-base font-bold text-white truncate">
                  {selectedCase.fullName}{' '}
                  <span className="text-amber-400 font-normal text-xs sm:text-sm">
                    ({selectedCase.year})
                  </span>
                </h1>
              </div>
            </div>

            {/* Botões de Controle no Mobile (Bem espaçados) */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <button
                onClick={() => setAudioPopoverOpen(o => !o)}
                className="p-2 rounded-xl bg-[#0B1320] border border-cyan-500/30 text-cyan-300 cursor-pointer"
                title="Áudio e Movimento"
              >
                {audioSettings.mutedAll ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setExitModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Centro: Stepper Inteligente (No mobile mostra o nome completo da etapa ativa e números nas demais, sem truncar "1. Obse...") */}
          <nav
            aria-label="Etapas do Ciclo de Investigação"
            className="flex sm:grid sm:grid-cols-5 items-center gap-1.5 sm:gap-2 flex-1 max-w-2xl mx-auto w-full"
          >
            {steps.map(st => {
              const isCurrent = state.activeStep === st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => {
                    soundEngine.playDocumentOpen();
                    setActiveStep(st.num);
                  }}
                  className={`py-2 rounded-xl font-mono text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isCurrent
                      ? 'flex-1 sm:flex-initial px-3 bg-amber-500/20 text-amber-200 border-amber-400/70 font-bold shadow-[0_0_12px_rgba(245,158,11,0.18)]'
                      : st.done
                      ? 'w-10 sm:w-auto px-2 bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15'
                      : 'w-10 sm:w-auto px-2 bg-[#0B1320]/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {st.done && !isCurrent && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  {/* No mobile (< sm): Etapa ativa exibe rótulo completo ("1. Observar"), inativas exibem apenas o número ("2", "3"...) */}
                  <span className="sm:hidden whitespace-nowrap">
                    {isCurrent ? st.short : st.done ? '' : st.num}
                  </span>
                  <span className="hidden sm:inline truncate">
                    <span className="xl:hidden">{st.short}</span>
                    <span className="hidden xl:inline">{st.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Direita (Desktop): Controles Discretos de Áudio, Animação, Tela Cheia e Sair */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 relative">
            <span className="px-2.5 py-1 rounded-lg bg-[#0B1320] border border-slate-800 text-[11px] font-mono text-cyan-300">
              +{progress.xpEarned} XP
            </span>

            <button
              onClick={() => setAudioPopoverOpen(o => !o)}
              aria-expanded={audioPopoverOpen}
              title="Controles de Áudio e Animação"
              className={`p-1.5 px-2 rounded-lg border text-xs font-mono flex items-center gap-1 cursor-pointer transition-all ${
                audioSettings.mutedAll
                  ? 'bg-slate-900 border-slate-700 text-slate-400'
                  : 'bg-[#0B1320] border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
              }`}
            >
              {audioSettings.mutedAll ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>

            <button
              onClick={() =>
                handleUpdateAudio({ reduceMotion: !audioSettings.reduceMotion })
              }
              title={
                audioSettings.reduceMotion
                  ? 'Animações Reduzidas (Ativo)'
                  : 'Reduzir Animações'
              }
              className={`p-1.5 px-2 rounded-lg border text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                audioSettings.reduceMotion
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold'
                  : 'bg-[#0B1320] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {isFullscreenSupported && (
              <button
                onClick={toggleBrowserFullscreen}
                title={
                  isBrowserFullscreen
                    ? 'Sair da Tela Cheia do navegador'
                    : 'Ativar Tela Cheia (Fullscreen)'
                }
                aria-label={
                  isBrowserFullscreen
                    ? 'Sair da Tela Cheia do navegador'
                    : 'Ativar Tela Cheia'
                }
                className={`p-1.5 px-2 rounded-lg border text-xs font-mono flex items-center gap-1 cursor-pointer transition-all ${
                  isBrowserFullscreen
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                    : 'bg-[#0B1320] border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                {isBrowserFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            <button
              onClick={() => setExitModalOpen(true)}
              title="Sair da Operação e voltar ao Mapa Mundial (Esc)"
              className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all ml-1"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Sair</span>
            </button>
          </div>

          {/* Popover de Áudio & Animações */}
          {audioPopoverOpen && (
            <div
              data-immersive-modal="true"
              className="fixed left-3 right-3 top-14 sm:absolute sm:left-auto sm:right-6 sm:top-12 sm:w-72 rounded-2xl bg-[#0B1320] border border-amber-500/40 shadow-[0_0_35px_rgba(0,0,0,0.95)] p-4 z-50 space-y-3 text-left font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Áudio & Movimento
                </span>
                <button
                  onClick={() => setAudioPopoverOpen(false)}
                  className="text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Fechar [Esc]
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200">Trilha Ambiente</span>
                  <button
                    onClick={() =>
                      handleUpdateAudio({
                        mutedAll: false,
                        ambientEnabled: !audioSettings.ambientEnabled,
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      audioSettings.ambientEnabled && !audioSettings.mutedAll
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {audioSettings.ambientEnabled && !audioSettings.mutedAll ? 'ATIVA' : 'OFF'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.ambientVolume}
                  onChange={e =>
                    handleUpdateAudio({
                      ambientVolume: parseFloat(e.target.value),
                      ambientEnabled: true,
                      mutedAll: false,
                    })
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200">Efeitos de Interação</span>
                  <button
                    onClick={() =>
                      handleUpdateAudio({
                        mutedAll: false,
                        sfxEnabled: !audioSettings.sfxEnabled,
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      audioSettings.sfxEnabled && !audioSettings.mutedAll
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {audioSettings.sfxEnabled && !audioSettings.mutedAll ? 'ATIVOS' : 'OFF'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.sfxVolume}
                  onChange={e =>
                    handleUpdateAudio({
                      sfxVolume: parseFloat(e.target.value),
                      sfxEnabled: true,
                      mutedAll: false,
                    })
                  }
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-200">Reduzir Animações</span>
                <button
                  onClick={() =>
                    handleUpdateAudio({ reduceMotion: !audioSettings.reduceMotion })
                  }
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                    audioSettings.reduceMotion
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {audioSettings.reduceMotion ? 'SIM' : 'NÃO'}
                </button>
              </div>

              <button
                onClick={() => handleUpdateAudio({ mutedAll: !audioSettings.mutedAll })}
                className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
              >
                {audioSettings.mutedAll ? 'Reativar Áudio' : 'Silenciar Tudo'}
              </button>
            </div>
          )}

        </div>
      </header>

      {/* =======================================================================
          ÁREA PRINCIPAL DA SESSÃO DE INVESTIGAÇÃO (AMPLO RESPIRO)
         ======================================================================= */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 min-w-0 relative">
        
        {/* Banner Rápido de Coreografia de Transição entre Etapas */}
        {stageTransition && (
          <div
            aria-live="polite"
            className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-cyan-500/10 to-transparent border border-amber-400/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                {stageTransition.to === 2 ? (
                  <GitCommit className="w-4 h-4" />
                ) : stageTransition.to === 5 ? (
                  <FileCheck2 className="w-4 h-4" />
                ) : (
                  <FolderArchive className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                  {stageTransition.title}
                </div>
                <div className="text-xs text-slate-200 truncate">
                  {stageTransition.subtitle}
                </div>
              </div>
            </div>
          </div>
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
          <div className="relative w-full max-w-md rounded-2xl bg-[#0B1320] border border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.95)] p-6 space-y-5">
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

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
              <button
                onClick={() => setExitModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
              >
                Continuar Investigando [Esc]
              </button>
              <button
                onClick={handleConfirmExitToMap}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Voltar ao Mapa Mundial</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
