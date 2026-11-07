import React, { useState, useEffect } from 'react';
import {
  HypothesisThesis,
  HistoricalNode,
} from '../../types/investigation';
import { soundEngine } from '../../utils/investigationAudio';
import {
  Info,
  FolderOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  FileText,
  BookmarkCheck,
  Check,
  Lightbulb,
  RotateCcw,
  X,
} from 'lucide-react';
import { ExtractedClueItem } from './CrossExamination3DStage';

interface ForensicAnalysis3DStageProps {
  selectedCase: HistoricalNode;
  theses: HypothesisThesis[];
  chosenThesisId: string;
  expandedThesisId: string | null;
  hypothesisClues: string[];
  reasoningText: string;
  isNotesOpen: boolean;
  hypothesisResult: {
    score: 'forte' | 'parcial' | 'fraca';
    feedback: string;
    xpAwarded: number;
  } | null;
  extractedCluesList: ExtractedClueItem[];
  allCaseClues: ExtractedClueItem[];
  allCaseCluesCount: number;
  onSelectThesis: (id: string) => void;
  onToggleExpandThesis: (id: string) => void;
  onToggleHypothesisClue: (clueId: string) => void;
  onUpdateReasoningText: (text: string) => void;
  onToggleNotesOpen: () => void;
  onSubmitHypothesis: () => void;
  onSelectStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onOpenArchiveDrawer: () => void;
  onSwitchTo2D: () => void;
}

