import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { DecisionTriangleSvg } from './DecisionTriangleSvg';
import { SemiCircleGauge } from './SemiCircleGauge';
import {
  BookOpen,
  Search,
  Lock,
  CheckCircle2,
  ArrowRight,
  Award,
  FileText,
  Sparkles,
  Layers,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export const InvestigatorProfileView: React.FC = () => {
  const {
    state,
    allNodes,
    stats,
    startCaseInvestigation,
    getCasePlayProgress,
    isAuthenticated,
    setIsAuthModalOpen,
  } = useInvestigation();

  const tendencies = [
    { label: 'Analítico', value: state.decisionProfile.analitico, color: 'bg-amber-400', text: 'text-amber-300' },
    { label: 'Estratégico', value: state.decisionProfile.estrategico, color: 'bg-cyan-400', text: 'text-cyan-300' },
    { label: 'Humanista', value: state.decisionProfile.humanista, color: 'bg-emerald-400', text: 'text-emerald-300' },
    { label: 'Exploratório', value: state.decisionProfile.exploratorio, color: 'bg-purple-400', text: 'text-purple-300' },
  ];

  const developedSkills = [
    { label: 'Leitura de evidências', value: state.skills.leituraEvidencias, desc: 'Exame de documentos primários e extração de pistas' },
    { label: 'Reconhecimento de padrões', value: state.skills.reconhecimentoPadroes, desc: 'Validação de vínculos e identificação de contradições' },
    { label: 'Raciocínio estratégico', value: state.skills.raciocinioEstrategico, desc: 'Sustentação de hipóteses com provas documentais' },
    { label: 'Tomada de decisão', value: state.skills.tomadaDecisao, desc: 'Resolução de dilemas sob restrição de tempo e recursos' },
  ];

  const evolutionLayers = [
    {
      layer: 'CAMADA 1 — AGORA',
      title: 'Investigar o Passado',
      status: 'Ativa',
      active: true,
      items: [
        'Investigar acontecimentos históricos e documentos.',
        'Descobrir relações, contradições e padrões.',
        'Desenvolver a identidade e as tendências do investigador.',
      ],
    },
    {
      layer: 'CAMADA 2 — VOLUME II',
      title: 'Alterar o Passado',
      status: 'Em Preparação',
      active: false,
      items: [
        'Alterar decisões históricas em cenários controlados.',
        'Simular linhas temporais alternativas.',
        'Comparar consequências e explorar o efeito borboleta.',
      ],
    },
    {
      layer: 'CAMADA 3 — VOLUME III',
      title: 'Investigar o Presente',
      status: 'Expansão Futura',
      active: false,
      items: [
        'Conectar situações contemporâneas a padrões históricos.',
        'Fontes verificáveis e formação de equipes por competência.',
        'Simular hipóteses analíticas com fronteira ética clara.',
      ],
    },
  ];

  return (
    <div className="space-y-6 mt-2">
      
      {/* 1. IDENTIDADE DO INVESTIGADOR & PONTUAÇÃO POR QUALIDADE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Cartão de Identidade (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/30 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                IDENTIDADE DO INVESTIGADOR
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold">
                Nível {state.investigator.level} • {state.totalXp} XP
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-700 flex items-center justify-center text-[#060A12] font-serif font-bold text-2xl shadow-[0_0_25px_rgba(245,158,11,0.35)] shrink-0">
                {state.investigator.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="font-sans text-xl sm:text-2xl font-bold text-white truncate">
                  {state.investigator.name}
                </h2>
                <div className="text-xs font-mono text-cyan-400">
                  {state.investigator.role}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  O perfil emerge organicamente da maneira como você examina pistas, sustenta hipóteses e decide nos casos.
                </p>
              </div>
            </div>

            {/* 4 Tendências de Investigação */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="uppercase tracking-wider font-bold text-amber-300">
                  Tendências de Investigação:
                </span>
                <span className="text-[10px] text-slate-400">Mutáveis conforme suas escolhas</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {tendencies.map(t => (
                  <div key={t.label} className="p-3 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">{t.label}</span>
                      <span className={`font-bold ${t.text}`}>{t.value}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              {isAuthenticated ? 'Progresso sincronizado na conta' : 'Modo local — vincule seu e-mail'}
            </span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isAuthenticated ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <KeyRound className="w-3.5 h-3.5" />}
              <span>{isAuthenticated ? 'Conta Vinculada' : 'Sincronizar Conta'}</span>
            </button>
          </div>
        </div>

        {/* Habilidades Desenvolvidas & Critérios de Mérito (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-cyan-500/25 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                Habilidades Desenvolvidas em Campo
              </span>
              <span className="text-xs font-mono text-slate-400">
                {stats.totalCluesExtracted} pistas extraídas • {stats.completedCount}/{stats.totalVol1} missões
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {developedSkills.map(sk => (
                <div key={sk.label} className="p-3.5 rounded-xl bg-[#060A12]/85 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{sk.label}</span>
                    <span className="text-cyan-400 font-bold">{sk.value}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${sk.value}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{sk.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Como Funciona a Pontuação (Recompensa pela Qualidade da Investigação) */}
          <div className="p-4 rounded-xl bg-[#060A12]/90 border border-amber-500/20 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sistema de Mérito: Recompensa pela Qualidade da Investigação</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Você não é premiado por adivinhar uma resposta única. O sistema recompensa: <strong>encontrar evidências relevantes (+XP)</strong>, <strong>identificar inconsistências documentais (+XP adicional)</strong>, <strong>estabelecer conexões fundamentadas (+XP adicional)</strong> e <strong>sustentar hipóteses com provas coerentes (+XP adicional)</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* 2. MATRIZ TRIÁDICA E MÉTRICAS DE INTERPRETAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/25 shadow-xl space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              Geometria de Decisão
            </span>
            <span className="text-xs font-mono text-slate-400">Equilíbrio Triádico</span>
          </div>
          <DecisionTriangleSvg
            analitico={state.decisionProfile.analitico}
            estrategico={state.decisionProfile.estrategico}
            humanista={state.decisionProfile.humanista}
          />
        </div>

        <div className="md:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-cyan-500/25 shadow-xl space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                Métricas de Interpretação
              </span>
              <span className="text-xs font-mono text-slate-400">Variáveis Acumuladas</span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              O balanço das suas decisões de campo alimentarão as simulações futuras do Volume II.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-4">
            <SemiCircleGauge label="Caos Global" value={state.globalImpact.caosGlobal} color="orange" />
            <SemiCircleGauge label="Livre-Arbítrio" value={state.globalImpact.livreArbitrio} color="cyan" />
            <SemiCircleGauge label="Suspeita" value={state.globalImpact.suspeita} color="purple" />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs font-mono text-slate-400 text-center">
            Suas escolhas moldam sua trajetória individual sem alterar o cânone central do romance.
          </div>
        </div>
      </div>

      {/* 3. AS TRÊS GRANDES EVOLUÇÕES DA PLATAFORMA (VOLUMES I, II E III) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              Uma Plataforma • Três Grandes Evoluções
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400">Arquitetura Evolutiva</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evolutionLayers.map((ev, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border space-y-2.5 ${
                ev.active
                  ? 'bg-amber-500/10 border-amber-400/50'
                  : 'bg-[#060A12]/70 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={ev.active ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                  {ev.layer}
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    ev.active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ev.status}
                </span>
              </div>
              <div className="font-sans text-base font-bold text-white">{ev.title}</div>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {ev.items.map((it, idx) => (
                  <li key={idx}>• {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CADERNO DE CAMPO // HIPÓTESES E CASOS INVESTIGADOS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            Caderno de Campo // Hipóteses e Provas Registradas
          </span>
          <span className="text-xs font-mono text-emerald-400">
            {stats.hypothesesCount} gravadas
          </span>
        </div>

        {allNodes.filter(n => state.completedNodes.includes(n.id) || state.formulatedHypotheses[n.id]).length > 0 ? (
          <div className="space-y-3">
            {allNodes
              .filter(n => state.completedNodes.includes(n.id) || state.formulatedHypotheses[n.id])
              .map(node => {
                const prog = getCasePlayProgress(node.id);
                const thesis = node.hypothesisTheses?.find(t => t.id === prog.selectedThesisId);
                const note = prog.hypothesisReasoning || state.personalNotes[node.id];

                return (
                  <div
                    key={node.id}
                    className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-sm text-white">
                          {node.fullName}
                        </span>
                        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {node.year} • +{prog.xpEarned} XP
                        </span>
                      </div>
                      {thesis && (
                        <div className="text-xs sm:text-sm font-sans text-cyan-300">
                          Hipótese Sustentada: <strong>{thesis.title}</strong> ({prog.attachedClueIds.length} provas anexadas)
                        </div>
                      )}
                      {note && (
                        <p className="text-sm font-sans text-slate-200 leading-relaxed italic pt-1">
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
            <div className="text-xs font-mono text-slate-300">Nenhuma investigação concluída ainda.</div>
            <p className="text-sm text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
              Inicie pela Missão 01 (Júlio César e o Rubicão) para examinar documentos, cruzar evidências e registrar sua primeira hipótese.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
