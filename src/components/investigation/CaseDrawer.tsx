import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { RestrictedFileModal } from './RestrictedFileModal';
import { soundEngine } from '../../utils/investigationAudio';
import {
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  FileSearch,
  GitCommit,
  EyeOff,
  Check,
  Circle,
} from 'lucide-react';

export const CaseDrawer: React.FC = () => {
  const {
    selectedCase,
    allNodes,
    state,
    startCaseInvestigation,
    selectCase,
    getCasePlayProgress,
    areCaseConnectionsUnlocked,
  } = useInvestigation();

  const [showRestrictedModal, setShowRestrictedModal] = useState(false);

  const isCompleted = state.completedNodes.includes(selectedCase.id);
  const isQuarantine = selectedCase.status === 'quarentena';
  const progress = getCasePlayProgress(selectedCase.id);
  const connectionsUnlocked = areCaseConnectionsUnlocked(selectedCase.id);

  const totalCluesInCase =
    selectedCase.documents?.reduce((acc, doc) => acc + doc.clues.length, 0) || 4;
  const totalConnectionsInCase = selectedCase.connectionChallenges?.length || 2;

  const unlockedConnections = selectedCase.connectedTo
    .map(id => allNodes.find(n => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n && n.status !== 'quarentena'));

  const actionSteps = [
    {
      label: `1. Observar documentos e extrair pistas (${progress.extractedClueIds.length}/${totalCluesInCase})`,
      done: progress.extractedClueIds.length >= 2,
    },
    {
      label: `2. Validar relações na Mesa de Conexões (${progress.solvedConnectionIds.length}/${totalConnectionsInCase})`,
      done: progress.solvedConnectionIds.length >= totalConnectionsInCase,
    },
    {
      label: '3. Formular hipótese sustentada por evidências',
      done: Boolean(progress.selectedThesisId),
    },
    {
      label: '4. Decidir no dilema simulado e revelar consequências',
      done: Boolean(progress.selectedDecisionId),
    },
  ];

  return (
    <>
      <div className="rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/35 shadow-[0_0_25px_rgba(212,175,55,0.12)] overflow-hidden flex flex-col font-sans lg:h-full lg:min-h-0">
        
        {/* Cabeçalho do Card + Status da Investigação */}
        <div className="px-4 py-3 border-b border-amber-500/20 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-mono uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{selectedCase.missionCode || 'Caso em Destaque'}</span>
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Concluído
            </span>
          ) : isQuarantine ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/15 text-red-300 border border-red-500/30 font-semibold">
              <Lock className="w-3 h-3" /> Acesso Condicionado
            </span>
          ) : progress.extractedClueIds.length > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold">
              Em Investigação
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
              Disponível
            </span>
          )}
        </div>

        {/* Imagem Ilustrativa do Personagem / Evento */}
        <div className="relative h-36 xl:h-44 w-full overflow-hidden bg-slate-950 border-b border-amber-500/20 shrink-0">
          <img
            src={selectedCase.dossierCover || selectedCase.image}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = selectedCase.image;
            }}
            alt={selectedCase.title}
            className={`w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 ${
              isQuarantine ? 'grayscale contrast-125 opacity-60' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
              {selectedCase.year} • {selectedCase.location}
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-bold text-white leading-snug mt-0.5">
              {selectedCase.title}
            </h3>
            {selectedCase.missionTitle && (
              <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider mt-0.5">
                {selectedCase.missionTitle}
              </div>
            )}
          </div>
        </div>

        {/* Corpo Descritivo */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between lg:overflow-y-auto lg:min-h-0">
          <div className="space-y-4">
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {selectedCase.shortDescription}
            </p>

            {/* Evidências Disponíveis & Conexões */}
            {!isQuarantine && (
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-[#060A12]/80 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileSearch className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        Peças no Dossiê ({selectedCase.documents?.length || 4} Documentos)
                      </div>
                      <div className="text-xs font-mono text-slate-200 truncate">
                        {progress.extractedClueIds.length} de {totalCluesInCase} pistas extraídas
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                      progress.extractedClueIds.length > 0
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                    }`}
                  >
                    {progress.extractedClueIds.length > 0 ? 'Em Análise' : 'Inspecionar'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#060A12]/80 border border-slate-800 space-y-1.5">
                  {connectionsUnlocked ? (
                    <>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-cyan-400">
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Conexões Descobertas ({unlockedConnections.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {unlockedConnections.map(conn => (
                          <button
                            key={conn.id}
                            onClick={() => selectCase(conn.id)}
                            className="px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-mono text-cyan-200 transition-colors cursor-pointer"
                          >
                            {conn.name} ({conn.year})
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-2 text-slate-400">
                      <EyeOff className="w-4 h-4 text-amber-400/70 shrink-0 mt-0.5" />
                      <div className="text-xs leading-snug">
                        <span className="font-mono text-[10px] uppercase text-amber-300/90 block">
                          Conexões Históricas Ocultas
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Indícios de ressonância detectados. Examine as evidências e valide as conexões no dossiê para revelar os elos no mapa.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lista de Ações Concretas do Ciclo de Investigação */}
            {!isQuarantine ? (
              <div className="space-y-2 pt-2 border-t border-amber-500/15">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Ciclo da Missão:
                </div>
                <ul className="space-y-1.5">
                  {actionSteps.map((step, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2 text-xs sm:text-sm leading-relaxed ${
                        step.done ? 'text-emerald-300' : 'text-slate-300'
                      }`}
                    >
                      {step.done ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-amber-400/70 shrink-0 mt-1" />
                      )}
                      <span>{step.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-amber-500/15">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Status do Arquivo:
                </div>
                <ul className="space-y-1.5">
                  {selectedCase.missionBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                      <span className="text-amber-400 text-xs mt-1 shrink-0">◆</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Botão de Ação Principal (font-sans limpa e legível) */}
          <div className="pt-3">
            {!isQuarantine ? (
              <button
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  startCaseInvestigation(selectedCase.id);
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-[#060A12] font-sans font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_28px_rgba(245,158,11,0.6)] hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isCompleted ? 'REVISAR INVESTIGAÇÃO' : 'INVESTIGAR CASO'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEngine.playErrorPulse();
                  setShowRestrictedModal(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/40 text-red-300 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>ACESSO RESTRITO — VER CONDIÇÕES</span>
              </button>
            )}
          </div>
        </div>

      </div>

      <RestrictedFileModal
        node={showRestrictedModal ? selectedCase : null}
        onClose={() => setShowRestrictedModal(false)}
      />
    </>
  );
};
