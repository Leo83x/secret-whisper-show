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
  ) => { score: 'forte' | 'parcial' | 'fraca'; feedback: string; xpAwarded: number };
  submitSimulationDecision: (caseId: string, choiceId: string) => void;
  areCaseConnectionsUnlocked: (caseId: string) => boolean;
  getCaseXpBreakdown: (caseId: string) => {
    cluesXp: number;
    connectionsXp: number;
    hypothesisXp: number;
    decisionXp: number;
    totalCaseXp: number;
  };
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
    totalConnectionsValidated: number;
  };
}

const STORAGE_KEY = 'ush_investigator_state_v3';

export const DEFAULT_CASE_PROGRESS: CasePlayProgress = {
  extractedClueIds: [],
  solvedConnectionIds: [],
  failedConnectionIds: [],
  attachedClueIds: [],
  hypothesisReasoning: '',
  completed: false,
  xpEarned: 0,
};

const BASE_PROFILE = {
  analitico: 58,
  estrategico: 54,
  humanista: 52,
  exploratorio: 60,
};

const BASE_SKILLS = {
  leituraEvidencias: 25,
  reconhecimentoPadroes: 20,
  raciocinioEstrategico: 20,
  tomadaDecisao: 20,
};

const BASE_IMPACT = {
  caosGlobal: 50,
  livreArbitrio: 60,
  suspeita: 35,
};

// Cálculo determinístico do XP de um caso (evita qualquer duplicação ao repetir ações)
function computeCaseXpBreakdown(caseId: string, prog: CasePlayProgress) {
  const node = HISTORICAL_NODES.find(n => n.id === caseId);
  if (!node) {
    return { cluesXp: 0, connectionsXp: 0, hypothesisXp: 0, decisionXp: 0, totalCaseXp: 0 };
  }

  const allClues = (node.documents || []).flatMap(d => d.clues);
  const cluesXp = prog.extractedClueIds.reduce((sum, cid) => {
    const found = allClues.find(c => c.id === cid);
    return sum + (found ? found.xpReward : 0);
  }, 0);

  const allChallenges = node.connectionChallenges || [];
  const connectionsXp = prog.solvedConnectionIds.reduce((sum, chId) => {
    const found = allChallenges.find(c => c.id === chId);
    return sum + (found ? found.xpReward : 0);
  }, 0);

  let hypothesisXp = 0;
  if (prog.selectedThesisId) {
    if (prog.hypothesisScore === 'forte') hypothesisXp = 100;
    else if (prog.hypothesisScore === 'parcial') hypothesisXp = 60;
    else hypothesisXp = 25;
  }

  const decisionXp = prog.selectedDecisionId ? 80 : 0;
  const totalCaseXp = cluesXp + connectionsXp + hypothesisXp + decisionXp;

  return { cluesXp, connectionsXp, hypothesisXp, decisionXp, totalCaseXp };
}

