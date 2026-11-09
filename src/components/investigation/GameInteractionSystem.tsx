import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Sparkles, Stamp, X, Compass, Eye, Link2, FileText, Scale, Award } from 'lucide-react';
import { soundEngine } from '../../utils/investigationAudio';

// ============================================================================
// 1. InteractionAudio Facade (Reutilizável em qualquer componente)
// ============================================================================
export const InteractionAudio = {
  primaryPress: () => soundEngine.playBrassPress(),
  secondaryClick: () => soundEngine.playMechanicalClick(),
  paperHandle: () => soundEngine.playPaperRustle(),
  cardFlip: () => soundEngine.playCardFlip(),
  typewriter: () => soundEngine.playTypewriterClick(),
  counterTick: () => soundEngine.playCounterTick(),
  stampSeal: () => soundEngine.playWaxStamp(),
  contradiction: () => soundEngine.playContradictionAlert(),
  discovery: () => soundEngine.playDiscoveryReveal(),
  errorPulse: () => soundEngine.playErrorPulse(),
  stageShift: () => soundEngine.playStageTransition(),
  stageMotif: (step: 1 | 2 | 3 | 4 | 5) => soundEngine.playStageIntroMotif(step),
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

// ============================================================================
// 10. TypewriterText — Entrada Progressiva de Texto com Estilo Telex / Terminal
// ============================================================================
export interface TypewriterTextProps {
  text: string;
  speedMs?: number;
  delayMs?: number;
  cursor?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  playSound?: boolean;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speedMs = 18,
  delayMs = 35,
  cursor = true,
  className = '',
  as: Tag = 'span',
  playSound = false,
  onComplete,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(() => {
    if (typeof window !== 'undefined' && soundEngine.getSettings().reduceMotion) {
      return text.length;
    }
    return 0;
  });
  const [isDone, setIsDone] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && soundEngine.getSettings().reduceMotion) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (soundEngine.getSettings().reduceMotion) {
      setDisplayedLength(text.length);
      setIsDone(true);
      onComplete?.();
      return;
    }

    setDisplayedLength(0);
    setIsDone(false);

    let current = 0;
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        current += 1;
        setDisplayedLength(current);
        if (playSound && current % 3 === 0) {
          InteractionAudio.typewriter();
        }
        if (current >= text.length) {
          clearInterval(intervalId);
          setIsDone(true);
          onComplete?.();
        }
      }, speedMs);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, speedMs, delayMs, playSound]);

  const handleClick = () => {
    if (!isDone) {
      setDisplayedLength(text.length);
      setIsDone(true);
      onComplete?.();
    }
  };

  const visibleText = text.slice(0, displayedLength);

  return (
    <Tag
      onClick={handleClick}
      className={`${className} cursor-pointer`}
      title="Clique para revelar o texto completo"
    >
      {visibleText}
      {!isDone && cursor && (
        <span className="inline-block w-1.5 h-4 ml-0.5 bg-amber-400 animate-pulse align-middle" />
      )}
    </Tag>
  );
};

