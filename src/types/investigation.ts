export type EraFilter = 'todos' | 'antiguidade' | 'idade_media' | 'moderna' | 'contemporanea';

export type NodeStatus = 'concluido' | 'disponivel' | 'bloqueado' | 'quarentena';

export type TabKey = 'mapa' | 'dossies' | 'missoes' | 'comunidade' | 'perfil';

export interface Hypothesis {
  id: string;
  tag: string; // ex: 'A' | 'B'
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
  coords: { x: number; y: number }; // Percentual relativo no mapa SVG (0-100)
  image: string;
  dossierCover: string;
  status: NodeStatus;
  isVolumeOne: boolean;
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
  connectedTo: string[]; // IDs de outros nós do radar orbital
  hypotheses: Hypothesis[];
}

export interface UserInvestigationState {
  activeTab: TabKey;
  selectedCaseId: string;
  eraFilter: EraFilter;
  activeStep: 1 | 2 | 3;
  completedNodes: string[];
  discoveredEvidenceIds: string[];
  formulatedHypotheses: Record<string, string>; // caseId -> hypothesisId
  personalNotes: Record<string, string>; // caseId -> custom notes text
  decisionProfile: {
    analitico: number;
    estrategico: number;
    humanista: number;
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
