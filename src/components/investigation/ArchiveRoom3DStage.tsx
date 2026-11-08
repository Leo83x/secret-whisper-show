import React, { useState, useEffect, useRef } from 'react';
import { EvidenceDocument, HistoricalNode } from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import { getEra3DTheme } from '../../utils/era3DTheme';
import {
  Info,
  FolderOpen,
  Compass,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Layers,
  X,
} from 'lucide-react';

interface ArchiveRoom3DStageProps {
  selectedCase: HistoricalNode;
  documents: EvidenceDocument[];
  extractedClueIds: string[];
  examinedDocIds: string[];
  activeStep: 1 | 2 | 3 | 4 | 5;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onInspectDocument: (doc: EvidenceDocument) => void;
  onOpenArchiveDrawer: () => void;
  onSwitchTo2D: () => void;
  onRequestExit: () => void;
}

interface DeskHotspot {
  slotIndex: number;
  label: string;
  shortName: string;
  objectName: string;
  // Position of the interactive surface over the physical object (% of 16:9 stage)
  box: { left: number; top: number; width: number; height: number };
  // Position of the DOC-0X badge along the front edge of the table (Desktop)
  badgePos: { left: number; top: number };
  // Camera focus point when zooming in on this document
  focusOrigin: { x: number; y: number };
  // Horizontal pan offset (%) on mobile when focusing this object
  mobilePanX: number;
  skewDeg: number;
}

const DESK_HOTSPOTS: DeskHotspot[] = [
  {
    slotIndex: 0,
    label: 'DOC-01',
    shortName: 'Dossiê',
    objectName: 'Dossiê Selado com Lacre',
    box: { left: 6.5, top: 58.5, width: 23.5, height: 25.5 },
    badgePos: { left: 15.8, top: 85.5 },
    focusOrigin: { x: 18, y: 71 },
    mobilePanX: 16,
    skewDeg: -8,
  },
  {
    slotIndex: 1,
    label: 'DOC-02',
    shortName: 'Tabuleta',
    objectName: 'Tabuleta / Registro de Campo',
    box: { left: 30.2, top: 61.0, width: 25.5, height: 23.0 },
    badgePos: { left: 49.5, top: 85.5 },
    focusOrigin: { x: 43, y: 72 },
    mobilePanX: 5,
    skewDeg: -2,
  },
  {
    slotIndex: 2,
    label: 'DOC-03',
    shortName: 'Mapa',
    objectName: 'Mapa Estratégico & Rotas',
    box: { left: 52.5, top: 56.0, width: 25.0, height: 26.5 },
    badgePos: { left: 71.2, top: 85.5 },
    focusOrigin: { x: 65, y: 69 },
    mobilePanX: -6,
    skewDeg: 4,
  },
  {
    slotIndex: 3,
    label: 'DOC-04',
    shortName: 'Prancheta',
    objectName: 'Prancheta de Auditoria',
    box: { left: 76.5, top: 60.0, width: 21.5, height: 24.5 },
    badgePos: { left: 90.0, top: 85.5 },
    focusOrigin: { x: 87, y: 72 },
    mobilePanX: -16,
    skewDeg: 9,
  },
];

