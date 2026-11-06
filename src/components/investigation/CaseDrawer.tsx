import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Sparkles, Lock, ArrowRight, CheckCircle2, ShieldAlert, FileSearch, GitCommit } from 'lucide-react';

export const CaseDrawer: React.FC = () => {
  const { selectedCase, allNodes, state, startCaseInvestigation, selectCase } = useInvestigation();
  const isCompleted = state.completedNodes.includes(selectedCase.id);
  const isEvidenceVerified = state.discoveredEvidenceIds.includes(selectedCase.id);
  const isQuarantine = selectedCase.status === 'quarentena';

  // Conexões descobertas / relacionadas (apenas nós liberados do Volume I, sem revelar bloqueados)
  const unlockedConnections = selectedCase.connectedTo
    .map(id => allNodes.find(n => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n && n.status !== 'quarentena'));

  return (
    <div className="rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/35 shadow-[0_0_25px_rgba(212,175,55,0.12)] overflow-hidden flex flex-col">
      
      {/* Cabeçalho do Card + Status da Investigação */}
      <div className="px-4 py-3 border-b border-amber-500/20 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
        <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-mono uppercase tracking-widest font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Caso em Destaque</span>
        </div>
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Concluído
          </span>
        ) : isQuarantine ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-600 font-semibold">
            <Lock className="w-3 h-3" /> Em Quarentena
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
            Disponível
          </span>
        )}
      </div>

      {/* Imagem Ilustrativa do Personagem / Evento */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-950 border-b border-amber-500/20">
        <img
          src={selectedCase.dossierCover || selectedCase.image}
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
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug mt-0.5">
            {selectedCase.title}
          </h3>
        </div>
      </div>

      {/* Corpo Descritivo */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Parágrafo interno com leitura confortável (text-sm leading-relaxed) */}
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {selectedCase.shortDescription}
          </p>

          {/* Evidências Disponíveis & Conexões Descobertas */}
          {!isQuarantine && (
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {/* Evidência Disponível */}
              <div className="p-2.5 rounded-xl bg-[#060A12]/80 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileSearch className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Evidência Primária</div>
                    <div className="text-xs font-mono text-slate-200 truncate">{selectedCase.evidence.artifactCode}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                  isEvidenceVerified
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                }`}>
                  {isEvidenceVerified ? 'Descriptografada' : 'Disponível'}
                </span>
              </div>

              {/* Conexões Descobertas */}
              {unlockedConnections.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#060A12]/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-cyan-400">
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>Conexões Históricas Ativas ({unlockedConnections.length})</span>
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
                </div>
              )}
            </div>
          )}

          {/* Lista "Sua missão:" */}
          <div className="space-y-2 pt-2 border-t border-amber-500/15">
            <div className="text-xs font-serif uppercase tracking-wider text-amber-400 font-semibold">
              Sua missão:
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
        </div>

        {/* Botão de Ação Principal */}
        <div className="pt-3">
          {!isQuarantine ? (
            <button
              onClick={() => startCaseInvestigation(selectedCase.id)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-[#060A12] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_28px_rgba(245,158,11,0.6)] hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>INVESTIGAR CASO</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <div className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500/70 shrink-0" />
              <span>Arquivo Reservado — Expansão Volume II</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
