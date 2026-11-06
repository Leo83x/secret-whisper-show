import React from 'react';
import { InvestigationProvider, useInvestigation } from '../context/InvestigationContext';
import { InvestigationHeader } from '../components/investigation/InvestigationHeader';
import { InvestigationBottomNav } from '../components/investigation/InvestigationBottomNav';
import { ReaderAccessModal } from '../components/investigation/ReaderAccessModal';
import { WorldMapView } from '../components/investigation/WorldMapView';
import { DossierInvestigationView } from '../components/investigation/DossierInvestigationView';
import { InvestigatorProfileView } from '../components/investigation/InvestigatorProfileView';
import { MissionsView } from '../components/investigation/MissionsView';
import { CommunityView } from '../components/investigation/CommunityView';

const TerminalContent: React.FC = () => {
  const { state } = useInvestigation();

  return (
    <div className="min-h-screen bg-[#060A12] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <InvestigationHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
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
