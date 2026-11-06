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
  }, [state.activeTab]);

  return (
    <div
      className={`investigation-terminal min-h-screen w-full max-w-full overflow-x-hidden bg-[#060A12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 ${
        reduceMotion ? 'reduce-motion' : ''
      }`}
    >
      <InvestigationHeader />

      <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-12 overflow-x-hidden">
        {state.activeTab === 'mapa' && <WorldMapView />}
        {state.activeTab === 'dossies' && <DossierInvestigationView />}
        {state.activeTab === 'missoes' && <MissionsView />}
        {state.activeTab === 'comunidade' && <CommunityView />}
        {state.activeTab === 'perfil' && <InvestigatorProfileView />}
      </main>

      <InvestigationBottomNav />
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
