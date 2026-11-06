import React from 'react';

interface SemiCircleGaugeProps {
  label: string;
  value: number; // 0 a 100
  color: 'orange' | 'cyan' | 'purple';
}

export const SemiCircleGauge: React.FC<SemiCircleGaugeProps> = ({ label, value, color }) => {
  // Configuração das cores neon
  const colorMap = {
    orange: {
      stroke: '#F97316',
      glow: 'rgba(249,115,22,0.4)',
      text: 'text-orange-400'
    },
    cyan: {
      stroke: '#06B6D4',
      glow: 'rgba(6,182,212,0.4)',
      text: 'text-cyan-400'
    },
    purple: {
      stroke: '#A855F7',
      glow: 'rgba(168,85,247,0.4)',
      text: 'text-purple-400'
    }
  };

  const currentTheme = colorMap[color];
  const radius = 40;
  const circumference = Math.PI * radius; // Apenas semicírculo
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative w-28 h-16 sm:w-32 sm:h-20 flex items-end justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 55">
          {/* Arco de fundo cinza */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Arco colorido de valor */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={currentTheme.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${currentTheme.glow})`,
              transition: 'stroke-dashoffset 0.8s ease-in-out'
            }}
          />
        </svg>

        {/* Valor centralizado */}
        <div className="absolute bottom-0 text-center leading-none">
          <span className={`font-mono text-base sm:text-lg font-bold ${currentTheme.text}`}>
            {value}%
          </span>
        </div>
      </div>

      <span className="text-xs sm:text-sm font-mono text-slate-300 mt-2 font-medium">
        {label}
      </span>
    </div>
  );
};
