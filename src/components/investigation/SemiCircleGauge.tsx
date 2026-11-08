import React from 'react';

interface SemiCircleGaugeProps {
  label: string;
  value: number; // 0 a 100
  color: 'orange' | 'cyan' | 'purple' | string;
  subtitle?: string;
}

export const SemiCircleGauge: React.FC<SemiCircleGaugeProps> = ({
  label,
  value,
  color,
  subtitle,
}) => {
  const colorMap: Record<string, { stroke: string; glow: string; text: string }> = {
    orange: {
      stroke: '#F97316',
      glow: 'rgba(249,115,22,0.4)',
      text: 'text-orange-400',
    },
    cyan: {
      stroke: '#06B6D4',
      glow: 'rgba(6,182,212,0.4)',
      text: 'text-cyan-400',
    },
    purple: {
      stroke: '#A855F7',
      glow: 'rgba(168,85,247,0.4)',
      text: 'text-purple-400',
    },
  };

  const currentTheme = colorMap[color] || colorMap.orange;
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 40;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#070B14]/75 border border-slate-800/90 text-center">
      <div className="relative w-28 h-16 sm:w-32 sm:h-20 flex items-end justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 55">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
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
              transition: 'stroke-dashoffset 0.8s ease-in-out',
            }}
          />
        </svg>

        <div className="absolute bottom-0 text-center leading-none">
          <span className={`font-mono text-base sm:text-lg font-bold ${currentTheme.text}`}>
            {safeValue}%
          </span>
        </div>
      </div>

      <span className="text-xs sm:text-sm font-mono text-slate-200 mt-2 font-bold uppercase tracking-wider">
        {label}
      </span>
      {subtitle && (
        <span className="text-[11px] font-sans text-slate-400 mt-0.5 leading-snug">
          {subtitle}
        </span>
      )}
    </div>
  );
};
