import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TabKey, EraFilter, UserInvestigationState, HistoricalNode } from '../types/investigation';
import { HISTORICAL_NODES } from '../data/investigationCasesData';

interface InvestigationContextType {
  state: UserInvestigationState;
  selectedCase: HistoricalNode;
  allNodes: HistoricalNode[];
  filteredNodes: HistoricalNode[];
  isAuthenticated: boolean;
  readerStatus: 'paid' | 'free' | 'guest';
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithEmailOrToken: (identifier: string) => Promise<{ success: boolean; message?: string }>;
  logoutReader: () => void;
  setActiveTab: (tab: TabKey) => void;
  setSelectedCaseId: (id: string) => void;
  setEraFilter: (era: EraFilter) => void;
  setActiveStep: (step: 1 | 2 | 3) => void;
  startCaseInvestigation: (caseId: string) => void;
  discoverEvidence: (caseId: string) => void;
  selectHypothesis: (caseId: string, hypothesisId: string) => void;
  updatePersonalNote: (caseId: string, text: string) => void;
  stats: {
    analyzedCount: number;
    totalVolumeOne: number;
    hypothesesCount: number;
    completionPercentage: number;
  };
}

const STORAGE_KEY = 'ush_investigator_state_v2';

const DEFAULT_STATE: UserInvestigationState = {
  activeTab: 'mapa',
  selectedCaseId: 'cesar',
  eraFilter: 'todos',
  activeStep: 1,
  completedNodes: [],
  discoveredEvidenceIds: ['cesar'],
  formulatedHypotheses: {},
  personalNotes: {},
  decisionProfile: {
    analitico: 68,
    estrategico: 62,
    humanista: 60
  },
  globalImpact: {
    caosGlobal: 55,
    livreArbitrio: 65,
    suspeita: 42
  },
  investigator: {
    id: '7426',
    name: 'Investigador 7426',
    role: 'Auditor de Campo',
    level: 1
  }
};

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserInvestigationState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_STATE, ...parsed };
        }
      } catch (e) {
        console.error('Error reading localStorage', e);
      }
    }
    return DEFAULT_STATE;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [readerStatus, setReaderStatus] = useState<'paid' | 'free' | 'guest'>('guest');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const loadProfileFromApi = useCallback(async (queryParam: string) => {
    try {
      const res = await fetch(`/api/get-reader-profile?${queryParam}`);
      if (!res.ok) return { success: false, message: 'Credencial não localizada no banco de leitores.' };
      const data = await res.json();
      if (data && data.reader) {
        const r = data.reader;
        const token = r.access_token || data.profile?.accessToken;
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('ush_token', token);
          localStorage.setItem('ush_name', r.name || 'Investigador');
          localStorage.setItem('ush_reader_status', r.status || 'free');
        }
        setIsAuthenticated(true);
        setReaderStatus(r.status === 'paid' ? 'paid' : 'free');

        const traits = data.profile?.traits || {};
        const savedInv = traits.reading_progress?.investigation_state || {};

        setState(prev => ({
          ...prev,
          completedNodes: savedInv.completedNodes || prev.completedNodes,
          formulatedHypotheses: savedInv.formulatedHypotheses || prev.formulatedHypotheses,
          decisionProfile: savedInv.decisionProfile || prev.decisionProfile,
          globalImpact: savedInv.globalImpact || prev.globalImpact,
          investigator: {
            id: r.referral_code || prev.investigator.id,
            name: r.name || prev.investigator.name,
            role: r.status === 'paid' ? 'Auditor Credenciado (Edição Especial)' : 'Auditor em Degustação',
            level: Math.max(1, (savedInv.completedNodes?.length || prev.completedNodes.length) + 1)
          }
        }));
        return { success: true };
      }
      return { success: false, message: 'Perfil não encontrado.' };
    } catch (e) {
      return { success: false, message: 'Erro de conexão ao verificar credencial.' };
    }
  }, []);

  // Verifica URL ?token= ou localStorage ao iniciar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const savedToken = localStorage.getItem('ush_token');
    const tokenToUse = urlToken || savedToken;

    if (tokenToUse) {
      loadProfileFromApi(`token=${encodeURIComponent(tokenToUse)}`);
    }
  }, [loadProfileFromApi]);

  const loginWithEmailOrToken = useCallback(async (identifier: string) => {
    const clean = identifier.trim();
    if (!clean) return { success: false, message: 'Informe seu e-mail ou código de acesso.' };
    const isToken = clean.startsWith('TK_');
    const query = isToken
      ? `token=${encodeURIComponent(clean)}`
      : `email=${encodeURIComponent(clean.toLowerCase())}`;
    const result = await loadProfileFromApi(query);
    if (result.success) {
      setIsAuthModalOpen(false);
    }
    return result;
  }, [loadProfileFromApi]);

  const logoutReader = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ush_token');
      localStorage.removeItem('ush_reader_status');
    }
    setIsAuthenticated(false);
    setReaderStatus('guest');
    setState(DEFAULT_STATE);
  }, []);

  // Salva no localStorage em toda mudanca de estado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Error saving state', e);
      }
    }
  }, [state]);

  // Sincronizacao silenciosa com Supabase se houver token autenticado
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ush_token') : null;
    if (!token) return;

    const syncToSupabase = async () => {
      try {
        await fetch('/api/track-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            investigation_state: {
              completedNodes: state.completedNodes,
              formulatedHypotheses: state.formulatedHypotheses,
              decisionProfile: state.decisionProfile,
              globalImpact: state.globalImpact,
              last_active_case: state.selectedCaseId
            }
          })
        });
      } catch (e) {
        // Mantem local
      }
    };

    const timeout = setTimeout(syncToSupabase, 2000);
    return () => clearTimeout(timeout);
  }, [state.completedNodes, state.formulatedHypotheses, state.decisionProfile, state.globalImpact, state.selectedCaseId]);

  const selectedCase = HISTORICAL_NODES.find(n => n.id === state.selectedCaseId) || HISTORICAL_NODES[0];

  const filteredNodes = HISTORICAL_NODES.filter(node => {
    if (state.eraFilter === 'todos') return true;
    return node.era === state.eraFilter;
  });

  const setActiveTab = useCallback((tab: TabKey) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const setSelectedCaseId = useCallback((id: string) => {
    setState(prev => ({ ...prev, selectedCaseId: id }));
  }, []);

  const setEraFilter = useCallback((era: EraFilter) => {
    setState(prev => ({ ...prev, eraFilter: era }));
  }, []);

  const setActiveStep = useCallback((step: 1 | 2 | 3) => {
    setState(prev => ({ ...prev, activeStep: step }));
  }, []);

  const startCaseInvestigation = useCallback((caseId: string) => {
    setState(prev => ({
      ...prev,
      selectedCaseId: caseId,
      activeTab: 'dossies',
      activeStep: 1
    }));
  }, []);

  const discoverEvidence = useCallback((caseId: string) => {
    setState(prev => {
      if (prev.discoveredEvidenceIds.includes(caseId)) return prev;
      return {
        ...prev,
        discoveredEvidenceIds: [...prev.discoveredEvidenceIds, caseId]
      };
    });
  }, []);

  const selectHypothesis = useCallback((caseId: string, hypothesisId: string) => {
    const targetCase = HISTORICAL_NODES.find(n => n.id === caseId);
    const chosen = targetCase?.hypotheses.find(h => h.id === hypothesisId);

    setState(prev => {
      const nextCompleted = prev.completedNodes.includes(caseId)
        ? prev.completedNodes
        : [...prev.completedNodes, caseId];

      const nextHypotheses = {
        ...prev.formulatedHypotheses,
        [caseId]: hypothesisId
      };

      const nextProfile = { ...prev.decisionProfile };
      const nextImpact = { ...prev.globalImpact };

      if (chosen) {
        nextProfile.analitico = Math.min(100, Math.max(10, nextProfile.analitico + chosen.deltaPerfil.analitico));
        nextProfile.estrategico = Math.min(100, Math.max(10, nextProfile.estrategico + chosen.deltaPerfil.estrategico));
        nextProfile.humanista = Math.min(100, Math.max(10, nextProfile.humanista + chosen.deltaPerfil.humanista));

        nextImpact.caosGlobal = Math.min(100, Math.max(0, nextImpact.caosGlobal + chosen.deltaCaos));
        nextImpact.livreArbitrio = Math.min(100, Math.max(0, nextImpact.livreArbitrio + chosen.deltaLivreArbitrio));
      }

      const newLevel = Math.max(1, nextCompleted.length + 1);

      return {
        ...prev,
        completedNodes: nextCompleted,
        formulatedHypotheses: nextHypotheses,
        decisionProfile: nextProfile,
        globalImpact: nextImpact,
        investigator: {
          ...prev.investigator,
          level: newLevel,
          role: newLevel >= 3 ? 'Auditor Desperto' : prev.investigator.role
        }
      };
    });
  }, []);

  const updatePersonalNote = useCallback((caseId: string, text: string) => {
    setState(prev => ({
      ...prev,
      personalNotes: {
        ...prev.personalNotes,
        [caseId]: text
      }
    }));
  }, []);

  const volumeOneNodes = HISTORICAL_NODES.filter(n => n.isVolumeOne);
  const totalVolumeOne = volumeOneNodes.length;
  const analyzedCount = state.completedNodes.filter(id => volumeOneNodes.some(n => n.id === id)).length;
  const hypothesesCount = Object.keys(state.formulatedHypotheses).length;
  const completionPercentage = Math.round((analyzedCount / totalVolumeOne) * 100);

  return (
    <InvestigationContext.Provider
      value={{
        state,
        selectedCase,
        allNodes: HISTORICAL_NODES,
        filteredNodes,
        isAuthenticated,
        readerStatus,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithEmailOrToken,
        logoutReader,
        setActiveTab,
        setSelectedCaseId,
        setEraFilter,
        setActiveStep,
        startCaseInvestigation,
        discoverEvidence,
        selectHypothesis,
        updatePersonalNote,
        stats: {
          analyzedCount,
          totalVolumeOne,
          hypothesesCount,
          completionPercentage
        }
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
