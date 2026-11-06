import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TabKey,
  EraFilter,
  UserInvestigationState,
  HistoricalNode,
  CasePlayProgress,
} from '../types/investigation';
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
  selectCase: (id: string) => void;
  setEraFilter: (era: EraFilter) => void;
  setActiveStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  startCaseInvestigation: (caseId: string) => void;
  discoverEvidence: (caseId: string) => void;
  selectHypothesis: (caseId: string, hypothesisId: string) => void;
  updatePersonalNote: (caseId: string, text: string) => void;
  // Novas funções do Ciclo de Investigação em 5 Etapas
  getCasePlayProgress: (caseId: string) => CasePlayProgress;
  extractClue: (caseId: string, clueId: string, xpReward: number) => void;
  attemptConnection: (
    caseId: string,
    challengeId: string,
    cluePair: [string, string]
  ) => { success: boolean; title?: string; message: string; unlockedMap?: boolean };
  submitStructuredHypothesis: (
    caseId: string,
    thesisId: string,
    attachedClueIds: string[],
    reasoning: string
  ) => { score: 'forte' | 'parcial'; feedback: string; xpAwarded: number };
  submitSimulationDecision: (caseId: string, choiceId: string) => void;
  areCaseConnectionsUnlocked: (caseId: string) => boolean;
  stats: {
    analyzedCount: number;
    completedCount: number;
    totalVolumeOne: number;
    totalVol1: number;
    hypothesesCount: number;
    completionPercentage: number;
    progressPercent: number;
    evidenceCount: number;
    totalCluesExtracted: number;
  };
}

const STORAGE_KEY = 'ush_investigator_state_v3';

const DEFAULT_CASE_PROGRESS: CasePlayProgress = {
  extractedClueIds: [],
  solvedConnectionIds: [],
  attachedClueIds: [],
  hypothesisReasoning: '',
  completed: false,
  xpEarned: 0,
};

