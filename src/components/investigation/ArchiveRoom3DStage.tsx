import React, { useState, useEffect, useRef } from 'react';
import { EvidenceDocument, HistoricalNode } from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Lightbulb,
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
  shortName: string;
  objectName: string;
  box: { left: number; top: number; width: number; height: number };
  badgePos: { left: number; top: number };
  focusOrigin: { x: number; y: number };
  skewDeg: number;
}

const DESK_HOTSPOTS: DeskHotspot[] = [
  {
    slotIndex: 0,
    label: 'DOC-01',
    shortName: 'Dossiê Selado',
    objectName: 'Dossiê Selado com Lacre',
    box: { left: 6.5, top: 58.5, width: 23.5, height: 25.5 },
    badgePos: { left: 16.5, top: 88.0 },
    focusOrigin: { x: 18, y: 71 },
    skewDeg: -8,
  },
  {
    slotIndex: 1,
    label: 'DOC-02',
    shortName: 'Tabuleta / Registro',
    objectName: 'Tabuleta / Registro de Campo',
    box: { left: 30.2, top: 61.0, width: 25.5, height: 23.0 },
    badgePos: { left: 45.5, top: 88.0 },
    focusOrigin: { x: 43, y: 72 },
    skewDeg: -2,
  },
  {
    slotIndex: 2,
    label: 'DOC-03',
    shortName: 'Mapa Estratégico',
    objectName: 'Mapa Estratégico & Rotas',
    box: { left: 52.5, top: 56.0, width: 25.0, height: 26.5 },
    badgePos: { left: 68.5, top: 88.0 },
    focusOrigin: { x: 65, y: 69 },
    skewDeg: 4,
  },
  {
    slotIndex: 3,
    label: 'DOC-04',
    shortName: 'Prancheta',
    objectName: 'Prancheta de Auditoria',
    box: { left: 76.5, top: 60.0, width: 21.5, height: 24.5 },
    badgePos: { left: 88.5, top: 88.0 },
    focusOrigin: { x: 87, y: 72 },
    skewDeg: 9,
  },
];

