import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { SemiCircleGauge } from './SemiCircleGauge';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Award,
  FileText,
  Sparkles,
  ShieldCheck,
  Compass,
  HelpCircle,
  X,
  ExternalLink,
  Layers,
  Lock,
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

  const [xpHelpOpen, setXpHelpOpen] = useState(false);

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

  // Cálculo de progresso até o próximo nível
  const nextLevelXp = (state.investigator.level || 1) * 300;
  const currentLevelProgress = Math.min(100, Math.round(((state.totalXp % 300) / 300) * 100));

  return (
    <div className="space-y-8 select-none font-sans max-w-7xl mx-auto pb-16">
      
      {/* =====================================================================
          1. CABEÇALHO DO ARQUIVO DO INVESTIGADOR
         ===================================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/35 bg-[#070B14] shadow-2xl p-6 sm:p-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/dossiers/investigator_archive_3d_clean.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                REGISTRO OPERACIONAL // STRATA PROTOCOL
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white">
              ARQUIVO DO INVESTIGADOR
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Credencial e compêndio de habilidades analíticas, decisões simuladas e conexões históricas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setXpHelpOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B1320] hover:bg-[#131D31] border border-amber-500/40 text-amber-300 text-sm font-mono flex items-center gap-2 cursor-pointer shadow-md"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Sistema de Mérito [ ? ]</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL / TOOLTIP DISCRETO DO SISTEMA DE MÉRITO (SUBSTITUI O MANUAL LONGO) */}
      {xpHelpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0B1320] border border-amber-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-sans text-base font-bold text-white">
                  Sistema de Mérito Investigativo (XP)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setXpHelpOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
              <p>
                O mérito é concedido pela precisão da sua auditoria documental em cada etapa:
              </p>
              <ul className="space-y-2 font-mono text-xs text-slate-300">
                <li className="p-2.5 rounded-lg bg-[#060A12] border border-slate-800 flex justify-between">
                  <span>Extração de Pista Primária:</span>
                  <strong className="text-emerald-400">+15 a +30 XP</strong>
                </li>
                <li className="p-2.5 rounded-lg bg-[#060A12] border border-slate-800 flex justify-between">
                  <span>Confronto de Vínculo na Mesa:</span>
                  <strong className="text-cyan-400">+50 XP</strong>
                </li>
                <li className="p-2.5 rounded-lg bg-[#060A12] border border-slate-800 flex justify-between">
                  <span>Sustentação de Tese Pericial:</span>
                  <strong className="text-amber-400">+25 a +100 XP</strong>
                </li>
                <li className="p-2.5 rounded-lg bg-[#060A12] border border-slate-800 flex justify-between">
                  <span>Tomada de Decisão de Campo:</span>
                  <strong className="text-purple-400">+50 XP</strong>
                </li>
              </ul>
              <p className="text-xs text-slate-400">
                Repetições de missões já concluídas não duplicam bonificações indevidamente.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setXpHelpOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. DUAS COLUNAS PRINCIPAIS NO DESKTOP (DOSSIÊ & HABILIDADES)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUNA 1 (5 cols): DOSSIÊ DO INVESTIGADOR & 4 TENDÊNCIAS */}
        <div className="lg:col-span-5 rounded-3xl bg-[#09101C]/95 border border-slate-800 p-6 sm:p-7 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            {/* Avatar & Identificação */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#070B14] flex items-center justify-center text-amber-300 font-serif text-2xl font-bold">
                  {state.investigator.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  {state.investigator.role || 'Auditor Desperto'}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {state.investigator.name}
                </h2>
                <div className="text-sm font-mono text-cyan-300">
                  Nível {state.investigator.level} // {state.totalXp} XP Acumulado
                </div>
              </div>
            </div>

            {/* Barra de Progresso de Nível */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#050811] border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Progresso para Nível {state.investigator.level + 1}</span>
                <span className="text-amber-400 font-bold">{currentLevelProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>

            {/* 4 Tendências de Investigação (100% Preservadas!) */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Tendências de Investigação (Derivadas de Suas Escolhas):
              </div>
              <div className="grid grid-cols-2 gap-3">
                {tendencies.map(t => (
                  <div
                    key={t.label}
                    className="p-3.5 rounded-xl bg-[#050811] border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">{t.label}</span>
                      <span className={`font-bold ${t.text}`}>{t.value}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${t.color} rounded-full transition-all duration-500`}
                        style={{ width: `${t.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Status da Sessão: Ativo</span>
            <span className="text-emerald-400 font-bold">● Sincronizado</span>
          </div>
        </div>

        {/* COLUNA 2 (7 cols): 4 HABILIDADES E MÉTRICAS */}
        <div className="lg:col-span-7 rounded-3xl bg-[#09101C]/95 border border-slate-800 p-6 sm:p-7 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Competências Desenvolvidas na Operação:
              </span>
              <span className="text-xs font-mono text-slate-400">Escala de Aptidão</span>
            </div>

            <div className="space-y-4">
              {developedSkills.map(skill => (
                <div
                  key={skill.label}
                  className="p-4 rounded-2xl bg-[#050811] border border-slate-800/90 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-sm sm:text-base font-medium text-white">
                    <span>{skill.label}</span>
                    <span className="text-amber-400 font-mono font-bold">{skill.value}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arcos de Impacto Simulado */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase">
                Métricas de Impacto Simulado da Investigação:
              </span>
              <span className="text-slate-400">Variáveis de Jogo</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#050811] border border-slate-800 text-center space-y-1">
                <div className="text-xs font-mono text-slate-400">Caos Global</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                  {state.globalImpact.caosGlobal}%
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#050811] border border-slate-800 text-center space-y-1">
                <div className="text-xs font-mono text-slate-400">Livre-Arbítrio</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400">
                  {state.globalImpact.livreArbitrio}%
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#050811] border border-slate-800 text-center space-y-1">
                <div className="text-xs font-mono text-slate-400">Suspeita</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-purple-400">
                  {state.globalImpact.suspeita}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. CAMADAS DO ECOSSISTEMA (3 CARTÕES HORIZONTAIS ENXUTOS)
         ===================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
            Camadas do Ecossistema Operacional:
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#09101C]/90 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                VOLUME I // CAMADA 1
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold">
                ATIVO
              </span>
            </div>
            <h4 className="text-base font-bold text-white">Investigar o Passado</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Exame de documentos primários, validação de vínculos e sustentação de teses históricas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#09101C]/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                VOLUME II // CAMADA 2
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs">
                SIMULAÇÃO
              </span>
            </div>
            <h4 className="text-base font-bold text-white">Alterar o Passado</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Simulação de linhas temporais alternativas, dilemas de campo e ramificações de causa e efeito.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#09101C]/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-purple-400 font-bold">
                VOLUME III // CAMADA 3
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-xs">
                EM PREPARAÇÃO
              </span>
            </div>
            <h4 className="text-base font-bold text-white">Investigar o Presente</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Conexão entre dinâmicas contemporâneas verificáveis e padrões descobertos no romance.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. CADERNO DE CAMPO (CARTÕES COMPACTOS POR CASO)
         ===================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Caderno de Campo // Registros por Dossiê:
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {allNodes.length} Casos Catalogados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allNodes.map(node => {
            const prog = getCasePlayProgress(node.id);
            const isCompleted = state.completedNodes.includes(node.id);
            const registeredThesis = node.hypothesisTheses?.find(t => t.id === prog.selectedThesisId);

            return (
              <div
                key={node.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isCompleted
                    ? 'bg-[#0A1A16]/90 border-emerald-500/40'
                    : prog.extractedClueIds.length > 0
                    ? 'bg-[#09121F]/90 border-amber-500/35'
                    : 'bg-[#070B14]/85 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold uppercase">
                    {node.missionCode || 'CASO'}
                  </span>
                  {isCompleted ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                    </span>
                  ) : prog.extractedClueIds.length > 0 ? (
                    <span className="text-amber-300">Em Investigação</span>
                  ) : (
                    <span className="text-slate-500">Disponível</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white leading-snug">
                    {node.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    {node.location} ({node.year})
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#040810] border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Pistas Coletadas:</span>
                    <strong className="text-emerald-400">
                      {prog.extractedClueIds.length}/{(node.documents || []).flatMap(d => d.clues).length}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Hipótese Registrada:</span>
                    <strong className="text-amber-300 truncate max-w-[130px]">
                      {registeredThesis ? registeredThesis.tag : 'Nenhuma'}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => startCaseInvestigation(node.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>{isCompleted ? 'Revisar Dossiê' : 'Abrir Investigação'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
