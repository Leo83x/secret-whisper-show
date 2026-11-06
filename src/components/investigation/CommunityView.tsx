import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Users, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { allNodes, state, startCaseInvestigation } = useInvestigation();

  const communityNotes = [
    {
      author: 'Investigador 1904',
      rank: 'Auditor de Campo',
      case: 'Júlio César e o Rubicão',
      time: 'Há 3 horas',
      hypothesis: 'Hipótese B (Salto Estratégico)',
      text: 'O fato de o Senado ter cortado os grãos no mesmo dia do bloqueio de crédito em Roma comprova coordenação prévia entre Pompeu e os tribunos.'
    },
    {
      author: 'Investigador 5120',
      rank: 'Auditor Desperto',
      case: 'Steve Jobs e o iPhone',
      time: 'Ontem',
      hypothesis: 'Hipótese B (Demonstração no Limiar)',
      text: 'Existe um padrão claro entre a 13ª Legião na margem do rio e o Moscone Center: ambos sabiam que admitir a fragilidade técnica destruiria a causa antes do início.'
    },
    {
      author: 'Investigador 8831',
      rank: 'Auditor de Campo',
      case: 'Napoleão e Waterloo',
      time: 'Há 2 dias',
      hypothesis: 'Hipótese A (Ataque Frontal)',
      text: 'A chuva atrasou os canhões, mas o erro real foi o formato dos despachos a cavalo, que demoravam 3 horas a mais que a movimentação das vanguardas prussianas.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-amber-500/20 pb-4">
        <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-white uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Comunidade // Registros e Hipóteses de Campo</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
          Anotações compartilhadas por leitores e auditores em investigação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {communityNotes.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/20 shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">{item.author}</span>
                <span className="text-slate-500">{item.time}</span>
              </div>
              <div className="text-xs font-serif font-bold text-white">{item.case}</div>
              <div className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-xs font-mono border border-cyan-500/25 inline-block">
                {item.hypothesis}
              </div>
              <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed italic pt-1">
                "{item.text}"
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Verificado
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
