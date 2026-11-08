import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  Users,
  ShieldCheck,
  MessageSquarePlus,
  Send,
  ThumbsUp,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { soundEngine } from '../../utils/investigationAudio';

interface FieldNoteItem {
  id: string;
  caseId: string;
  author: string;
  caseTitle: string;
  badge: string;
  hypothesis: string;
  text: string;
  time: string;
  upvotes: number;
}

const INITIAL_COMMUNITY_NOTES: FieldNoteItem[] = [
  {
    id: 'seed-1',
    caseId: 'cesar',
    author: 'Auditor 1904',
    caseTitle: 'Júlio César e o Rubicão (49 a.C.)',
    badge: 'Contradição Documental Validada',
    hypothesis: 'Tese I — Asfixia Logística',
    text: 'Ao cruzar a Ata do Senado (DOC-01) com a Tabuleta de Intendência (DOC-02), fica provado que uma embaixada de 12 dias a Roma jamais voltaria antes do colapso dos 9 dias de trigo.',
    time: 'Há 3 horas',
    upvotes: 42,
  },
  {
    id: 'seed-2',
    caseId: 'napoleao',
    author: 'Auditora 5120',
    caseTitle: 'Napoleão e Waterloo (1815)',
    badge: 'Análise de Comando',
    hypothesis: 'Tese II — Colapso de Sincronia',
    text: 'Muitos atribuem a derrota apenas à lama, mas o despacho de Soult mostra que enviar um único mensageiro a Grouchy violou o protocolo de Berthier e isolou 33.000 soldados.',
    time: 'Ontem',
    upvotes: 31,
  },
  {
    id: 'seed-3',
    caseId: 'turing',
    author: 'Auditor 7742',
    caseTitle: 'Alan Turing e o Código Enigma (1941)',
    badge: 'Decisão Estatística',
    hypothesis: 'Tese I — Proteção da Fonte Ultra',
    text: 'Se Bletchley Park tivesse alertado todos os comboios imediatamente sem voo de reconhecimento, o almirantado alemão teria trocado os rotores da Enigma em 48 horas.',
    time: 'Há 2 dias',
    upvotes: 29,
  },
  {
    id: 'seed-4',
    caseId: 'jobs',
    author: 'Auditor 8831',
    caseTitle: 'Steve Jobs e o Lançamento de 2007',
    badge: 'Conexão entre Eras',
    hypothesis: 'Tese I — O Caminho Dourado',
    text: 'Tanto na margem do Rubicão quanto no Moscone Center em 2007, expor a fragilidade interna antes da travessia destruiria a operação. O Caminho Dourado salvou a percepção pública.',
    time: 'Há 3 dias',
    upvotes: 37,
  },
];

const CASE_TELEMETRY: Record<
  string,
  {
    caseName: string;
    totalAudits: number;
    dominantThesis: string;
    thesisPct: number;
    dominantDecision: string;
    decisionPct: number;
    insight: string;
  }
> = {
  cesar: {
    caseName: 'Caso 001 — Júlio César (49 a.C.)',
    totalAudits: 1420,
    dominantThesis: 'Asfixia Logística e Ponto Sem Retorno',
    thesisPct: 68,
    dominantDecision: 'Cruzar o Rubicão na madrugada e tomar Ariminum',
    decisionPct: 74,
    insight: '74% dos leitores priorizaram a sobrevivência logística da 13ª Legião sobre o ultimato senatorial.',
  },
  napoleao: {
    caseName: 'Caso 004 — Napoleão em Waterloo (1815)',
    totalAudits: 980,
    dominantThesis: 'Atraso de 4h na Lama + Falha de Transmissão a Grouchy',
    thesisPct: 71,
    dominantDecision: 'Iniciar ataque às 09h00 com infantaria leve antes de Blücher',
    decisionPct: 62,
    insight: '62% dos investigadores recusaram esperar o solo secar até as 11h30 para impedir a junção prussiana.',
  },
  turing: {
    caseName: 'Caso 005 — Alan Turing em Bletchley Park (1941)',
    totalAudits: 865,
    dominantThesis: 'Ocultação Estatística do Segredo Ultra',
    thesisPct: 79,
    dominantDecision: 'Enviar avião de reconhecimento ("avistamento casual") antes de desviar',
    decisionPct: 83,
    insight: 'A maioria absoluta (83%) usou o protocolo de avistamento forjado para salvar o comboio sem queimar a Bombe.',
  },
  jobs: {
    caseName: 'Caso 007 — Steve Jobs no Moscone Center (2007)',
    totalAudits: 1110,
    dominantThesis: 'Execução Estrita do Caminho Dourado + 5 Barras Fixas',
    thesisPct: 76,
    dominantDecision: 'Manter a demonstração ao vivo com troca silenciosa de protótipos',
    decisionPct: 69,
    insight: '69% assumiram o risco da demonstração ao vivo amparados pelo roteiro cirúrgico do Caminho Dourado.',
  },
};

