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
  ChevronUp,
  ChevronDown,
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
    allNodes,
    isAuthenticated,
    setIsAuthModalOpen,
    setActiveTab,
    setActiveStep,
    selectCase,
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
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
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

  // Subscribe to audio/motion settings
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
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCase.id, audioSettings.reduceMotion]);

  // Dedicated Transitions Between Stages (1->2, 2->3, 3->4, 4->5)
  useEffect(() => {
    // Ignore if case just switched
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
    }, 320);

    return () => clearTimeout(timer);
  }, [state.activeStep, selectedCase.id, audioSettings.reduceMotion]);

  // Browser Fullscreen API check & event listeners
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsFullscreenSupported(Boolean(document.fullscreenEnabled));
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    }

    const handleFsChange = () => {
      // Synchronization of icon with real browser fullscreen state.
      // Exiting native browser fullscreen NEVER exits our Immersive Mode!
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
      // Browser blocked or exited gracefully
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    }
  }, []);

  // Contextual ESC key handler:
  // 1st priority: close any open child modal or HUD audio popover ([data-immersive-modal="true"])
  // 2nd priority: when no modal is open, open (or close) the Exit Operation Confirmation Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      // If HUD audio popover is open, close it first
      if (audioPopoverOpen) {
        e.stopPropagation();
        setAudioPopoverOpen(false);
        return;
      }

      // Check if a child modal (DocumentInspectorModal or DiscoveryRevealModal) is currently open in the DOM
      const activeChildModal = document.querySelector('[data-immersive-modal="true"]');
      if (activeChildModal) {
        // Let the child modal's own Escape listener close it
        return;
      }

      // Otherwise toggle the Exit Operation Confirmation Modal
      setExitModalOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioPopoverOpen]);

  const handleConfirmExitToMap = async () => {
    setExitModalOpen(false);
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // Ignore
      }
    }
    soundEngine.playDocumentOpen();
    setActiveTab('mapa');
  };

  const handleUpdateAudio = (partial: Partial<AudioAndMotionSettings>) => {
    const next = soundEngine.updateSettings(partial);
    setAudioSettings(next);
  };

  // Calculate investigation progress percentage for the current case
  const stepWeights = [
    progress.extractedClueIds.length > 0 ? 25 : 0,
    challenges.length > 0 && progress.solvedConnectionIds.length > 0 ? 25 : 0,
    progress.selectedThesisId ? 25 : 0,
    progress.selectedDecisionId ? 25 : 0,
  ];
  const caseProgressPct = stepWeights.reduce((a, b) => a + b, 0);

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
      label: '3. Formular Hipótese',
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
      short: '5. Consequências',
      label: '5. Consequências',
      done: progress.completed,
    },
  ];

  const volumeOneCases = allNodes.filter(n => n.isVolumeOne);

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
          HUD PRÓPRIO DA CENTRAL DE INVESTIGAÇÃO (COMPACTO E RECOLHÍVEL)
         ======================================================================= */}
      <header
        aria-label="HUD Operacional de Investigação"
        className="sticky top-0 z-40 w-full bg-[#070C18]/95 backdrop-blur-md border-b border-amber-500/25 shadow-[0_4px_25px_rgba(0,0,0,0.75)] transition-all"
      >
        {/* Linha Primária Ultra-Compacta do HUD */}
        <div className="max-w-[1600px] w-full mx-auto px-2.5 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-2 min-w-0">
          
          {/* Esquerda: Identificação da Central + Código e Nome do Caso */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-amber-400 font-serif font-bold text-xs sm:text-sm shrink-0">
              Φ
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-cyan-400 truncate">
                <span className="font-bold">CENTRAL DE INVESTIGAÇÃO</span>
                <span className="text-slate-600">//</span>
                <span className="text-amber-400 font-semibold truncate">
                  {selectedCase.missionCode || 'CASO ATIVO'}
                </span>
                {/* Indicador de Sincronização */}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  title="Status de salvamento e sincronização"
                  className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 hover:bg-emerald-500/20 cursor-pointer ml-1"
                >
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{isAuthenticated ? 'SINCRONIZADO' : 'SALVO LOCAL'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <h1 className="font-sans text-xs sm:text-sm font-bold text-white truncate">
                  {selectedCase.fullName}{' '}
                  <span className="text-amber-400 font-normal">({selectedCase.year})</span>
                </h1>

                {/* Progresso Compacto da Investigação */}
                <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-[#0B1320] border border-slate-800 px-2.5 py-0.5 rounded-full shrink-0">
                  <span className="text-amber-300 font-bold">{caseProgressPct}%</span>
                  <span className="text-slate-600">•</span>
                  <span>
                    Pistas: <strong>{progress.extractedClueIds.length}/{allCluesCount}</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-300">+{progress.xpEarned} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centro (Desktop XL): Seletor Rápido entre Dossiês do Volume I */}
          <div className="hidden xl:flex items-center gap-1 bg-[#050811] border border-slate-800/90 rounded-xl p-1 shrink-0">
            {volumeOneCases.map(c => {
              const active = c.id === selectedCase.id;
              const done = state.completedNodes.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    soundEngine.playDocumentOpen();
                    selectCase(c.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    active
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 font-bold'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <span>{c.name}</span>
                  {done && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Direita: Controles Operacionais (Áudio, Reduzir Animações, Tela Cheia, Recolher HUD, Sair) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative">
            
            {/* Botão de Áudio */}
            <button
              onClick={() => setAudioPopoverOpen(o => !o)}
              aria-expanded={audioPopoverOpen}
              title="Controles de Áudio"
              className={`p-1.5 sm:px-2 sm:py-1 rounded-lg border text-xs font-mono flex items-center gap-1 cursor-pointer transition-all ${
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
              <span className="hidden md:inline text-[10px]">Áudio</span>
            </button>

            {/* Botão Direto de Controle de Animações */}
            <button
              onClick={() =>
                handleUpdateAudio({ reduceMotion: !audioSettings.reduceMotion })
              }
              title={
                audioSettings.reduceMotion
                  ? 'Animações Reduzidas (Ativo) — Clique para restaurar'
                  : 'Reduzir Animações'
              }
              className={`hidden sm:inline-flex px-2 py-1 rounded-lg border text-[10px] font-mono items-center gap-1 cursor-pointer transition-all ${
                audioSettings.reduceMotion
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold'
                  : 'bg-[#0B1320] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden lg:inline">
                {audioSettings.reduceMotion ? 'Anim: Reduzidas' : 'Anim: Padrão'}
              </span>
            </button>

            {/* Botão de Tela Cheia Opcional (Fullscreen API) */}
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
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg border text-xs font-mono flex items-center gap-1 cursor-pointer transition-all ${
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
                <span className="hidden lg:inline text-[10px]">
                  {isBrowserFullscreen ? 'Janela' : 'Tela Cheia'}
                </span>
              </button>
            )}

            {/* Botão Recolher / Expandir Barra de Etapas do HUD */}
            <button
              onClick={() => setIsHudCollapsed(c => !c)}
              title={isHudCollapsed ? 'Expandir HUD de Etapas' : 'Recolher HUD para ampliar área útil'}
              aria-label={isHudCollapsed ? 'Expandir HUD' : 'Recolher HUD'}
              className="p-1.5 rounded-lg bg-[#0B1320] border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              {isHudCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Botão Sair da Operação */}
            <button
              onClick={() => setExitModalOpen(true)}
              title="Sair da Operação e voltar ao Mapa Mundial (Esc)"
              className="px-2 sm:px-3 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-200 text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Sair</span>
              <span className="hidden md:inline">da Operação</span>
            </button>

            {/* Popover de Áudio & Animações dentro do HUD */}
            {audioPopoverOpen && (
              <div
                data-immersive-modal="true"
                className="fixed left-3 right-3 top-12 sm:absolute sm:left-auto sm:right-0 sm:top-10 sm:w-72 rounded-2xl bg-[#0B1320] border border-amber-500/40 shadow-[0_0_35px_rgba(0,0,0,0.95)] p-4 z-50 space-y-3 text-left font-sans"
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
        </div>

        {/* Linha Secundária do HUD: Navegação pelas 5 Etapas + Progresso Mobile (Recolhível) */}
        {!isHudCollapsed && (
          <div className="border-t border-slate-800/80 bg-[#050811]/90 px-2.5 sm:px-5 py-1.5">
            <div className="max-w-[1600px] w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              
              {/* Navegação pelas 5 Etapas do Ciclo Investigativo */}
              <nav
                aria-label="Etapas do Ciclo de Investigação"
                className="grid grid-cols-5 gap-1 sm:gap-1.5 flex-1"
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
                      className={`py-1.5 px-1.5 sm:px-3 rounded-lg font-mono text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                        isCurrent
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/70 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : st.done
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15'
                          : 'bg-[#0B1320]/70 text-slate-400 border-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      {st.done && !isCurrent && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 hidden xs:inline" />
                      )}
                      <span className="truncate">
                        <span className="md:hidden">{st.short}</span>
                        <span className="hidden md:inline">{st.label}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Seletor de Caso Mobile/Tablet + Telemetria Rápida */}
              <div className="flex xl:hidden items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {volumeOneCases.map(c => {
                    const active = c.id === selectedCase.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => selectCase(c.id)}
                        className={`px-2 py-0.5 rounded border whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 font-bold'
                            : 'bg-[#0B1320] border-slate-800 text-slate-400'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
                <span className="text-amber-300 shrink-0">
                  {progress.extractedClueIds.length}/{allCluesCount} pistas • +{progress.xpEarned} XP
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =======================================================================
          ÁREA PRINCIPAL DA SESSÃO DE INVESTIGAÇÃO (LARGURA INTEGRAL + TRANSIÇÕES)
         ======================================================================= */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-5 min-w-0 relative">
        
        {/* Banner Rápido de Coreografia de Transição entre Etapas */}
        {stageTransition && (
          <div
            aria-live="polite"
            className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-cyan-500/10 to-transparent border border-amber-400/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
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
          className="animate-in fade-in duration-200 min-w-0"
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
