import React, { useEffect, useState } from "react";
import { Maximize2, Volume2, ShieldCheck, Sparkles, Sliders, X } from "lucide-react";
import { InvestigationProvider, useInvestigation } from "../context/InvestigationContext";
import { InvestigationBottomNav } from "../components/investigation/InvestigationBottomNav";
import { ReaderAccessModal } from "../components/investigation/ReaderAccessModal";
import { WorldMapView } from "../components/investigation/WorldMapView";
import { DossierInvestigationView } from "../components/investigation/DossierInvestigationView";
import { InvestigatorProfileView } from "../components/investigation/InvestigatorProfileView";
import { MissionsView } from "../components/investigation/MissionsView";
import { CommunityView } from "../components/investigation/CommunityView";
import { ImmersiveInvestigationLayout } from "../components/investigation/ImmersiveInvestigationLayout";
import { CaseMissionHub } from "../components/investigation/CaseMissionHub";
import { PersonalArchiveDrawer } from "../components/investigation/PersonalArchiveDrawer";
import { GameButton } from "../components/investigation/GameInteractionSystem";
import { soundEngine, AudioAndMotionSettings } from "../utils/investigationAudio";

const TerminalContent: React.FC = () => {
  const { state, setActiveTab } = useInvestigation();
  const [reduceMotion, setReduceMotion] = useState<boolean>(
    () => soundEngine.getSettings().reduceMotion
  );

  // Modo: Hub de Apresentação (Briefing) vs Mesa de Investigação Ativa
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);

  // Gaveta de Arquivo Pessoal Compartilhada
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);

  // Modal de Configurações de Áudio e Acessibilidade
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [audioSettings, setAudioSettings] = useState<AudioAndMotionSettings>(() =>
    soundEngine.getSettings()
  );

  // Modal de Inicialização Imersiva em Tela Cheia logo ao abrir a Home da Central
  const [showFullscreenModal, setShowFullscreenModal] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return !document.fullscreenElement;
  });

  useEffect(() => {
    return soundEngine.subscribe(settings => {
      setReduceMotion(settings.reduceMotion);
      setAudioSettings(settings);
    });
  }, []);

  useEffect(() => {
    soundEngine.setAdaptiveMode(state.activeTab === "dossies" ? "investigacao" : "exploracao");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [state.activeTab, state.selectedCaseId, state.activeStep]);

  useEffect(() => {
    const handleFsChange = () => {
      if (document.fullscreenElement) {
        setShowFullscreenModal(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleEnterGameFullscreen = async () => {
    soundEngine.playBrassPress();
    setShowFullscreenModal(false);
    try {
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        }
      }
    } catch {
      // Fallback silencioso
    }
  };

  const handleContinueWindowed = () => {
    soundEngine.playDocumentOpen();
    setShowFullscreenModal(false);
  };

  const handleExitToHome = () => {
    soundEngine.playMechanicalClick();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const isDossierTab = state.activeTab === "dossies";

  return (
    <div
      className={`investigation-terminal min-h-screen w-full max-w-full overflow-x-hidden bg-[#060A12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 ${
        reduceMotion ? "reduce-motion" : ""
      }`}
    >
      {/* MODAL DE INICIALIZAÇÃO EM MODO JOGO (TELA CHEIA TOTAL NA HOME) */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-[120] bg-[#03060C]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#10192D] via-[#0A101D] to-[#060A12] border-2 border-amber-400/60 shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_70px_rgba(245,158,11,0.25)] p-6 sm:p-7 text-center space-y-5 overflow-hidden game-modal-object">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/35 text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>TERMINAL OPERACIONAL // MODO JOGO</span>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/70 bg-[#060A12] shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center">
                <img
                  src="/reader/icons/icon-192.png"
                  alt="O Último Segredo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-[0.14em] uppercase text-white">
                  O ÚLTIMO SEGREDO
                </h2>
                <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Central de Investigação Forense 3D
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
              Para vivenciar a experiência completa de jogo — <strong className="text-amber-200">ocupando 100% da tela</strong> e com áudio tático ativado — inicie a sessão em Tela Cheia.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-[#060A12]/90 border border-slate-800 flex flex-col items-center gap-1">
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">Tela 100%</span>
              </div>
              <div className="p-2 rounded-xl bg-[#060A12]/90 border border-slate-800 flex flex-col items-center gap-1">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">Áudio 3D</span>
              </div>
              <div className="p-2 rounded-xl bg-[#060A12]/90 border border-slate-800 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">Dossiês V1</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <GameButton onClick={handleEnterGameFullscreen} className="w-full" size="md">
                ATIVAR TELA CHEIA (MODO JOGO)
              </GameButton>

              <button
                type="button"
                onClick={handleContinueWindowed}
                className="game-btn-capsule w-full py-2.5 px-4 text-xs font-mono cursor-pointer"
              >
                Continuar em Modo Janela
              </button>
            </div>

            <div className="text-xs font-mono text-slate-300 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pressione [ESC] a qualquer momento para alternar a janela</span>
            </div>
          </div>
        </div>
      )}

      {/* RENDERIZAÇÃO PRINCIPAL */}
      {isDossierTab ? (
        !isInvestigating ? (
          /* ===================================================================
             1. HUB DA MISSÃO (TELA PRINCIPAL DE HERÓI, REFERÊNCIA DO USUÁRIO)
             =================================================================== */
          <CaseMissionHub
            onStartInvestigation={() => setIsInvestigating(true)}
            onOpenArchive={() => setIsArchiveOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onExit={handleExitToHome}
          />
        ) : (
          /* ===================================================================
             2. MESA DE INVESTIGAÇÃO 3D (HUD LIMPO, CENÁRIO DOMINANTE)
             =================================================================== */
          <ImmersiveInvestigationLayout
            onBackToBriefing={() => setIsInvestigating(false)}
            onOpenArchive={() => setIsArchiveOpen(true)}
          >
            <DossierInvestigationView />
          </ImmersiveInvestigationLayout>
        )
      ) : (
        /* OUTRAS SEÇÕES (MAPA, MISSÕES, PERFIL, COMUNIDADE) */
        <div className="flex-1 flex flex-col min-h-screen">
          <main
            className={
              state.activeTab === "mapa"
                ? "flex-1 w-full max-w-[1920px] min-w-0 mx-auto px-2.5 sm:px-4 py-2 pb-24 lg:h-[calc(100dvh-53px)] lg:overflow-hidden flex flex-col"
                : "flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 overflow-x-hidden"
            }
          >
            {state.activeTab === "mapa" && <WorldMapView />}
            {state.activeTab === "missoes" && <MissionsView />}
            {state.activeTab === "comunidade" && <CommunityView />}
            {state.activeTab === "perfil" && <InvestigatorProfileView />}
          </main>

          {/* DOCK INFERIOR DE 5 MEDALHÕES METÁLICOS */}
          <InvestigationBottomNav
            onOpenCaseSelector={() => {
              setActiveTab("dossies");
              setIsInvestigating(false);
            }}
            onOpenArchive={() => setIsArchiveOpen(true)}
          />
        </div>
      )}

      {/* GAVETA DE ARQUIVO PESSOAL COMPARTILHADA */}
      <PersonalArchiveDrawer
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
      />

      {/* MODAL DE CONFIGURAÇÕES DE ÁUDIO & MOVIMENTO */}
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#131c2e] via-[#0b101c] to-[#060a12] border-2 border-amber-400/60 shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-base uppercase tracking-wider">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Configurações Operacionais</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Trilha Sonora Adaptativa</span>
                <button
                  type="button"
                  onClick={() =>
                    soundEngine.updateSettings({
                      ambientEnabled: !audioSettings.ambientEnabled,
                      mutedAll: false,
                    })
                  }
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                    audioSettings.ambientEnabled && !audioSettings.mutedAll
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {audioSettings.ambientEnabled && !audioSettings.mutedAll ? "ATIVADA" : "DESLIGADA"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-200">Efeitos de Interação Tátil</span>
                <button
                  type="button"
                  onClick={() =>
                    soundEngine.updateSettings({
                      sfxEnabled: !audioSettings.sfxEnabled,
                      mutedAll: false,
                    })
                  }
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                    audioSettings.sfxEnabled && !audioSettings.mutedAll
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {audioSettings.sfxEnabled && !audioSettings.mutedAll ? "ATIVADOS" : "DESLIGADOS"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-200">Redução de Movimento</span>
                <button
                  type="button"
                  onClick={() =>
                    soundEngine.updateSettings({ reduceMotion: !audioSettings.reduceMotion })
                  }
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                    audioSettings.reduceMotion
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {audioSettings.reduceMotion ? "SIM" : "NÃO"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => soundEngine.toggleMuteAll()}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-[#2a1e08] to-[#140f04] border border-amber-500/50 text-amber-300 font-bold hover:text-white transition-all cursor-pointer"
              >
                {audioSettings.mutedAll ? "Reativar Todos os Áudios" : "Silenciar Todo o Áudio"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReaderAccessModal />
    </div>
  );
};

const InvestigationTerminalPage: React.FC = () => {
  return (
    <InvestigationProvider>
      <TerminalContent />
    </InvestigationProvider>
  );
};

export default InvestigationTerminalPage;
