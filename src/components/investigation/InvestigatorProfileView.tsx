import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { soundEngine } from '../../utils/investigationAudio';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Award,
  ShieldCheck,
  HelpCircle,
  X,
  FolderOpen,
  Sliders,
  IdCard,
  Layers,
  Sparkles,
  FileCheck2,
  Clock,
} from 'lucide-react';

type ProfileSectionTab = 'credencial' | 'competencias' | 'arquivo';

export const InvestigatorProfileView: React.FC = () => {
  const {
    state,
    allNodes,
    startCaseInvestigation,
    getCasePlayProgress,
  } = useInvestigation();

  const [activeSubTab, setActiveSubTab] = useState<ProfileSectionTab>('credencial');
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

  const currentLevelProgress = Math.min(100, Math.round(((state.totalXp % 300) / 300) * 100));

  const totalExtractedClues = allNodes.reduce((acc, n) => {
    const p = getCasePlayProgress(n.id);
    return acc + p.extractedClueIds.length;
  }, 0);

  const totalValidatedLinks = allNodes.reduce((acc, n) => {
    const p = getCasePlayProgress(n.id);
    return acc + p.solvedConnectionIds.length;
  }, 0);

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

      <div className="relative z-10 p-4 sm:p-7 space-y-6">
        {/* =====================================================================
            1. CABEÇALHO COMPACTO + NAVEGAÇÃO INTERNA EM 3 PASTAS DE ARQUIVO
           ===================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-amber-500/25">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                <span>REGISTRO OPERACIONAL // STRATA PROTOCOL</span>
                <span className="text-emerald-400">• Sincronizado</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white">
                ARQUIVO DO INVESTIGADOR
              </h1>
            </div>
          </div>

          {/* Seletor das 3 Áreas do Arquivo (Evita sobrecarga na mesma tela) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setActiveSubTab('credencial');
              }}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs flex items-center gap-2 cursor-pointer transition-all border ${
                activeSubTab === 'credencial'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-[#090F1B]/85 border-slate-700/80 text-slate-300 hover:border-amber-400/50 hover:text-white'
              }`}
            >
              <IdCard className="w-4 h-4 text-amber-400" />
              <span>1. Credencial & Tendências</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setActiveSubTab('competencias');
              }}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs flex items-center gap-2 cursor-pointer transition-all border ${
                activeSubTab === 'competencias'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-[#090F1B]/85 border-slate-700/80 text-slate-300 hover:border-amber-400/50 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>2. Competências & Simulação</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setActiveSubTab('arquivo');
              }}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs flex items-center gap-2 cursor-pointer transition-all border ${
                activeSubTab === 'arquivo'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-[#090F1B]/85 border-slate-700/80 text-slate-300 hover:border-amber-400/50 hover:text-white'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span>3. Pastas de Casos ({state.completedNodes.length}/{allNodes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setXpHelpOpen(true)}
              className="p-2 rounded-xl bg-[#090F1B]/85 hover:bg-[#131D31] border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Sistema de Mérito (XP)"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">[ ? ]</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            ÁREA 1: CREDENCIAL FÍSICA, NÍVEL, XP, TENDÊNCIAS & SÍNTESE
           ===================================================================== */}
        {activeSubTab === 'credencial' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-in fade-in duration-200">
            {/* Crachá / Credencial Física sobre a Mesa (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl bg-[#080E1A]/85 backdrop-blur-md border border-amber-500/35 p-5 sm:p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-2xl bg-[#060A12] flex items-center justify-center text-amber-300 font-serif text-2xl font-bold">
                        {state.investigator.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                        {state.investigator.role || 'Auditor Credenciado'}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {state.investigator.name}
                      </h2>
                      <div className="text-xs sm:text-sm font-mono text-cyan-300">
                        Nível {state.investigator.level} // {state.totalXp} XP Acumulado
                      </div>
                    </div>
                  </div>

                  {/* Carimbo Diegético de Credencial */}
                  <div className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-right font-mono">
                    <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                      CREDENCIAL STRATA
                    </div>
                    <div className="text-xs text-slate-200 font-semibold">
                      NÍVEL DE ACESSO {state.investigator.level}
                    </div>
                  </div>
                </div>

                {/* Barra de Progresso de Nível */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#050811]/90 border border-slate-800">
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

                {/* 4 Tendências de Investigação */}
                <div className="space-y-2.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Tendências de Investigação (Derivadas de Suas Escolhas):
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {tendencies.map(t => (
                      <div
                        key={t.label}
                        className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800/90 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-200">{t.label}</span>
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
            </div>

            {/* Síntese do Arquivo na Mesa + Atalhos Rápidos (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-[#080E1A]/85 backdrop-blur-md border border-slate-800 p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Síntese de Expediente na Mesa
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Resumo Geral</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800 text-center">
                    <div className="text-lg font-mono font-bold text-amber-300">
                      {state.completedNodes.length}/{allNodes.length}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 mt-0.5">
                      Dossiês
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800 text-center">
                    <div className="text-lg font-mono font-bold text-emerald-300">
                      {totalExtractedClues}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 mt-0.5">
                      Pistas Salvas
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800 text-center">
                    <div className="text-lg font-mono font-bold text-cyan-300">
                      {totalValidatedLinks}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 mt-0.5">
                      Vínculos
                    </div>
                  </div>
                </div>

                {/* Camadas do Ecossistema Compactas */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Camadas do Ecossistema Operacional:
                  </div>
                  <div className="p-3 rounded-xl bg-[#050811]/90 border border-emerald-500/35 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                        VOLUME I // CAMADA 1
                      </span>
                      <span className="text-xs font-bold text-white">Investigar o Passado</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      ATIVO
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050811]/90 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                        VOLUME II // CAMADA 2
                      </span>
                      <span className="text-xs font-bold text-white">Alterar o Passado (Simulação)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                      SIMULAÇÃO
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                        VOLUME III // CAMADA 3
                      </span>
                      <span className="text-xs font-bold text-white">Investigar o Presente</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                      EM PREPARAÇÃO
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('competencias')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 cursor-pointer"
                >
                  Ver Competências →
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('arquivo')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Abrir Pastas de Casos</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            ÁREA 2: COMPETÊNCIAS DESENVOLVIDAS & VARIÁVEIS DE SIMULAÇÃO DISCRETAS
           ===================================================================== */}
        {activeSubTab === 'competencias' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
            {/* 4 Habilidades Principais em Destaque (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl bg-[#080E1A]/85 backdrop-blur-md border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Competências Desenvolvidas na Operação:
                </span>
                <span className="text-xs font-mono text-slate-400">Escala de Aptidão</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {developedSkills.map(skill => (
                  <div
                    key={skill.label}
                    className="p-4 rounded-xl bg-[#050811]/90 border border-slate-800/90 space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm font-bold text-white">
                      <span>{skill.label}</span>
                      <span className="text-amber-400 font-mono">{skill.value}%</span>
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

            {/* Variáveis de Impacto Simulado (Subordinadas e Contextualizadas - 4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-[#080E1A]/85 backdrop-blur-md border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                    Impacto Simulado
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                    Variáveis de Jogo
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reflete as consequências acumuladas das ordens táticas assinadas na Etapa 4 (Simulação de Campo).
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Caos Global</div>
                    <div className="text-[10px] font-mono text-slate-400">Ruptura de estabilidade</div>
                  </div>
                  <div className="text-base font-bold font-mono text-amber-400">
                    {state.globalImpact.caosGlobal}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Livre-Arbítrio</div>
                    <div className="text-[10px] font-mono text-slate-400">Autonomia decisória</div>
                  </div>
                  <div className="text-base font-bold font-mono text-cyan-400">
                    {state.globalImpact.livreArbitrio}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Suspeita</div>
                    <div className="text-[10px] font-mono text-slate-400">Exposição da operação</div>
                  </div>
                  <div className="text-base font-bold font-mono text-purple-400">
                    {state.globalImpact.suspeita}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            ÁREA 3: ARQUIVO PESSOAL & CADERNO DE CAMPO (PASTAS DE ARQUIVO POR CASO)
           ===================================================================== */}
        {activeSubTab === 'arquivo' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                  Pastas Físicas do Arquivo Pessoal // Caderno de Campo
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {allNodes.length} Dossiês Históricos Catalogados
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {allNodes.map(node => {
                const prog = getCasePlayProgress(node.id);
                const isCompleted = state.completedNodes.includes(node.id);
                const registeredThesis = node.hypothesisTheses?.find(
                  t => t.id === prog.selectedThesisId
                );
                const registeredDecision = node.simulationChoices?.find(
                  c => c.id === prog.selectedDecisionId
                );
                const totalCaseClues = (node.documents || []).flatMap(d => d.clues).length;

                return (
                  <div key={node.id} className="relative pt-3 group">
                    {/* Aba Superior da Pasta de Arquivo Física (File Folder Tab) */}
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-t-xl border-t border-x text-[10px] font-mono uppercase tracking-wider font-bold ${
                        isCompleted
                          ? 'bg-[#0C221D] border-emerald-500/45 text-emerald-300'
                          : prog.extractedClueIds.length > 0
                          ? 'bg-[#141C2B] border-amber-500/45 text-amber-300'
                          : 'bg-[#0B101B] border-slate-700/80 text-slate-400'
                      }`}
                    >
                      <FolderOpen className="w-3 h-3" />
                      <span>{node.missionCode || 'DOSSIÊ'}</span>
                    </div>

                    {/* Corpo da Pasta de Arquivo */}
                    <div
                      className={`p-5 rounded-b-2xl rounded-tr-2xl border transition-all space-y-3.5 shadow-xl ${
                        isCompleted
                          ? 'bg-[#091815]/90 border-emerald-500/45 hover:border-emerald-400'
                          : prog.extractedClueIds.length > 0
                          ? 'bg-[#0B1322]/90 border-amber-500/40 hover:border-amber-400'
                          : 'bg-[#080D18]/85 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-white leading-snug">
                            {node.name}
                          </h4>
                          <p className="text-xs font-mono text-slate-400 mt-0.5">
                            {node.location} ({node.year})
                          </p>
                        </div>

                        {isCompleted ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> Concluído
                          </span>
                        ) : prog.extractedClueIds.length > 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" /> Em Curso
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[10px] font-mono shrink-0">
                            Disponível
                          </span>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-[#050811]/90 border border-slate-800/90 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Pistas Extraídas:</span>
                          <strong className="text-emerald-400 font-mono">
                            {prog.extractedClueIds.length}/{totalCaseClues}
                          </strong>
                        </div>
                        <div className="flex justify-between text-slate-300 gap-2">
                          <span className="shrink-0">Hipótese:</span>
                          <strong className="text-amber-300 truncate text-right">
                            {registeredThesis ? registeredThesis.title : 'Em aberto'}
                          </strong>
                        </div>
                        <div className="flex justify-between text-slate-300 gap-2">
                          <span className="shrink-0">Decisão:</span>
                          <strong className="text-cyan-300 truncate text-right">
                            {registeredDecision ? `Ordem ${registeredDecision.tag}` : 'Em aberto'}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startCaseInvestigation(node.id)}
                        className={`w-full py-2.5 px-3.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200'
                        }`}
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Revisar Pasta do Caso' : 'Abrir Pasta de Investigação'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DO SISTEMA DE MÉRITO (XP) */}
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
                className="text-slate-400 hover:text-white cursor-pointer"
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
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
