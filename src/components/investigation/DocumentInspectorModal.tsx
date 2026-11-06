import React, { useState } from 'react';
import { EvidenceDocument } from '../../types/investigation';
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
} from 'lucide-react';

interface DocumentInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: EvidenceDocument;
  caseImage: string;
  locationSubtitle: string;
  extractedClueIds: string[];
  onExtractClue: (clueId: string, xpReward: number, isContradiction?: boolean) => void;
}

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  isOpen,
  onClose,
  document,
  caseImage,
  locationSubtitle,
  extractedClueIds,
  onExtractClue,
}) => {
  const [zoom, setZoom] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl bg-[#0B1320] border border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-sans">
        
        {/* Top Bar do Visualizador */}
        <div className="px-5 py-3.5 bg-[#060A12] border-b border-amber-500/25 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cyan-400">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{document.code}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 truncate">{document.typeLabel}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
              {document.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors shrink-0"
            title="Fechar visualizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Principal: Imagem Ampliável à Esquerda + Transcrição e Pistas à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Lado Esquerdo (6 cols): Imagem / Fac-símile com Controles de Zoom */}
          <div className="lg:col-span-6 bg-[#050811] border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col justify-between min-h-[280px] sm:min-h-[380px]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{document.dateLabel}</span>
              </span>

              <div className="flex items-center gap-1 bg-[#0B1320] border border-slate-700 rounded-lg p-1 shrink-0">
                <button
                  onClick={() => setZoom(z => Math.max(1, Number((z - 0.25).toFixed(2))))}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="Reduzir zoom"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[11px] font-mono text-amber-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(2.25, Number((z + 0.25).toFixed(2))))}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="Ampliar zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer"
                  title="Restaurar tamanho"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Viewport de Zoom da Imagem */}
            <div className="relative flex-1 rounded-xl overflow-auto custom-scrollbar border border-amber-500/25 bg-black flex items-center justify-center min-h-[240px]">
              <img
                src={caseImage}
                alt={document.title}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                className="max-h-[340px] w-auto object-contain transition-transform duration-200 select-none filter sepia-[0.25] contrast-110"
              />
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="truncate">{locationSubtitle}</span>
              <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" /> Fonte Verificada
              </span>
            </div>
          </div>

          {/* Lado Direito (6 cols): Transcrição Integral & Trechos Selecionáveis */}
          <div className="lg:col-span-6 p-5 space-y-5 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Transcrição Documental
              </div>
              <div className="p-4 rounded-xl bg-[#060A12] border border-amber-500/30 text-sm sm:text-base text-slate-100 leading-relaxed">
                "{document.fullText}"
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                Trechos Selecionáveis ({document.clues.length})
              </div>

              {document.clues.map(clue => {
                const isSaved = extractedClueIds.includes(clue.id);
                return (
                  <div
                    key={clue.id}
                    onClick={() => onExtractClue(clue.id, clue.xpReward, clue.isContradiction)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSaved
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-[#060A12] border-amber-500/40 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white">
                        {clue.title}
                      </span>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 cursor-pointer ${
                          isSaved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
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

                    <p className="text-sm text-slate-200 leading-relaxed">
                      {clue.excerpt}
                    </p>

                    {isSaved && (
                      <div className="text-xs font-mono text-cyan-300 pt-2 border-t border-white/10">
                        {clue.analysisNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
