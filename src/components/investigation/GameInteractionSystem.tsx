import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Sparkles, Stamp, X, Compass, Eye, Link2, FileText, Scale, Award } from 'lucide-react';
import { soundEngine } from '../../utils/investigationAudio';

// ============================================================================
// 1. InteractionAudio Facade (Reutilizável em qualquer componente)
// ============================================================================
export const InteractionAudio = {
  primaryPress: () => soundEngine.playBrassPress(),
  secondaryClick: () => soundEngine.playMechanicalClick(),
  paperHandle: () => soundEngine.playPaperRustle(),
  stampSeal: () => soundEngine.playWaxStamp(),
  contradiction: () => soundEngine.playContradictionAlert(),
  discovery: () => soundEngine.playDiscoveryReveal(),
  errorPulse: () => soundEngine.playErrorPulse(),
  stageShift: () => soundEngine.playStageTransition(),
};

// ============================================================================
// Ícone de Lupa em Relevo Dourado Fotorrealista (image_57.png)
// ============================================================================
export const BrassMagnifierIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 sm:w-7 sm:h-7' }) => (
  <svg
    viewBox="0 0 32 32"
    className={`shrink-0 drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] ${className}`}
    fill="none"
    aria-hidden="true"
  >
    {/* Aro da lupa em relevo dourado escovado */}
    <circle cx="13" cy="13" r="8.5" stroke="url(#brassMagnifierRing)" strokeWidth="3" fill="rgba(60, 42, 9, 0.45)" />
    <circle cx="13" cy="13" r="6.8" stroke="#fffbeb" strokeWidth="0.8" opacity="0.7" />
    <circle cx="13" cy="13" r="10" stroke="#362404" strokeWidth="0.75" opacity="0.8" />
    {/* Cabo da lupa em relevo com virola */}
    <rect
      x="18.5"
      y="18.5"
      width="4.8"
      height="10.5"
      rx="1.6"
      transform="rotate(-45 18.5 18.5)"
      fill="url(#brassMagnifierHandle)"
      stroke="#2b1a01"
      strokeWidth="0.8"
    />
    <circle cx="19.2" cy="19.2" r="1.4" fill="#fef08a" opacity="0.85" />
    <defs>
      <linearGradient id="brassMagnifierRing" x1="5" y1="5" x2="21" y2="21">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#d4af37" />
        <stop offset="70%" stopColor="#8a6521" />
        <stop offset="100%" stopColor="#4a3307" />
      </linearGradient>
      <linearGradient id="brassMagnifierHandle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#c59b27" />
        <stop offset="85%" stopColor="#63450c" />
        <stop offset="100%" stopColor="#362404" />
      </linearGradient>
    </defs>
  </svg>
);

// Rebite metálico circular com sombra e brilho entalhado
const BrassRivet: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4c3c13] border border-[#2b200b] shadow-[inset_0_1px_1px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.25)] pointer-events-none ${className}`}
  />
);

