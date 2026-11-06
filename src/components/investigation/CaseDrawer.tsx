import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Sparkles, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const CaseDrawer: React.FC = () => {
  const { selectedCase, startCaseInvestigation, state } = useInvestigation();
  const isCompleted = state.completedNodes.includes(selectedCase.id);
  const isQuarantine = selectedCase.status === 'quarentena';
  const isBlocked = selectedCase.status === 'bloqueado' && !isCompleted;

  return (
    <div className="w-full rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/30 p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.8)] relative flex flex-col justify-between overflow-hidden">
      {/* Brilho de fundo sutil */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-4">
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-amber-300">
              Caso em Destaque
            </span>
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3" /> Concluído
            </span>
          ) : isQuarantine ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400/80 font-mono text-[11px]">
              <Lock className="w-3 h-3" /> Volume II
            </span>
          ) : isBlocked ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[11px]">
              <Lock className="w-3 h-3" /> Bloqueado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold animate-pulse">
              ● Disponível
            </span>
          )}
        </div>

        {/* Imagem Ilustrativa com Borda Dourada */}
        <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 group">
          <img
            src={selectedCase.dossierCover || selectedCase.image}
            alt={selectedCase.fullName}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-amber-300 font-semibold">
              {selectedCase.year}
            </span>
            <span className="text-slate-400">
              {selectedCase.location}
            </span>
          </div>
        </div>

        {/* Título e Descrição */}
        <div className="space-y-1.5">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide leading-snug">
            {selectedCase.fullName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            {selectedCase.shortDescription}
          </p>
        </div>

        {/* Seção 'Sua Missão' com Losangos Dourados */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <div className="text-xs font-mono font-bold tracking-wider uppercase text-amber-400">
            Sua Missão Analítica:
          </div>
          <ul className="space-y-1.5">
            {selectedCase.missionBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                <span className="text-amber-400 text-[10px] mt-0.5 select-none shrink-0">◆</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão de Ação CTA */}
      <div className="pt-5">
        {isQuarantine ? (
          <div className="w-full py-3 px-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 text-xs font-mono text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500/70" />
            <span>Arquivo sob Quarentena // Expansão do Volume II</span>
          </div>
        ) : isBlocked ? (
          <div className="w-full py-3 px-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 text-xs font-mono text-center flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Conclua a investigação anterior para desbloquear</span>
          </div>
        ) : (
          <button
            onClick={() => startCaseInvestigation(selectedCase.id)}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] transition-all cursor-pointer active:scale-[0.99]"
          >
            <span>{isCompleted ? 'Reexaminar Dossiê' : 'Investigar Caso'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
