import React, { useEffect, useState } from 'react';
import { Maximize2, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { InvestigationProvider, useInvestigation } from '../context/InvestigationContext';
import { InvestigationHeader } from '../components/investigation/InvestigationHeader';
import { InvestigationBottomNav } from '../components/investigation/InvestigationBottomNav';
import { ReaderAccessModal } from '../components/investigation/ReaderAccessModal';
import { WorldMapView } from '../components/investigation/WorldMapView';
import { DossierInvestigationView } from '../components/investigation/DossierInvestigationView';
import { InvestigatorProfileView } from '../components/investigation/InvestigatorProfileView';
import { MissionsView } from '../components/investigation/MissionsView';
import { CommunityView } from '../components/investigation/CommunityView';
import { ImmersiveInvestigationLayout } from '../components/investigation/ImmersiveInvestigationLayout';
import { soundEngine } from '../utils/investigationAudio';

const TerminalContent: React.FC = () => {
  const { state } = useInvestigation();
  const [reduceMotion, setReduceMotion] = useState<boolean>(
    () => soundEngine.getSettings().reduceMotion
  );

  // Modal de Inicialização Imersiva em Tela Cheia logo ao abrir a Home da Central
  const [showFullscreenModal, setShowFullscreenModal] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return !document.fullscreenElement;
  });

  useEffect(() => {
    return soundEngine.subscribe(settings => {
      setReduceMotion(settings.reduceMotion);
    });
  }, []);

  useEffect(() => {
    soundEngine.setAdaptiveMode(state.activeTab === 'dossies' ? 'investigacao' : 'exploracao');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
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
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
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
      // Fallback silencioso caso o navegador ou SO bloqueie
    }
  };

  const handleContinueWindowed = () => {
    soundEngine.playDocumentOpen();
    setShowFullscreenModal(false);
  };

  const isImmersiveInvestigation = state.activeTab === 'dossies';

  return (
    <div
      className={`investigation-terminal min-h-screen w-full max-w-full overflow-x-hidden bg-[#060A12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 ${
        reduceMotion ? 'reduce-motion' : ''
      }`}
    >
      {/* MODAL DE INICIALIZAÇÃO EM MODO JOGO (TELA CHEIA TOTAL NA HOME) */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-[120] bg-[#03060C]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#10192D] via-[#0A101D] to-[#060A12] border-2 border-amber-400/60 shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_70px_rgba(245,158,11,0.25)] p-6 sm:p-7 text-center space-y-5 overflow-hidden game-modal-object">
            {/* Brilho Superior */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-500/15 blur-3xl pointer-events-none" />

            {/* Badge de Status do Terminal */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/35 text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>TERMINAL OPERACIONAL // MODO JOGO</span>
            </div>

            {/* Logo Oficial do PWA + Identidade da Marca */}
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

            {/* Descrição Imersiva */}
            <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
              Para vivenciar a experiência completa de jogo — <strong className="text-amber-200">ocupando 100% do monitor sem barra de navegador ou barra de tarefas</strong> e com áudio tático ativado — inicie a sessão em Tela Cheia.
            </p>

            {/* Pílulas de Recursos Ativados */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-[#060A12]/90 border border-slate-800 flex flex-col items-center gap-1">
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono text-slate-300">Tela 100%</span>
              </div>
              <div className="p-2 rounded-xl bg-[#060A12]/90 border border-slate-800 flex flex-col items-center gap-1">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-slate-300">Áudio 3D</span>
              </div>
              <div className="p-2 rounded-xl bg-[#060A12]/90 border border-slate-800 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono text-slate-300">Dossiês V1</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleEnterGameFullscreen}
                className="game-btn-primary w-full py-3.5 px-5 font-sans font-extrabold text-sm tracking-wider flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                <span>ATIVAR TELA CHEIA (MODO JOGO)</span>
              </button>

              <button
                type="button"
                onClick={handleContinueWindowed}
                className="game-btn-capsule w-full py-2.5 px-4 text-xs font-mono cursor-pointer"
              >
                Continuar em Modo Janela
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Pressione [ESC] a qualquer momento para alternar a janela</span>
            </div>
          </div>
        </div>
      )}

      {isImmersiveInvestigation ? (
        <ImmersiveInvestigationLayout>
          <DossierInvestigationView />
        </ImmersiveInvestigationLayout>
      ) : (
        <>
          <InvestigationHeader />

          <main
            className={
              state.activeTab === 'mapa'
                ? 'flex-1 w-full max-w-[1920px] min-w-0 mx-auto px-2.5 sm:px-4 py-2 pb-20 md:pb-2.5 lg:h-[calc(100dvh-53px)] lg:overflow-hidden flex flex-col'
                : 'flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-12 overflow-x-hidden'
            }
          >
            {state.activeTab === 'mapa' && <WorldMapView />}
            {state.activeTab === 'missoes' && <MissionsView />}
            {state.activeTab === 'comunidade' && <CommunityView />}
            {state.activeTab === 'perfil' && <InvestigatorProfileView />}
          </main>

          <InvestigationBottomNav />
        </>
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