// ============================================================================
// 2. GameButton — Botão Fotorrealista de Latão Envelhecido e Relevo 3D (image_57.png)
// ============================================================================
export interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  soundType?: 'brass' | 'stamp' | 'discovery' | 'none';
  showMagnifier?: boolean;
  showArrow?: boolean;
  showDivider?: boolean;
  showRivets?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({
  children,
  icon,
  rightIcon,
  size = 'md',
  soundType = 'brass',
  showMagnifier = true,
  showArrow = true,
  showDivider = true,
  showRivets = true,
  className = '',
  onClick,
  disabled,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundType === 'brass') InteractionAudio.primaryPress();
    else if (soundType === 'stamp') InteractionAudio.stampSeal();
    else if (soundType === 'discovery') InteractionAudio.discovery();
    onClick?.(e);
  };

  const padY = size === 'sm' ? 'py-2 sm:py-2.5' : size === 'lg' ? 'py-3.5 sm:py-4' : 'py-2.5 sm:py-3.5';
  const textSz = size === 'sm' ? 'text-xs sm:text-sm' : size === 'lg' ? 'text-sm sm:text-lg' : 'text-sm md:text-base';

  const leftElement = icon !== undefined ? icon : showMagnifier ? <BrassMagnifierIcon /> : null;
  const rightElement =
    rightIcon !== undefined ? (
      rightIcon
    ) : showArrow ? (
      <span
        aria-hidden="true"
        className="text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] font-serif font-black text-lg sm:text-2xl shrink-0 transition-transform duration-150 group-hover/brass:translate-x-1"
      >
        ➔
      </span>
    ) : null;

  return (
    <div className={`relative inline-block select-none group/brass ${className.includes('w-full') ? 'w-full' : ''}`}>
      {/* 1. O Berço/Chassi Escuro com bordas chanfradas e sombra de profundidade */}
      <div
        className="brass-plate-chassis p-[2.5px] sm:p-[3px] bg-gradient-to-b from-[#2e1f08] via-[#1a1204] to-[#0c0802] shadow-[0_8px_24px_rgba(0,0,0,0.95)]"
        style={{
          clipPath:
            'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)',
        }}
      >
        {/* 2. O Corpo do Botão (Latão Envelhecido e Relevo 3D de 4px) */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleClick}
          className={`relative w-full flex items-center justify-between px-3 sm:px-6 ${padY}
            bg-gradient-to-r from-[#8a6521] via-[#d4af37] to-[#8a6521]
            border-t border-amber-300/40 border-l border-r border-amber-500/30
            border-b-[4px] border-b-[#523903]
            cursor-pointer select-none transition-all duration-150 ease-out
            hover:brightness-[1.12] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]
            active:translate-y-[3px] active:border-b-0 active:shadow-[0_2px_8px_rgba(0,0,0,0.9)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0
            ${className}`}
          style={{
            clipPath:
              'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
          }}
          {...rest}
        >
          {/* 3. Acabamentos e Rebites Circulares nos Cantos Chanfrados */}
          {showRivets && (
            <>
              <BrassRivet className="top-1.5 left-2 sm:top-2 sm:left-2.5" />
              <BrassRivet className="bottom-1.5 left-2 sm:bottom-2 sm:left-2.5" />
              <BrassRivet className="top-1.5 right-2 sm:top-2 sm:right-2.5" />
              <BrassRivet className="bottom-1.5 right-2 sm:bottom-2 sm:right-2.5" />
            </>
          )}

          {/* Lado Esquerdo: Ícone de Lupa em Alto-Relevo + Linha Divisória Escura */}
          <div className="flex items-center shrink-0 pl-1 sm:pl-2">
            {leftElement}
            {leftElement && showDivider && (
              <div
                aria-hidden="true"
                className="w-[1.5px] h-6 sm:h-8 bg-gradient-to-b from-transparent via-[#422e06] to-transparent shadow-[1px_0_0_rgba(255,255,255,0.35)] mx-2 sm:mx-3.5 shrink-0 pointer-events-none"
              />
            )}
          </div>

          {/* Centro: Texto com Tipografia Serifada de Baixo-Relevo Entalhado */}
          <span
            className={`flex-1 text-center font-serif font-extrabold uppercase tracking-[0.14em] text-slate-950/90 ${textSz} drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] px-2 truncate`}
          >
            {children}
          </span>

          {/* Lado Direito: Seta Dourada Brilhante com Glow */}
          <div className="flex items-center shrink-0 pr-1 sm:pr-2">
            {rightElement}
          </div>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 3. GameIconButton — Família 2: Controles Secundários em Cápsula Metálica
// ============================================================================
export interface GameIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  compact?: boolean;
}

export const GameIconButton: React.FC<GameIconButtonProps> = ({
  children,
  icon,
  active = false,
  compact = false,
  className = '',
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    InteractionAudio.secondaryClick();
    onClick?.(e);
  };

  const padClasses = compact
    ? children
      ? 'px-3 py-1 text-[11px] gap-1.5'
      : 'p-2'
    : children
    ? 'px-3.5 py-1.5 text-xs gap-1.5'
    : 'p-2.5';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`game-btn-capsule ${
        active ? 'game-btn-capsule-active font-bold' : ''
      } font-mono inline-flex items-center justify-center select-none cursor-pointer ${padClasses} ${className}`}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

// ============================================================================
// 4. EvidenceHotspot — Família 3: Elementos Interativos do Cenário
// ============================================================================
export interface EvidenceHotspotProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  verified?: boolean;
}

