import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Lock,
  Unlock,
  Sparkles,
  BookOpen,
  X,
  ShieldCheck,
} from 'lucide-react';
import { soundEngine } from '../../utils/investigationAudio';

export const MissionsView: React.FC = () => {
  const { allNodes, state, startCaseInvestigation } = useInvestigation();
  const [bonusModalOpen, setBonusModalOpen] = useState(false);

  const volumeOneNodes = allNodes.filter(n => n.isVolumeOne && n.status !== 'quarentena');
  const completedVolOneCount = volumeOneNodes.filter(n => state.completedNodes.includes(n.id)).length;
  const totalVolOneCount = volumeOneNodes.length || 4;
  const isAllCompleted = completedVolOneCount >= totalVolOneCount;
  const progressPct = Math.min(100, Math.round((completedVolOneCount / totalVolOneCount) * 100));

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto pb-12">
      <div className="border-b border-amber-500/20 pb-4">
        <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-wide text-white uppercase flex items-center gap-2.5">
          <Target className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Diretrizes e Missões de Investigação // Volume I</span>
        </h2>
        <p className="text-sm text-slate-300 font-sans mt-1">
          Confronte as fontes primárias de cada época para destravar o Dossiê Zero e a recompensa mestre do protocolo.
        </p>
      </div>

      {/* =====================================================================
          PAINEL DE OBJETIVO FINAL & BÔNUS DE CONCLUSÃO (4/4 MISSÕES)
         ===================================================================== */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-400/45 bg-gradient-to-br from-[#0B1426] via-[#09101D] to-[#060A12] p-5 sm:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.85)] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>OBJETIVO MESTRE DA CAMADA 1 // RECOMPENSA DE AUDITORIA</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Bônus Final: Dossiê Zero — &ldquo;A Equação do Ponto Cego&rdquo; + Credencial Sênior
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ao concluir as <strong>4 missões históricas do Volume I</strong> (Júlio César, Napoleão, Alan Turing e Steve Jobs), você desbloqueia o capítulo confidencial que revela o elo invisível entre as quatro eras e recebe a Credencial Oficial de Auditor Sênior.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-[#060A12]/90 border border-slate-700/80 text-right font-mono">
              <div className="text-xs text-slate-400 uppercase">Progresso do Protocolo</div>
              <div className="text-base font-bold text-amber-300">
                {completedVolOneCount} de {totalVolOneCount} Missões ({progressPct}%)
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setBonusModalOpen(true);
              }}
              className={`px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isAllCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200'
              }`}
            >
              {isAllCompleted ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Abrir Dossiê Zero Desbloqueado</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ver Prévia da Recompensa ({completedVolOneCount}/{totalVolOneCount})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Progresso do Bônus */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* LISTA DAS 4 MISSÕES DO VOLUME I */}
      <div className="space-y-4">
        {volumeOneNodes.map(node => {
          const isCompleted = state.completedNodes.includes(node.id);

          return (
            <div
              key={node.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-[#0B1320]/85 border-emerald-500/40'
                  : 'bg-[#0B1320]/95 border-amber-500/30 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-amber-400/40 shrink-0 bg-slate-900">
                  <img src={node.image} alt={node.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                      {node.missionCode}
                    </span>
                    <span className="font-sans font-bold text-base sm:text-lg text-white">
                      {node.fullName}
                    </span>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded">
                      {node.year}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 font-sans leading-relaxed">
                    {node.shortDescription}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-mono">
                    {isCompleted ? (
                      <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Dossiê Concluído e Auditado (+XP)
                      </span>
                    ) : (
                      <span className="text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Investigação Disponível
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => startCaseInvestigation(node.id)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
              >
                <span>{isCompleted ? 'Reexaminar Dossiê' : 'Iniciar Missão'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL DO BÔNUS FINAL: DOSSIÊ ZERO */}
      {bonusModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setBonusModalOpen(false)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl bg-[#080D18] border border-amber-400/50 p-6 space-y-4 text-slate-200 shadow-2xl max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>ARQUIVO CONFIDENCIAL DE CONCLUSÃO // DOSSIÊ ZERO</span>
              </div>
              <button
                type="button"
                onClick={() => setBonusModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAllCompleted ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center gap-2.5 text-emerald-300 text-sm font-bold">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>ACESSO MESTRE CONCEDIDO: Todas as 4 Missões do Volume I foram auditadas!</span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  Dossiê Zero — A Equação do Ponto Cego (49 a.C. – 2007)
                </h3>

                <div className="space-y-3 text-sm text-slate-200 leading-relaxed bg-[#050811] p-4 rounded-xl border border-slate-800">
                  <p>
                    <strong>1. A Convergência das Quatro Rupturas:</strong> Ao cruzar o estoque de 9 dias de trigo de César no Rubicão (49 a.C.), as 4 horas de lama em Waterloo (1815), o sacrifício estatístico do comboio em Bletchley Park (1941) e o Caminho Dourado no Moscone Center (2007), emerge uma mesma constante histórica: <em>grandes sistemas colapsam ou triunfam no intervalo invisível entre a narrativa oficial e o limite físico do tempo</em>.
                  </p>
                  <p>
                    <strong>2. O Elo com o Volume II:</strong> Os três arquivos em quarentena no seu terminal — <strong>Cleópatra (30 a.C.)</strong>, <strong>Joana d&apos;Arc (1429)</strong> e <strong>Nelson Mandela (1994)</strong> — representam a segunda metade da equação: quando o fator humano rompe o cálculo puramente logístico.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href="/reader/"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Continuar Leitura no E-Reader Oficial</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setBonusModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-mono cursor-pointer"
                  >
                    Fechar Arquivo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/35 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <div className="font-bold text-amber-200">
                      Faltam {totalVolOneCount - completedVolOneCount} missão(ões) para liberar o Dossiê Zero completo
                    </div>
                    <p className="text-slate-300">
                      Complete as 5 etapas dos 4 casos históricos principais (Júlio César, Napoleão, Alan Turing e Steve Jobs) para abrir este documento confidencial e receber sua Credencial Sênior.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#050811] border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold block">RECOMPENSA #1</span>
                    <span className="text-slate-200 font-sans text-sm font-semibold block">Epílogo Dossiê Zero</span>
                    <span className="text-slate-400 font-sans">A conexão secreta entre os 4 casos do livro.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050811] border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold block">RECOMPENSA #2</span>
                    <span className="text-slate-200 font-sans text-sm font-semibold block">Credencial Nível Máximo</span>
                    <span className="text-slate-400 font-sans">Selo de Auditor Sênior no seu Perfil.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050811] border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">RECOMPENSA #3</span>
                    <span className="text-slate-200 font-sans text-sm font-semibold block">Spoiler do Volume II</span>
                    <span className="text-slate-400 font-sans">Acesso à síntese de Cleópatra, Joana e Mandela.</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setBonusModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
                  >
                    Continuar Missões
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
