import React from 'react';

interface DecisionTriangleProps {
  analitico: number;
  estrategico: number;
  humanista: number;
}

export const DecisionTriangleSvg: React.FC<DecisionTriangleProps> = ({
  analitico,
  estrategico,
  humanista
}) => {
  // Centro do triângulo em (50, 50)
  // Vértice 1 (Analítico / Topo): (50, 15)
  // Vértice 2 (Estratégico / Inferior Esquerdo): (18, 80)
  // Vértice 3 (Humanista / Inferior Direito): (82, 80)

  const cx = 50;
  const cy = 55;

  // Normalização de 0 a 100 para o deslocamento a partir do centro
  const factorA = (analitico / 100);
  const factorE = (estrategico / 100);
  const factorH = (humanista / 100);

  const ptA = { x: cx, y: cy - 40 * factorA };
  const ptE = { x: cx - 35 * factorE, y: cy + 25 * factorE };
  const ptH = { x: cx + 35 * factorH, y: cy + 25 * factorH };

  return (
    <div className="relative w-full h-56 sm:h-64 flex items-center justify-center">
      <svg className="w-full h-full max-w-[260px]" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        {/* Triângulo de referência (fundo guia) */}
        <polygon
          points="50,15 15,80 85,80"
          fill="none"
          stroke="#475569"
          strokeWidth="0.5"
          strokeDasharray="1.5, 1.5"
          opacity="0.5"
        />

        {/* Linhas radiais do centro aos vértices guias */}
        <line x1={cx} y1={cy} x2={50} y2={15} stroke="#334155" strokeWidth="0.5" />
        <line x1={cx} y1={cy} x2={15} y2={80} stroke="#334155" strokeWidth="0.5" />
        <line x1={cx} y1={cy} x2={85} y2={80} stroke="#334155" strokeWidth="0.5" />

        {/* Triângulo dinâmico de perfil preenchido */}
        <polygon
          points={`${ptA.x},${ptA.y} ${ptE.x},${ptE.y} ${ptH.x},${ptH.y}`}
          fill="url(#goldGradient)"
          stroke="#F59E0B"
          strokeWidth="1.5"
          className="transition-all duration-700 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
        />

        {/* Pontos nos vértices dinâmicos */}
        <circle cx={ptA.x} cy={ptA.y} r="2" fill="#FDE68A" />
        <circle cx={ptE.x} cy={ptE.y} r="2" fill="#FDE68A" />
        <circle cx={ptH.x} cy={ptH.y} r="2" fill="#FDE68A" />

        {/* Rótulos dos vértices */}
        <text x="50" y="9" textAnchor="middle" fill="#F59E0B" fontSize="3.8" fontFamily="monospace" fontWeight="bold">
          Analítico {analitico}%
        </text>
        <text x="14" y="90" textAnchor="middle" fill="#CBD5E1" fontSize="3.8" fontFamily="monospace">
          Estratégico {estrategico}%
        </text>
        <text x="86" y="90" textAnchor="middle" fill="#CBD5E1" fontSize="3.8" fontFamily="monospace">
          Humanista {humanista}%
        </text>
      </svg>
    </div>
  );
};
