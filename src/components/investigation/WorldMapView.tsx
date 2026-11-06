import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EraFilter } from '../../types/investigation';
import { CaseDrawer } from './CaseDrawer';
import { Compass, CheckCircle2, Lock, Filter } from 'lucide-react';

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

  // Arcos de conexão entre os nós históricos
  const connectionArcs = [
    { from: 'jobs', to: 'joana' },
    { from: 'jobs', to: 'napoleao' },
    { from: 'joana', to: 'turing' },
    { from: 'joana', to: 'napoleao' },
    { from: 'turing', to: 'cesar' },
    { from: 'napoleao', to: 'cesar' },
    { from: 'napoleao', to: 'cleopatra' },
    { from: 'cesar', to: 'cleopatra' },
    { from: 'cleopatra', to: 'mandela' },
  ];

  const getNodeCoords = (id: string) => {
    const node = allNodes.find(n => n.id === id);
    return node ? node.coords : { x: 50, y: 50 };
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOPO: TÍTULO DA VISÃO & FILTROS DE ERA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wider text-white uppercase">
            CONECTE O PASSADO. DESCUBRA O <span className="text-amber-400">PADRÃO.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans mt-1">
            Explore os eventos que moldaram o mundo e encontre as pistas que atravessam os séculos.
          </p>
        </div>

        {/* Pílulas de Filtro de Era com Fonte Maior */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm font-mono mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Era:</span>
          </div>
          {eraFilters.map(filter => {
            const isActive = state.eraFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setEraFilter(filter.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-amber-500/30'
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
        
        {/* COLUNA ESQUERDA: MAPA-MÚNDI NOTURNO ESTILIZADO */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className="relative w-full rounded-2xl border border-amber-500/30 p-3 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden min-h-[430px] sm:min-h-[500px] flex flex-col justify-between"
            style={{
              background: 'radial-gradient(ellipse at 50% 110%, rgba(14, 116, 144, 0.32) 0%, rgba(11, 22, 44, 0.85) 40%, #050912 85%)'
            }}
          >
            {/* Grade tática de coordenadas */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.04)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

            {/* MAPA-MÚNDI NOTURNO COM CONTINENTES E LUZES DE CIDADES DOURADAS (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              viewBox="0 0 1000 520"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="continentDots" width="6" height="6" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#38bdf8" fillOpacity="0.22" />
                </pattern>
                <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="cityCluster" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Linhas de Latitude e Equador */}
              <line x1="0" y1="130" x2="1000" y2="130" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4,4" />
              <line x1="0" y1="260" x2="1000" y2="260" stroke="#334155" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
              <line x1="0" y1="390" x2="1000" y2="390" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4,4" />

              {/* SILHUETAS DOS CONTINENTES (Visíveis com preenchimento noturno + malha pontilhada + borda dourada/azul) */}
              <g fill="#0d1b30" stroke="#2d4a6d" strokeWidth="1.5" opacity="0.85">
                {/* América do Norte */}
                <path d="M 45 75 L 125 60 L 210 75 L 285 65 L 310 110 L 270 160 L 235 195 L 200 225 L 175 245 L 145 225 L 115 190 L 95 145 L 55 120 Z" />
                {/* Groenlândia */}
                <path d="M 295 35 L 365 30 L 380 65 L 335 85 L 295 65 Z" />
                {/* América do Sul */}
                <path d="M 205 265 L 255 260 L 315 305 L 305 365 L 265 435 L 230 475 L 205 445 L 195 365 L 180 305 Z" />
                {/* Europa */}
                <path d="M 420 75 L 485 55 L 565 65 L 595 110 L 565 165 L 525 185 L 475 185 L 430 165 L 410 130 Z" />
                {/* Reino Unido / Escandinávia */}
                <path d="M 415 95 L 435 90 L 440 118 L 420 122 Z" />
                {/* África */}
                <path d="M 425 200 L 505 195 L 575 210 L 615 265 L 595 345 L 555 425 L 505 435 L 480 375 L 455 305 L 410 265 Z" />
                {/* Ásia */}
                <path d="M 580 65 L 710 55 L 855 75 L 925 115 L 895 195 L 845 255 L 775 280 L 705 270 L 655 245 L 605 205 L 575 155 Z" />
                {/* Japão e Sudeste Asiático */}
                <path d="M 865 160 L 885 155 L 890 195 L 870 205 Z" />
                <path d="M 760 285 L 825 295 L 845 330 L 780 335 Z" />
                {/* Oceania / Austrália */}
                <path d="M 790 360 L 885 355 L 910 415 L 865 445 L 795 430 Z" />
              </g>

              {/* Malha Pontilhada Tecnológica sobre os Continentes */}
              <g fill="url(#continentDots)" stroke="#d4af37" strokeWidth="0.6" strokeOpacity="0.35">
                <path d="M 45 75 L 125 60 L 210 75 L 285 65 L 310 110 L 270 160 L 235 195 L 200 225 L 175 245 L 145 225 L 115 190 L 95 145 L 55 120 Z" />
                <path d="M 205 265 L 255 260 L 315 305 L 305 365 L 265 435 L 230 475 L 205 445 L 195 365 L 180 305 Z" />
                <path d="M 420 75 L 485 55 L 565 65 L 595 110 L 565 165 L 525 185 L 475 185 L 430 165 L 410 130 Z" />
                <path d="M 425 200 L 505 195 L 575 210 L 615 265 L 595 345 L 555 425 L 505 435 L 480 375 L 455 305 L 410 265 Z" />
                <path d="M 580 65 L 710 55 L 855 75 L 925 115 L 895 195 L 845 255 L 775 280 L 705 270 L 655 245 L 605 205 L 575 155 Z" />
                <path d="M 790 360 L 885 355 L 910 415 L 865 445 L 795 430 Z" />
              </g>

              {/* AGLOMERADOS DE LUZES NOTURNAS DOURADAS (Igual à arte de referência) */}
              <g filter="url(#goldGlow)">
                {/* Califórnia / Costa Oeste EUA */}
                <circle cx="145" cy="185" r="22" fill="url(#cityCluster)" />
                <circle cx="145" cy="185" r="2.5" fill="#FEF08A" />
                {/* Costa Leste EUA */}
                <circle cx="235" cy="165" r="26" fill="url(#cityCluster)" />
                <circle cx="235" cy="165" r="2.5" fill="#FEF08A" />
                {/* América do Sul (São Paulo / Rio / Buenos Aires) */}
                <circle cx="285" cy="365" r="22" fill="url(#cityCluster)" />
                <circle cx="285" cy="365" r="2.5" fill="#FEF08A" />
                {/* Europa Ocidental (Londres / Paris / Waterloo) */}
                <circle cx="465" cy="135" r="35" fill="url(#cityCluster)" />
                <circle cx="455" cy="125" r="3" fill="#FEF08A" />
                <circle cx="480" cy="145" r="3" fill="#FEF08A" />
                {/* Itália / Roma / Mediterrâneo */}
                <circle cx="525" cy="175" r="28" fill="url(#cityCluster)" />
                <circle cx="525" cy="175" r="3" fill="#FEF08A" />
                {/* Egito / Alexandria / Nilo */}
                <circle cx="565" cy="225" r="24" fill="url(#cityCluster)" />
                <circle cx="565" cy="225" r="2.5" fill="#FEF08A" />
                {/* África do Sul */}
                <circle cx="535" cy="405" r="22" fill="url(#cityCluster)" />
                <circle cx="535" cy="405" r="2.5" fill="#FEF08A" />
                {/* Índia e Ásia Oriental */}
                <circle cx="715" cy="235" r="25" fill="url(#cityCluster)" />
                <circle cx="835" cy="185" r="30" fill="url(#cityCluster)" />
                <circle cx="835" cy="185" r="2.5" fill="#FEF08A" />
              </g>

              {/* Horizonte Curvo Atmosférico na Base */}
              <path
                d="M -50 515 Q 500 465 1050 515"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                opacity="0.35"
              />
            </svg>

            {/* Camada SVG de Linhas Curvas Douradas Conectando as Coordenadas dos Cards */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {connectionArcs.map((arc, i) => {
                const p1 = getNodeCoords(arc.from);
                const p2 = getNodeCoords(arc.to);
                const midX = (p1.x + p2.x) / 2;
                const midY = Math.min(p1.y, p2.y) - 10;
                const isSelected = selectedCase.id === arc.from || selectedCase.id === arc.to;

                return (
                  <path
                    key={i}
                    d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={isSelected ? '#F59E0B' : '#D4AF37'}
                    strokeWidth={isSelected ? '0.45' : '0.28'}
                    strokeDasharray={isSelected ? '1.5, 0.8' : '1, 1'}
                    opacity={isSelected ? 0.95 : 0.45}
                  />
                );
              })}
            </svg>

            {/* Rosa dos Ventos no Canto Inferior Esquerdo */}
            <div className="absolute bottom-16 left-4 text-amber-500/30 pointer-events-none hidden sm:flex items-center gap-2">
              <Compass className="w-14 h-14 stroke-[1.2]" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/50 leading-tight">
                Conectando o Passado<br />em Busca do Padrão
              </div>
            </div>

            {/* Nós Interativos Espalhados (Sem Sobreposição!) */}
            <div className="relative z-10 w-full h-[350px] sm:h-[410px]">
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
                    {/* Halo dourado na base do pin */}
                    <div
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full blur-[2px] transition-all ${
                        isSelected
                          ? 'bg-amber-400 opacity-90 scale-125'
                          : isAvailable
                          ? 'bg-amber-500/60 opacity-70'
                          : 'bg-slate-600/40 opacity-40'
                      }`}
                    />

                    <div
                      className={`relative flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#09111E]/95 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.65)] scale-110 z-30'
                          : isAvailable
                          ? 'bg-[#09111E]/90 border border-amber-500/45 hover:border-amber-400 hover:scale-105 z-20 shadow-lg'
                          : 'bg-[#09111E]/80 border border-slate-700/70 opacity-75 hover:opacity-100 z-10'
                      }`}
                    >
                      {/* Retrato do Personagem */}
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900">
                        <img
                          src={node.image}
                          alt={node.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Nome e Data com Fonte Maior */}
                      <div className="leading-tight text-left">
                        <div className="text-xs sm:text-sm font-sans font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1 whitespace-nowrap">
                          <span>{node.name}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : isQuarantine ? (
                            <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />
                          ) : null}
                        </div>
                        <div className="text-[11px] sm:text-xs font-mono text-amber-400 font-semibold">
                          {node.year}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. RÉGUA CRONOLÓGICA INFERIOR EM ORDEM HISTÓRICA ESTRITA */}
            <div className="relative z-20 pt-3 border-t border-amber-500/25 bg-[#060A12]/80 backdrop-blur-sm -mx-3 sm:-mx-5 -mb-3 sm:-mb-5 px-4 py-3">
              {/* Linha dourada contínua de fundo */}
              <div className="hidden md:block absolute top-[22px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-amber-500/20 via-amber-400/60 to-amber-500/20 pointer-events-none" />

              <div className="relative flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
                {allNodes.map(n => {
                  const isSelected = selectedCase.id === n.id;
                  const isCompleted = state.completedNodes.includes(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => setSelectedCaseId(n.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-white/5'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                            : isSelected
                            ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                            : 'bg-slate-500'
                        }`}
                      />
                      <span className="text-xs font-mono font-semibold whitespace-nowrap">
                        {n.timelineLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 4. BARRA DE ESTATÍSTICAS REAIS DO LEITOR COM FONTE AMPLIADA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0B1320] border border-amber-500/25 flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-mono text-slate-300">Sua Jornada (Volume I):</span>
                <div className="text-white font-bold text-sm sm:text-base mt-0.5">
                  {stats.analyzedCount} de {stats.totalVolumeOne} Dossiês Concluídos
                </div>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-mono font-bold text-lg sm:text-xl">
                  {stats.completionPercentage}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1320] border border-amber-500/25 flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-mono text-slate-300">Hipóteses Formuladas:</span>
                <div className="text-white font-bold text-sm sm:text-base mt-0.5">
                  {stats.hypothesesCount} teses gravadas no compêndio
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                Ativo
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