// Recalcula de forma determinística todo o estado derivado (XP total, tendências, habilidades, conexões desbloqueadas)
function recomputeDerivedState(
  caseProgressMap: Record<string, CasePlayProgress>,
  currentRole: string
) {
  const updatedCaseProgress: Record<string, CasePlayProgress> = {};
  let totalXp = 0;
  const completedNodes: string[] = [];
  const discoveredEvidenceIds: string[] = [];
  const unlockedConnectionNodeIds: string[] = [];
  const formulatedHypotheses: Record<string, string> = {};

  const profile = { ...BASE_PROFILE };
  const skills = { ...BASE_SKILLS };
  const impact = { ...BASE_IMPACT };

  Object.entries(caseProgressMap).forEach(([caseId, rawProg]) => {
    const node = HISTORICAL_NODES.find(n => n.id === caseId);
    const prog: CasePlayProgress = {
      ...DEFAULT_CASE_PROGRESS,
      ...rawProg,
    };

    const { totalCaseXp } = computeCaseXpBreakdown(caseId, prog);
    prog.xpEarned = totalCaseXp;
    updatedCaseProgress[caseId] = prog;
    totalXp += totalCaseXp;

    if (prog.extractedClueIds.length > 0) {
      discoveredEvidenceIds.push(caseId);
      skills.leituraEvidencias = Math.min(100, skills.leituraEvidencias + prog.extractedClueIds.length * 4);
      profile.exploratorio = Math.min(100, profile.exploratorio + prog.extractedClueIds.length * 2);
    }

    if (prog.solvedConnectionIds.length > 0) {
      skills.reconhecimentoPadroes = Math.min(
        100,
        skills.reconhecimentoPadroes + prog.solvedConnectionIds.length * 8
      );
      profile.analitico = Math.min(100, profile.analitico + prog.solvedConnectionIds.length * 3);
    }

    // Conexão no mapa SÓ é desbloqueada se o vínculo com unlocksMapConnections foi efetivamente validado!
    const mapChallenge = node?.connectionChallenges?.find(c => c.unlocksMapConnections);
    if (mapChallenge && prog.solvedConnectionIds.includes(mapChallenge.id)) {
      unlockedConnectionNodeIds.push(caseId);
    }

    if (prog.selectedThesisId) {
      formulatedHypotheses[caseId] = prog.selectedThesisId;
      const bonus = prog.hypothesisScore === 'forte' ? 6 : prog.hypothesisScore === 'parcial' ? 4 : 2;
      skills.leituraEvidencias = Math.min(100, skills.leituraEvidencias + bonus);
      skills.reconhecimentoPadroes = Math.min(100, skills.reconhecimentoPadroes + bonus);
    }

    if (prog.selectedDecisionId) {
      completedNodes.push(caseId);
      const choice = node?.simulationChoices?.find(c => c.id === prog.selectedDecisionId);
      if (choice) {
        profile.analitico = Math.min(100, Math.max(15, profile.analitico + choice.deltaPerfil.analitico));
        profile.estrategico = Math.min(100, Math.max(15, profile.estrategico + choice.deltaPerfil.estrategico));
        profile.humanista = Math.min(100, Math.max(15, profile.humanista + choice.deltaPerfil.humanista));
        profile.exploratorio = Math.min(100, Math.max(15, profile.exploratorio + choice.deltaPerfil.exploratorio));

        skills.leituraEvidencias = Math.min(100, skills.leituraEvidencias + choice.deltaSkills.leituraEvidencias);
        skills.reconhecimentoPadroes = Math.min(
          100,
          skills.reconhecimentoPadroes + choice.deltaSkills.reconhecimentoPadroes
        );
        skills.raciocinioEstrategico = Math.min(
          100,
          skills.raciocinioEstrategico + choice.deltaSkills.raciocinioEstrategico
        );
        skills.tomadaDecisao = Math.min(100, skills.tomadaDecisao + choice.deltaSkills.tomadaDecisao);

        impact.caosGlobal = Math.min(100, Math.max(0, impact.caosGlobal + choice.deltaCaos));
        impact.livreArbitrio = Math.min(100, Math.max(0, impact.livreArbitrio + choice.deltaLivreArbitrio));
      }
    }
  });

  const level = Math.max(1, Math.floor(totalXp / 250) + 1);
  const role =
    completedNodes.length >= 2
      ? 'Auditor Desperto'
      : currentRole || 'Investigador Independente';

  return {
    updatedCaseProgress,
    totalXp,
    completedNodes,
    discoveredEvidenceIds,
    unlockedConnectionNodeIds,
    formulatedHypotheses,
    decisionProfile: profile,
    skills,
    globalImpact: impact,
    level,
    role,
  };
}