export const ArchiveRoom3DStage: React.FC<ArchiveRoom3DStageProps> = ({
  selectedCase,
  documents,
  extractedClueIds,
  examinedDocIds,
  activeStep,
  onSelectStep,
  onInspectDocument,
  onOpenArchiveDrawer,
  onSwitchTo2D,
  onRequestExit,
}) => {
  // 3D Camera Orbit, Pan, Tilt & Zoom State
  const [camRotX, setCamRotX] = useState<number>(0);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camPanX, setCamPanX] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.04);
  const [camOrigin, setCamOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [zoomingSlot, setZoomingSlot] = useState<number | null>(null);

  // Interactive Room Lighting & Prop Tooltips
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [propMessage, setPropMessage] = useState<string | null>(null);

  // Diegetic HUD Sub-levels
  const [briefingOpen, setBriefingOpen] = useState<boolean>(false);
  const [stepMenuOpen, setStepMenuOpen] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(() => soundEngine.getSettings().mutedAll);

  // Drag-to-orbit / touch-pan tracking
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const eraTheme = getEra3DTheme(selectedCase.id);
  const activeDeskHotspots = DESK_HOTSPOTS.map((spot, idx) => {
    const eraSpot = eraTheme.hotspotsStage1[idx];
    return eraSpot
      ? {
          ...spot,
          label: eraSpot.tag,
          shortName: eraSpot.tag,
          objectName: eraSpot.eraLabel,
          box: {
            left: parseFloat(eraSpot.left),
            top: parseFloat(eraSpot.top),
            width: parseFloat(eraSpot.width),
            height: parseFloat(eraSpot.height),
          },
          badgePos: {
            left: parseFloat(eraSpot.labelLeft),
            top: 85.5,
          },
        }
      : spot;
  });

  const totalCluesCount = documents.reduce((acc, d) => acc + d.clues.length, 0);
  const extractedCount = documents
    .flatMap(d => d.clues)
    .filter(c => extractedClueIds.includes(c.id)).length;

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  // Automatic gentle camera orbit animation when [ Orbitar Câmera ] is toggled
  useEffect(() => {
    if (!isAutoOrbiting || zoomingSlot !== null) return;
    let frameId: number;
    const startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 6.5);
      setCamRotX(Math.cos(elapsed * 0.7) * 3.0);
      setCamPanX(Math.sin(elapsed * 0.9) * 10);
      setCamScale(1.07 + Math.sin(elapsed * 0.5) * 0.03);
      frameId = requestAnimationFrame(animateOrbit);
    };

    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting, zoomingSlot]);

  // Volumetric 3D Dust Motes rendered on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.7 + 0.5,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -Math.random() * 0.25 - 0.06,
      alpha: Math.random() * 0.45 + 0.12,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!soundEngine.getSettings().reduceMotion) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < 0) p.y = canvas.height;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = bankerLampOn
            ? `rgba(251, 211, 141, ${p.alpha})`
            : `rgba(148, 163, 184, ${p.alpha * 0.5})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [bankerLampOn]);

  // Pointer drag / mouse parallax for 3D camera
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomingSlot !== null) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setCamRotY(prev => Math.max(-9, Math.min(9, prev + dx * 0.045)));
      setCamRotX(prev => Math.max(-5, Math.min(5, prev - dy * 0.035)));
      setCamPanX(prev => Math.max(-16, Math.min(16, prev + dx * 0.08)));
    } else if (!isAutoOrbiting && !soundEngine.getSettings().reduceMotion && window.innerWidth >= 768) {
      // Subtle mouse parallax on desktop
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setCamRotY(nx * 4.5);
      setCamRotX(-ny * 2.8);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (zoomingSlot !== null) return;
    setCamScale(prev => {
      const next = prev - e.deltaY * 0.0006;
      return Math.max(1.02, Math.min(1.38, Number(next.toFixed(3))));
    });
  };

  const resetCamera = () => {
    setIsAutoOrbiting(false);
    setZoomingSlot(null);
    setCamRotX(0);
    setCamRotY(0);
    setCamPanX(0);
    setCamScale(1.04);
    setCamOrigin({ x: 50, y: 55 });
  };

  // Click on one of the 4 physical documents on the desk (or mobile quick-dock):
  // Smoothly dolly/zoom camera onto that object on the table, then open the Inspector Modal!
  const handleDocumentObjectClick = (spot: DeskHotspot) => {
    const targetDoc = documents[spot.slotIndex] || documents[documents.length - 1];
    if (!targetDoc) return;

    soundEngine.playDocumentOpen();
    setIsAutoOrbiting(false);
    setZoomingSlot(spot.slotIndex);
    setCamOrigin(spot.focusOrigin);
    setCamPanX(spot.mobilePanX);
    setCamRotX(2);
    setCamRotY(0);
    setCamScale(1.42);

    setTimeout(() => {
      onInspectDocument(targetDoc);
      // Reset camera gently so when the modal closes, the table is framed cleanly
      setTimeout(() => {
        setZoomingSlot(null);
        setCamScale(1.04);
        setCamOrigin({ x: 50, y: 55 });
        setCamRotX(0);
      }, 220);
    }, 260);
  };

  const showTempPropNote = (msg: string) => {
    soundEngine.playDocumentOpen();
    setPropMessage(msg);
    setTimeout(() => {
      setPropMessage(prev => (prev === msg ? null : prev));
    }, 3800);
  };

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  return (
    <div
      className="fixed inset-0 top-0 left-0 !mt-0 !m-0 z-50 w-screen h-[100dvh] bg-[#04060B] overflow-hidden select-none font-sans flex flex-col justify-between cursor-game-grab"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* =====================================================================
          1. HUD SUPERIOR UNIFICADO (SEM SOBREPOSIÇÃO NO MOBILE OU DESKTOP)
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-30 w-full p-2.5 sm:p-4 md:p-6 pointer-events-none shrink-0"
      >
        {/* --- VERSÃO MOBILE (< md): 2 Linhas Organizadas, Zero Sobreposição --- */}
        <div className="md:hidden pointer-events-auto rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-slate-800/90 p-2.5 shadow-2xl space-y-2">
          {/* Linha 1 Mobile: Logo PWA + Título do Caso + Áudio + Sair */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img
                src="/reader/icons/icon-192.png"
                alt="O Último Segredo"
                className="w-5 h-5 rounded-md object-cover border border-amber-400/60 shrink-0"
              />
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
                {caseShortHeader} ({selectedCase.name})
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
                className="p-1.5 rounded-lg bg-[#0B111E] border border-slate-700/80 text-cyan-300 cursor-pointer"
                title={muted ? 'Reativar Áudio' : 'Silenciar Áudio'}
              >
                {muted ? (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={onRequestExit}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-b from-[#DFBF76] to-[#B69146] text-slate-950 font-sans font-bold text-[11px] border border-amber-200/60 shadow-md cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Linha 2 Mobile: 4 Pílulas Compactas Sem Estourar a Tela */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setBriefingOpen(o => !o);
                setStepMenuOpen(false);
              }}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-sans flex items-center justify-center gap-1 cursor-pointer transition-all truncate ${
                briefingOpen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#0B111E] border-slate-700/80 text-slate-200'
              }`}
            >
              <Info className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Briefing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setStepMenuOpen(o => !o);
                setBriefingOpen(false);
              }}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-sans flex items-center justify-center gap-1 cursor-pointer transition-all truncate ${
                stepMenuOpen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#0B111E] border-amber-500/40 text-amber-300 font-semibold'
              }`}
            >
              <span className="truncate">1. Observar</span>
              <Layers className="w-3 h-3 text-amber-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-2 py-1.5 rounded-lg bg-[#0B111E] border border-slate-700/80 text-[11px] font-sans text-cyan-300 font-semibold flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              <span className="truncate">Modo 2D</span>
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-2 py-1.5 rounded-lg bg-[#0B111E] border border-slate-700/80 text-[11px] font-sans text-amber-300 font-bold flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              <FolderOpen className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                {extractedCount}/{totalCluesCount}
              </span>
            </button>
          </div>

          {/* Subníveis Mobile (Briefing ou Seletor de Etapa) */}
          {briefingOpen && (
            <div className="p-3 rounded-xl bg-[#0B1324] border border-amber-500/40 text-xs text-slate-200 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  BRIEFING DA OPERAÇÃO // {selectedCase.location} ({selectedCase.year})
                </span>
                <button
                  type="button"
                  onClick={() => setBriefingOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="leading-relaxed text-slate-300">{selectedCase.PeriodSummary}</p>
            </div>
          )}

          {stepMenuOpen && (
            <div className="p-1.5 rounded-xl bg-[#0B1324] border border-slate-700 grid grid-cols-1 gap-1 animate-in fade-in duration-150">
              {(
                [
                  { id: 1, label: '1. Observar — Arquivo Histórico (3D)' },
                  { id: 2, label: '2. Conectar — Mesa de Evidências' },
                  { id: 3, label: '3. Hipótese — Sala de Análise' },
                  { id: 4, label: '4. Decidir — Ponto de Decisão' },
                  { id: 5, label: '5. Consequências — Relatório Final' },
                ] as const
              ).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStepMenuOpen(false);
                    onSelectStep(s.id);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-sans flex items-center justify-between cursor-pointer ${
                    activeStep === s.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{s.label}</span>
                  {activeStep === s.id && (
                    <span className="text-[10px] font-mono text-amber-400">ATIVA</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- VERSÃO DESKTOP (>= md): HUD Diegético Flutuante Esquerda/Direita --- */}
        <div className="hidden md:flex items-start justify-between gap-4">
          {/* Esquerda Desktop */}
          <div className="pointer-events-auto flex flex-col items-start gap-2 max-w-xl">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#080C14]/85 backdrop-blur-md border border-amber-500/30 shadow-lg">
              <h1 className="font-sans text-base lg:text-lg font-bold tracking-wide text-[#EAD29C] uppercase">
                {caseShortHeader} ({selectedCase.name.toUpperCase()})
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setBriefingOpen(o => !o);
                  setStepMenuOpen(false);
                }}
                className="game-btn-capsule px-3.5 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <span className="text-amber-400 font-serif italic font-bold">i</span>
                <span>Briefing</span>
                
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setStepMenuOpen(o => !o);
                  setBriefingOpen(false);
                }}
                className="game-btn-capsule game-btn-capsule-active px-4 py-1.5 text-xs font-mono flex items-center gap-2 cursor-pointer"
              >
                <span>
                  <strong className="text-amber-400">1. Observar</strong> Evidências (Etapa Ativa)
                </span>
                <Layers className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {briefingOpen && (
              <div className="mt-1 p-4 rounded-xl bg-[#080D18]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    BRIEFING DA OPERAÇÃO // {selectedCase.location} ({selectedCase.year})
                  </span>
                  <button
                    type="button"
                    onClick={() => setBriefingOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p>{selectedCase.PeriodSummary}</p>
              </div>
            )}

            {stepMenuOpen && (
              <div className="mt-1 p-2 rounded-xl bg-[#080D18]/95 backdrop-blur-xl border border-slate-700 shadow-2xl w-72 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {(
                  [
                    { id: 1, label: '1. Observar — Arquivo Histórico (3D)' },
                    { id: 2, label: '2. Conectar — Mesa de Evidências' },
                    { id: 3, label: '3. Hipótese — Sala de Análise' },
                    { id: 4, label: '4. Decidir — Ponto de Decisão' },
                    { id: 5, label: '5. Consequências — Relatório Final' },
                  ] as const
                ).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStepMenuOpen(false);
                      onSelectStep(s.id);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-sans flex items-center justify-between cursor-pointer transition-colors ${
                      activeStep === s.id
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <span>{s.label}</span>
                    {activeStep === s.id && (
                      <span className="text-[10px] font-mono text-amber-400">ATIVA</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Direita Desktop */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={onSwitchTo2D}
              className="game-btn-capsule px-3.5 py-1.5 text-xs font-mono cursor-pointer"
            >
              Alternar:{' '}
              <strong className="text-amber-300">3D</strong> / Leitura 2D
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="game-btn-capsule px-3.5 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Arquivo Pessoal:{' '}
                <strong className="text-amber-300">
                  {extractedCount}/{totalCluesCount}
                </strong>{' '}
                Pistas
              </span>
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="game-btn-capsule p-2 text-cyan-300 cursor-pointer"
              title={muted ? 'Reativar Áudio' : 'Silenciar Áudio'}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onRequestExit}
              className="game-btn-capsule px-3.5 py-1.5 text-xs font-mono cursor-pointer"
            >
              Sair da Operação
            </button>
          </div>
        </div>
      </div>

      {/* Notificação Contextual de Objeto do Cenário */}
      {propMessage && (
        <div className="fixed top-28 md:top-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-[#080D18]/95 border border-amber-400/50 text-xs font-mono text-amber-200 shadow-2xl animate-in fade-in duration-200 max-w-[92vw] text-center">
          {propMessage}
        </div>
      )}

      {/* Atmosfera 3D de Fundo para Preencher Tela Vertical no Mobile */}
      <div className="md:hidden fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={eraTheme.stage1Bg}
          alt=""
          className="w-full h-full object-cover object-center blur-md opacity-30 brightness-50 scale-110"
        />
      </div>

      {/* =====================================================================
          2. VIEWPORT 3D REALISTA (QUADRO 16:10 COMPLETO NO MOBILE / TELA CHEIA DESKTOP)
         ===================================================================== */}
      <div
        className="relative md:fixed md:inset-0 flex-1 w-full flex flex-col items-center justify-center overflow-hidden z-10 px-2.5 md:px-0"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:w-full md:h-full rounded-2xl md:rounded-none overflow-hidden border border-amber-500/35 md:border-none shadow-[0_0_40px_rgba(0,0,0,0.95)] transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: `${camOrigin.x}% ${camOrigin.y}%`,
            transform: `translateX(${camPanX}%) scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          <div className="relative w-full h-full">
            <img
              src={eraTheme.stage1Bg}
              alt="Sala de Arquivo Histórico 3D"
              draggable={false}
              className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
              style={{
                filter: bankerLampOn
                  ? eraTheme.stage1Filter
                  : 'brightness(0.70) contrast(1.10) saturate(0.85)',
              }}
            />

            {/* Feixe de Luz Volumétrica Dinâmica da Luminária Verde (Banker's Lamp) */}
            {bankerLampOn && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{
                  background:
                    eraTheme.ambientGlowCss,
                }}
              />
            )}

            {/* Partículas de Poeira 3D no Feixe de Luz */}
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 w-full h-full opacity-75"
            />

            {/* ===============================================================
                OBJETOS AMBIENTAIS SECUNDÁRIOS INTERATIVOS NA SALA 3D
               =============================================================== */}
            {/* Luminária Verde de Banqueiro */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                soundEngine.playDocumentOpen();
                setBankerLampOn(v => !v);
                showTempPropNote(
                  bankerLampOn
                    ? 'Luminária de mesa desligada — modo de contraste noturno.'
                    : 'Luminária de banqueiro acesa — iluminação direta sobre os mapas.'
                );
              }}
              style={{ left: '69%', top: '27%', width: '16%', height: '28%' }}
              className="absolute z-10 rounded-full group cursor-game-inspect game-hotspot-artifact focus:outline-none"
              title="Alternar Luminária de Mesa (Luz Volumétrica)"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-slate-950/90 border border-emerald-400/50 text-[10px] font-mono text-emerald-300 whitespace-nowrap shadow-lg">
                <Lightbulb className="w-3 h-3 inline mr-1" />
                {bankerLampOn ? 'Apagar Luminária' : 'Acender Luminária'}
              </span>
            </button>

            {/* Esfera Armilar / Globo de Latão */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                showTempPropNote(
                  `Coordenadas de Campo: ${selectedCase.location} (${selectedCase.year}) — ${selectedCase.historicalPhase}`
                );
              }}
              style={{ left: '15%', top: '28%', width: '16%', height: '29%' }}
              className="absolute z-10 rounded-full group cursor-game-inspect game-hotspot-artifact focus:outline-none"
              title="Inspecionar Esfera Armilar"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-slate-950/90 border border-amber-400/50 text-[10px] font-mono text-amber-300 whitespace-nowrap shadow-lg">
                <Compass className="w-3 h-3 inline mr-1" />
                Coordenadas: {selectedCase.location}
              </span>
            </button>

            {/* Quadro de Evidências na Parede Direita (Atalho para Etapa 2) */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                soundEngine.playDocumentOpen();
                onSelectStep(2);
              }}
              style={{ left: '81%', top: '8%', width: '17%', height: '36%' }}
              className="absolute z-10 rounded-lg border border-transparent hover:border-amber-400/40 hover:bg-amber-500/5 transition-all group cursor-game-inspect game-hotspot-artifact focus:outline-none"
              title="Ir para Etapa 2: Mesa de Conexões"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-slate-950/95 border border-amber-400/60 text-[10px] font-mono text-amber-300 whitespace-nowrap shadow-lg">
                Ir para Etapa 2: Conectar Pistas →
              </span>
            </button>

            {/* ===============================================================
                OS 4 DOCUMENTOS FÍSICOS SOBRE A MESA DE MADEIRA (HOTSPOTS 3D)
               =============================================================== */}
            {activeDeskHotspots.map(spot => {
              const doc = documents[spot.slotIndex] || documents[spot.slotIndex % Math.max(1, documents.length)];
              if (!doc) return null;

              const extractedInDoc = doc.clues.filter(c => extractedClueIds.includes(c.id)).length;
              const allExtracted = extractedInDoc === doc.clues.length && doc.clues.length > 0;
              const isExamined = examinedDocIds.includes(doc.id);
              const isHovered = hoveredSlot === spot.slotIndex;

              return (
                <React.Fragment key={spot.label}>
                  {/* Superfície Física Interativa Sobre a Mesa */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleDocumentObjectClick(spot);
                    }}
                    onMouseEnter={() => setHoveredSlot(spot.slotIndex)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    style={{
                      left: `${spot.box.left}%`,
                      top: `${spot.box.top}%`,
                      width: `${spot.box.width}%`,
                      height: `${spot.box.height}%`,
                      transform: `skewX(${spot.skewDeg}deg)`,
                    }}
                    className={`absolute z-20 rounded-xl transition-all duration-300 cursor-pointer group focus:outline-none ${
                      isHovered
                        ? 'bg-amber-400/15 border-2 border-amber-300/80 shadow-[0_0_35px_rgba(251,191,36,0.45)] -translate-y-1'
                        : allExtracted
                        ? 'border border-emerald-400/40 bg-emerald-500/5 hover:border-emerald-300'
                        : 'border border-amber-400/20 bg-transparent hover:border-amber-300/70 hover:bg-amber-400/10'
                    }`}
                    aria-label={`Inspecionar ${spot.label}: ${doc.title}`}
                  >
                    <span
                      className={`absolute top-3 right-3 w-3 h-3 rounded-full transition-transform duration-300 ${
                        allExtracted
                          ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                          : 'bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-pulse'
                      } ${isHovered ? 'scale-125' : ''}`}
                    />

                    {/* Card Flutuante 3D no Hover (Desktop) */}
                    <div
                      style={{ transform: `skewX(${-spot.skewDeg}deg)` }}
                      className={`pointer-events-none hidden md:block absolute -top-24 left-1/2 -translate-x-1/2 w-64 p-3 rounded-xl bg-[#070B14]/95 backdrop-blur-md border transition-all duration-200 shadow-[0_15px_35px_rgba(0,0,0,0.95)] text-left ${
                        isHovered
                          ? 'opacity-100 translate-y-0 border-amber-400/70'
                          : 'opacity-0 translate-y-2 border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                        <span>
                          {spot.label} // {spot.objectName}
                        </span>
                        <span className={allExtracted ? 'text-emerald-300' : 'text-amber-300'}>
                          {extractedInDoc}/{doc.clues.length} pistas
                        </span>
                      </div>
                      <div className="text-xs font-sans font-bold text-white mt-1 line-clamp-1">
                        {doc.title}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Clique para dar zoom e inspecionar</span>
                      </div>
                    </div>
                  </button>

                  {/* Plaqueta Diegética na Borda da Mesa (Exibida no Desktop >= md) */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleDocumentObjectClick(spot);
                    }}
                    onMouseEnter={() => setHoveredSlot(spot.slotIndex)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    style={{
                      left: `${spot.badgePos.left}%`,
                      top: `${spot.badgePos.top}%`,
                    }}
                    className={`flex absolute z-20 -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 md:px-3.5 md:py-1.5 rounded md:rounded-md font-mono text-[8px] sm:text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer items-center gap-1 md:gap-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.9)] ${
                      isHovered
                        ? 'bg-amber-400 text-slate-950 border border-amber-200 scale-110 shadow-[0_0_25px_rgba(251,191,36,0.6)]'
                        : allExtracted
                        ? 'bg-[#0B1917]/95 text-emerald-300 border border-emerald-500/60 hover:border-emerald-300'
                        : isExamined
                        ? 'bg-[#101827]/95 text-amber-200 border border-amber-400/60 hover:bg-amber-500/20'
                        : 'bg-[#0C121E]/95 text-slate-200 border border-slate-600/80 hover:border-amber-400/70 hover:text-amber-200'
                    }`}
                  >
                    <span>{spot.label}</span>
                    {allExtracted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. BARRA INFERIOR RESPONSIVA (DOCK DE DOCUMENTOS MOBILE + CONTROLES)
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative md:fixed md:bottom-5 md:left-1/2 md:-translate-x-1/2 z-30 w-full md:w-auto px-2.5 pb-2.5 pt-1.5 md:p-0 space-y-2 shrink-0"
      >
        {/* Dock Rápido de Documentos da Mesa no Mobile (< md) — 100% visível e sem corte */}
        <div className="md:hidden grid grid-cols-4 gap-1.5">
          {activeDeskHotspots.map(spot => {
            const doc = documents[spot.slotIndex] || documents[spot.slotIndex % Math.max(1, documents.length)];
            if (!doc) return null;
            const extractedInDoc = doc.clues.filter(c => extractedClueIds.includes(c.id)).length;
            const allExtracted = extractedInDoc === doc.clues.length && doc.clues.length > 0;
            const isExamined = examinedDocIds.includes(doc.id);

            return (
              <button
                key={spot.label}
                type="button"
                onClick={() => handleDocumentObjectClick(spot)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  allExtracted
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                    : isExamined
                    ? 'bg-[#10192B]/95 border-amber-400/60 text-amber-200'
                    : 'bg-[#0A101D]/95 border-slate-700/90 text-slate-200 active:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-400">
                    {spot.label}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      allExtracted
                        ? 'bg-emerald-400'
                        : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                </div>
                <div className="text-[11px] font-sans font-semibold text-white truncate mt-0.5">
                  {spot.shortName}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {extractedInDoc}/{doc.clues.length} pistas
                </div>
              </button>
            );
          })}
        </div>

        {/* Barra de Controle de Câmera + Avanço para Mesa de Conexões */}
        <div className="flex flex-wrap items-center justify-between md:justify-center gap-2 bg-[#070B14]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-2 md:p-0 rounded-2xl border border-slate-800/90 md:border-none">
          <div className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#0B111E]/90 border border-amber-500/40 shadow-lg text-[11px] sm:text-sm font-sans text-slate-200 flex items-center gap-2">
            <span className="hidden sm:inline">
              Clique em um documento para inspecionar com zoom
            </span>
            <span className="sm:hidden text-slate-300">Toque em um doc</span>
            <span className="text-amber-400">•</span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setIsAutoOrbiting(o => !o);
              }}
              className={`font-semibold cursor-pointer transition-colors ${
                isAutoOrbiting
                  ? 'text-amber-300 underline'
                  : 'text-cyan-300 hover:text-amber-300'
              }`}
            >
              [ {isAutoOrbiting ? 'Pausar' : 'Orbitar Câmera'} ]
            </button>

            {(camRotX !== 0 || camRotY !== 0 || camPanX !== 0 || camScale !== 1.04) && (
              <button
                type="button"
                onClick={resetCamera}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 ml-0.5 cursor-pointer"
                title="Centralizar Câmera"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playBrassPress();
              onSelectStep(2);
            }}
            className="game-btn-primary px-5 sm:px-6 py-2.5 font-sans font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Mesa de Conexões</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
