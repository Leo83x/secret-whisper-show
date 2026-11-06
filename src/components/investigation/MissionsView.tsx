import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Target, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const MissionsView: React.FC = () => {
  const { allNodes, state, startCaseInvestigation } = useInvestigation();

  const volumeOneNodes = allNodes.filter(n => n.isVolumeOne);

  return (
    <div className="space-y-6">
      <div className="border-b border-amber-500/20 pb-4">
        <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-white uppercase flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <span>Diretrizes e Missões de Investigação // Volume I</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
          Confronte as fontes primárias de cada nó para desbloquear as camadas analíticas da obra.
        </p>
      </div>

      <div className="space-y-4">
        {volumeOneNodes.map(node => {
          const isCompleted = state.completedNodes.includes(node.id);
          const hasHypo = !!state.formulatedHypotheses[node.id];

          return (
            <div
              key={node.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-[#0B1320]/80 border-emerald-500/30'
                  : 'bg-[#0B1320]/95 border-amber-500/25 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400/40 shrink-0 bg-slate-900">
                  <img src={node.image} alt={node.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-white">{node.fullName}</span>
                    <span className="text-xs sm:text-sm font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {node.year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">{node.shortDescription}</p>
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono">
                    {isCompleted ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Dossiê Concluído e Sincronizado
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Investigação Pendente
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => startCaseInvestigation(node.id)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start md:self-auto"
              >
                <span>{isCompleted ? 'Reexaminar' : 'Iniciar Missão'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
