import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  Users,
  ShieldCheck,
  Sparkles,
  GitCommit,
  Award,
  MessageSquarePlus,
  Send,
  Layers,
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { allNodes, state, startCaseInvestigation } = useInvestigation();
  const [selectedCaseId, setSelectedCaseId] = useState('cesar');
  const [contributionText, setContributionText] = useState('');
  const [userContributions, setUserContributions] = useState<
    Array<{ id: string; author: string; caseTitle: string; badge: string; text: string; time: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('ush_community_notes_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handlePublishNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionText.trim()) return;
    const node = allNodes.find(n => n.id === selectedCaseId) || allNodes[0];
    const entry = {
      id: Date.now().toString(),
      author: state.investigator.name,
      caseTitle: `${node.name} (${node.year})`,
      badge: 'Descoberta Compartilhada',
      text: contributionText.trim(),
      time: 'Agora mesmo',
    };
    const next = [entry, ...userContributions];
    setUserContributions(next);
    localStorage.setItem('ush_community_notes_v2', JSON.stringify(next));
    setContributionText('');
  };

  const collaborativeNotes = [
    {
      author: 'Investigador 1904',
      recognition: 'Mérito: Identificou Contradição Documental',
      case: 'Júlio César e o Rubicão (49 a.C.)',
      time: 'Há 3 horas',
      hypothesis: 'Hipótese I — Asfixia Logística (2 Provas Anexadas)',
      text: 'Ao cruzar a Ata do Senado (DOC-01) com a Tabuleta de Intendência (DOC-02), fica evidente que Roma operava com informação falsa ou fabricada: uma embaixada de 12 dias nunca retornaria antes do fim dos 9 dias de trigo.',
    },
    {
      author: 'Investigador 5120',
      recognition: 'Mérito: Hipótese Alternativa Fundamentada',
      case: 'Napoleão e Waterloo (1815)',
      time: 'Ontem',
      hypothesis: 'Hipótese II — Falha de Redundância no Comando',
      text: 'Muitos culpam apenas a chuva em Waterloo, mas o documento do Marechal Soult mostra que enviar um único mensageiro a cavalo às 10h00 violou o protocolo de Berthier e custou 33.000 homens no flanco direito.',
    },
    {
      author: 'Investigador 8831',
      recognition: 'Mérito: Conexão Transversal entre Séculos',
      case: 'Steve Jobs (2007) ↔ Júlio César (49 a.C.)',
      time: 'Há 2 dias',
      hypothesis: 'Padrão de Janela Fechada',
      text: 'Tanto na margem do Rubicão quanto nos bastidores do Moscone Center em 2007, admitir publicamente a vulnerabilidade técnica ou logística antes da travessia teria destruído a operação antes de começar.',
    },
  ];

  return (
    <div className="space-y-6 mt-2">
      <div className="border-b border-amber-500/20 pb-4">
        <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-white uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Comunidade // Rede de Investigação Colaborativa</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1 max-w-3xl">
          Mais do que um ranking de pontos: aqui são reconhecidos os investigadores que encontram contradições documentais, sustentam boas hipóteses e ajudam a montar descobertas coletivas.
        </p>
      </div>

      {/* OS 3 NÍVEIS DE PARTICIPAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1320]/90 border border-amber-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            NÍVEL 1 // INDIVIDUAL
          </span>
          <div className="font-sans text-base font-bold text-white">
            Sua Trajetória e Arquivo
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Cada jogador examina evidências, formula suas hipóteses e desenvolve um perfil único de decisão ({state.totalXp} XP acumulados).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1320]/90 border border-cyan-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            NÍVEL 2 // COLABORATIVO
          </span>
          <div className="font-sans text-base font-bold text-white">
            Confronto de Hipóteses
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Investigadores compartilham pistas opcionais e interpretações diferentes para o mesmo evento, enriquecendo a análise.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1320]/90 border border-emerald-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            NÍVEL 3 // COLETIVO
          </span>
          <div className="font-sans text-base font-bold text-white">
            Descoberta Convergente
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A comunidade combina achados de diferentes épocas (49 a.C., 1815, 1941 e 2007) para decifrar a equação central do Padrão.
          </p>
        </div>
      </div>

      {/* GRID PRINCIPAL: COMPARTILHAR DESCOBERTA + MURAL COLABORATIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Formulário de Contribuição (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2.5">
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              Compartilhar Pista ou Hipótese
            </span>
          </div>

          <form onSubmit={handlePublishNote} className="space-y-3">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Caso Relacionado:
              </label>
              <select
                value={selectedCaseId}
                onChange={e => setSelectedCaseId(e.target.value)}
                className="w-full rounded-xl bg-[#060A12] border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {allNodes
                  .filter(n => n.isVolumeOne)
                  .map(n => (
                    <option key={n.id} value={n.id}>
                      {n.fullName} ({n.year})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Sua Descoberta, Contradição ou Argumento:
              </label>
              <textarea
                rows={4}
                value={contributionText}
                onChange={e => setContributionText(e.target.value)}
                placeholder="Compartilhe uma evidência ou interpretação fundamentada que você encontrou..."
                className="w-full rounded-xl bg-[#060A12] border border-slate-800 p-3 text-sm text-slate-100 leading-relaxed focus:outline-none focus:border-amber-400 custom-scrollbar"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar no Mural de Campo</span>
            </button>
          </form>
        </div>

        {/* Mural de Hipóteses Fundamentadas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {userContributions.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0B1320]/95 border border-emerald-500/40 shadow-lg space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">{item.author} (Você)</span>
                <span className="text-slate-400">{item.time}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-sm font-bold text-white">{item.caseTitle}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[11px] font-mono border border-emerald-500/30">
                  {item.badge}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed italic pt-1">
                "{item.text}"
              </p>
            </div>
          ))}

          {collaborativeNotes.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/20 shadow-lg space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">{item.author}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-200">
                    {item.recognition}
                  </span>
                </div>
                <span className="text-slate-500">{item.time}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-sans font-bold text-white">{item.case}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-xs font-mono border border-cyan-500/25">
                  {item.hypothesis}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed italic pt-1">
                "{item.text}"
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Evidência Verificada no Arquivo
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
