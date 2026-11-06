import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { DecisionTriangleSvg } from './DecisionTriangleSvg';
import { SemiCircleGauge } from './SemiCircleGauge';
import { BookOpen, Search, Lock, Globe, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const InvestigatorProfileView: React.FC = () => {
  const { state, allNodes, stats, startCaseInvestigation } = useInvestigation();

  return (
    <div className="space-y-6">
      
      {/* 1. TOPO: IDENTIDADE DO AUDITOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 bg-gradient-to-br from-amber-500/30 to-slate-950 flex items-center justify-center text-amber-300 font-bold text-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            74
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
              {state.investigator.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                {state.investigator.role}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Nível {state.investigator.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans pt-1">
              Registro Ativo // Auditoria de Anomalias do Romance (Volume I)
            </p>
          </div>
        </div>

        {/* Resumo de Progresso Individual Real */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono space-y-1 min-w-[200px]">
          <div className="text-slate-400">Progresso de Campo:</div>
          <div className="text-amber-400 font-bold text-base">
            {stats.analyzedCount} de {stats.totalVolumeOne} Dossiês Concluídos
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. CARD "SUA JORNADA" (4 CAMADAS DO ECOSSISTEMA TRANSMÍDIA) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            Sua Jornada // Camadas do Ecossistema
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Volume I Ativo
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Camada 1: Livro Conectado */}
          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="font-sans font-bold text-xs text-white">Livro Conectado</div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Volume I Ativo
            </span>
          </div>

          {/* Camada 2: Investigação em Andamento */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/50 flex flex-col items-center text-center space-y-2 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 animate-pulse">
              <Search className="w-5 h-5" />
            </div>
            <div className="font-sans font-bold text-xs text-white">Investigação de Campo</div>
            <span className="text-[10px] font-mono text-amber-400 font-bold">
              ● Em Descoberta
            </span>
          </div>

          {/* Camada 3: Simulação de Cenários (Volume II) */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 opacity-60 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <div className="font-sans font-bold text-xs text-slate-400">Simulação Contrafactual</div>
            <span className="text-[10px] font-mono text-slate-500">Volume II</span>
          </div>

          {/* Camada 4: Missão Global (Volume III) */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 opacity-60 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
              <Globe className="w-4 h-4" />
            </div>
            <div className="font-sans font-bold text-xs text-slate-400">Impacto Global</div>
            <span className="text-[10px] font-mono text-slate-500">Volume III</span>
          </div>
        </div>
      </div>

      {/* 3. GRID DE PERFIL: TRIÂNGULO RADAR + IMPACTO GLOBAL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* TRIÂNGULO DE PERFIL ANALÍTICO */}
        <div className="md:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/25 shadow-xl space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              Seu Perfil de Decisão
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Calibrado por Hipóteses
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Reflete a tendência das suas deduções históricas: inclinação a variáveis lógicas, manobras estratégicas ou impactos humanistas.
          </p>
          <DecisionTriangleSvg
            analitico={state.decisionProfile.analitico}
            estrategico={state.decisionProfile.estrategico}
            humanista={state.decisionProfile.humanista}
          />
        </div>

        {/* MEDIDORES DE IMPACTO GLOBAL */}
        <div className="md:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-cyan-500/25 shadow-xl space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                Métricas de Interpretação
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Variáveis do Modelo
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              O balanço teórico das decisões formuladas nos dossiês de campo.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-4">
            <SemiCircleGauge label="Caos Global" value={state.globalImpact.caosGlobal} color="orange" />
            <SemiCircleGauge label="Livre-Arbítrio" value={state.globalImpact.livreArbitrio} color="cyan" />
            <SemiCircleGauge label="Suspeita" value={state.globalImpact.suspeita} color="purple" />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] font-mono text-slate-400 text-center">
            Suas decisões influenciam a matriz de convergência dos próximos episódios.
          </div>
        </div>

      </div>

      {/* 4. DOSSIÊS RESOLVIDOS & NOTAS DE CAMPO */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            Caderno de Campo // Hipóteses Registradas
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            {stats.hypothesesCount} gravadas
          </span>
        </div>

        {allNodes.filter(n => state.completedNodes.includes(n.id)).length > 0 ? (
          <div className="space-y-3">
            {allNodes
              .filter(n => state.completedNodes.includes(n.id))
              .map(node => {
                const hypoId = state.formulatedHypotheses[node.id];
                const hypo = node.hypotheses.find(h => h.id === hypoId);
                const note = state.personalNotes[node.id];

                return (
                  <div
                    key={node.id}
                    className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-white">
                          {node.fullName}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {node.year}
                        </span>
                      </div>
                      {hypo && (
                        <div className="text-xs font-sans text-cyan-300">
                          Hipótese Escolhida: <strong>{hypo.title}</strong>
                        </div>
                      )}
                      {note && (
                        <p className="text-xs font-sans text-slate-300 italic pt-1">
                          "{note}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => startCaseInvestigation(node.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Revisar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-900/40 border border-dashed border-slate-700 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-xs font-mono text-slate-300">Nenhum dossiê concluído ainda.</div>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              Inicie pelo caso de Júlio César e o Rubicão no Mapa Mundial para registrar suas primeiras deduções.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