export const ForensicAnalysis3DStage: React.FC<ForensicAnalysis3DStageProps> = ({
  selectedCase,
  theses,
  chosenThesisId,
  expandedThesisId,
  hypothesisClues,
  reasoningText,
  isNotesOpen,
  hypothesisResult,
  extractedCluesList,
  allCaseClues,
  allCaseCluesCount,
  onSelectThesis,
  onToggleExpandThesis,
  onToggleHypothesisClue,
  onUpdateReasoningText,
  onToggleNotesOpen,
  onSubmitHypothesis,
  onSelectStep,
  onOpenArchiveDrawer,
  onSwitchTo2D,
}) => {
  const [camRotX, setCamRotX] = useState<number>(6);
  const [camRotY, setCamRotY] = useState<number>(0);
  const [camScale, setCamScale] = useState<number>(1.02);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [bankerLampOn, setBankerLampOn] = useState<boolean>(true);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [muted, setMuted] = useState(() => soundEngine.getSettings().mutedAll);

  useEffect(() => {
    return soundEngine.subscribe(s => setMuted(s.mutedAll));
  }, []);

  useEffect(() => {
    if (!isAutoOrbiting) return;
    let frameId: number;
    const startTime = performance.now();
    const animateOrbit = (now: number) => {
      const elapsed = (now - startTime) * 0.0012;
      setCamRotY(Math.sin(elapsed) * 4.5);
      setCamRotX(6 + Math.cos(elapsed * 0.8) * 2.5);
      frameId = requestAnimationFrame(animateOrbit);
    };
    frameId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbiting]);

  const availableClues = extractedCluesList.length > 0 ? extractedCluesList : allCaseClues;

  const caseShortHeader = `${selectedCase.missionCode?.split('//')[0]?.trim() || 'CASO 001'} // ${
    selectedCase.missionTitle || selectedCase.title
  }`;

  return (
    <div className="relative min-h-[92vh] w-full bg-[#04060B] select-none font-sans space-y-5 pb-12">
      {/* 1. HUD SUPERIOR DA SALA DE ANÁLISE */}
      <div className="rounded-2xl bg-[#070B14]/95 backdrop-blur-md border border-slate-800 p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
                {caseShortHeader} ({selectedCase.name})
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                Etapa 3 — Sala de Análise & Pasta Pericial (Formular Hipótese)
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                setBriefingOpen(o => !o);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                briefingOpen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#0B1320] border-slate-700 text-slate-300 hover:border-amber-400/50'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Briefing</span>
            </button>

            <button
              type="button"
              onClick={onSwitchTo2D}
              className="px-3 py-1.5 rounded-xl bg-[#0B1320] hover:bg-[#131D31] border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>[ Modo 2D ]</span>
            </button>

            <button
              type="button"
              onClick={onOpenArchiveDrawer}
              className="px-3 py-1.5 rounded-xl bg-[#0B1320] hover:bg-[#131D31] border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Arquivo ({extractedCluesList.length}/{allCaseCluesCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBankerLampOn(v => !v)}
              className="p-1.5 rounded-xl bg-[#0B1320] border border-slate-700 text-amber-300 hover:text-white cursor-pointer"
              title="Luminária de Mesa"
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => soundEngine.updateSettings({ mutedAll: !muted })}
              className="p-1.5 rounded-xl bg-[#0B1320] border border-slate-700 text-cyan-300 hover:text-white cursor-pointer"
              title={muted ? 'Reativar Áudio' : 'Silenciar'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {briefingOpen && (
          <div className="p-4 rounded-xl bg-[#050811] border border-amber-500/35 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start justify-between gap-4 animate-in fade-in duration-150">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                OBJETIVO TÁTICO DA ETAPA 3
              </div>
              <p>
                Analise as interpretações periciais do caso, escolha a hipótese que melhor se sustenta
                e anexe as evidências correspondentes para testar a consistência do seu compêndio.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBriefingOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. CENÁRIO 3D: PASTA CONFIDENCIAL ABERTA SOBRE A MESA DE ANÁLISE */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-amber-500/40 bg-[#070B14] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${camScale}) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`,
          }}
        >
          <img
            src="/dossiers/forensic_analysis_room_3d_clean.webp"
            alt="Sala de Análise e Pasta Pericial"
            draggable={false}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
            style={{
              filter: bankerLampOn
                ? 'brightness(0.95) contrast(1.06)'
                : 'brightness(0.65) contrast(1.1) saturate(0.85)',
            }}
          />

          {bankerLampOn && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 75% 35%, rgba(251, 191, 36, 0.16) 0%, rgba(6, 182, 212, 0.06) 42%, transparent 75%)',
              }}
            />
          )}
        </div>

        <div className="relative z-30 p-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playDocumentOpen();
              setIsAutoOrbiting(o => !o);
            }}
            className={`px-3 py-1 rounded-xl backdrop-blur-md border text-xs font-mono cursor-pointer transition-all ${
              isAutoOrbiting
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                : 'bg-[#0B111E]/85 border-cyan-500/40 text-cyan-300 hover:border-amber-400/60'
            }`}
          >
            [ {isAutoOrbiting ? 'Pausar Órbita' : 'Orbitar Sala 3D'} ]
          </button>

          {(camRotX !== 6 || camRotY !== 0 || camScale !== 1.02) && (
            <button
              type="button"
              onClick={() => {
                setIsAutoOrbiting(false);
                setCamRotX(6);
                setCamRotY(0);
                setCamScale(1.02);
              }}
              className="p-1.5 rounded-xl bg-[#0B111E]/85 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Centralizar Mesa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Conteúdo Diegético Sobre a Pasta de Couro / Papel de Arquivo */}
        <div className="relative z-20 p-5 sm:p-8 lg:p-10 space-y-7">
          <div className="border-b border-amber-500/30 pb-4 flex flex-wrap items-center justify-between gap-3 bg-[#0B1322]/85 backdrop-blur-md p-4 rounded-xl">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4" /> COMPÊNDIO PERICIAL // REGISTRO DE TESE
              </span>
              <h3 className="font-sans text-lg sm:text-2xl font-bold text-white">
                Qual interpretação explica com maior consistência material o caso investigado?
              </h3>
            </div>

            {chosenThesisId && (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>REGISTRADO NO COMPÊNDIO</span>
              </div>
            )}
          </div>

          {/* Fichas Periciais de Hipóteses (Fontes Confortáveis >= 16px) */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold px-1">
              Fichas Periciais Disponíveis (Toque para registrar no compêndio):
            </div>

            <div className="grid grid-cols-1 gap-4">
              {theses.map(th => {
                const isSelected = chosenThesisId === th.id;
                const isExpanded = expandedThesisId === th.id;

                return (
                  <div
                    key={th.id}
                    onClick={() => {
                      soundEngine.playDocumentOpen();
                      onSelectThesis(th.id);
                    }}
                    className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                        : 'bg-[#080E1A]/90 backdrop-blur-md border-slate-700/80 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="px-3 py-1 rounded-lg bg-amber-500/25 text-amber-300 border border-amber-400/50 text-xs font-mono font-bold shrink-0">
                          {th.tag}
                        </span>
                        <span className="font-sans text-base sm:text-lg font-bold text-white">
                          {th.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onToggleExpandThesis(th.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes da tese'}
                        </button>

                        {isSelected ? (
                          <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>REGISTRADO NO COMPÊNDIO</span>
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-slate-400 hover:text-amber-300">
                            Toque para registrar
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-sans text-cyan-300 leading-relaxed">
                      {th.subtitle}
                    </p>

                    {isExpanded && (
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed pt-3 border-t border-slate-800">
                        {th.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anexação Física das Evidências Coletadas */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#080E1A]/90 backdrop-blur-md border border-slate-700/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Anexe de 1 a 3 evidências físicas para sustentar a hipótese ({hypothesisClues.length} anexadas):
              </span>
              <span className="text-xs font-mono text-slate-400">
                A sustentação determina o mérito pericial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {availableClues.map(clue => {
                const checked = hypothesisClues.includes(clue.id);
                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playDocumentOpen();
                      onToggleHypothesisClue(clue.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      checked
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-[#0B1322] border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 mt-0.5 ${
                        checked
                          ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                        {clue.docCode.split('//')[0]}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-2">
                        {clue.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caderno de Anotação Pericial (Opcional) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onToggleNotesOpen}
              className="text-xs sm:text-sm font-mono text-slate-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              {isNotesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{isNotesOpen ? 'Ocultar anotação pericial' : '+ Adicionar raciocínio de sustentação no caderno (opcional)'}</span>
            </button>

            {isNotesOpen && (
              <textarea
                rows={3}
                value={reasoningText}
                onChange={e => onUpdateReasoningText(e.target.value)}
                placeholder="Descreva a cadeia de fatos que sustenta a sua tese pericial..."
                className="mt-2.5 w-full p-4 rounded-xl bg-[#060A12] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            )}
          </div>

          {/* Botão de Validação no Compêndio */}
          <button
            onClick={onSubmitHypothesis}
            disabled={!chosenThesisId}
            className={`w-full py-4 px-6 rounded-xl font-sans font-bold text-xs sm:text-sm uppercase tracking-wider transition-all ${
              chosenThesisId
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Validar e Registrar Hipótese no Compêndio
          </button>

          {/* Feedback de Consistência */}
          {hypothesisResult && (
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-3 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-mono uppercase text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Grau de Consistência:{' '}
                  {hypothesisResult.score === 'forte'
                    ? 'Alta Consistência (Blindada por Provas)'
                    : hypothesisResult.score === 'parcial'
                    ? 'Consistência Parcial'
                    : 'Baixa Consistência'}
                </span>
                <span className="text-xs sm:text-sm font-mono text-amber-300 font-bold">
                  +{hypothesisResult.xpAwarded} XP
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {hypothesisResult.feedback}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. NAVEGAÇÃO ENTRE ETAPAS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1320]/95 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => onSelectStep(2)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
        >
          ← Voltar à Mesa de Conexões (Etapa 2)
        </button>

        <button
          type="button"
          onClick={() => {
            if (chosenThesisId && !hypothesisResult) {
              onSubmitHypothesis();
            }
            soundEngine.playDocumentOpen();
            onSelectStep(4);
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Avançar para Etapa 4: Tomar Decisão</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