// ============================================================================
// 11. AnimatedCounter — Contagem Progressiva Lenta e Perceptível (1.5s a 2.5s)
// ============================================================================
export interface AnimatedCounterProps {
  targetValue: number;
  startValue?: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  playSound?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  startValue = 0,
  durationMs = 1800,
  prefix = '',
  suffix = '',
  className = '',
  playSound = true,
}) => {
  const [current, setCurrent] = useState<number>(startValue);

  useEffect(() => {
    if (soundEngine.getSettings().reduceMotion) {
      setCurrent(targetValue);
      return;
    }

    let startTimestamp: number | null = null;
    let frameId: number;
    let lastSoundValue = startValue;

    const step = (now: number) => {
      if (!startTimestamp) startTimestamp = now;
      const elapsed = now - startTimestamp;
      const progress = Math.min(1, elapsed / durationMs);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startValue + (targetValue - startValue) * easeProgress);

      setCurrent(nextVal);

      if (playSound && nextVal !== lastSoundValue && Math.abs(nextVal - lastSoundValue) >= 1) {
        lastSoundValue = nextVal;
        InteractionAudio.counterTick();
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, startValue, durationMs, playSound]);

  return (
    <span className={className}>
      {prefix}{current}{suffix}
    </span>
  );
};

// ============================================================================
// 12. FlipClueCard — Ficha/Carta Tátil que Vira em 3D (Frente e Verso Forense)
// ============================================================================
export interface FlipClueCardProps {
  clue: {
    id: string;
    title: string;
    excerpt: string;
    analysisNote?: string;
    isContradiction?: boolean;
    xpReward?: number;
  };
  docCode?: string;
  docTitle?: string;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const FlipClueCard: React.FC<FlipClueCardProps> = ({
  clue,
  docCode = 'DOC-01',
  docTitle = 'Arquivo Oficial',
  isSelected = false,
  isSaved = false,
  onSelect,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    InteractionAudio.cardFlip();
    setIsFlipped(f => !f);
  };

  return (
    <div
      className={`group relative [perspective:1000px] w-full min-h-[175px] select-none ${className}`}
      onClick={onSelect}
    >
      <div
        className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] rounded-2xl ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRENTE DA CARTA */}
        <div
          className={`[backface-visibility:hidden] w-full h-full p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.9)] cursor-pointer ${
            isSelected
              ? 'bg-[#0D1628]/98 border-amber-300 ring-2 ring-amber-400/50 shadow-[0_0_28px_rgba(251,191,36,0.5)]'
              : isSaved
              ? 'bg-[#061814]/95 border-emerald-400/60'
              : 'bg-[#070B14]/95 border-amber-500/40 hover:border-amber-300 hover:bg-[#0A101D]/98'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-[11px] font-mono font-extrabold text-amber-300 uppercase">
                  {docCode}
                </span>
                {clue.isContradiction && (
                  <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                    Contradição
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleFlip}
                className="text-xs font-mono text-cyan-300 hover:text-amber-300 flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-amber-400/40 cursor-pointer transition-colors"
                title="Virar para examinar verso confidencial"
              >
                <span>↻ Examinar Verso</span>
              </button>
            </div>

            <h4 className="font-sans text-base sm:text-lg font-bold text-white leading-snug drop-shadow">
              {clue.title}
            </h4>

            <p className="text-xs sm:text-sm font-sans text-slate-200 line-clamp-3 leading-relaxed border-l-2 border-amber-400/70 pl-2.5 py-0.5">
              "{clue.excerpt}"
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className={isSelected ? 'text-amber-300 font-bold' : isSaved ? 'text-emerald-300' : 'text-slate-400'}>
              {isSelected ? '✓ SELECIONADO NA MESA' : isSaved ? '✓ PISTA ARQUIVADA' : 'Clique p/ selecionar'}
            </span>
            {clue.xpReward && (
              <span className="text-amber-300 font-bold">+{clue.xpReward} XP</span>
            )}
          </div>
        </div>

        {/* VERSO DA CARTA (TRANSCRIÇÃO E ANÁLISE FORENSE) */}
        <div
          className="[backface-visibility:hidden] [transform:rotateY(180deg)] absolute inset-0 w-full h-full p-4 sm:p-5 rounded-2xl border border-amber-400/60 bg-gradient-to-b from-[#0F172A] to-[#070B14] text-slate-100 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-amber-400/30 pb-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>CHANCELA FORENSE // VERSO CONFIDENCIAL</span>
              </div>
              <button
                type="button"
                onClick={handleFlip}
                className="text-xs font-mono text-amber-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-400/40 cursor-pointer transition-colors"
              >
                <span>↺ Ver Frente</span>
              </button>
            </div>

            <div className="text-xs font-mono text-cyan-300">
              Origem Documental: <strong>{docTitle}</strong>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed max-h-24 overflow-y-auto">
              <strong className="text-amber-200 block text-xs font-mono uppercase mb-0.5">Nota de Análise:</strong>
              {clue.analysisNote || clue.excerpt}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>REGISTRO ORIGINAL HOMOLOGADO</span>
            <span className="text-emerald-400 font-bold">GRAU A+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 13. HistoricalCharacterPortrait — Presença Visual do Personagem nas 5 Etapas
// ============================================================================
export interface HistoricalCharacterPortraitProps {
  image: string;
  name: string;
  year: string;
  role?: string;
  variant: 'archive-plaque' | 'tactical-cameo' | 'pericial-file' | 'dramatic-bust' | 'audit-seal';
  className?: string;
}

export const HistoricalCharacterPortrait: React.FC<HistoricalCharacterPortraitProps> = ({
  image,
  name,
  year,
  role,
  variant,
  className = '',
}) => {
  if (variant === 'archive-plaque') {
    return (
      <div
        className={`relative w-20 sm:w-24 shrink-0 rounded-2xl bg-gradient-to-b from-[#1E160A] via-[#100D06] to-[#0A0703] border-2 border-amber-500/60 p-1.5 sm:p-2 shadow-[0_10px_25px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.2)] select-none ${className}`}
      >
        <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#523e12] border border-[#2b200b]" />
        <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#523e12] border border-[#2b200b]" />
        <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-[#523e12] border border-[#2b200b]" />
        <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#523e12] border border-[#2b200b]" />

        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden border border-amber-400/50 shadow-inner bg-slate-950">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top filter contrast-105 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-amber-900/10 pointer-events-none" />
          <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/80 border border-amber-400/40 text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider">
            DOSSIÊ
          </div>
        </div>

        <div className="mt-1 text-center px-0.5">
          <div className="font-serif font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-[#EAD29C] drop-shadow leading-tight truncate">
            {name}
          </div>
          <div className="font-mono text-[9px] text-cyan-300 uppercase tracking-widest truncate mt-0.5">
            {year}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'tactical-cameo') {
    return (
      <div
        className={`flex items-center gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-[#070B14]/95 border border-amber-500/50 shadow-[0_8px_25px_rgba(0,0,0,0.9)] select-none shrink-0 ${className}`}
      >
        <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 border-amber-400/70 shadow-[0_0_16px_rgba(212,175,55,0.35)] shrink-0 bg-slate-950">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
        <div className="min-w-0 pr-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            ALVO DA OPERAÇÃO
          </div>
          <div className="font-sans font-bold text-xs sm:text-sm text-white truncate">
            {name}
          </div>
          <div className="text-[11px] font-mono text-cyan-300 truncate">
            {year}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'pericial-file') {
    return (
      <div
        className={`p-2 rounded-xl bg-[#070B14]/95 border border-amber-400/50 shadow-xl flex items-center gap-2.5 select-none shrink-0 ${className}`}
      >
        <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden border border-amber-400/70 shadow-md shrink-0 bg-slate-950">
          <img src={image} alt={name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="min-w-0 pr-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            FIGURA CENTRAL
          </div>
          <div className="font-sans font-bold text-xs sm:text-sm text-white truncate">
            {name}
          </div>
          <div className="text-[11px] font-mono text-slate-300 truncate">
            {year}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dramatic-bust') {
    return (
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-[0_10px_25px_rgba(0,0,0,0.95)] bg-slate-950 select-none ${className}`}
      >
        <img src={image} alt={name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-1 left-0.5 right-0.5 px-1 py-0.5 rounded bg-black/75 text-[9px] font-mono text-amber-300 font-bold uppercase text-center truncate">
          {name.split(' ')[0]}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3.5 p-3 rounded-2xl bg-[#090D18]/90 border border-amber-400/60 shadow-xl select-none ${className}`}
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-amber-400/70 shadow-md shrink-0 bg-slate-950">
        <img src={image} alt={name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
          AUDITORIA HISTÓRICA CONCLUÍDA
        </div>
        <div className="font-sans font-bold text-sm sm:text-base text-white">
          {name}
        </div>
        <div className="text-xs font-mono text-amber-300">
          Era: {year}
        </div>
      </div>
    </div>
  );
};
