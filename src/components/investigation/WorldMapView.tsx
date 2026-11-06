import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EraFilter, HistoricalNode } from '../../types/investigation';
import { CaseDrawer } from './CaseDrawer';
import { Compass, CheckCircle2, Lock, Sparkles, Filter } from 'lucide-react';

export const WorldMapView: React.FC = () => {
  const {
    state,
    filteredNodes,
    allNodes,
    selectedCase,
    setSelectedCaseId,
    setEraFilter,
    stats
  } = useInvestigation();

  const eraFilters: { key: EraFilter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'antiguidade', label: 'Antiguidade' },
    { key: 'idade_media', label: 'Idade Média' },
    { key: 'moderna', label: 'Moderna' },
    { key: 'contemporanea', label: 'Contemporânea' },
  ];

  // Gera curvas SVG douradas conectando nós relacionados
  const connectionArcs = [
    { from: 'cesar', to: 'napoleao' },
    { from: 'cesar', to: 'jobs' },
    { from: 'napoleao', to: 'jobs' },
    { from: 'jobs', to: 'turing' },
    { from: 'cesar', to: 'cleopatra' },
    { from: 'napoleao', to: 'joana' },
    { from: 'turing', to: 'mandela' },
  ];

  const getNodeCoords = (id: string) => {
    const node = allNodes.find(n => n.id === id);
    return node ? node.coords : { x: 50, y: 50 };
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOPO: TÍTULO DA VISÃO & FILTROS DE ERA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/15 pb-4">
        <div>
          <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
            <span>CONECTE O PASSADO. DESCUBRA O PADRÃO.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
            Explore as anomalias históricas da Strata e localize os pontos de ruptura que moldaram o presente.
          </p>
        </div>

        {/* Pílulas de Filtro de Era */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-slate-500 text-xs font-mono mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Era:</span>
          </div>
          {eraFilters.map(filter => {
            const isActive = state.eraFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setEraFilter(filter.key)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/10'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GRID PRINCIPAL: MAPA (ESQUERDA) + CASO EM DESTAQUE (DIREITA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA ESQUERDA: MAPA-MÚNDI TÁTICO INTERATIVO */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full rounded-2xl bg-[#070b14] border border-amber-500/25 p-3 sm:p-5 shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-between">
            
            {/* Grade de coordenadas táticas de fundo */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

            {/* Rosa dos Ventos no Canto Inferior Esquerdo */}
            <div className="absolute bottom-16 left-4 text-slate-700 pointer-events-none opacity-40 hidden sm:block">
              <Compass className="w-16 h-16 stroke-[1]" />
            </div>

            {/* Camada SVG: Mapa-Múndi Estilizado + Arcos de Bézier */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Linhas de conexão douradas entre nós */}
              {connectionArcs.map((arc, i) => {
                const p1 = getNodeCoords(arc.from);
                const p2 = getNodeCoords(arc.to);
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2 - 8; // Arco curvo superior
                const isSelected = selectedCase.id === arc.from || selectedCase.id === arc.to;

                return (
                  <path
                    key={i}
                    d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={isSelected ? '#F59E0B' : '#785A28'}
                    strokeWidth={isSelected ? '0.45' : '0.25'}
                    strokeDasharray={isSelected ? '1.5, 0.8' : '1, 1'}
                    opacity={isSelected ? 0.9 : 0.35}
                    className={isSelected ? 'animate-pulse' : ''}
                  />
                );
              })}
            </svg>

            {/* Nós Interativos Sobrepostos ao Mapa */}
            <div className="relative z-10 w-full h-[320px] sm:h-[380px]">
              {filteredNodes.map(node => {
                const isSelected = selectedCase.id === node.id;
                const isCompleted = state.completedNodes.includes(node.id);
                const isQuarantine = node.status === 'quarentena';
                const isAvailable = node.status === 'disponivel' || isCompleted;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedCaseId(node.id)}
                    style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none"
                  >
                    {/* Efeito de halo pulsante no nó selecionado ou disponível */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-amber-400/20 blur-sm animate-ping pointer-events-none" />
                    )}

                    <div
                      className={`relative flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-black/90 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-110 z-20'
                          : isAvailable
                          ? 'bg-black/75 border border-amber-500/40 hover:border-amber-400/80 hover:scale-105 z-10'
                          : 'bg-black/60 border border-slate-700/50 opacity-60 hover:opacity-90'
                      }`}
                    >
                      {/* Avatar do Personagem com Aro de Status */}
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900">
                        <img
                          src={node.image}
                          alt={node.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Texto do Nó */}
                      <div className="leading-tight text-left">
                        <div className="text-[11px] font-sans font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
                          <span>{node.name}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          ) : isQuarantine ? (
                            <Lock className="w-2.5 h-2.5 text-amber-500/70 shrink-0" />
                          ) : null}
                        </div>
                        <div className="text-[9px] font-mono text-amber-400/90">
                          {node.year}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. RÉGUA CRONOLÓGICA INFERIOR (SCRUBBER HISTÓRICO) */}
            <div className="relative z-10 pt-3 border-t border-amber-500/20">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 overflow-x-auto gap-2 pb-1 scrollbar-none">
                {allNodes
                  .filter(n => n.isVolumeOne)
                  .map(n => {
                    const isSelected = selectedCase.id === n.id;
                    const isCompleted = state.completedNodes.includes(n.id);
                    return (
                      <button
                        key={n.id}
                        onClick={() => setSelectedCaseId(n.id)}
                        className={`px-2.5 py-1 rounded-md transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                            : 'hover:text-slate-200 text-slate-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : isSelected ? 'bg-amber-400' : 'bg-slate-600'}`} />
                        <span>{n.timelineLabel}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

          </div>

          {/* 4. BARRA DE ESTATÍSTICAS REAIS DO LEITOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#0B1320] border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Progresso no Volume I:</span>
                <div className="text-white font-bold text-sm mt-0.5">
                  {stats.analyzedCount} de {stats.totalVolumeOne} Dossiês Concluídos
                </div>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold text-base">{stats.completionPercentage}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1320] border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Hipóteses Formuladas:</span>
                <div className="text-white font-bold text-sm mt-0.5">
                  {stats.hypothesesCount} teses de investigação gravadas
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[11px] font-bold border border-cyan-500/30">
                Sincronizado
              </span>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: CASO EM DESTAQUE (DRAWER) */}
        <div className="lg:col-span-4">
          <CaseDrawer />
        </div>

      </div>

    </div>
  );
};
