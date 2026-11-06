export type EraFilter = 'todos' | 'antiguidade' | 'idade_media' | 'moderna' | 'contemporanea';

export type NodeStatus = 'concluido' | 'disponivel' | 'bloqueado' | 'quarentena';

export type TabKey = 'mapa' | 'dossies' | 'missoes' | 'comunidade' | 'perfil';

export interface ExtractableClue {
  id: string;
  title: string;
  excerpt: string;
  analysisNote: string;
  category: 'cronologia' | 'logistica' | 'contradicao' | 'mapa' | 'opcional';
  xpReward: number;
  isOptional?: boolean;
  isContradiction?: boolean;
}

export interface EvidenceDocument {
  id: string;
  code: string;
  title: string;
  typeLabel: string;
  dateLabel: string;
  summary: string;
  fullText: string;
  clues: ExtractableClue[];
}

export interface ConnectionChallenge {
  id: string;
  stepNumber: number;
  question: string;
  promptHint: string;
  requiredClueIds: [string, string];
  successTitle: string;
  successConclusion: string;
  errorFeedback: string;
  xpReward: number;
  unlocksMapConnections?: boolean;
}

export interface HypothesisThesis {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  supportingClueIds: string[]; // Pistas que melhor fundamentam esta tese
  feedbackStrong: string;
  feedbackPartial: string;
}

export interface SimulationChoice {
  id: string;
  tag: 'A' | 'B' | 'C';
  title: string;
  subtitle: string;
  description: string;
  consequenceSummary: string;
  deltaCaos: number;
  deltaLivreArbitrio: number;
  deltaPerfil: {
    analitico: number;
    estrategico: number;
    humanista: number;
    exploratorio: number;
  };
  deltaSkills: {
    leituraEvidencias: number;
    reconhecimentoPadroes: number;
    raciocinioEstrategico: number;
    tomadaDecisao: number;
  };
}

export interface Hypothesis {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  consequence: string;
  deltaCaos: number;
  deltaLivreArbitrio: number;
  deltaPerfil: {
    analitico: number;
    estrategico: number;
    humanista: number;
  };
}

export interface HistoricalNode {
  id: string;
  name: string;
  fullName: string;
  year: string;
  timelineLabel: string;
  location: string;
  era: EraFilter;
  coords: { x: number; y: number };
  geoCoords?: { x: number; y: number };
  image: string;
  dossierCover: string;
  status: NodeStatus;
  isVolumeOne: boolean;
  missionCode?: string;
  missionTitle?: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  missionBullets: string[];
  evidence: {
    title: string;
    artifactCode: string;
    locationSubtitle: string;
    parchmentNote: string;
    confidentialTelemetry: string;
  };
  documents?: EvidenceDocument[];
  connectionChallenges?: ConnectionChallenge[];
  hypothesisTheses?: HypothesisThesis[];
  simulationPrompt?: string;
  simulationChoices?: SimulationChoice[];
  alternativeInterpretations?: string[];
  connectedTo: string[];
  hypotheses: Hypothesis[];
}

export interface CasePlayProgress {
  examinedDocumentIds?: string[];
  activeDocId?: string;
  lastStep?: 1 | 2 | 3 | 4 | 5;
  extractedClueIds: string[];
  solvedConnectionIds: string[];
  selectedThesisId?: string;
  attachedClueIds: string[];
  hypothesisReasoning: string;
  hypothesisScore?: 'forte' | 'parcial' | 'fraca';
  failedConnectionIds?: string[];
  selectedDecisionId?: string;
  completed: boolean;
  xpEarned: number;
}

export interface UserInvestigationState {
  activeTab: TabKey;
  selectedCaseId: string;
  eraFilter: EraFilter;
  activeStep: 1 | 2 | 3 | 4 | 5;
  completedNodes: string[];
  discoveredEvidenceIds: string[];
  unlockedConnectionNodeIds: string[]; // Casos cujas conexões no mapa já foram descobertas pelo jogador
  caseProgress: Record<string, CasePlayProgress>;
  formulatedHypotheses: Record<string, string>;
  personalNotes: Record<string, string>;
  totalXp: number;
  decisionProfile: {
    analitico: number;
    estrategico: number;
    humanista: number;
    exploratorio: number;
  };
  skills: {
    leituraEvidencias: number;
    reconhecimentoPadroes: number;
    raciocinioEstrategico: number;
    tomadaDecisao: number;
  };
  globalImpact: {
    caosGlobal: number;
    livreArbitrio: number;
    suspeita: number;
  };
  investigator: {
    id: string;
    name: string;
    role: string;
    level: number;
  };
}
