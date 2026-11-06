import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Network, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const HistoricalOrbitalRadar: React.FC = () => {
  const { selectedCase, allNodes } = useInvestigation();

  // Nós principais que convergem para a tese de escassez e decisão
  const cesarNode = allNodes.find(n => n.id === 'cesar');
  const jobsNode = allNodes.find(n => n.id === 'jobs');
  const napoleaoNode = allNodes.find(n => n.id === 'napoleao');

  return (
    <div className="space-y-4">
      {/* Título da Seção */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
            2. Conexão Analógica — Matriz de Risco
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
          Telemetria Ativa
        </span>
      </div>

      {/* Gráfico Orbital Escuro com Círculos Concêntricos e Nós */}
      <div className="relative w-full h-64 sm:h-72 rounded-xl bg-[#070b14] border border-cyan-500/30 p-4 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Anéis orbitais concêntricos */}
        <div className="absolute w-56 h-56 rounded-full border border-cyan-500/15 pointer-events-none" />
        <div className="absolute w-40 h-40 rounded-full border border-amber-500/20 pointer-events-none animate-spin [animation-duration:45s]" />
        <div className="absolute w-24 h-24 rounded-full border border-slate-700/50 pointer-events-none" />

        {/* Linhas SVG de conexão orbital */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <line x1="28" y1="35" x2="50" y2="72" stroke="#F59E0B" strokeWidth="0.6" strokeDasharray="2, 2" />
          <line x1="50" y1="72" x2="72" y2="35" stroke="#06B6D4" strokeWidth="0.6" strokeDasharray="2, 2" />
          <line x1="28" y1="35" x2="72" y2="35" stroke="#F59E0B" strokeWidth="0.4" strokeOpacity="0.4" />
        </svg>

        {/* Nó 1: Júlio César (Superior Esquerdo) */}
        <div className="absolute left-[28%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
          <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <img src={cesarNode?.image} alt="César" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-black/80 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap">
            49 a.C. Roma
          </div>
        </div>

        {/* Nó 2: Napoleão (Superior Direito) */}
        <div className="absolute left-[72%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
          <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <img src={napoleaoNode?.image} alt="Napoleão" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-black/80 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap">
            1815 Waterloo
          </div>
        </div>

        {/* Nó 3: Steve Jobs (Inferior Centro) */}
        <div className="absolute left-[50%] top-[72%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
          <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-400 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <img src={jobsNode?.image} alt="Jobs" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-black/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold whitespace-nowrap">
            2007 Califórnia
          </div>
        </div>
      </div>

      {/* Relatório de Convergência Documental */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/25 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold uppercase text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pontos de Convergência das 3 Épocas:</span>
        </div>
        <div className="space-y-1.5 text-slate-300 font-sans leading-relaxed text-[11px]">
          <p>
            • <strong>Escassez de Alternativas:</strong> César tinha 9 dias de trigo; Napoleão tinha poucas horas antes dos prussianos; Jobs tinha minutos antes do travamento de memória.
          </p>
          <p>
            • <strong>Discurso Público vs Realidade:</strong> Em todos os casos, a posteridade registrou um herói destemido no palco, enquanto os arquivos registram analistas angustiados na retaguarda.
          </p>
        </div>
      </div>
    </div>
  );
};
