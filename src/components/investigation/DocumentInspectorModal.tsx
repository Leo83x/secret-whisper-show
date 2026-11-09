import React, { useState, useEffect, useRef } from 'react';
import { EvidenceDocument } from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import { GameButton } from './GameInteractionSystem';
import { ClueFlyToken, FlyingClueData } from './GameInteractionSystem';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookmarkPlus,
  BookmarkCheck,
  FileText,
  MapPin,
  ShieldCheck,
  Search,
  Columns,
  Image as ImageIcon,
  AlignLeft,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface DocumentInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: EvidenceDocument;
  caseId?: string;
  caseImage: string;
  locationSubtitle: string;
  extractedClueIds: string[];
  onExtractClue: (clueId: string, xpReward: number, isContradiction?: boolean) => void;
}

type ViewMode = 'split' | 'image' | 'transcript';

interface SavedDocViewState {
  zoom: number;
  scrollTop: number;
  viewMode: ViewMode;
  imageInspected: boolean;
  transcriptRead: boolean;
}

// Memória em sessão do ponto exato de leitura de cada documento
const docSessionMemory: Record<string, SavedDocViewState> = {};

// Identidade visual específica de cada período histórico
export const getEraDocumentTheme = (caseId?: string) => {
  switch (caseId) {
    case "salomao":
      return {
        eraStamp: "TEMPLO DE SALOMÃO // CRÔNICA REAL & ROLO DE PAPIRO HEBRAICO (970 a.C.)",
        materialLabel: "Reconstrução Visual de Registro Fundacional / Fonte: Arquivo Zero & Crônicas de Jerusalém",
        paperBg: "bg-[#18130a]",
        paperBorder: "border-amber-500/50",
        textStyle: "text-amber-50 font-serif tracking-wide",
        headerBadge: "bg-amber-950/70 text-amber-300 border-amber-400/50",
        imgFilter: "sepia(0.5) contrast(1.15) brightness(0.92)",
      };
    case "alexandre":
      return {
        eraStamp: "EXPEDIÇÃO MACEDÔNIA // DIÁRIO DE CAMPANHA & PERGAMINHO GREGO (326 a.C.)",
        materialLabel: "Reconstrução Visual de Registro de Marcha / Fonte: Arriano, Plutarco & Registros do Hífasis",
        paperBg: "bg-[#16140d]",
        paperBorder: "border-yellow-600/50",
        textStyle: "text-yellow-50 font-sans tracking-wide",
        headerBadge: "bg-yellow-950/70 text-yellow-300 border-yellow-400/50",
        imgFilter: "sepia(0.4) contrast(1.12)",
      };
    case "cesar":
    case "julio_cesar":
    case "cleopatra":
      return {
        eraStamp: "TABULARIUM SENATORIAL // SUPORTE EPIGRÁFICO & PAPIRO ROMANO (49 a.C.)",
        materialLabel: "Reconstrução Visual de Registro Clássico / Fonte Histórica: Suetônio, Plutarco e Cícero",
        paperBg: "bg-[#17120B]",
        paperBorder: "border-amber-600/45",
        textStyle: "text-amber-100/95 font-sans tracking-wide",
        headerBadge: "bg-amber-950/60 text-amber-300 border-amber-500/40",
        imgFilter: "sepia(0.45) contrast(1.12) brightness(0.95)",
      };
    case "joana":
      return {
        eraStamp: "CHANCELARIA DE ORLÉANS // REGISTRO MANUSCRITO MEDIEVAL (1429)",
        materialLabel: "Reconstrução Visual de Pergaminho Medieval / Fonte: Arquivos da Coroa Francesa",
        paperBg: "bg-[#15120c]",
        paperBorder: "border-amber-600/40",
        textStyle: "text-amber-100 font-serif",
        headerBadge: "bg-amber-950/60 text-amber-300 border-amber-500/40",
        imgFilter: "sepia(0.4) contrast(1.1)",
      };
    case "da_vinci":
      return {
        eraStamp: "OFICINA SFORZESCA // MANUSCRITO RENASCENTISTA & TINTA FERROGÁLICA (1490)",
        materialLabel: "Reconstrução Visual de Caderno Técnico / Fonte: Codex Atlanticus & Cartórios de Veneza",
        paperBg: "bg-[#17130e]",
        paperBorder: "border-amber-500/40",
        textStyle: "text-stone-100 font-mono text-[13px] sm:text-sm",
        headerBadge: "bg-amber-950/60 text-amber-200 border-amber-500/40",
        imgFilter: "sepia(0.35) contrast(1.15)",
      };
    case "napoleao":
      return {
        eraStamp: "CHANCELARIA IMPERIAL // DESPACHO MILITAR DE CAMPANHA (WATERLOO, 1815)",
        materialLabel: "Reconstrução Visual de Despacho de Estado-Maior / Fonte: Arquivos de Guerra da França",
        paperBg: "bg-[#14140F]",
        paperBorder: "border-yellow-600/40",
        textStyle: "text-stone-100 font-sans",
        headerBadge: "bg-yellow-950/60 text-yellow-300 border-yellow-500/40",
        imgFilter: "sepia(0.32) contrast(1.15)",
      };
    case "turing":
      return {
        eraStamp: "BLETCHLEY PARK — HUT 8 // RELATÓRIO CRIPTOGRÁFICO DATILOGRAFADO (1941)",
        materialLabel: "Reconstrução Visual de Prontuário Técnico / Fonte: GC&CS / National Archives UK",
        paperBg: "bg-[#0C1317]",
        paperBorder: "border-emerald-500/35",
        textStyle: "text-emerald-50 font-mono text-[13px] sm:text-sm",
        headerBadge: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40",
        imgFilter: "grayscale(0.45) contrast(1.2)",
      };
    case "mandela":
      return {
        eraStamp: "PRISÃO DE ROBBEN ISLAND // REGISTROS JUDICIAIS & CARTAS CENSURADAS (1964)",
        materialLabel: "Reconstrução Visual de Processo de Rivonia / Fonte: National Archives of South Africa",
        paperBg: "bg-[#13110e]",
        paperBorder: "border-orange-500/35",
        textStyle: "text-orange-50 font-sans",
        headerBadge: "bg-orange-950/60 text-orange-300 border-orange-500/40",
        imgFilter: "contrast(1.1) brightness(0.95)",
      };
    case "jobs":
    default:
      return {
        eraStamp: "AUDITORIA DE SISTEMA // TELEMETRIA & REGISTRO CORPORATIVO (2007–2026)",
        materialLabel: "Reconstrução Visual para Investigação / Fonte: Registros Técnicos & Engenharia de Produto",
        paperBg: "bg-[#060C16]",
        paperBorder: "border-cyan-500/35",
        textStyle: "text-cyan-50 font-sans",
        headerBadge: "bg-cyan-950/60 text-cyan-300 border-cyan-500/40",
        imgFilter: "contrast(1.1) saturate(1.05)",
      };
  }
};

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  isOpen,
  onClose,
  document,
  caseId,
  caseImage,
  locationSubtitle,
  extractedClueIds,
  onExtractClue,
}) => {
  const saved = docSessionMemory[document.id] || {
    zoom: 1,
    scrollTop: 0,
    viewMode: 'split' as ViewMode,
    imageInspected: true,
    transcriptRead: false,
  };

  const [zoom, setZoom] = useState<number>(saved.zoom);
  const [viewMode, setViewMode] = useState<ViewMode>(saved.viewMode);
  const [loupeActive, setLoupeActive] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 50,
    y: 50,
    visible: false,
  });
  const [transcriptRead, setTranscriptRead] = useState<boolean>(saved.transcriptRead);
  const [flyingClue, setFlyingClue] = useState<FlyingClueData | null>(null);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const theme = getEraDocumentTheme(caseId);

  // Restaura memória de sessão ao abrir ou trocar documento
  useEffect(() => {
    if (!isOpen) return;
    soundEngine.playPaperRustle();
    const mem = docSessionMemory[document.id];
    if (mem) {
      setZoom(mem.zoom);
      setViewMode(mem.viewMode);
      setTranscriptRead(mem.transcriptRead);
      setTimeout(() => {
        if (transcriptRef.current) {
          transcriptRef.current.scrollTop = mem.scrollTop;
        }
      }, 40);
    } else {
      setZoom(1);
      setViewMode('split');
    }
    closeBtnRef.current?.focus();
  }, [isOpen, document.id]);

  // Salva estado na memória ao alterar zoom ou modo
  useEffect(() => {
    if (!isOpen) return;
    docSessionMemory[document.id] = {
      zoom,
      scrollTop: transcriptRef.current?.scrollTop || saved.scrollTop || 0,
      viewMode,
      imageInspected: true,
      transcriptRead,
    };
  }, [zoom, viewMode, transcriptRead, isOpen, document.id]);

  // Tecla Escape e atalhos de teclado (+ / - / 0)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        setZoom(z => Math.min(2.25, Number((z + 0.25).toFixed(2))));
      } else if (e.key === '-') {
        setZoom(z => Math.max(1, Number((z - 0.25).toFixed(2))));
      } else if (e.key === '0') {
        setZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const extractedCount = document.clues.filter(c => extractedClueIds.includes(c.id)).length;

  const handleMouseMoveImage = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!loupeActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoupePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      visible: true,
    });
  };

  return (
    <div
      role="dialog"
      data-immersive-modal="true"
      aria-modal="true"
      aria-labelledby="inspector-modal-title"
      onClick={e => {
        if (e.target === e.currentTarget) {
          soundEngine.playMechanicalClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-[115] flex items-center justify-center p-2 sm:p-4 bg-[#03050A]/80 backdrop-blur-xl animate-in fade-in duration-200 font-sans"
    >
      <ClueFlyToken token={flyingClue} />
      <div className="relative w-[96vw] max-w-[1440px] h-[90dvh] rounded-2xl bg-gradient-to-b from-[#101828] via-[#0A101C] to-[#060A12] border-2 border-amber-400/55 shadow-[0_25px_95px_rgba(0,0,0,0.95),0_0_60px_rgba(212,175,55,0.22)] overflow-hidden flex flex-col font-sans game-modal-object game-light-scan">
        
        {/* Top Bar do Visualizador (Sem Serifa no Título Operacional!) */}
        <div className="px-4 sm:px-5 py-3 bg-[#060A12] border-b border-amber-500/25 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-cyan-400">
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{document.code}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 truncate">{document.typeLabel}</span>
              <span className={`hidden md:inline-block px-2 py-0.5 rounded border text-[9px] ${theme.headerBadge}`}>
                {theme.eraStamp}
              </span>
            </div>
            <h3
              id="inspector-modal-title"
              className="font-sans text-base sm:text-lg font-bold text-white truncate mt-0.5 tracking-normal"
            >
              {document.title}
            </h3>
          </div>

          {/* Alternador de Visualização (Dividido / Imagem / Transcrição) + Botão Fechar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-[#0B1320] border border-slate-700 rounded-lg p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'split'
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Exibir Imagem e Transcrição lado a lado"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dividido</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('image')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'image'
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Focar apenas na Imagem Histórica"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imagem</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('transcript');
                  setTranscriptRead(true);
                }}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'transcript'
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Focar apenas na Transcrição e Pistas"
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Transcrição</span>
              </button>
            </div>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="game-btn-capsule p-2 cursor-pointer shrink-0"
              title="Fechar visualizador (Tecla Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Status de Inspeção da Peça Documental */}
        <div className="px-4 sm:px-5 py-2 bg-[#080E1A] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Camada Visual Examinada
            </span>
            <span
              className={`inline-flex items-center gap-1 ${
                transcriptRead || extractedCount > 0 ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Transcrição Inspecionada
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              Pistas Extraídas: <strong>{extractedCount}/{document.clues.length}</strong>
            </span>
          </div>
          <div className="text-slate-400 flex items-center gap-1.5 truncate">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{theme.materialLabel}</span>
          </div>
        </div>

        {/* Corpo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar min-h-0">
          
          {/* Lado Esquerdo: Imagem / Reconstrução com Zoom e Lupa Interativa */}
          {(viewMode === 'split' || viewMode === 'image') && (
            <div
              className={`${
                viewMode === 'image' ? 'lg:col-span-12' : 'lg:col-span-6'
              } bg-[#050811] border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col justify-between min-h-[260px] sm:min-h-[380px] min-w-0`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{document.dateLabel}</span>
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Botão da Lupa que acompanha o cursor */}
                  <button
                    type="button"
                    onClick={() => setLoupeActive(l => !l)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                      loupeActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-[#0B1320] text-slate-300 border-slate-700 hover:border-amber-500/40'
                    }`}
                    title="Ativar lupa óptica que acompanha o cursor"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Lupa 2.5x</span>
                  </button>

                  {/* Controles de Zoom */}
                  <div className="flex items-center gap-0.5 bg-[#0B1320] border border-slate-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoom(z => Math.max(1, Number((z - 0.25).toFixed(2))))}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                      title="Reduzir zoom (-)"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-[11px] font-mono text-amber-300">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom(z => Math.min(2.25, Number((z + 0.25).toFixed(2))))}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                      title="Ampliar zoom (+)"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer"
                      title="Restaurar tamanho (0)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewport de Zoom + Lupa Óptica */}
              <div
                onMouseMove={handleMouseMoveImage}
                onMouseLeave={() => setLoupePos(p => ({ ...p, visible: false }))}
                className={`relative flex-1 rounded-xl overflow-auto custom-scrollbar border border-amber-500/25 bg-black flex items-center justify-center min-h-[220px] ${
                  loupeActive ? 'cursor-crosshair' : 'cursor-grab'
                }`}
              >
                <img
                  src={caseImage}
                  alt={document.title}
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    filter: theme.imgFilter,
                  }}
                  className="max-h-[340px] w-auto object-contain transition-transform duration-200 select-none"
                />

                {/* Selo explícito de Reconstrução Visual */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 border border-amber-500/35 text-[10px] font-mono text-amber-300 uppercase tracking-wider pointer-events-none">
                  [Reconstrução Visual // Evidência Contextual]
                </div>

                {/* Lente da Lupa que acompanha o cursor */}
                {loupeActive && loupePos.visible && (
                  <div
                    className="pointer-events-none absolute w-36 h-36 rounded-full border-2 border-amber-400 shadow-[0_0_25px_rgba(0,0,0,0.9)] overflow-hidden z-20"
                    style={{
                      left: `calc(${loupePos.x}% - 72px)`,
                      top: `calc(${loupePos.y}% - 72px)`,
                      backgroundImage: `url(${caseImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '260% 260%',
                      backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                      filter: theme.imgFilter,
                    }}
                  />
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <span className="truncate">{locationSubtitle}</span>
                <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fonte Histórica Catalogada
                </span>
              </div>
            </div>
          )}

          {/* Lado Direito: Transcrição Integral com Aparência da Era & Trechos Selecionáveis */}
          {(viewMode === 'split' || viewMode === 'transcript') && (
            <div
              ref={transcriptRef}
              onScroll={e => {
                const top = e.currentTarget.scrollTop;
                setTranscriptRead(true);
                if (docSessionMemory[document.id]) {
                  docSessionMemory[document.id].scrollTop = top;
                }
              }}
              className={`${
                viewMode === 'transcript' ? 'lg:col-span-12' : 'lg:col-span-6'
              } p-4 sm:p-5 space-y-5 overflow-y-auto custom-scrollbar min-w-0`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  <span>Transcrição Documental Integral</span>
                  <span className="text-cyan-400">[Posição de leitura salva]</span>
                </div>
                <div className={`p-4 sm:p-5 rounded-xl ${theme.paperBg} border ${theme.paperBorder} ${theme.textStyle} text-sm sm:text-base leading-relaxed shadow-inner space-y-2`}>
                  <div className="text-[10px] font-mono uppercase tracking-widest opacity-75 border-b border-white/10 pb-1.5">
                    {theme.eraStamp}
                  </div>
                  <p className="leading-relaxed">"{document.fullText}"</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                  Trechos Destacados para Extração ({document.clues.length})
                </div>

                {document.clues.map(clue => {
                  const isSaved = extractedClueIds.includes(clue.id);
                  return (
                    <div
                      key={clue.id}
                      onClick={e => {
                        if (!isSaved) {
                          setFlyingClue({
                            id: Date.now(),
                            title: clue.title,
                            startX: e.clientX || window.innerWidth / 2,
                            startY: e.clientY || window.innerHeight / 2,
                          });
                          setTimeout(() => setFlyingClue(null), 680);
                        }
                        onExtractClue(clue.id, clue.xpReward, clue.isContradiction);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSaved
                          ? 'bg-emerald-950/30 border-emerald-500/50'
                          : 'bg-[#060A12]/90 border-amber-500/45 hover:border-amber-300 game-hotspot-artifact cursor-game-inspect'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm font-bold text-white">
                            {clue.title}
                          </span>
                          {clue.isContradiction && (
                            <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                              Contradição
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 cursor-pointer ${
                            isSaved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'game-btn-primary px-3.5 py-1.5'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5" /> Pista Guardada
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5" /> GUARDAR PISTA
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-sm font-sans text-amber-100/95 bg-amber-500/10 border-l-2 border-amber-400 pl-3 py-1 rounded-r leading-relaxed">
                        {clue.excerpt}
                      </p>

                      {isSaved && (
                        <div className="text-xs font-mono text-cyan-300 pt-2 border-t border-white/10 leading-relaxed">
                          Nota de Análise: {clue.analysisNote}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rodapé Tático do Inspetor Documental */}
          <div className="pt-4 mt-4 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-300">
              Pistas catalogadas neste documento:{' '}
              <strong className="text-amber-300 font-bold">
                {extractedCount}/{document.clues.length}
              </strong>
            </span>
            <GameButton size="sm" onClick={onClose}>
              CONCLUIR INSPEÇÃO DO DOCUMENTO
            </GameButton>
          </div>

        </div>

      </div>
    </div>
  );
};
