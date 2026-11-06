import React, { useState, useEffect, useRef } from 'react';
import { EvidenceDocument, HistoricalNode } from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
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
  ShieldCheck,
  LogOut,
  Eye,
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
  objectName: string;
  // Position of the interactive surface over the physical object (% of 16:9 stage)
  box: { left: number; top: number; width: number; height: number };
  // Position of the DOC-0X badge along the front edge of the table
  badgePos: { left: number; top: number };
  // Camera focus point when zooming in on this document
  focusOrigin: { x: number; y: number };
  skewDeg: number;
}

const DESK_HOTSPOTS: DeskHotspot[] = [
  {
    slotIndex: 0,
    label: 'DOC-01',
    objectName: 'Dossiê Selado com Lacre',
    box: { left: 6.5, top: 58.5, width: 23.5, height: 25.5 },
    badgePos: { left: 15.8, top: 85.5 },
    focusOrigin: { x: 18, y: 71 },
    skewDeg: -8,
  },
  {
    slotIndex: 1,
    label: 'DOC-02',
    objectName: 'Tabuleta / Registro de Campo',
    box: { left: 30.2, top: 61.0, width: 25.5, height: 23.0 },
    badgePos: { left: 49.5, top: 85.5 },
    focusOrigin: { x: 43, y: 72 },
    skewDeg: -2,
  },
  {
    slotIndex: 2,
    label: 'DOC-03',
    objectName: 'Mapa Estratégico & Rotas',
    box: { left: 52.5, top: 56.0, width: 25.0, height: 26.5 },
    badgePos: { left: 71.2, top: 85.5 },
    focusOrigin: { x: 65, y: 69 },
    skewDeg: 4,
  },
  {
    slotIndex: 3,
    label: 'DOC-04',
    objectName: 'Prancheta de Auditoria',
    box: { left: 76.5, top: 60.0, width: 21.5, height: 24.5 },
    badgePos: { left: 90.0, top: 85.5 },
    focusOrigin: { x: 87, y: 72 },
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
  // 3D Camera Orbit, Tilt & Zoom State
  const [camRotX, setCamRotX] = useState<number>(0);
  const [camRotY, setCamRotY] = useState<number>(0);
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

  // Drag-to-orbit tracking
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    let startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 6.5);
      setCamRotX(Math.cos(elapsed * 0.7) * 3.0);
      setCamScale(1.07 + Math.sin(elapsed * 0.5) * 0.03);
      frameId = requestAnimationFrame(animateOrbit);
    };

    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting, zoomingSlot]);

  // Volumetric 3D Dust Motes rendered on Canvas in the warm light beams
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * 1376,
      y: Math.random() * 768,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.22 - 0.05,
      alpha: Math.random() * 0.55 + 0.15,
    }));

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(renderParticles);
    };

    if (!soundEngine.getSettings().reduceMotion) {
      animId = requestAnimationFrame(renderParticles);
    }
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer / Touch Camera Orbit Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomingSlot !== null) return;
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomingSlot !== null) return;
    if (isDraggingRef.current) {
      setIsAutoOrbiting(false);
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setCamRotY(prev => Math.max(-9, Math.min(9, prev + dx * 0.045)));
      setCamRotX(prev => Math.max(-5, Math.min(5, prev - dy * 0.035)));
    } else if (!isAutoOrbiting && !soundEngine.getSettings().reduceMotion) {
      // Subtle mouse parallax when moving cursor over the room
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
    setCamScale(1.04);
    setCamOrigin({ x: 50, y: 55 });
  };

  // Click on one of the 4 physical documents on the desk:
  // Smoothly dolly/zoom camera onto that object on the table, then open the Inspector Modal!
  const handleDocumentObjectClick = (spot: DeskHotspot) => {
    const targetDoc = documents[spot.slotIndex] || documents[documents.length - 1];
    if (!targetDoc) return;

    soundEngine.playDocumentOpen();
    setIsAutoOrbiting(false);
    setZoomingSlot(spot.slotIndex);
    setCamOrigin(spot.focusOrigin);
    setCamRotX(2);
    setCamRotY(0);
    setCamScale(1.48);

    setTimeout(() => {
      onInspectDocument(targetDoc);
      // Reset camera gently so when the modal closes, the table is framed cleanly
      setTimeout(() => {
        setZoomingSlot(null);
        setCamScale(1.04);
        setCamOrigin({ x: 50, y: 55 });
        setCamRotX(0);
      }, 220);
    }, 280);
  };

  const showTempPropNote = (msg: string) => {
    soundEngine.playDocumentOpen();
    setPropMessage(msg);
    setTimeout(() => {
      setPropMessage(prev => (prev === msg ? null : prev));
    }, 3800);
  };

  return (
    <div
      className="fixed inset-0 z-40 w-screen h-screen bg-[#04060B] overflow-hidden select-none font-sans"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* =====================================================================
          1. VIEWPORT 3D REALISTA COM PERSPECTIVA ESPACIAL, PARALLAX E ILUMINAÇÃO
         ===================================================================== */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: `${camOrigin.x}% ${camOrigin.y}%`,
            transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          {/* Container 16:9 Centralizado / Cover que preserva o alinhamento exato dos objetos da mesa */}
          <div className="relative w-full h-full">
            <img
              src="/dossiers/archive_room_3d_clean.webp"
              alt="Sala de Arquivo Histórico 3D"
              draggable={false}
              className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
              style={{
                filter: bankerLampOn
                  ? 'brightness(1.02) contrast(1.04)'
                  : 'brightness(0.72) contrast(1.08) saturate(0.85)',
              }}
            />

            {/* Feixe de Luz Volumétrica Dinâmica da Luminária Verde (Banker's Lamp) */}
            {bankerLampOn && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{
                  background:
                    'radial-gradient(circle at 77% 46%, rgba(251,191,36,0.16) 0%, rgba(16,185,129,0.06) 22%, transparent 55%), radial-gradient(circle at 50% 16%, rgba(251,191,36,0.14) 0%, transparent 48%)',
                }}
              />
            )}

            {/* Canvas de Partículas Volumétricas 3D (Poeira Dourada no Feixe de Luz) */}
            <canvas
              ref={canvasRef}
              width={1376}
              height={768}
              className="pointer-events-none absolute inset-0 w-full h-full opacity-75"
            />

            {/* =================================================================
                PONTOS SECUNDÁRIOS INTERATIVOS DO CENÁRIO 3D (LUMINÁRIA, ESFERA, QUADRO)
               ================================================================= */}
            {/* Luminária Verde de Banqueiro (Liga/Desliga Luz de Mesa) */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                soundEngine.playDocumentOpen();
                setBankerLampOn(v => !v);
                showTempPropNote(
                  !bankerLampOn
                    ? 'Luminária de bancada acesa — Iluminação direta sobre as peças documentais.'
                    : 'Luminária de bancada desligada — Modo de contraste noturno.'
                );
              }}
              style={{ left: '70%', top: '28%', width: '16%', height: '27%' }}
              className="absolute z-10 rounded-2xl cursor-pointer group focus:outline-none"
              title="Luminária de Bancada (Clique para alternar iluminação da mesa)"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-black/85 border border-amber-400/50 text-[10px] font-mono text-amber-300 whitespace-nowrap flex items-center gap-1 shadow-lg">
                <Lightbulb className="w-3 h-3" />
                {bankerLampOn ? 'Apagar Luminária' : 'Acender Luminária'}
              </span>
            </button>

            {/* Esfera Armilar de Latão (Calibragem Cronológica) */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                showTempPropNote(
                  `Esfera Armilar // Coordenada Temporal: ${selectedCase.year} — ${selectedCase.location}`
                );
              }}
              style={{ left: '16%', top: '30%', width: '14%', height: '27%' }}
              className="absolute z-10 rounded-full cursor-pointer group focus:outline-none"
              title="Inspecionar Esfera Armilar"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-black/85 border border-amber-400/50 text-[10px] font-mono text-amber-300 whitespace-nowrap shadow-lg">
                Esfera Armilar ({selectedCase.year})
              </span>
            </button>

            {/* Quadro de Evidências na Parede Direita (Atalho para Etapa 2: Mesa de Conexões) */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                soundEngine.playDocumentOpen();
                onSelectStep(2);
              }}
              style={{ left: '80%', top: '9%', width: '18%', height: '34%' }}
              className="absolute z-10 rounded-xl border border-transparent hover:border-amber-400/40 hover:bg-amber-500/5 transition-all cursor-pointer group focus:outline-none"
              title="Ir para Etapa 2 — Sala de Cruzamento Analítico"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-black/90 border border-amber-400/60 text-[10px] font-mono text-amber-300 whitespace-nowrap shadow-lg">
                Abrir Quadro de Conexões (Etapa 2) →
              </span>
            </button>

            {/* =================================================================
                OS 4 DOCUMENTOS FÍSICOS SOBRE A MESA 3D (DOC-01 A DOC-04)
               ================================================================= */}
            {DESK_HOTSPOTS.map(spot => {
              const doc = documents[spot.slotIndex] || documents[documents.length - 1];
              if (!doc) return null;

              const isHovered = hoveredSlot === spot.slotIndex;
              const isExamined = examinedDocIds.includes(doc.id);
              const extractedInDoc = doc.clues.filter(c =>
                extractedClueIds.includes(c.id)
              ).length;
              const allExtracted = extractedInDoc === doc.clues.length;

              return (
                <React.Fragment key={spot.label}>
                  {/* Superfície 3D Clicável sobre o Objeto Físico na Mesa */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspecionar ${spot.label}: ${doc.title}`}
                    onMouseEnter={() => setHoveredSlot(spot.slotIndex)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onClick={e => {
                      e.stopPropagation();
                      handleDocumentObjectClick(spot);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDocumentObjectClick(spot);
                      }
                    }}
                    style={{
                      left: `${spot.box.left}%`,
                      top: `${spot.box.top}%`,
                      width: `${spot.box.width}%`,
                      height: `${spot.box.height}%`,
                      transform: `skewX(${spot.skewDeg}deg) ${
                        isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)'
                      }`,
                    }}
                    className={`absolute z-20 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none ${
                      isHovered
                        ? 'border-2 border-amber-400/80 bg-amber-400/15 shadow-[0_0_35px_rgba(251,191,36,0.35)]'
                        : allExtracted
                        ? 'border border-emerald-400/35 bg-emerald-500/5 hover:border-amber-400/70'
                        : 'border border-amber-500/15 bg-transparent hover:border-amber-400/70'
                    }`}
                  >
                    {/* Ponto de Interesse Pulsante Discreto sobre o Objeto */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                          allExtracted
                            ? 'bg-emerald-400/80 shadow-[0_0_12px_#10b981]'
                            : 'bg-amber-400/90 shadow-[0_0_15px_#fbbf24]'
                        }`}
                      >
                        {!allExtracted && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                        )}
                      </span>
                    </div>

                    {/* Tooltip Flutuante 3D ao Passar o Mouse ou Focar */}
                    {isHovered && (
                      <div
                        style={{ transform: `skewX(${-spot.skewDeg}deg)` }}
                        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 p-3 rounded-xl bg-[#070B14]/95 border border-amber-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.95)] text-left z-30 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mb-0.5">
                          <span>{spot.label} // {spot.objectName}</span>
                          <span className={allExtracted ? 'text-emerald-400 font-bold' : 'text-cyan-300'}>
                            {extractedInDoc}/{doc.clues.length} pistas
                          </span>
                        </div>
                        <div className="text-xs font-sans font-bold text-white truncate">
                          {doc.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>Clique para aproximar e abrir na lupa</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Etiqueta Diegética DOC-01 .. DOC-04 na Borda da Mesa (Idêntica à Referência!) */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredSlot(spot.slotIndex)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onClick={e => {
                      e.stopPropagation();
                      handleDocumentObjectClick(spot);
                    }}
                    style={{
                      left: `${spot.badgePos.left}%`,
                      top: `${spot.badgePos.top}%`,
                    }}
                    className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded bg-[#0D131F]/90 backdrop-blur-md border font-mono text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.85)] ${
                      isHovered
                        ? 'border-amber-400 text-amber-200 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                        : allExtracted
                        ? 'border-emerald-500/60 text-emerald-300'
                        : isExamined
                        ? 'border-amber-500/50 text-amber-100'
                        : 'border-slate-600/80 text-slate-200 hover:border-amber-400'
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

      {/* Vinheta Cinematográfica Suave nas Bordas */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background:
            'radial-gradient(circle at center, transparent 58%, rgba(4,6,11,0.65) 100%), linear-gradient(to bottom, rgba(4,6,11,0.75) 0%, transparent 16%, transparent 82%, rgba(4,6,11,0.85) 100%)',
        }}
      />

      {/* =====================================================================
          2. HUD DIEGÉTICO FLUTUANTE — TOPO ESQUERDO (IDÊNTICO À REFERÊNCIA!)
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="fixed top-4 left-4 sm:top-6 sm:left-7 z-30 flex flex-col items-start gap-2 max-w-[92vw] sm:max-w-lg"
      >
        {/* Título do Caso em Ouro Suave */}
        <h1 className="font-sans text-sm sm:text-lg md:text-xl font-semibold tracking-wider uppercase text-amber-200/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          {selectedCase.missionCode || 'CASO 001'} // {selectedCase.missionTitle || selectedCase.title} ({selectedCase.name.toUpperCase()})
        </h1>

        {/* Linha de Pílulas: [ i Briefing ] + Seletor Rápido */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBriefingOpen(o => !o)}
            className={`px-3 py-1.5 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border text-xs sm:text-sm font-sans flex items-center gap-1.5 cursor-pointer transition-all shadow-lg ${
              briefingOpen
                ? 'border-amber-400 text-amber-200'
                : 'border-slate-700/80 text-slate-200 hover:border-amber-500/50'
            }`}
          >
            <span className="text-amber-400">[</span>
            <Info className="w-3.5 h-3.5 text-amber-300 italic" />
            <span>Briefing</span>
            <span className="text-amber-400">]</span>
          </button>

          {/* Botão de Áudio Discreto no Mobile */}
          <button
            type="button"
            onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
            className="sm:hidden p-1.5 rounded-lg bg-[#0B111E]/85 border border-slate-700/80 text-cyan-300"
            title="Alternar Som"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Pílula da Etapa Ativa: 1. Observar Evidências (Etapa Ativa) — Clicável para trocar de etapa */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setStepMenuOpen(o => !o)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-amber-500/40 text-xs sm:text-sm font-sans text-slate-200 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>
              <strong className="text-amber-300">1. Observar</strong> Evidências (Etapa Ativa)
            </span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Menu Suspenso das 5 Etapas */}
          {stepMenuOpen && (
            <div className="mt-2 w-64 rounded-xl bg-[#090E1A]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl p-2 space-y-1 z-40">
              {[
                { num: 1 as const, label: '1. Observar — Arquivo Histórico 3D' },
                { num: 2 as const, label: '2. Conectar — Mesa Topográfica' },
                { num: 3 as const, label: '3. Formular Hipótese — Centro de Análise' },
                { num: 4 as const, label: '4. Decidir — Simulação de Campo' },
                { num: 5 as const, label: '5. Consequências — Câmara Final' },
              ].map(st => (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => {
                    setStepMenuOpen(false);
                    onSelectStep(st.num);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    activeStep === st.num
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subnível Flutuante do Briefing da Missão */}
        {briefingOpen && (
          <div className="mt-1 p-4 rounded-xl bg-[#080D18]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl max-w-md space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                BRIEFING OPERACIONAL // {selectedCase.year}
              </span>
              <button
                type="button"
                onClick={() => setBriefingOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {selectedCase.shortDescription}
            </p>
          </div>
        )}
      </div>

      {/* =====================================================================
          3. HUD DIEGÉTICO FLUTUANTE — TOPO DIREITO (IDÊNTICO À REFERÊNCIA!)
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="fixed top-4 right-4 sm:top-6 sm:right-7 z-30 flex flex-wrap items-center justify-end gap-2"
      >
        {/* Botão [ Alternar: 3D / Leitura 2D ] */}
        <button
          type="button"
          onClick={onSwitchTo2D}
          className="px-3 py-1.5 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-amber-400/60 text-xs sm:text-sm font-sans text-slate-200 cursor-pointer transition-all shadow-lg"
        >
          <span className="text-amber-400">[</span>{' '}
          <span className="hidden sm:inline">Alternar: </span>
          <strong className="text-amber-300">3D</strong> / Leitura 2D{' '}
          <span className="text-amber-400">]</span>
        </button>

        {/* Botão [ 📁 Arquivo Pessoal: X/Y Pistas ] */}
        <button
          type="button"
          onClick={onOpenArchiveDrawer}
          className="px-3 py-1.5 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-slate-600/80 hover:border-cyan-400/60 text-xs sm:text-sm font-sans text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all shadow-lg"
        >
          <span className="text-amber-400">[</span>
          <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <span className="hidden md:inline">Arquivo Pessoal: </span>
            <strong className="text-amber-300">
              {extractedCount}/{totalCluesCount}
            </strong>{' '}
            Pistas
          </span>
          <span className="text-amber-400">]</span>
        </button>

        {/* Botão Som Desktop */}
        <button
          type="button"
          onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
          className="hidden sm:flex p-2 rounded-lg bg-[#0B111E]/85 hover:bg-[#131D31] backdrop-blur-md border border-slate-700/80 text-cyan-300 cursor-pointer shadow-lg"
          title={muted ? 'Reativar Áudio' : 'Silenciar Áudio'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Botão Dourado [ Sair da Operação ] */}
        <button
          type="button"
          onClick={onRequestExit}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-[#DFBF76] to-[#B69146] hover:from-[#EAD08E] hover:to-[#C8A252] text-slate-950 font-sans font-bold text-xs sm:text-sm border border-amber-200/60 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer transition-all"
        >
          Sair da Operação
        </button>
      </div>

      {/* Notificação Contextual de Objeto do Cenário */}
      {propMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-[#080D18]/95 border border-amber-400/50 text-xs font-mono text-amber-200 shadow-2xl animate-in fade-in duration-200">
          {propMessage}
        </div>
      )}

      {/* =====================================================================
          4. BARRA FLUTUANTE INFERIOR — CONTROLE DE CÂMERA & AVANÇO DE ETAPA
         ===================================================================== */}
      <div
        onClick={e => e.stopPropagation()}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-2.5 w-[94vw] sm:w-auto"
      >
        <div className="px-4 sm:px-5 py-2 rounded-xl bg-[#0B111E]/90 backdrop-blur-md border border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.9)] text-xs sm:text-sm font-sans text-slate-200 flex flex-wrap items-center justify-center gap-2">
          <span>Clique em um documento para inspecionar com zoom</span>
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
            [ {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar Câmera'} ]
          </button>

          {(camRotX !== 0 || camRotY !== 0 || camScale !== 1.04) && (
            <button
              type="button"
              onClick={resetCamera}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 ml-1 cursor-pointer"
              title="Centralizar Câmera"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Botão de Avanço imediato para a Etapa 2 (Mesa de Conexões) */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playDocumentOpen();
            onSelectStep(2);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer transition-all"
        >
          <span>Mesa de Conexões</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
