import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { GameButton } from './GameInteractionSystem';
import { SemiCircleGauge } from './SemiCircleGauge';
import { RestrictedFileModal } from './RestrictedFileModal';
import { HistoricalNode } from '../../types/investigation';
import {
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  Award,
  HelpCircle,
  X,
  Compass,
  FolderOpen,
  BookOpen,
  Layers,
  Sparkles,
  FileCheck2,
  IdCard,
  Sliders,
} from 'lucide-react';
import { soundEngine } from '../../utils/investigationAudio';

type ProfileArchiveSubTab = 'credencial' | 'competencias' | 'arquivo';

export const InvestigatorProfileView: React.FC = () => {
  const {
    state,
    allNodes,
    stats,
    startCaseInvestigation,
    getCasePlayProgress,
  } = useInvestigation();

  const [xpHelpOpen, setXpHelpOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<ProfileArchiveSubTab>('credencial');
  const [restrictedNode, setRestrictedNode] = useState<HistoricalNode | null>(null);

  const playableNodesCount = allNodes.filter(n => n.status !== 'quarentena' && n.isVolumeOne).length || 4;

  const xpNextLevel = Math.max(300, (state.investigator?.level || 1) * 300);
  const xpPercent = Math.min(100, Math.round(((state.totalXp % 300) / 300) * 100));

  const tendencies = [
    {
      key: 'analitico',
      label: 'Analítico',
      value: state.decisionProfile?.analitico ?? 25,
      color: 'from-cyan-500 to-cyan-300',
      description: 'Foco em dados materiais, balística, cronologia e cruzamento documental.',
    },
    {
      key: 'estrategico',
      label: 'Estratégico',
      value: state.decisionProfile?.estrategico ?? 25,
      color: 'from-amber-500 to-amber-300',
      description: 'Leitura de comando, logística, risco calculado e janelas de oportunidade.',
    },
    {
      key: 'humanista',
      label: 'Humanista',
      value: state.decisionProfile?.humanista ?? 25,
      color: 'from-emerald-500 to-emerald-300',
      description: 'Atenção ao fator humano, coesão social, ética e preservação de vidas.',
    },
    {
      key: 'exploratorio',
      label: 'Exploratório',
      value: state.decisionProfile?.exploratorio ?? 25,
      color: 'from-purple-500 to-purple-300',
      description: 'Descoberta de conexões transversais entre eras e padrões ocultos.',
    },
  ];

  const sortedTendencies = [...tendencies].sort((a, b) => b.value - a.value);
  const dominantTendency = sortedTendencies[0] || tendencies[0];
  const secondaryTendency = sortedTendencies[1] || tendencies[1];

  const totalSavedClues =
    stats?.totalCluesExtracted ??
    allNodes.reduce((acc, n) => acc + (getCasePlayProgress(n.id)?.extractedClueIds?.length || 0), 0);

  const totalSolvedLinks =
    stats?.totalConnectionsSolved ??
    allNodes.reduce((acc, n) => acc + (getCasePlayProgress(n.id)?.solvedConnectionIds?.length || 0), 0);

  const skills = [
    {
      label: 'Leitura de evidências',
      desc: 'Inspeção de fontes primárias, despachos e documentos históricos.',
      score: state.skills?.leituraEvidencias ?? Math.min(100, 45 + totalSavedClues * 4),
      accent: 'text-amber-300 border-amber-500/35 bg-amber-500/10',
    },
    {
      label: 'Reconhecimento de padrões',
      desc: 'Cruzamento de pistas na Mesa de Conexões e validação de vínculos.',
      score: state.skills?.reconhecimentoPadroes ?? Math.min(100, 40 + totalSolvedLinks * 7),
      accent: 'text-cyan-300 border-cyan-500/35 bg-cyan-500/10',
    },
    {
      label: 'Raciocínio estratégico',
      desc: 'Formulação de hipóteses consistentes diante de dilemas de comando.',
      score: state.skills?.raciocinioEstrategico ?? 50,
      accent: 'text-emerald-300 border-emerald-500/35 bg-emerald-500/10',
    },
    {
      label: 'Tomada de decisão',
      desc: 'Escolhas sob pressão nas simulações históricas de campo.',
      score: state.skills?.tomadaDecisao ?? 45,
      accent: 'text-purple-300 border-purple-500/35 bg-purple-500/10',
    },
  ];

  const investigatorName = state.investigator?.name || 'Investigador';
  const investigatorRole = state.investigator?.role || 'Auditor Credenciado';
  const investigatorLevel = state.investigator?.level || 1;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/35 bg-[#050811] shadow-[0_25px_70px_rgba(0,0,0,0.95)] select-none font-sans max-w-7xl mx-auto mb-12">
      {/* CENÁRIO 3D DE FUNDO CONTÍNUO: MESA E ARQUIVO PESSOAL DO INVESTIGADOR */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/dossiers/investigator_archive_3d_clean.webp"
          alt="Mesa do Arquivo Pessoal do Investigador"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 75% 22%, rgba(245, 158, 11, 0.14) 0%, rgba(6, 182, 212, 0.06) 40%, rgba(5, 8, 17, 0.92) 85%)',
          }}
        />
      </div>

      <div className="relative z-10 p-3.5 sm:p-7 space-y-5">
        {/* =====================================================================
            1. CABEÇALHO COMPACTO + BARRA ÚNICA DE SEPARADORES COM [ ? MÉRITO ]
           ===================================================================== */}
        <div className="space-y-3.5 pb-4 border-b border-amber-500/25">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-[#060A12] border border-amber-400/60 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(212,175,55,0.28)]">
                <img
                  src="/reader/icons/icon-192.png"
                  alt="O Último Segredo"
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs sm:text-xs font-mono uppercase tracking-widest text-amber-400 font-bold truncate">
                  <span>REGISTRO OPERACIONAL // STRATA PROTOCOL</span>
                  <span className="text-emerald-400 hidden xs:inline">● Sincronizado</span>
                </div>
                <h1 className="font-sans text-lg sm:text-2xl font-bold tracking-wide text-white truncate">
                  ARQUIVO DO INVESTIGADOR
                </h1>
              </div>
            </div>
          </div>

          {/* Linha Única de Separadores + Botão [ ? Mérito ] Alinhado à Direita */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setActiveSubTab('credencial');
                }}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-mono text-xs sm:text-xs flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all border ${
                  activeSubTab === 'credencial'
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-[#090F1B]/85 border-slate-700/80 text-slate-300 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span>1. Credencial & Tendências</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setActiveSubTab('competencias');
                }}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-mono text-xs sm:text-xs flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all border ${
                  activeSubTab === 'competencias'
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-[#090F1B]/85 border-slate-700/80 text-slate-300 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                <span>2. Competências & Simulação</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setActiveSubTab('arquivo');
                }}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-mono text-xs sm:text-xs flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all border ${
                  activeSubTab === 'arquivo'
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-[#090F1B]/85 border-slate-700/80 text-slate-300 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>
                  3. Pastas de Casos ({state.completedNodes.length}/{playableNodesCount})
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setXpHelpOpen(true)}
              className="ml-auto px-3 py-1.5 sm:py-2 rounded-xl bg-[#090F1B]/85 hover:bg-[#131D31] border border-amber-500/40 text-amber-300 text-xs sm:text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              title="Como funciona a progressão e XP"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>[ ? Mérito ]</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            ABA 1: CREDENCIAL FÍSICA STRATA & TENDÊNCIAS INVESTIGATIVAS
           ===================================================================== */}
        {activeSubTab === 'credencial' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Crachá / Credencial Física sobre a Mesa */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0A111F]/70 backdrop-blur-md border border-amber-400/40 shadow-2xl flex flex-col justify-between space-y-5 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-300 to-amber-700 p-[2px] shadow-lg flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-2xl bg-[#060A12] flex items-center justify-center text-amber-300 font-sans text-xl sm:text-2xl font-bold">
                        {investigatorName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                        {investigatorRole}
                      </div>
                      <h2 className="text-lg sm:text-2xl font-bold text-white mt-1">
                        {investigatorName}
                      </h2>
                      <div className="text-xs sm:text-sm font-mono text-cyan-300">
                        Nível {investigatorLevel} // {state.totalXp} XP Acumulado
                      </div>
                    </div>
                  </div>

                  {/* Carimbo Diegético de Credencial */}
                  <div className="hidden sm:block px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-right font-mono shrink-0">
                    <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                      CREDENCIAL STRATA
                    </div>
                    <div className="text-xs text-slate-200 font-semibold">
                      NÍVEL DE ACESSO {investigatorLevel}
                    </div>
                  </div>
                </div>

                {/* Barra de Progressão de XP */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Progresso de Nível Operacional</span>
                    <span className="text-amber-300 font-bold">
                      {state.totalXp} / {xpNextLevel} XP ({xpPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden border border-slate-700/80">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_12px_#f59e0b]"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>

                {/* Indicadores Rápidos do Caderno */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#070B14]/80 border border-slate-800 text-center">
                    <div className="text-xs font-mono uppercase text-slate-400">Missões</div>
                    <div className="text-sm sm:text-base font-bold text-amber-300 mt-0.5">
                      {state.completedNodes.length}/{playableNodesCount}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#070B14]/80 border border-slate-800 text-center">
                    <div className="text-xs font-mono uppercase text-slate-400">Pistas</div>
                    <div className="text-sm sm:text-base font-bold text-cyan-300 mt-0.5">
                      {totalSavedClues}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#070B14]/80 border border-slate-800 text-center">
                    <div className="text-xs font-mono uppercase text-slate-400">Vínculos</div>
                    <div className="text-sm sm:text-base font-bold text-emerald-300 mt-0.5">
                      {totalSolvedLinks}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Tendências de Investigação */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#0A111F]/65 backdrop-blur-md border border-slate-700/80 shadow-2xl flex flex-col justify-between space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                      PERFIL COGNITIVO DE CAMPO //
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      4 Tendências de Investigação
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-xs font-mono text-amber-300 font-bold">
                    Dominante: {dominantTendency.label} ({dominantTendency.value}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {tendencies.map(t => (
                    <div
                      key={t.key}
                      className="p-3.5 rounded-xl bg-[#070B14]/75 border border-slate-800/90 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-100 uppercase">{t.label}</span>
                        <span className="text-amber-300 font-bold">{t.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full bg-gradient-to-r ${t.color} rounded-full transition-all duration-700`}
                          style={{ width: `${t.value}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Síntese Executiva & Integração com o Livro */}
            <div className="p-5 rounded-2xl bg-[#0A111F]/60 backdrop-blur-md border border-amber-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>SÍNTESE DO DOSSIÊ PESSOAL //</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Seu estilo combina leitura{' '}
                  <strong className="text-amber-300">{dominantTendency.label}</strong> com viés{' '}
                  <strong className="text-cyan-300">{secondaryTendency.label}</strong>. Cada caso
                  auditado na Central de Investigação expande sua compreensão das rupturas
                  históricas narradas em <em>O Último Segredo da Humanidade</em>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Camada 1: Investigação Ativa
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Camada 2: Simulação Tática
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            ABA 2: 4 COMPETÊNCIAS DESENVOLVIDAS & VARIÁVEIS DE SIMULAÇÃO
           ===================================================================== */}
        {activeSubTab === 'competencias' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0A111F]/70 backdrop-blur-md border border-amber-400/35 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                    APTIDÕES TÉCNICAS AUDITADAS //
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-white">
                    Competências Desenvolvidas em Campo
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-300">
                  Calculado a partir das 5 etapas de cada caso
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map(s => (
                  <div
                    key={s.label}
                    className="p-4 rounded-xl bg-[#070B14]/80 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-sm sm:text-base font-bold text-white">
                        {s.label}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md border text-xs font-mono font-bold ${s.accent}`}
                      >
                        {Math.round(s.score)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.round(s.score)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impacto Simulado (Subordinado e Contextualizado) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0A111F]/60 backdrop-blur-md border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    TELEMETRIA SECUNDÁRIA DE CAMPO //
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    Variáveis de Impacto Simulado (Etapa 4 — Decidir)
                  </h3>
                </div>
                <span className="text-xs font-sans text-slate-400">
                  Reflexo acumulado das decisões estratégicas tomadas nos casos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SemiCircleGauge
                  label="Caos Global"
                  value={state.metrics?.caosGlobal ?? 48}
                  color="orange"
                  subtitle="Tensão geopolítica acumulada nas simulações"
                />
                <SemiCircleGauge
                  label="Livre-Arbítrio"
                  value={state.metrics?.livreArbitrio ?? 52}
                  color="cyan"
                  subtitle="Grau de autonomia humana preservado"
                />
                <SemiCircleGauge
                  label="Suspeita"
                  value={state.metrics?.suspeita ?? 18}
                  color="purple"
                  subtitle="Exposição operacional perante o protocolo"
                />
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            ABA 3: PASTAS FÍSICAS DE ARQUIVO DOS 7 CASOS HISTÓRICOS
           ===================================================================== */}
        {activeSubTab === 'arquivo' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  GAVETA DE DOSSIÊS // REGISTRO DE AUDITORIA
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white">
                  Pastas de Casos Investigados ({state.completedNodes.length} de {playableNodesCount} Missões Concluídas)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-300">
                Clique em uma pasta para abrir ou revisar a operação
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allNodes.map((node, index) => {
                const isQuarantine = node.status === 'quarentena' || !node.isVolumeOne;
                const isCompleted = state.completedNodes.includes(node.id);
                const prog = getCasePlayProgress(node.id);
                const extractedCount = prog?.extractedClueIds?.length || 0;
                const solvedCount = prog?.solvedConnectionIds?.length || 0;
                const totalCaseClues = (node.documents || []).reduce(
                  (acc, d) => acc + d.clues.length,
                  0
                );
                const chosenThesis = (node.hypothesisTheses || []).find(
                  t => t.id === prog?.selectedThesisId
                );
                const chosenDecision = (node.simulationChoices || []).find(
                  c => c.id === prog?.selectedDecisionId
                );
                const isInProgress =
                  !isQuarantine &&
                  !isCompleted &&
                  (extractedCount > 0 || solvedCount > 0 || Boolean(prog?.selectedThesisId));

                return (
                  <div
                    key={node.id}
                    className="group relative pt-3 flex flex-col justify-between"
                  >
                    {/* Aba Física Superior da Pasta de Arquivo */}
                    <div className="flex items-center justify-between px-1">
                      <div
                        className={`px-3.5 py-1 rounded-t-xl border-t border-x text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                          isQuarantine
                            ? 'bg-slate-900/90 border-slate-700/80 text-slate-400'
                            : isCompleted
                            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                            : isInProgress
                            ? 'bg-amber-950/90 border-amber-400/60 text-amber-200'
                            : 'bg-[#0C1424]/95 border-slate-700 text-slate-300'
                        }`}
                      >
                        <FolderOpen className="w-3 h-3" />
                        <span>{node.missionCode || `CASO 00${index + 1}`}</span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-mono uppercase font-bold flex items-center gap-1 ${
                          isQuarantine
                            ? 'bg-slate-900/90 border border-amber-500/35 text-amber-200/80'
                            : isCompleted
                            ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                            : isInProgress
                            ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300'
                            : 'bg-slate-800/80 border border-slate-700 text-slate-300'
                        }`}
                      >
                        {isQuarantine ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-400" /> Em Preparação (Vol. II)
                          </>
                        ) : isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Concluído
                          </>
                        ) : isInProgress ? (
                          <>
                            <Clock className="w-3 h-3" /> Em Curso
                          </>
                        ) : (
                          <>
                            <Compass className="w-3 h-3" /> Disponível
                          </>
                        )}
                      </span>
                    </div>

                    {/* Corpo da Pasta Física */}
                    <div
                      className={`p-4 sm:p-5 rounded-b-2xl rounded-tr-2xl backdrop-blur-md border transition-all flex-1 flex flex-col justify-between space-y-3.5 shadow-xl ${
                        isQuarantine
                          ? 'bg-[#080D18]/65 border-slate-800/90'
                          : isCompleted
                          ? 'bg-[#0A1320]/75 border-emerald-500/40 hover:border-emerald-400/70'
                          : isInProgress
                          ? 'bg-[#0B1322]/75 border-amber-400/50 hover:border-amber-300'
                          : 'bg-[#09101D]/70 border-slate-700/80 hover:border-amber-400/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-mono text-amber-300/90">
                              {node.name} • {node.location} ({node.year})
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                              {node.missionTitle || node.title}
                            </h3>
                          </div>
                        </div>

                        {isQuarantine ? (
                          <div className="p-3 rounded-lg bg-[#060A12]/80 border border-slate-800/90 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-mono text-amber-300 font-semibold block">
                                Arquivo Classificado // Expansão Volume II
                              </span>
                              <span>
                                Dossiê catalogado no protocolo histórico. A simulação interativa completa será liberada no lançamento do Volume II.
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Resumo de Progresso Interno da Pasta */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div className="p-2 rounded-lg bg-[#060A12]/75 border border-slate-800/90 text-xs font-mono">
                                <span className="text-slate-400 block text-xs">PISTAS EXTRAÍDAS</span>
                                <span className="text-cyan-300 font-bold">
                                  {extractedCount}/{totalCaseClues || 6} catalogadas
                                </span>
                              </div>
                              <div className="p-2 rounded-lg bg-[#060A12]/75 border border-slate-800/90 text-xs font-mono">
                                <span className="text-slate-400 block text-xs">HIPÓTESE / LAUDO</span>
                                <span className="text-amber-300 font-bold truncate block">
                                  {chosenThesis ? chosenThesis.tag : isCompleted ? 'Validada' : 'Pendente'}
                                </span>
                              </div>
                            </div>

                            {(chosenThesis || chosenDecision) && (
                              <div className="p-2.5 rounded-lg bg-[#060A12]/80 border border-white/5 text-xs text-slate-200 space-y-1">
                                {chosenThesis && (
                                  <div className="truncate">
                                    <strong className="text-amber-300 font-mono">Hipótese:</strong>{' '}
                                    {chosenThesis.title}
                                  </div>
                                )}
                                {chosenDecision && (
                                  <div className="truncate">
                                    <strong className="text-cyan-300 font-mono">Decisão:</strong>{' '}
                                    {chosenDecision.title}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                        {isQuarantine ? (
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playDocumentOpen();
                              setRestrictedNode(node);
                            }}
                            className="w-full py-2 px-3.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all bg-slate-900/90 hover:bg-slate-800 border border-amber-500/35 text-amber-200/90"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Em Preparação (Vol. II) — Ver Condições</span>
                          </button>
                        ) : (
                          <GameButton
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              soundEngine.playDocumentOpen();
                              startCaseInvestigation(node.id);
                            }}
                          >
                            {isCompleted
                              ? 'REVISAR DOSSIÊ AUDITADO'
                              : isInProgress
                              ? 'CONTINUAR INVESTIGAÇÃO'
                              : 'INVESTIGAR CASO'}
                          </GameButton>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Explicativo de XP & Mérito */}
      {xpHelpOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setXpHelpOpen(false)}
        >
          <div
            className="max-w-md w-full p-5 rounded-2xl bg-[#080D18] border border-amber-400/50 text-slate-200 space-y-3 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase font-bold">
                <Award className="w-4 h-4" />
                <span>Protocolo de Mérito & Progressão</span>
              </div>
              <button
                type="button"
                onClick={() => setXpHelpOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Cada operação histórica concluída concede pontos de experiência (XP) de acordo com as
              pistas extraídas na Etapa 1 (+15 a +30 XP), os vínculos comprovados na Etapa 2 (+50 XP),
              a consistência da hipótese na Etapa 3 (+25 a +100 XP) e a decisão estratégica na Etapa 4 (+50 XP).
            </p>
          </div>
        </div>
      )}

      {/* Modal de Arquivo Reservado (Volume II) */}
      <RestrictedFileModal
        node={restrictedNode}
        onClose={() => setRestrictedNode(null)}
      />
    </div>
  );
};
