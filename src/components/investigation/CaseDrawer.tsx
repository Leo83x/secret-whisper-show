import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Sparkles, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const CaseDrawer: React.FC = () => {
  const { selectedCase, startCaseInvestigation, state } = useInvestigation();
  const isCompleted = state.completedNodes.includes(selectedCase.id);
  const isQuarantine = selectedCase.status === 'quarentena';
  const isBlocked = selectedCase.status === 'bloqueado' && !isCompleted;

  return (
    <div className="w-full rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/35 p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.85)] relative flex flex-col justify-between overflow-hidden">
      {/* Brilho de fundo sutil */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-4">
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs sm:text-sm uppercase tracking-wider font-bold text-amber-300">
              Caso em Destaque
            </span>
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
            </span>
          ) : isQuarantine ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-xs">
              <Lock className="w-3.5 h-3.5" /> Volume II
            </span>
          ) : isBlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs">
              <Lock className="w-3.5 h-3.5" /> Bloqueado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold animate-pulse">
              ● Disponível
            </span>
          )}
        </div>

        {/* Imagem Ilustrativa com Borda Dourada */}
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-amber-500/35 bg-slate-950 group">
          <img
            src={selectedCase.dossierCover || selectedCase.image}
            alt={selectedCase.fullName}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-transparent to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-200">
            <span className="px-2.5 py-0.5 rounded bg-black/80 border border-amber-500/30 text-amber-300 font-bold">
              {selectedCase.year}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 text-slate-200">
              {selectedCase.location}
            </span>
          </div>
        </div>

        {/* Título e Descrição com Fonte Ampliada */}
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug">
            {selectedCase.fullName}
          </h3>
          <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
            {selectedCase.shortDescription}
          </p>
        </div>

        {/* Seção 'Sua Missão' com Losangos Dourados e Fonte Legível */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <div className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-amber-400">
            Sua Missão Analítica:
          </div>
          <ul className="space-y-2">
            {selectedCase.missionBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200 leading-relaxed">
                <span className="text-amber-400 text-xs mt-1 select-none shrink-0">◆</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão de Ação CTA */}
      <div className="pt-5">
        {isQuarantine ? (
          <div className="w-full py-3.5 px-4 rounded-xl bg-slate-900/90 border border-amber-500/25 text-amber-200/90 text-xs sm:text-sm font-mono text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Arquivo Reservado // Expansão do Volume II</span>
          </div>
        ) : isBlocked ? (
          <div className="w-full py-3.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 text-xs sm:text-sm font-mono text-center flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Conclua a investigação anterior para desbloquear</span>
          </div>
        ) : (
          <button
            onClick={() => startCaseInvestigation(selectedCase.id)}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] transition-all cursor-pointer active:scale-[0.99]"
          >
            <span>{isCompleted ? 'Reexaminar Dossiê' : 'Investigar Caso'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