const DEFAULT_STATE: UserInvestigationState = {
  activeTab: 'mapa',
  selectedCaseId: 'cesar',
  eraFilter: 'todos',
  activeStep: 1,
  completedNodes: [],
  discoveredEvidenceIds: [],
  unlockedConnectionNodeIds: [], // Conexões iniciam ocultas até que o jogador as descubra!
  caseProgress: {},
  formulatedHypotheses: {},
  personalNotes: {},
  totalXp: 0,
  decisionProfile: {
    analitico: 58,
    estrategico: 54,
    humanista: 52,
    exploratorio: 60,
  },
  skills: {
    leituraEvidencias: 25,
    reconhecimentoPadroes: 20,
    raciocinioEstrategico: 20,
    tomadaDecisao: 20,
  },
  globalImpact: {
    caosGlobal: 50,
    livreArbitrio: 60,
    suspeita: 35,
  },
  investigator: {
    id: '7426',
    name: 'Investigador 7426',
    role: 'Investigador Independente',
    level: 1,
  },
};

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserInvestigationState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('ush_investigator_state_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_STATE,
            ...parsed,
            decisionProfile: { ...DEFAULT_STATE.decisionProfile, ...(parsed.decisionProfile || {}) },
            skills: { ...DEFAULT_STATE.skills, ...(parsed.skills || {}) },
            caseProgress: parsed.caseProgress || {},
            unlockedConnectionNodeIds: parsed.unlockedConnectionNodeIds || [],
          };
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
          unlockedConnectionNodeIds: savedInv.unlockedConnectionNodeIds || prev.unlockedConnectionNodeIds,
          caseProgress: savedInv.caseProgress || prev.caseProgress,
          formulatedHypotheses: savedInv.formulatedHypotheses || prev.formulatedHypotheses,
          totalXp: savedInv.totalXp ?? prev.totalXp,
          decisionProfile: { ...prev.decisionProfile, ...(savedInv.decisionProfile || {}) },
          skills: { ...prev.skills, ...(savedInv.skills || {}) },
          globalImpact: savedInv.globalImpact || prev.globalImpact,
          investigator: {
            id: r.referral_code || prev.investigator.id,
            name: r.name || prev.investigator.name,
            role: r.status === 'paid' ? 'Auditor Credenciado' : 'Investigador Independente',
            level: Math.max(1, Math.floor((savedInv.totalXp || prev.totalXp) / 250) + 1),
          },
        }));
        return { success: true };
      }
      return { success: false, message: 'Perfil não encontrado.' };
    } catch (e) {
      return { success: false, message: 'Erro de conexão ao verificar credencial.' };
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const savedToken = urlToken || localStorage.getItem('ush_token');
    const savedEmail = localStorage.getItem('ush_email');

    if (savedToken) {
      loadProfileFromApi(`token=${encodeURIComponent(savedToken)}`);
    } else if (savedEmail) {
      loadProfileFromApi(`email=${encodeURIComponent(savedEmail)}`);
    }
  }, [loadProfileFromApi]);

  const loginWithEmailOrToken = useCallback(
    async (identifier: string) => {
      const clean = identifier.trim();
      if (!clean) return { success: false, message: 'Informe seu e-mail ou código de acesso.' };
      const isEmail = clean.includes('@');
      const query = isEmail
        ? `email=${encodeURIComponent(clean.toLowerCase())}`
        : `token=${encodeURIComponent(clean)}`;
      const result = await loadProfileFromApi(query);
      if (result.success && isEmail && typeof window !== 'undefined') {
        localStorage.setItem('ush_email', clean.toLowerCase());
      }
      return result;
    },
    [loadProfileFromApi]
  );

  const logoutReader = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ush_token');
      localStorage.removeItem('ush_email');
      localStorage.removeItem('ush_reader_status');
    }
    setIsAuthenticated(false);
    setReaderStatus('guest');
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving localStorage', e);
    }
  }, [state]);

  useEffect(() => {
    const syncToSupabase = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('ush_token') : null;
      if (!token) return;
      try {
        await fetch('/api/save-reading-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: token,
            investigation_state: {
              completedNodes: state.completedNodes,
              unlockedConnectionNodeIds: state.unlockedConnectionNodeIds,
              caseProgress: state.caseProgress,
              formulatedHypotheses: state.formulatedHypotheses,
              totalXp: state.totalXp,
              decisionProfile: state.decisionProfile,
              skills: state.skills,
              globalImpact: state.globalImpact,
              lastActiveCase: state.selectedCaseId,
            },
          }),
        });
      } catch (e) {
        // Mantem local
      }
    };

    const timeout = setTimeout(syncToSupabase, 2000);
    return () => clearTimeout(timeout);
  }, [
    state.completedNodes,
    state.unlockedConnectionNodeIds,
    state.caseProgress,
    state.formulatedHypotheses,
    state.totalXp,
    state.decisionProfile,
    state.skills,
    state.globalImpact,
    state.selectedCaseId,
  ]);

  const selectedCase = HISTORICAL_NODES.find(n => n.id === state.selectedCaseId) || HISTORICAL_NODES[0];

  const filteredNodes = HISTORICAL_NODES.filter(node => {
    if (state.eraFilter === 'todos') return true;
    return node.era === state.eraFilter;
  });

  const getCasePlayProgress = useCallback(
    (caseId: string): CasePlayProgress => {
      return state.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
    },
    [state.caseProgress]
  );

  const areCaseConnectionsUnlocked = useCallback(
    (caseId: string): boolean => {
      return (
        state.unlockedConnectionNodeIds.includes(caseId) ||
        state.completedNodes.includes(caseId)
      );
    },
    [state.unlockedConnectionNodeIds, state.completedNodes]
  );

  const setActiveTab = useCallback((tab: TabKey) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const setSelectedCaseId = useCallback((id: string) => {
    setState(prev => ({ ...prev, selectedCaseId: id }));
  }, []);

  const setEraFilter = useCallback((era: EraFilter) => {
    setState(prev => ({ ...prev, eraFilter: era }));
  }, []);

  const setActiveStep = useCallback((step: 1 | 2 | 3 | 4 | 5) => {
    setState(prev => ({ ...prev, activeStep: step }));
  }, []);

  const startCaseInvestigation = useCallback((caseId: string) => {
    setState(prev => ({
      ...prev,
      selectedCaseId: caseId,
      activeTab: 'dossies',
      activeStep: 1,
    }));
  }, []);

  // ETAPA 1: Extrair pista de um documento para o Arquivo Pessoal
  const extractClue = useCallback((caseId: string, clueId: string, xpReward: number) => {
    setState(prev => {
      const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
      if (currentProg.extractedClueIds.includes(clueId)) return prev;

      const nextClues = [...currentProg.extractedClueIds, clueId];
      const nextCaseXp = currentProg.xpEarned + xpReward;
      const nextTotalXp = prev.totalXp + xpReward;
      const nextLevel = Math.max(1, Math.floor(nextTotalXp / 250) + 1);

      const nextDiscovered = prev.discoveredEvidenceIds.includes(caseId)
        ? prev.discoveredEvidenceIds
        : [...prev.discoveredEvidenceIds, caseId];

      return {
        ...prev,
        totalXp: nextTotalXp,
        discoveredEvidenceIds: nextDiscovered,
        caseProgress: {
          ...prev.caseProgress,
          [caseId]: {
            ...currentProg,
            extractedClueIds: nextClues,
            xpEarned: nextCaseXp,
          },
        },
        skills: {
          ...prev.skills,
          leituraEvidencias: Math.min(100, prev.skills.leituraEvidencias + 4),
        },
        decisionProfile: {
          ...prev.decisionProfile,
          exploratorio: Math.min(100, prev.decisionProfile.exploratorio + 2),
        },
        investigator: {
          ...prev.investigator,
          level: nextLevel,
        },
      };
    });
  }, []);

  // ETAPA 2: Validar relação entre duas pistas na Mesa de Conexões
  const attemptConnection = useCallback(
    (caseId: string, challengeId: string, cluePair: [string, string]) => {
      const node = HISTORICAL_NODES.find(n => n.id === caseId);
      const challenge = node?.connectionChallenges?.find(c => c.id === challengeId);
      if (!challenge) {
        return { success: false, message: 'Desafio de conexão não encontrado.' };
      }

      const [reqA, reqB] = challenge.requiredClueIds;
      const [selA, selB] = cluePair;
      const isMatch = (selA === reqA && selB === reqB) || (selA === reqB && selB === reqA);

      if (!isMatch) {
        return {
          success: false,
          message: challenge.errorFeedback,
        };
      }

      setState(prev => {
        const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
        const alreadySolved = currentProg.solvedConnectionIds.includes(challengeId);
        const xpGain = alreadySolved ? 0 : challenge.xpReward;
        const nextSolved = alreadySolved
          ? currentProg.solvedConnectionIds
          : [...currentProg.solvedConnectionIds, challengeId];

        const nextUnlockedMap =
          challenge.unlocksMapConnections && !prev.unlockedConnectionNodeIds.includes(caseId)
            ? [...prev.unlockedConnectionNodeIds, caseId]
            : prev.unlockedConnectionNodeIds;

        const nextTotalXp = prev.totalXp + xpGain;
        const nextLevel = Math.max(1, Math.floor(nextTotalXp / 250) + 1);

        return {
          ...prev,
          totalXp: nextTotalXp,
          unlockedConnectionNodeIds: nextUnlockedMap,
          caseProgress: {
            ...prev.caseProgress,
            [caseId]: {
              ...currentProg,
              solvedConnectionIds: nextSolved,
              xpEarned: currentProg.xpEarned + xpGain,
            },
          },
          skills: {
            ...prev.skills,
            reconhecimentoPadroes: Math.min(100, prev.skills.reconhecimentoPadroes + (alreadySolved ? 0 : 8)),
          },
          decisionProfile: {
            ...prev.decisionProfile,
            analitico: Math.min(100, prev.decisionProfile.analitico + (alreadySolved ? 0 : 3)),
          },
          investigator: {
            ...prev.investigator,
            level: nextLevel,
          },
        };
      });

      return {
        success: true,
        title: challenge.successTitle,
        message: challenge.successConclusion,
        unlockedMap: Boolean(challenge.unlocksMapConnections),
      };
    },
    []
  );

  // ETAPA 3: Formular Hipótese sustentada por evidências
  const submitStructuredHypothesis = useCallback(
    (caseId: string, thesisId: string, attachedClueIds: string[], reasoning: string) => {
      const node = HISTORICAL_NODES.find(n => n.id === caseId);
      const thesis = node?.hypothesisTheses?.find(t => t.id === thesisId);

      const matchingClues = attachedClueIds.filter(id => thesis?.supportingClueIds.includes(id));
      const score: 'forte' | 'parcial' = matchingClues.length >= 2 ? 'forte' : 'parcial';
      const xpAwarded = score === 'forte' ? 100 : 50;
      const feedback =
        score === 'forte'
          ? thesis?.feedbackStrong || 'Hipótese bem sustentada pelas evidências selecionadas.'
          : thesis?.feedbackPartial || 'Hipótese registrada, mas poderia ser melhor fundamentada com outras pistas do arquivo.';

      setState(prev => {
        const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
        const firstTimeHypothesis = !currentProg.selectedThesisId;
        const xpGain = firstTimeHypothesis ? xpAwarded : 0;
        const nextTotalXp = prev.totalXp + xpGain;
        const nextLevel = Math.max(1, Math.floor(nextTotalXp / 250) + 1);

        return {
          ...prev,
          totalXp: nextTotalXp,
          formulatedHypotheses: {
            ...prev.formulatedHypotheses,
            [caseId]: thesisId,
          },
          personalNotes: reasoning.trim()
            ? { ...prev.personalNotes, [caseId]: reasoning.trim() }
            : prev.personalNotes,
          caseProgress: {
            ...prev.caseProgress,
            [caseId]: {
              ...currentProg,
              selectedThesisId: thesisId,
              attachedClueIds,
              hypothesisReasoning: reasoning,
              hypothesisScore: score,
              xpEarned: currentProg.xpEarned + xpGain,
            },
          },
          skills: {
            ...prev.skills,
            leituraEvidencias: Math.min(100, prev.skills.leituraEvidencias + (firstTimeHypothesis ? 6 : 0)),
            reconhecimentoPadroes: Math.min(100, prev.skills.reconhecimentoPadroes + (firstTimeHypothesis ? 6 : 0)),
          },
          investigator: {
            ...prev.investigator,
            level: nextLevel,
          },
        };
      });

      return { score, feedback, xpAwarded };
    },
    []
  );

  // ETAPA 4 -> 5: Tomar decisão no dilema simulado e concluir o ciclo do caso
  const submitSimulationDecision = useCallback((caseId: string, choiceId: string) => {
    const node = HISTORICAL_NODES.find(n => n.id === caseId);
    const choice = node?.simulationChoices?.find(c => c.id === choiceId);

    setState(prev => {
      const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
      const firstDecision = !currentProg.selectedDecisionId;
      const xpGain = firstDecision ? 80 : 0;
      const nextTotalXp = prev.totalXp + xpGain;
      const nextCompleted = prev.completedNodes.includes(caseId)
        ? prev.completedNodes
        : [...prev.completedNodes, caseId];
      const nextUnlockedMap = prev.unlockedConnectionNodeIds.includes(caseId)
        ? prev.unlockedConnectionNodeIds
        : [...prev.unlockedConnectionNodeIds, caseId];

      const nextProfile = { ...prev.decisionProfile };
      const nextSkills = { ...prev.skills };
      const nextImpact = { ...prev.globalImpact };

      if (choice && firstDecision) {
        nextProfile.analitico = Math.min(100, Math.max(15, nextProfile.analitico + choice.deltaPerfil.analitico));
        nextProfile.estrategico = Math.min(100, Math.max(15, nextProfile.estrategico + choice.deltaPerfil.estrategico));
        nextProfile.humanista = Math.min(100, Math.max(15, nextProfile.humanista + choice.deltaPerfil.humanista));
        nextProfile.exploratorio = Math.min(100, Math.max(15, nextProfile.exploratorio + choice.deltaPerfil.exploratorio));

        nextSkills.leituraEvidencias = Math.min(100, nextSkills.leituraEvidencias + choice.deltaSkills.leituraEvidencias);
        nextSkills.reconhecimentoPadroes = Math.min(100, nextSkills.reconhecimentoPadroes + choice.deltaSkills.reconhecimentoPadroes);
        nextSkills.raciocinioEstrategico = Math.min(100, nextSkills.raciocinioEstrategico + choice.deltaSkills.raciocinioEstrategico);
        nextSkills.tomadaDecisao = Math.min(100, nextSkills.tomadaDecisao + choice.deltaSkills.tomadaDecisao);

        nextImpact.caosGlobal = Math.min(100, Math.max(0, nextImpact.caosGlobal + choice.deltaCaos));
        nextImpact.livreArbitrio = Math.min(100, Math.max(0, nextImpact.livreArbitrio + choice.deltaLivreArbitrio));
      }

      const nextLevel = Math.max(1, Math.floor(nextTotalXp / 250) + 1);

      return {
        ...prev,
        totalXp: nextTotalXp,
        completedNodes: nextCompleted,
        unlockedConnectionNodeIds: nextUnlockedMap,
        decisionProfile: nextProfile,
        skills: nextSkills,
        globalImpact: nextImpact,
        caseProgress: {
          ...prev.caseProgress,
          [caseId]: {
            ...currentProg,
            selectedDecisionId: choiceId,
            completed: true,
            xpEarned: currentProg.xpEarned + xpGain,
          },
        },
        investigator: {
          ...prev.investigator,
          level: nextLevel,
          role: nextCompleted.length >= 2 ? 'Auditor Desperto' : prev.investigator.role,
        },
      };
    });
  }, []);

  const discoverEvidence = useCallback((caseId: string) => {
    setState(prev => {
      if (prev.discoveredEvidenceIds.includes(caseId)) return prev;
      return {
        ...prev,
        discoveredEvidenceIds: [...prev.discoveredEvidenceIds, caseId],
      };
    });
  }, []);

  const selectHypothesis = useCallback((caseId: string, hypothesisId: string) => {
    setState(prev => ({
      ...prev,
      formulatedHypotheses: {
        ...prev.formulatedHypotheses,
        [caseId]: hypothesisId,
      },
    }));
  }, []);

  const updatePersonalNote = useCallback((caseId: string, text: string) => {
    setState(prev => ({
      ...prev,
      personalNotes: {
        ...prev.personalNotes,
        [caseId]: text,
      },
    }));
  }, []);

  const volumeOneNodes = HISTORICAL_NODES.filter(n => n.isVolumeOne);
  const totalVolumeOne = volumeOneNodes.length;
  const analyzedCount = state.completedNodes.filter(id => volumeOneNodes.some(n => n.id === id)).length;
  const hypothesesCount = Object.keys(state.formulatedHypotheses).length;
  const completionPercentage = Math.round((analyzedCount / totalVolumeOne) * 100);
  const totalCluesExtracted = Object.values(state.caseProgress).reduce(
    (acc, curr) => acc + (curr.extractedClueIds?.length || 0),
    0
  );

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
        selectCase: setSelectedCaseId,
        setEraFilter,
        setActiveStep,
        startCaseInvestigation,
        discoverEvidence,
        selectHypothesis,
        updatePersonalNote,
        getCasePlayProgress,
        extractClue,
        attemptConnection,
        submitStructuredHypothesis,
        submitSimulationDecision,
        areCaseConnectionsUnlocked,
        stats: {
          analyzedCount,
          completedCount: analyzedCount,
          totalVolumeOne,
          totalVol1: totalVolumeOne,
          hypothesesCount,
          completionPercentage,
          progressPercent: completionPercentage,
          evidenceCount: state.discoveredEvidenceIds.length,
          totalCluesExtracted,
        },
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