export const CommunityView: React.FC = () => {
  const { allNodes, state, getCasePlayProgress, startCaseInvestigation } = useInvestigation();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('cesar');
  const [filterCaseId, setFilterCaseId] = useState<string>('todos');
  const [contributionText, setContributionText] = useState('');

  const [userNotes, setUserNotes] = useState<FieldNoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('ush_community_notes_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ush_community_upvotes_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const playableCases = allNodes.filter(n => n.isVolumeOne && n.status !== 'quarentena');
  const telemetry = CASE_TELEMETRY[selectedCaseId] || CASE_TELEMETRY.cesar;
  const userProg = getCasePlayProgress(selectedCaseId);
  const currentCaseNode = allNodes.find(n => n.id === selectedCaseId) || allNodes[0];
  const userThesis = currentCaseNode.hypothesisTheses?.find(
    t => t.id === userProg?.selectedThesisId
  );

  const handlePublishNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionText.trim()) return;
    soundEngine.playClueSaved();

    const node = allNodes.find(n => n.id === selectedCaseId) || allNodes[0];
    const prog = getCasePlayProgress(node.id);
    const thesis = node.hypothesisTheses?.find(t => t.id === prog?.selectedThesisId);

    const entry: FieldNoteItem = {
      id: `note-${Date.now()}`,
      caseId: node.id,
      author: state.investigator.name || 'Investigador',
      caseTitle: `${node.name} (${node.year})`,
      badge: state.completedNodes.includes(node.id)
        ? 'Auditor com Caso Concluído'
        : 'Relatório de Campo',
      hypothesis: thesis ? `${thesis.tag} — ${thesis.title}` : 'Análise Documental Livre',
      text: contributionText.trim(),
      time: 'Agora mesmo',
      upvotes: 1,
    };

    const next = [entry, ...userNotes];
    setUserNotes(next);
    localStorage.setItem('ush_community_notes_v3', JSON.stringify(next));
    setContributionText('');

    // Sincroniza no Supabase se o leitor estiver autenticado
    const token = localStorage.getItem('ush_token');
    if (token) {
      fetch('/api/track-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          community_notes: next,
        }),
      }).catch(() => {});
    }
  };

  const handleToggleUpvote = (id: string) => {
    soundEngine.playDocumentOpen();
    const next = upvotedIds.includes(id)
      ? upvotedIds.filter(x => x !== id)
      : [...upvotedIds, id];
    setUpvotedIds(next);
    localStorage.setItem('ush_community_upvotes_v1', JSON.stringify(next));
  };

  const allDisplayedNotes = [...userNotes, ...INITIAL_COMMUNITY_NOTES].filter(
    n => filterCaseId === 'todos' || n.caseId === filterCaseId
  );

  return (
    <div className="space-y-6 mt-2 font-sans max-w-6xl mx-auto pb-12">
      <div className="border-b border-amber-500/20 pb-4">
        <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-wide text-white uppercase flex items-center gap-2.5">
          <Users className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Comunidade // Inteligência Coletiva & Mural de Campo</span>
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Compare suas hipóteses e decisões com a telemetria global dos leitores e publique relatórios analíticos no Mural de Campo.
        </p>
      </div>

      {/* =====================================================================
          1. TELEMETRIA COLETIVA POR CASO (COMPARAÇÃO DE DECISÕES DA COMUNIDADE)
         ===================================================================== */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0A111F]/90 border border-amber-500/35 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                TELEMETRIA GLOBAL DOS LEITORES //
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Consenso de Hipóteses & Decisões de Campo
              </h3>
            </div>
          </div>

          {/* Seletor de Caso */}
          <div className="flex flex-wrap items-center gap-1.5">
            {playableCases.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all border ${
                  selectedCaseId === c.id
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : 'bg-[#060A12] text-slate-300 border-slate-700 hover:border-amber-400/50'
                }`}
              >
                {c.name} ({c.year})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-300 font-bold uppercase">HIPÓTESE MAIS DEFENDIDA</span>
              <span className="text-white font-bold">{telemetry.thesisPct}% dos auditores</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white">
              {telemetry.dominantThesis}
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                style={{ width: `${telemetry.thesisPct}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold uppercase">DECISÃO DE CAMPO MAJORITÁRIA</span>
              <span className="text-white font-bold">{telemetry.decisionPct}% dos auditores</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white">
              {telemetry.dominantDecision}
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                style={{ width: `${telemetry.decisionPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs sm:text-sm text-slate-300">
          <div>
            <strong className="text-emerald-300 font-mono">Sua posição neste caso:</strong>{' '}
            {userThesis ? (
              <span>Você registrou &ldquo;{userThesis.title}&rdquo;.</span>
            ) : (
              <span>Você ainda não registrou uma tese pericial neste dossiê.</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => startCaseInvestigation(selectedCaseId)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Abrir Caso na Mesa 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. PUBLICAR RELATÓRIO NO MURAL DE CAMPO
         ===================================================================== */}
      <form
        onSubmit={handlePublishNote}
        className="p-5 sm:p-6 rounded-2xl bg-[#0A111F]/90 border border-slate-700/80 space-y-4 shadow-lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase font-bold">
            <MessageSquarePlus className="w-4 h-4" />
            <span>Registrar Nota Analítica no Mural de Campo</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Autor: <strong className="text-slate-200">{state.investigator.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Caso Analisado:</label>
            <select
              value={selectedCaseId}
              onChange={e => setSelectedCaseId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#060A12] border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {playableCases.map(n => (
                <option key={n.id} value={n.id}>
                  {n.name} ({n.year})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Sua Descoberta ou Argumento Documental (máx. 280 caracteres):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                maxLength={280}
                value={contributionText}
                onChange={e => setContributionText(e.target.value)}
                placeholder="Ex: A diferença entre os 9 dias de trigo e os 12 dias de viagem comprova que..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060A12] border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Publicar</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* =====================================================================
          3. MURAL DE CAMPO (RELATÓRIOS VALIDADOS PELA COMUNIDADE)
         ===================================================================== */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Mural de Campo // Relatórios de Investigadores ({allDisplayedNotes.length})</span>
          </h3>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterCaseId('todos')}
              className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer border ${
                filterCaseId === 'todos'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-[#060A12] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos os Casos
            </button>
            {playableCases.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilterCaseId(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer border ${
                  filterCaseId === c.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                    : 'bg-[#060A12] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allDisplayedNotes.map(note => {
            const isUpvoted = upvotedIds.includes(note.id);
            const totalVotes = note.upvotes + (isUpvoted ? 1 : 0);

            return (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-[#0B1320]/90 border border-slate-800 hover:border-amber-500/35 transition-all flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-amber-300 font-bold">{note.author}</span>
                    <span className="text-slate-400">{note.time}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-semibold">
                      {note.caseTitle}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-200">
                      {note.hypothesis}
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed pt-1">{note.text}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {note.badge}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleUpvote(note.id)}
                    className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                      isUpvoted
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                        : 'bg-[#060A12] border-slate-700 text-slate-300 hover:border-amber-400/50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Validar ({totalVotes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