export const EvidenceHotspot: React.FC<EvidenceHotspotProps> = ({
  selected = false,
  verified = false,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    InteractionAudio.paperHandle();
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`game-hotspot-artifact cursor-game-inspect ${
        selected
          ? 'ring-2 ring-amber-300 shadow-[0_0_32px_rgba(251,191,36,0.45)]'
          : verified
          ? 'ring-1 ring-emerald-400/70'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

// ============================================================================
// 5. DecisionStamp — Família 4: Carimbo / Selo Físico de Autenticação
// ============================================================================
export interface DecisionStampProps {
  label?: string;
  tone?: 'gold' | 'emerald' | 'crimson';
  className?: string;
}

export const DecisionStamp: React.FC<DecisionStampProps> = ({
  label = 'AUTENTICADO',
  tone = 'gold',
  className = '',
}) => {
  const palette =
    tone === 'emerald'
      ? 'border-emerald-400/90 text-emerald-300 bg-emerald-950/75 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
      : tone === 'crimson'
      ? 'border-red-400/90 text-red-200 bg-red-950/75 shadow-[0_0_20px_rgba(248,113,113,0.3)]'
      : 'border-amber-300/95 text-amber-200 bg-amber-950/80 shadow-[0_0_22px_rgba(251,191,36,0.35)]';

  return (
    <div
      className={`game-wax-stamp inline-flex items-center gap-1.5 px-2.5 py-1 rounded border-2 border-double font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] select-none pointer-events-none ${palette} ${className}`}
    >
      <Stamp className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </div>
  );
};

// ============================================================================
// 6. DiscoveryAnimation — Pulso de Luz para Descobertas Comprovadas
// ============================================================================
export const DiscoveryAnimation: React.FC<{ active?: boolean }> = ({ active = true }) => {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-inherit z-10">
      <div className="w-48 h-48 rounded-full border-2 border-amber-300/70 game-pulse-ring" />
    </div>
  );
};

// ============================================================================
// 7. CinematicModal — 4 Arquétipos Físicos (Documento, Restrito, Confirmação, Revelação)
// ============================================================================
export type CinematicModalVariant = 'document' | 'restricted' | 'confirm' | 'revelation';

export interface CinematicModalProps {
  isOpen: boolean;
  onClose?: () => void;
  variant?: CinematicModalVariant;
  folderCode?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const CinematicModal: React.FC<CinematicModalProps> = ({
  isOpen,
  onClose,
  variant = 'confirm',
  folderCode,
  children,
  maxWidthClass,
}) => {
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass =
    maxWidthClass ||
    (variant === 'document'
      ? 'w-[95vw] max-w-[1460px] h-[90dvh]'
      : variant === 'revelation'
      ? 'w-[92vw] max-w-3xl'
      : variant === 'restricted'
      ? 'w-[92vw] max-w-lg'
      : 'w-[92vw] max-w-md');

  const frameStyle =
    variant === 'restricted'
      ? 'bg-gradient-to-b from-[#160C0E] via-[#0E090C] to-[#08060A] border-2 border-red-500/55 shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(239,68,68,0.2)]'
      : variant === 'revelation'
      ? 'bg-gradient-to-b from-[#12192B] via-[#0B1220] to-[#060A12] border-2 border-amber-400/75 shadow-[0_25px_100px_rgba(0,0,0,0.95),0_0_80px_rgba(245,158,11,0.3)] game-light-scan'
      : 'bg-gradient-to-b from-[#101829] via-[#0A101D] to-[#060A12] border border-amber-400/55 shadow-[0_25px_90px_rgba(0,0,0,0.92),0_0_55px_rgba(212,175,55,0.22)]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-immersive-modal="true"
      onClick={e => {
        if (e.target === e.currentTarget && onClose) {
          InteractionAudio.secondaryClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2.5 sm:p-5 bg-[#03050A]/78 backdrop-blur-xl select-none font-sans animate-in fade-in duration-200"
    >
      <div className={`relative rounded-2xl overflow-hidden game-modal-object ${sizeClass} ${frameStyle}`}>
        {/* Cantoneiras Metálicas Diegéticas */}
        <span className="pointer-events-none absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/60 rounded-tl-sm z-30" />
        <span className="pointer-events-none absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/60 rounded-tr-sm z-30" />
        <span className="pointer-events-none absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/60 rounded-bl-sm z-30" />
        <span className="pointer-events-none absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/60 rounded-br-sm z-30" />

        {/* Aba de Pasta Física quando houver folderCode */}
        {folderCode && (
          <div className="px-5 py-2 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300/90 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {folderCode}
            </span>
            {onClose && (
              <GameIconButton
                compact
                onClick={onClose}
                title="Fechar (Esc)"
                icon={<X className="w-3.5 h-3.5" />}
              >
                ESC
              </GameIconButton>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

// ============================================================================
// 8. SceneTransition — Transição Cinematográfica entre as 5 Etapas (680ms)
// ============================================================================
export interface SceneTransitionProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  eraLabel?: string;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  stepNumber,
  title,
  subtitle,
  eraLabel,
}) => {
  const Icon =
    stepNumber === 1
      ? Eye
      : stepNumber === 2
      ? Link2
      : stepNumber === 3
      ? FileText
      : stepNumber === 4
      ? Scale
      : stepNumber === 5
      ? Award
      : Compass;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[110] pointer-events-none bg-[#03050B]/88 backdrop-blur-lg flex items-center justify-center p-6 animate-in fade-in duration-150"
    >
      {/* Barras Cinematográficas Sutis no Topo e Base */}
      <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/90 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/90 to-transparent" />

      <div className="relative max-w-lg w-full px-7 py-6 rounded-2xl bg-gradient-to-b from-[#0E1626]/95 to-[#070B14]/95 border border-amber-400/55 shadow-[0_0_80px_rgba(245,158,11,0.22)] text-center space-y-2.5 game-modal-object">
        <div className="mx-auto w-11 h-11 rounded-full bg-amber-500/15 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.3)]">
          <Icon className="w-5 h-5" />
        </div>
        {eraLabel && (
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300 font-bold">
            {eraLabel}
          </div>
        )}
        <div className="text-sm sm:text-base font-sans font-extrabold uppercase tracking-wider text-amber-200">
          {title}
        </div>
        <div className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
          {subtitle}
        </div>
        <div className="pt-1 flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map(n => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all ${
                n === stepNumber
                  ? 'w-7 bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  : n < stepNumber
                  ? 'w-2.5 bg-emerald-400/70'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. SignatureStrokeSvg — Traço Manuscrito Animado ao Assinar Ordem de Campo
// ============================================================================
export const SignatureStrokeSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 180 38"
    fill="none"
    className={`w-32 sm:w-36 h-8 pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <path
      d="M8 28 C 22 8, 30 32, 44 18 C 55 8, 60 29, 74 20 C 88 11, 96 27, 114 16 C 128 8, 138 25, 172 14"
      stroke="#fde68a"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="game-signature-path"
    />
    <path
      d="M24 33 L 158 29"
      stroke="rgba(251, 191, 36, 0.55)"
      strokeWidth="1.1"
      strokeLinecap="round"
      className="game-signature-path"
    />
  </svg>
);

