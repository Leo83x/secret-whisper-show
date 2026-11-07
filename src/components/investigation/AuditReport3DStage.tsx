import React, { useState, useEffect } from 'react';
import {
  HistoricalNode,
  EvidenceDocument,
  ConnectionChallenge,
  HypothesisThesis,
  SimulationChoice,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import {
  Award,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Compass,
  Link2,
  ShieldCheck,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { ExtractedClueItem } from './CrossExamination3DStage';

interface AuditReport3DStageProps {
  selectedCase: HistoricalNode;
  documents: EvidenceDocument[];
  challenges: ConnectionChallenge[];
  theses: HypothesisThesis[];
  simChoices: SimulationChoice[];
  extractedCluesList: ExtractedClueItem[];
  allCaseClues: ExtractedClueItem[];
  solvedConnectionIds: string[];
  selectedThesisId: string | undefined;
  hypothesisScore: 'forte' | 'parcial' | 'fraca' | undefined;
  hypothesisReasoning: string | undefined;
  selectedDecisionId: string | undefined;
  mapConnectionsUnlocked: boolean;
  xpBreakdown: {
    cluesXp: number;
    connectionsXp: number;
    hypothesisXp: number;
    decisionXp: number;
    totalCaseXp: number;
  };
  onReturnToMap: () => void;
  onOpenArchiveDrawer: () => void;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
}

export const AuditReport3DStage: React.FC<AuditReport3DStageProps> = ({
  selectedCase,
  challenges,
  theses,
  simChoices,
  extractedCluesList,
  allCaseClues,
  solvedConnectionIds,
  selectedThesisId,
  hypothesisScore,
  hypothesisReasoning,
  selectedDecisionId,
  mapConnectionsUnlocked,
  xpBreakdown,
  onReturnToMap,
  onOpenArchiveDrawer,
  onSelectStep,
}) => {
  const [camRotX, setCamRotX] = useState<number>(4);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.02);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [muted, setMuted] = useState(() => soundEngine.getSettings().mutedAll);

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  const registeredThesis = theses.find(t => t.id === selectedThesisId);
  const registeredDecision = simChoices.find(c => c.id === selectedDecisionId);
  const validatedChallenges = challenges.filter(ch => solvedConnectionIds.includes(ch.id));

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  return (
    <div className="relative min-h-[92vh] w-full bg-[#04060B] select-none font-sans space-y-5 pb-12">
      {/* 1. HUD SUPERIOR DA CÂMARA DE SÍNTESE */}
      <div className="rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-slate-800 p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
              {caseShortHeader} ({selectedCase.name})
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
              Etapa 5 — Câmara de Síntese & Laudo de Auditoria Histórica
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenArchiveDrawer}
            className="px-3 py-1.5 rounded-xl bg-[#0B1320] hover:bg-[#131D31] border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Arquivo</span>
          </button>

          <button
            type="button"
            onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
            className="p-1.5 rounded-xl bg-[#0B1320] border border-slate-700 text-cyan-300 hover:text-white cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. CENÁRIO 3D: CÂMARA MONUMENTAL COM MAPA ILUMINADO AO FUNDO */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-amber-500/40 bg-[#070B14] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          <img
            src="/dossiers/audit_chamber_3d_clean.webp"
            alt="Câmara de Auditoria Histórica"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
            style={{
              filter: 'brightness(0.95) contrast(1.06)',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.14) 0%, rgba(245, 158, 11, 0.08) 35%, transparent 75%)',
            }}
          />
        </div>

        <div className="relative z-30 p-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className={`px-3 py-1 rounded-xl backdrop-blur-md border text-xs font-mono cursor-pointer transition-all ${
              isAutoOrbiting
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                : 'bg-[#0B111E]/85 border-cyan-500/40 text-cyan-300 hover:border-amber-400/60'
            }`}
          >
            [ {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar Câmara 3D'} ]
          </button>

          {(camRotX !== 4 || camRotY !== 0 || camScale !== 1.02) && (
            <button
              type="button"
              onClick={() => {
                setIsAutoOrbiting(false);
                setCamRotX(4);
                setCamRotY(0);
                setCamScale(1.02);
              }}
              className="p-1.5 rounded-xl bg-[#0B111E]/85 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Centralizar Câmera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* LAUDO DE AUDITORIA HISTÓRICA SOBRE O PÓDIO DA CÂMARA */}
        <div className="relative z-20 p-5 sm:p-8 lg:p-10 space-y-6">
          <div className="rounded-2xl bg-[#080E1A]/95 backdrop-blur-md border border-amber-500/35 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Cabeçalho do Laudo Strata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>LAUDO OFICIAL DE AUDITORIA HISTÓRICA // STRATA ARCHIVES</span>
                </div>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white">
                  {selectedCase.fullName}
                </h3>
                <p className="text-xs font-mono text-cyan-300">
                  {selectedCase.location} ({selectedCase.year}) — {selectedCase.historicalPhase}
                </p>
              </div>

              <div className="px-5 py-3 rounded-xl bg-[#060A12] border border-amber-500/40 text-center shrink-0">
                <div className="text-[10px] font-mono uppercase text-slate-400">Mérito Investigativo</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400">
                  +{xpBreakdown.totalCaseXp} XP
                </div>
              </div>
            </div>

            {/* 4 Indicadores Rigorosos (Separando Pista Extraída, Conexão Comprovada e Hipótese) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Pistas Extraídas</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {extractedCluesList.length}/{allCaseClues.length}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Vínculos Comprovados</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">
                  {validatedChallenges.length}/{challenges.length}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Consistência da Tese</div>
                <div className="text-sm font-bold text-amber-300 mt-1.5 uppercase">
                  {hypothesisScore === 'forte'
                    ? 'Alta (+100 XP)'
                    : hypothesisScore === 'parcial'
                    ? 'Parcial (+60 XP)'
                    : hypothesisScore === 'fraca'
                    ? 'Baixa (+25 XP)'
                    : 'Registrada'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Elos Históricos</div>
                <div className="text-sm font-bold text-white mt-1.5">
                  {mapConnectionsUnlocked ? 'Comprovados no Mapa' : 'Não Demonstrados'}
                </div>
              </div>
            </div>

            {/* Hipótese Registrada no Compêndio */}
            <div className="p-5 rounded-2xl bg-[#060A12]/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  Hipótese Registrada no Compêndio:
                </span>
                {registeredThesis && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase">
                    {registeredThesis.tag}
                  </span>
                )}
              </div>
              <div className="text-base font-sans font-bold text-white">
                {registeredThesis ? registeredThesis.title : 'Nenhuma hipótese formal registrada.'}
              </div>
              {registeredThesis && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {registeredThesis.description}
                </p>
              )}
              {hypothesisReasoning && (
                <div className="pt-2 border-t border-slate-800/80 text-xs font-mono text-cyan-200">
                  Caderno de Campo: "{hypothesisReasoning}"
                </div>
              )}
            </div>

            {/* Decisão de Campo Simulada */}
            <div className="p-5 rounded-2xl bg-[#060A12]/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  Posição Estratégica Assumida na Simulação:
                </span>
                {registeredDecision && (
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                    Ordem {registeredDecision.tag}
                  </span>
                )}
              </div>
              <div className="text-base font-sans font-bold text-white">
                {registeredDecision ? registeredDecision.title : 'Decisão em aberto.'}
              </div>
              {registeredDecision && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {registeredDecision.consequenceText || registeredDecision.description}
                </p>
              )}
            </div>

            {/* Botão Principal em Destaque Dourado: RETORNAR AO MAPA MUNDIAL */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onSelectStep(1)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
              >
                Revisar Arquivo Histórico (Etapa 1)
              </button>

              <button
                type="button"
                onClick={onReturnToMap}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer"
              >
                <Globe className="w-5 h-5" />
                <span>RETORNAR AO MAPA MUNDIAL</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
