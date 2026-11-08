import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EraFilter } from '../../types/investigation';
import { CaseDrawer } from './CaseDrawer';
import { Check, Lock, Sparkles, Compass, Globe2 } from 'lucide-react';

export const WorldMapView: React.FC = () => {
  const {
    state,
    filteredNodes,
    allNodes,
    selectCase,
    setEraFilter,
    areCaseConnectionsUnlocked,
    stats,
  } = useInvestigation();

  const eras: { key: EraFilter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'antiguidade', label: 'Antiguidade' },
    { key: 'idade_media', label: 'Idade Média' },
    { key: 'moderna', label: 'Moderna' },
    { key: 'contemporanea', label: 'Contemporânea' },
  ];

  // Ordem estritamente cronológica
  const chronologicalOrder = ['cesar', 'cleopatra', 'joana', 'napoleao', 'turing', 'mandela', 'jobs'];
  const orderedAllNodes = [...allNodes].sort(
    (a, b) => chronologicalOrder.indexOf(a.id) - chronologicalOrder.indexOf(b.id)
  );

  const selectedNode = allNodes.find(n => n.id === state.selectedCaseId) || allNodes[0];

  // Conexões históricas visíveis APENAS se o jogador já descobriu/validou as conexões na investigação!
  const visibleConnections: { from: string; to: string; isRelatedToSelected: boolean }[] = [];
  filteredNodes.forEach(node => {
    if (node.status === 'quarentena') return;
    // Só revela os elos deste nó se o jogador já desbloqueou as conexões dele
    if (!areCaseConnectionsUnlocked(node.id)) return;

    node.connectedTo.forEach(targetId => {
      const targetNode = filteredNodes.find(n => n.id === targetId);
      if (!targetNode || targetNode.status === 'quarentena') return;
      const exists = visibleConnections.some(
        c => (c.from === node.id && c.to === targetId) || (c.from === targetId && c.to === node.id)
      );
      if (!exists) {
        const isRelatedToSelected =
          node.id === state.selectedCaseId || targetId === state.selectedCaseId;
        visibleConnections.push({ from: node.id, to: targetId, isRelatedToSelected });
      }
    });
  });

  return (
    <div className="flex-1 flex flex-col justify-between gap-2.5 lg:h-full lg:min-h-0">
      
      {/* 1. BARRA TÁTICA COMPACTA DE COMANDO DO MAPA-MÚNDI (MODO JOGO FULL-SCREEN) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#09101D]/90 border border-amber-500/25 shrink-0">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            <Globe2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>MAPA DE OPERAÇÕES //</span>
          </div>
          <h2 className="font-sans text-sm sm:text-base font-bold tracking-wide uppercase text-white truncate">
            CONECTE O PASSADO. DESCUBRA O <span className="text-amber-400">PADRÃO.</span>
          </h2>
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-slate-300 border-l border-slate-700 pl-3">
            <span>
              Missões: <strong className="text-amber-300">{stats.completedCount}/{stats.totalVol1}</strong>
            </span>
            <span>•</span>
            <span>
              Pistas: <strong className="text-emerald-300">{stats.totalCluesExtracted}</strong>
            </span>
            <span>•</span>
            <span>
              Mérito: <strong className="text-cyan-300">{state.totalXp} XP</strong>
            </span>
          </div>
        </div>

        {/* Pílulas de Filtro de Época */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {eras.map((era) => {
            const active = state.eraFilter === era.key;
            return (
              <button
                key={era.key}
                onClick={() => setEraFilter(era.key)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.25)] font-semibold'
                    : 'bg-[#0B1320]/80 text-slate-400 border-slate-700/60 hover:border-amber-500/40 hover:text-slate-200'
                }`}
              >
                {era.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GRID PRINCIPAL FULL-HEIGHT: MAPA INTERATIVO (8 COLUNAS) + PAINEL LATERAL (4 COLUNAS) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch lg:min-h-0">
        
        {/* COLUNA CENTRAL: CONTAINER DO MAPA-MÚNDI + RÉGUA CRONOLÓGICA INTEGRADA */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#060A12] via-[#090E17] to-[#04060B] border border-amber-500/35 shadow-[0_0_35px_rgba(0,0,0,0.85)] overflow-hidden lg:h-full lg:min-h-0">
          
          {/* CANVAS GEOGRÁFICO EXPANSÍVEL */}
          <div className="relative w-full h-[380px] sm:h-[460px] lg:h-auto lg:flex-1 overflow-hidden select-none min-h-0">
            
            {/* Efeito Sutil de Radar / Pontos Estelares */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 42%, rgba(212, 175, 55, 0.07) 0%, rgba(6, 182, 212, 0.04) 45%, rgba(4, 6, 11, 0.85) 100%)',
              }}
            />

            {/* Mapa-Múndi Cartográfico Reconhecível ao Fundo */}
            <img
              src="/dossiers/world_map_bg.webp"
              alt="Mapa Mundial de Investigação"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-85 pointer-events-none mix-blend-lighten"
            />

            {/* Vinheta Suave nas Bordas */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 55%, #050811 100%)',
              }}
            />

            {/* CAMADA SVG: ARCOS DESCOBERTOS + INDÍCIOS DE RESSONÂNCIA + LINHAS-GUIA + PINOS REAIS */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldArcActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#FDE68A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="goldArcIdle" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* 1. Arcos Curvos Conectando apenas os Nós cujas Conexões já foram Descobertas pelo Jogador */}
              {visibleConnections.map((conn, idx) => {
                const fromNode = allNodes.find(n => n.id === conn.from);
                const toNode = allNodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const p1 = fromNode.geoCoords || fromNode.coords;
                const p2 = toNode.geoCoords || toNode.coords;

                const midX = (p1.x + p2.x) / 2;
                const midY = Math.min(p1.y, p2.y) - 10;

                return (
                  <g key={idx}>
                    {conn.isRelatedToSelected && (
                      <path
                        d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="0.9"
                        opacity="0.28"
                      />
                    )}
                    <path
                      d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                      fill="none"
                      stroke={conn.isRelatedToSelected ? 'url(#goldArcActive)' : 'url(#goldArcIdle)'}
                      strokeWidth={conn.isRelatedToSelected ? '0.45' : '0.28'}
                      strokeDasharray={conn.isRelatedToSelected ? 'none' : '1.2, 1.2'}
                    />
                  </g>
                );
              })}

              {/* 2. Linhas-Guia (Leader Lines) e Pinos Luminosos na Localização Geográfica Exata */}
              {filteredNodes.map((node) => {
                const geo = node.geoCoords || node.coords;
                const card = node.coords;
                const isSelected = state.selectedCaseId === node.id;
                const isQuarantine = node.status === 'quarentena';
                const hasOffset = Math.hypot(card.x - geo.x, card.y - geo.y) > 2;

                return (
                  <g key={`pin-${node.id}`}>
                    {/* Indício sutil de onda/radar no pino selecionado quando conexões ainda estão ocultas */}
                    {isSelected && !isQuarantine && !areCaseConnectionsUnlocked(node.id) && (
                      <circle
                        cx={geo.x}
                        cy={geo.y}
                        r="3.2"
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="0.2"
                        strokeDasharray="0.6, 0.6"
                        opacity="0.6"
                      />
                    )}

                    {/* Linha-guia conectando o ponto geográfico real ao cartão deslocado */}
                    {hasOffset && (
                      <line
                        x1={geo.x}
                        y1={geo.y}
                        x2={card.x}
                        y2={card.y}
                        stroke={isSelected ? '#F59E0B' : isQuarantine ? '#64748B' : '#D4AF37'}
                        strokeWidth={isSelected ? '0.35' : '0.22'}
                        strokeDasharray={isSelected ? 'none' : '0.8, 0.8'}
                        opacity={isSelected ? '0.95' : '0.55'}
                      />
                    )}

                    {/* Halo e Pino Geográfico Exato sobre o Continente */}
                    {!isQuarantine && (
                      <circle
                        cx={geo.x}
                        cy={geo.y}
                        r={isSelected ? '1.6' : '1.0'}
                        fill={isSelected ? '#F59E0B' : '#D4AF37'}
                        opacity={isSelected ? '0.45' : '0.25'}
                      />
                    )}
                    <circle
                      cx={geo.x}
                      cy={geo.y}
                      r={isSelected ? '0.75' : '0.5'}
                      fill={isSelected ? '#FDE68A' : isQuarantine ? '#64748B' : '#F59E0B'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Rosa dos Ventos Decorativa no Canto Inferior Esquerdo */}
            <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2.5 opacity-65 pointer-events-none">
              <Compass className="w-8 h-8 text-amber-500/70 stroke-[1.2]" />
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200/80 leading-tight">
                <div>CONECTANDO O PASSADO AO PRESENTE</div>
                <div className="text-amber-400/70">
                  {visibleConnections.length > 0
                    ? `${visibleConnections.length} ELOS HISTÓRICOS REVELADOS`
                    : 'ELOS OCULTOS — INVESTIGUE OS CASOS PARA REVELAR'}
                </div>
              </div>
            </div>

            {/* CARDS INTERATIVOS DOS 7 NÓS HISTÓRICOS */}
            {filteredNodes.map((node) => {
              const isSelected = state.selectedCaseId === node.id;
              const isCompleted = state.completedNodes.includes(node.id);
              const isQuarantine = node.status === 'quarentena';
              const isUnlockedPeer =
                !isQuarantine &&
                areCaseConnectionsUnlocked(selectedNode.id) &&
                (selectedNode.connectedTo.includes(node.id) ||
                  node.connectedTo.includes(selectedNode.id));

              const dimClass = isSelected
                ? 'z-30 scale-105 opacity-100'
                : isUnlockedPeer
                ? 'z-20 opacity-95 hover:opacity-100 hover:scale-105'
                : 'z-10 opacity-70 hover:opacity-100 hover:scale-105';

              return (
                <div
                  key={node.id}
                  onClick={() => selectCase(node.id)}
                  style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group ${dimClass}`}
                >
                  {isSelected && (
                    <div className="absolute -inset-1 rounded-xl bg-amber-400/20 blur-md animate-pulse pointer-events-none" />
                  )}

                  <div
                    className={`relative flex items-center gap-2 p-1.5 pr-2.5 rounded-xl backdrop-blur-md border transition-all min-w-[128px] sm:min-w-[146px] ${
                      isSelected
                        ? 'bg-[#0B1320]/95 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.45)]'
                        : isCompleted
                        ? 'bg-[#0B1320]/90 border-emerald-500/50 hover:border-emerald-400'
                        : isQuarantine
                        ? 'bg-[#060A12]/85 border-slate-700/70 hover:border-slate-500'
                        : 'bg-[#0B1320]/90 border-amber-500/40 hover:border-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                    }`}
                  >
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-amber-500/30 shrink-0 bg-slate-900">
                      <img
                        src={node.image}
                        alt={node.name}
                        className={`w-full h-full object-cover ${isQuarantine ? 'grayscale opacity-65' : ''}`}
                      />
                    </div>

                    <div className="text-left leading-tight flex-1 min-w-0">
                      <div className="font-sans text-[11px] sm:text-xs font-bold text-slate-100 truncate">
                        {node.name}
                      </div>
                      <div className="font-mono text-[10px] text-amber-400/90 mt-0.5">
                        {node.year}
                      </div>
                    </div>

                    <div className="ml-0.5 shrink-0">
                      {isCompleted ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        </span>
                      ) : isQuarantine ? (
                        <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
                          <Lock className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                          <Sparkles className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RÉGUA CRONOLÓGICA INFERIOR INTEGRADA AO MAPA */}
          <div className="bg-[#060A12]/95 border-t border-amber-500/25 px-3 sm:px-5 py-3">
            <div className="relative">
              <div className="hidden lg:block absolute top-2.5 left-6 right-6 h-[1px] bg-gradient-to-r from-amber-500/20 via-amber-400/50 to-amber-500/20 pointer-events-none" />

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2 relative z-10">
                {orderedAllNodes.map((node) => {
                  const active = state.selectedCaseId === node.id;
                  const completed = state.completedNodes.includes(node.id);
                  const isQuarantine = node.status === 'quarentena';

                  return (
                    <button
                      key={node.id}
                      onClick={() => selectCase(node.id)}
                      className={`group flex flex-col items-center justify-center py-1.5 px-2 rounded-lg border transition-all cursor-pointer text-center ${
                        active
                          ? 'bg-amber-500/15 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-[#0B1320]/60 lg:bg-transparent border-slate-800/80 lg:border-transparent hover:border-amber-500/30 hover:bg-amber-500/5'
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all mb-1 ${
                          active
                            ? 'bg-amber-400 scale-125 shadow-[0_0_8px_#f59e0b]'
                            : completed
                            ? 'bg-emerald-400'
                            : isQuarantine
                            ? 'bg-slate-600 group-hover:bg-slate-400'
                            : 'bg-amber-500/60 group-hover:bg-amber-300'
                        }`}
                      />
                      <span
                        className={`font-mono text-[10px] sm:text-[11px] leading-tight transition-colors ${
                          active
                            ? 'text-amber-300 font-bold'
                            : completed
                            ? 'text-emerald-300 font-medium'
                            : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {node.timelineLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: PAINEL LATERAL "CASO EM DESTAQUE" (4 COLUNAS) */}
        <div className="lg:col-span-4 flex flex-col lg:h-full lg:min-h-0">
          <CaseDrawer />
        </div>

      </div>

      {/* 3. RODAPÉ DE TELEMETRIA (EXIBIDO NO MOBILE/TABLET) */}
      <div className="xl:hidden flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#0B1320]/90 border border-amber-500/20 shrink-0">
        <div className="w-full sm:w-1/2 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 uppercase tracking-wider">Progresso na Investigação (Volume I):</span>
            <span className="text-amber-400 font-bold">
              {stats.completedCount} de {stats.totalVol1} Missões Concluídas ({stats.progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.max(stats.progressPercent, 6)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pistas Extraídas: <strong className="text-white">{stats.totalCluesExtracted}</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span>Hipóteses Fundamentadas: <strong className="text-cyan-400">{stats.hypothesesCount}</strong></span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span>Mérito Investigativo: <strong className="text-amber-300">{state.totalXp} XP</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
};