export const ArchiveRoom3DStage: React.FC<ArchiveRoom3DStageProps> = ({
  selectedCase,
  documents,
  extractedClueIds,
  examinedDocIds,
  onSelectStep,
  onInspectDocument,
}) => {
  const [camRotX, setCamRotX] = useState<number>(0);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.03);
  const [camOrigin, setCamOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [zoomingSlot, setZoomingSlot] = useState<number | null>(null);

  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [propMessage, setPropMessage] = useState<string | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Automatic gentle camera orbit animation when [ Orbitar Câmera ] is toggled
  useEffect(() => {
    if (!isAutoOrbiting || zoomingSlot !== null) return;
    let frameId: number;
    const startTime = performance.now();

    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 6.0);
      setCamRotX(Math.cos(elapsed * 0.7) * 2.8);
      setCamScale(1.06 + Math.sin(elapsed * 0.5) * 0.03);
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
      canvas.width = canvas.parentElement?.clientWidth || 960;
      canvas.height = canvas.parentElement?.clientHeight || 540;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -Math.random() * 0.22 - 0.05,
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
      setCamRotY(prev => Math.max(-8, Math.min(8, prev + dx * 0.045)));
      setCamRotX(prev => Math.max(-4, Math.min(4, prev - dy * 0.035)));
    } else if (!isAutoOrbiting && !soundEngine.getSettings().reduceMotion && window.innerWidth >= 768) {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setCamRotY(nx * 4.0);
      setCamRotX(-ny * 2.5);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const resetCamera = () => {
    setIsAutoOrbiting(false);
    setZoomingSlot(null);
    setCamRotX(0);
    setCamRotY(0);
    setCamScale(1.03);
    setCamOrigin({ x: 50, y: 55 });
  };

  const handleDocumentObjectClick = (spot: DeskHotspot) => {
    const targetDoc = documents[spot.slotIndex] || documents[documents.length - 1];
    if (!targetDoc) return;

    soundEngine.playDocumentOpen();
    setIsAutoOrbiting(false);
    setZoomingSlot(spot.slotIndex);
    setCamOrigin(spot.focusOrigin);
    setCamRotX(2);
    setCamRotY(0);
    setCamScale(1.42);

    setTimeout(() => {
      onInspectDocument(targetDoc);
      setTimeout(() => {
        setZoomingSlot(null);
        setCamScale(1.03);
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
    }, 3500);
  };

  return (
    <div className="space-y-4 select-none font-sans">
      {/* =====================================================================
          1. JANELA 3D DESOBSTRUÍDA (PROPORÇÃO 16:9 CORRIDA, SEM CAIXAS COBRINDO A IMAGEM)
         ===================================================================== */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-amber-500/35 bg-[#04060B] shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
        style={{ perspective: '1200px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Notificação de Objeto do Cenário (Luminária / Globo) */}
        {propMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-xl bg-[#080D18]/95 border border-amber-400/60 text-[11px] font-mono text-amber-200 shadow-xl w-max max-w-[90%] text-center">
            {propMessage}
          </div>
        )}

        {/* Controles Discretos de Iluminação e Órbita no Canto da Cena 3D */}
        <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setBankerLampOn(v => !v);
            }}
            className={`px-2.5 py-1 rounded-lg backdrop-blur-md border text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
              bankerLampOn
                ? 'bg-[#0B111E]/85 border-amber-400/50 text-amber-300'
                : 'bg-[#0B111E]/85 border-slate-700 text-slate-400'
            }`}
            title="Alternar Luminária da Mesa"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{bankerLampOn ? 'Luz Acesa' : 'Luz Baixa'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className={`px-2.5 py-1 rounded-lg backdrop-blur-md border text-[11px] font-mono cursor-pointer transition-all ${
              isAutoOrbiting
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                : 'bg-[#0B111E]/85 border-cyan-500/40 text-cyan-300 hover:border-amber-400/60'
            }`}
          >
            {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar 3D'}
          </button>

          {(camRotX !== 0 || camRotY !== 0 || camScale !== 1.03) && (
            <button
              type="button"
              onClick={resetCamera}
              className="p-1.5 rounded-lg bg-[#0B111E]/85 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Centralizar Câmera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Palco 3D com Parallax e Iluminação Volumétrica */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: `${camOrigin.x}% ${camOrigin.y}%`,
            transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          <img
            src="/dossiers/archive_room_3d_clean.webp"
            alt="Sala de Arquivo Histórico 3D"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
            style={{
              filter: bankerLampOn
                ? 'brightness(1.03) contrast(1.04)'
                : 'brightness(0.72) contrast(1.08) saturate(0.85)',
            }}
          />

          {bankerLampOn && (
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                background:
                  'radial-gradient(circle at 75% 48%, rgba(251, 191, 36, 0.16) 0%, rgba(16, 185, 129, 0.08) 28%, transparent 62%)',
              }}
            />
          )}

          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 w-full h-full opacity-75"
          />

          {/* Luminária Verde Interativa */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setBankerLampOn(v => !v);
              showTempPropNote(
                bankerLampOn
                  ? 'Luminária de mesa desligada — modo de contraste noturno.'
                  : 'Luminária de banqueiro acesa — iluminação direta sobre a mesa.'
              );
            }}
            style={{ left: '69%', top: '27%', width: '16%', height: '28%' }}
            className="absolute z-10 rounded-full cursor-pointer focus:outline-none"
            title="Alternar Luminária de Banqueiro"
          />

          {/* Esfera Armilar / Globo */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              showTempPropNote(
                `Coordenadas de Campo: ${selectedCase.location} (${selectedCase.year}) — ${selectedCase.historicalPhase}`
              );
            }}
            style={{ left: '15%', top: '28%', width: '16%', height: '29%' }}
            className="absolute z-10 rounded-full cursor-pointer focus:outline-none"
            title="Inspecionar Esfera Armilar"
          />

          {/* Hotspots Físicos dos 4 Documentos sobre a Mesa */}
          {DESK_HOTSPOTS.map(spot => {
            const doc = documents[spot.slotIndex];
            if (!doc) return null;

            const extractedInDoc = doc.clues.filter(c => extractedClueIds.includes(c.id)).length;
            const allExtracted = extractedInDoc === doc.clues.length && doc.clues.length > 0;
            const isExamined = examinedDocIds.includes(doc.id);
            const isHovered = hoveredSlot === spot.slotIndex;

            return (
              <React.Fragment key={spot.label}>
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
                      ? 'bg-amber-400/20 border-2 border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.5)] -translate-y-0.5'
                      : allExtracted
                      ? 'border border-emerald-400/50 bg-emerald-500/10 hover:border-emerald-300'
                      : 'border border-amber-400/25 bg-transparent hover:border-amber-300/80 hover:bg-amber-400/10'
                  }`}
                  aria-label={`Inspecionar ${spot.label}: ${doc.title}`}
                >
                  <span
                    className={`absolute top-2 right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                      allExtracted
                        ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                        : 'bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse'
                    }`}
                  />

                  {/* Tooltip Flutuante no Hover (Desktop) */}
                  <div
                    style={{ transform: `skewX(${-spot.skewDeg}deg)` }}
                    className={`pointer-events-none hidden md:block absolute -top-24 left-1/2 -translate-x-1/2 w-60 p-2.5 rounded-xl bg-[#070B14]/95 backdrop-blur-md border transition-all duration-200 shadow-2xl text-left ${
                      isHovered
                        ? 'opacity-100 translate-y-0 border-amber-400/70'
                        : 'opacity-0 translate-y-2 border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-amber-400 font-bold">
                      <span>{spot.label}</span>
                      <span>
                        {extractedInDoc}/{doc.clues.length} pistas
                      </span>
                    </div>
                    <div className="text-xs font-sans font-bold text-white mt-0.5 line-clamp-1">
                      {doc.title}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Clique para dar zoom</span>
                    </div>
                  </div>
                </button>

                {/* Plaqueta DOC-01..04 na borda da mesa */}
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
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 shadow-lg ${
                    isHovered
                      ? 'bg-amber-400 text-slate-950 border border-amber-200 scale-105'
                      : allExtracted
                      ? 'bg-[#0B1917]/95 text-emerald-300 border border-emerald-500/60'
                      : isExamined
                      ? 'bg-[#101827]/95 text-amber-200 border border-amber-400/60'
                      : 'bg-[#0C121E]/95 text-slate-200 border border-slate-600/80'
                  }`}
                >
                  <span>{spot.label}</span>
                  {allExtracted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. GRADE DE ACESSO RÁPIDO ÀS 4 PEÇAS DA MESA (ABAIXO DO CENÁRIO 3D, COM SCROLL LIVRE)
         ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {DESK_HOTSPOTS.map(spot => {
          const doc = documents[spot.slotIndex];
          if (!doc) return null;
          const extractedInDoc = doc.clues.filter(c => extractedClueIds.includes(c.id)).length;
          const allExtracted = extractedInDoc === doc.clues.length && doc.clues.length > 0;
          const isExamined = examinedDocIds.includes(doc.id);

          return (
            <button
              key={spot.label}
              type="button"
              onClick={() => handleDocumentObjectClick(spot)}
              onMouseEnter={() => setHoveredSlot(spot.slotIndex)}
              onMouseLeave={() => setHoveredSlot(null)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                allExtracted
                  ? 'bg-emerald-950/30 border-emerald-500/50 hover:border-emerald-400'
                  : isExamined
                  ? 'bg-[#0D1626] border-amber-500/40 hover:border-amber-400'
                  : 'bg-[#0B111E] border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  {spot.label} • {spot.shortName}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    allExtracted
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {extractedInDoc}/{doc.clues.length}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-sans font-bold text-white line-clamp-1">
                {doc.title}
              </div>
              <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                <Eye className="w-3 h-3 shrink-0" />
                <span>Inspecionar com lupa</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          3. RODAPÉ DA ETAPA 1 (SEMPRE ACESSÍVEL COM SCROLL, NUNCA CORTADO)
         ===================================================================== */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B111E]/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          Toque em qualquer documento sobre a mesa 3D (ou nos cartões acima) para abrir a lupa de inspeção e guardar pistas.
        </div>
        <button
          type="button"
          onClick={() => {
            soundEngine.playDocumentOpen();
            onSelectStep(2);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer shrink-0"
        >
          <span>Ir para Mesa de Conexões (Etapa 2)</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