const DEFAULT_STATE: UserInvestigationState = {
  activeTab: 'mapa',
  selectedCaseId: 'cesar',
  eraFilter: 'todos',
  activeStep: 1,
  completedNodes: [],
  discoveredEvidenceIds: [],
  unlockedConnectionNodeIds: [],
  caseProgress: {},
  formulatedHypotheses: {},
  personalNotes: {},
  totalXp: 0,
  decisionProfile: { ...BASE_PROFILE },
  skills: { ...BASE_SKILLS },
  globalImpact: { ...BASE_IMPACT },
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
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const derived = recomputeDerivedState(
            parsed.caseProgress || {},
            parsed.investigator?.role || 'Investigador Independente'
          );
          return {
            ...DEFAULT_STATE,
            ...parsed,
            caseProgress: derived.updatedCaseProgress,
            totalXp: derived.totalXp,
            completedNodes: derived.completedNodes,
            discoveredEvidenceIds: derived.discoveredEvidenceIds,
            unlockedConnectionNodeIds: derived.unlockedConnectionNodeIds,
            formulatedHypotheses: derived.formulatedHypotheses,
            decisionProfile: derived.decisionProfile,
            skills: derived.skills,
            globalImpact: derived.globalImpact,
            investigator: {
              ...(parsed.investigator || DEFAULT_STATE.investigator),
              level: derived.level,
              role: derived.role,
            },
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

        setState(prev => {
          const mergedCaseProgress = {
            ...(savedInv.caseProgress || {}),
            ...prev.caseProgress,
          };
          const baseRole =
            r.status === 'paid' ? 'Auditor Credenciado' : 'Investigador Independente';
          const derived = recomputeDerivedState(mergedCaseProgress, baseRole);

          return {
            ...prev,
            caseProgress: derived.updatedCaseProgress,
            totalXp: derived.totalXp,
            completedNodes: derived.completedNodes,
            discoveredEvidenceIds: derived.discoveredEvidenceIds,
            unlockedConnectionNodeIds: derived.unlockedConnectionNodeIds,
            formulatedHypotheses: derived.formulatedHypotheses,
            decisionProfile: derived.decisionProfile,
            skills: derived.skills,
            globalImpact: derived.globalImpact,
            investigator: {
              id: r.referral_code || prev.investigator.id,
              name: r.name || prev.investigator.name,
              role: derived.role,
              level: derived.level,
            },
          };
        });
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
        // Mantém local
      }
    };

    const timeout = setTimeout(syncToSupabase, 1500);
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

  const getCaseXpBreakdown = useCallback(
    (caseId: string) => {
      const prog = state.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
      return computeCaseXpBreakdown(caseId, prog);
    },
    [state.caseProgress]
  );

  // ESTRITO: Só retorna true se a conexão histórica do caso foi efetivamente validada na Etapa 2!
  const areCaseConnectionsUnlocked = useCallback(
    (caseId: string): boolean => {
      return state.unlockedConnectionNodeIds.includes(caseId);
    },
    [state.unlockedConnectionNodeIds]
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

  // ETAPA 1: Extrair pista de um documento
  const extractClue = useCallback((caseId: string, clueId: string, _xpReward: number) => {
    setState(prev => {
      const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
      if (currentProg.extractedClueIds.includes(clueId)) return prev;

      const nextCaseMap = {
        ...prev.caseProgress,
        [caseId]: {
          ...currentProg,
          extractedClueIds: [...currentProg.extractedClueIds, clueId],
        },
      };

      const derived = recomputeDerivedState(nextCaseMap, prev.investigator.role);

      return {
        ...prev,
        caseProgress: derived.updatedCaseProgress,
        totalXp: derived.totalXp,
        completedNodes: derived.completedNodes,
        discoveredEvidenceIds: derived.discoveredEvidenceIds,
        unlockedConnectionNodeIds: derived.unlockedConnectionNodeIds,
        formulatedHypotheses: derived.formulatedHypotheses,
        decisionProfile: derived.decisionProfile,
        skills: derived.skills,
        globalImpact: derived.globalImpact,
        investigator: {
          ...prev.investigator,
          level: derived.level,
          role: derived.role,
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
        // Registra tentativa falha sem bloquear o avanço e sem conceder XP
        setState(prev => {
          const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
          if (currentProg.solvedConnectionIds.includes(challengeId)) return prev;
          const prevFailed = currentProg.failedConnectionIds || [];
          const nextFailed = prevFailed.includes(challengeId)
            ? prevFailed
            : [...prevFailed, challengeId];

          return {
            ...prev,
            caseProgress: {
              ...prev.caseProgress,
              [caseId]: {
                ...currentProg,
                failedConnectionIds: nextFailed,
              },
            },
          };
        });

        return {
          success: false,
          message: challenge.errorFeedback,
        };
      }

      setState(prev => {
        const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
        const nextSolved = currentProg.solvedConnectionIds.includes(challengeId)
          ? currentProg.solvedConnectionIds
          : [...currentProg.solvedConnectionIds, challengeId];
        const nextFailed = (currentProg.failedConnectionIds || []).filter(
          id => id !== challengeId
        );

        const nextCaseMap = {
          ...prev.caseProgress,
          [caseId]: {
            ...currentProg,
            solvedConnectionIds: nextSolved,
            failedConnectionIds: nextFailed,
          },
        };

        const derived = recomputeDerivedState(nextCaseMap, prev.investigator.role);

        return {
          ...prev,
          caseProgress: derived.updatedCaseProgress,
          totalXp: derived.totalXp,
          completedNodes: derived.completedNodes,
          discoveredEvidenceIds: derived.discoveredEvidenceIds,
          unlockedConnectionNodeIds: derived.unlockedConnectionNodeIds,
          formulatedHypotheses: derived.formulatedHypotheses,
          decisionProfile: derived.decisionProfile,
          skills: derived.skills,
          globalImpact: derived.globalImpact,
          investigator: {
            ...prev.investigator,
            level: derived.level,
            role: derived.role,
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

  // ETAPA 3: Formular Hipótese sustentada por evidências (avalia consistência Forte, Parcial ou Fraca)
  const submitStructuredHypothesis = useCallback(
    (caseId: string, thesisId: string, attachedClueIds: string[], reasoning: string) => {
      const node = HISTORICAL_NODES.find(n => n.id === caseId);
      const thesis = node?.hypothesisTheses?.find(t => t.id === thesisId);

      const matchingClues = attachedClueIds.filter(id => thesis?.supportingClueIds.includes(id));
      let score: 'forte' | 'parcial' | 'fraca' = 'fraca';
      let xpAwarded = 25;
      let feedback =
        'Baixa Consistência: As evidências anexadas não correspondem diretamente aos fatos que sustentam esta tese. Você pode revisar as provas ou prosseguir.';

      if (matchingClues.length >= 2) {
        score = 'forte';
        xpAwarded = 100;
        feedback =
          thesis?.feedbackStrong ||
          'Alta Consistência: Hipótese muito bem sustentada pelas evidências selecionadas.';
      } else if (matchingClues.length === 1) {
        score = 'parcial';
        xpAwarded = 60;
        feedback =
          thesis?.feedbackPartial ||
          'Consistência Parcial: Você anexou uma evidência coerente, mas faltou uma segunda prova complementar para blindar a hipótese.';
      }

      setState(prev => {
        const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
        const nextCaseMap = {
          ...prev.caseProgress,
          [caseId]: {
            ...currentProg,
            selectedThesisId: thesisId,
            attachedClueIds,
            hypothesisReasoning: reasoning,
            hypothesisScore: score,
          },
        };

        const derived = recomputeDerivedState(nextCaseMap, prev.investigator.role);

        return {
          ...prev,
          caseProgress: derived.updatedCaseProgress,
          totalXp: derived.totalXp,
          completedNodes: derived.completedNodes,
          discoveredEvidenceIds: derived.discoveredEvidenceIds,
          unlockedConnectionNodeIds: derived.unlockedConnectionNodeIds,
          formulatedHypotheses: derived.formulatedHypotheses,
          personalNotes: reasoning.trim()
            ? { ...prev.personalNotes, [caseId]: reasoning.trim() }
            : prev.personalNotes,
          decisionProfile: derived.decisionProfile,
          skills: derived.skills,
          globalImpact: derived.globalImpact,
          investigator: {
            ...prev.investigator,
            level: derived.level,
            role: derived.role,
          },
        };
      });

      return { score, feedback, xpAwarded };
    },
    []
  );

  // ETAPA 4 -> 5: Tomar decisão no dilema simulado (NÃO força desbloqueio de conexões não validadas!)
  const submitSimulationDecision = useCallback((caseId: string, choiceId: string) => {
    setState(prev => {
      const currentProg = prev.caseProgress[caseId] || DEFAULT_CASE_PROGRESS;
      const nextCaseMap = {
        ...prev.caseProgress,
        [caseId]: {
          ...currentProg,
          selectedDecisionId: choiceId,
          completed: true,
        },
      };

      const derived = recomputeDerivedState(nextCaseMap, prev.investigator.role);

      return {
        ...prev,
        caseProgress: derived.updatedCaseProgress,
        totalXp: derived.totalXp,
        completedNodes: derived.completedNodes,
        discoveredEvidenceIds: derived.discoveredEvidenceIds,
        unlockedConnectionNodeIds: derived.unlockedConnectionNodeIds,
        formulatedHypotheses: derived.formulatedHypotheses,
        decisionProfile: derived.decisionProfile,
        skills: derived.skills,
        globalImpact: derived.globalImpact,
        investigator: {
          ...prev.investigator,
          level: derived.level,
          role: derived.role,
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
  const totalConnectionsValidated = Object.values(state.caseProgress).reduce(
    (acc, curr) => acc + (curr.solvedConnectionIds?.length || 0),
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
        getCaseXpBreakdown,
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
          totalConnectionsValidated,
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
