import React, { useEffect, useState } from 'react';
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

  // Modo Jogo Fullscreen Nativo: Entra automaticamente em tela cheia (sem barra do navegador e sem barra do Windows)
  // no primeiro clique do jogador, respeitando caso ele saia manualmente com ESC ou botão.
  useEffect(() => {
    let wasFullscreen = Boolean(document.fullscreenElement);

    const handleFsChange = () => {
      const isNowFs = Boolean(document.fullscreenElement);
      if (wasFullscreen && !isNowFs) {
        try {
          sessionStorage.setItem('ush_fs_manual_exit', '1');
        } catch {
          // ignore
        }
      }
      wasFullscreen = isNowFs;
    };

    const handleFirstInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-no-autofullscreen="true"]')) return;
      try {
        if (sessionStorage.getItem('ush_fs_manual_exit') === '1') return;
      } catch {
        // ignore
      }
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  const isImmersiveInvestigation = state.activeTab === 'dossies';

  return (
    <div
      className={`investigation-terminal min-h-screen w-full max-w-full overflow-x-hidden bg-[#060A12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 ${
        reduceMotion ? 'reduce-motion' : ''
      }`}
    >
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