// ============================================================================
// 10. ClueFlyToken — Fragmento de Pista Migrando para o Arquivo Pessoal
// ============================================================================
export interface FlyingClueData {
  id: number;
  title: string;
  startX: number;
  startY: number;
}

export const ClueFlyToken: React.FC<{ token: FlyingClueData | null }> = ({ token }) => {
  if (!token) return null;
  const targetX = typeof window !== 'undefined' ? window.innerWidth - 140 : 800;
  const targetY = 36;
  const dx = Math.round(targetX - token.startX);
  const dy = Math.round(targetY - token.startY);

  return (
    <div
      key={token.id}
      style={
        {
          left: `${token.startX}px`,
          top: `${token.startY}px`,
          '--fly-dx': `${dx}px`,
          '--fly-dy': `${dy}px`,
        } as React.CSSProperties
      }
      className="fixed z-[160] pointer-events-none -translate-x-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-mono text-xs font-extrabold shadow-[0_0_30px_rgba(251,191,36,0.85)] border border-white flex items-center gap-2 game-clue-fly-token"
    >
      <span>📂 +PISTA ARQUIVADA:</span>
      <span className="max-w-[180px] truncate">{token.title}</span>
    </div>
  );
};

// ============================================================================
// 11. AmbientParticlesCanvas — Poeira Volumétrica Adaptativa (Leve no Mobile)
// ============================================================================
export const AmbientParticlesCanvas: React.FC<{
  tint?: 'gold' | 'cyan' | 'emerald';
  className?: string;
}> = ({ tint = 'gold', className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (soundEngine.getSettings().reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobileOrLowPower =
      window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const count = isMobileOrLowPower ? 9 : 22;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const rgb =
      tint === 'cyan'
        ? '103, 232, 249'
        : tint === 'emerald'
        ? '110, 231, 183'
        : '253, 224, 71';

    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.05,
      alpha: Math.random() * 0.38 + 0.08,
    }));

    let rafId = 0;
    const render = () => {
      if (!document.hidden) {
        ctx.clearRect(0, 0, w, h);
        for (const m of motes) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -10) m.y = h + 10;
          if (m.x < -10) m.x = w + 10;
          if (m.x > w + 10) m.x = -10;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${m.alpha})`;
          ctx.fill();
        }
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [tint]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full z-10 opacity-70 ${className}`}
    />
  );
};
