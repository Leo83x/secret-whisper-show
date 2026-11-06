import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  FileSearch,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  BookmarkPlus,
  BookmarkCheck,
  GitCommit,
  Sparkles,
  Scale,
  Award,
  Check,
  XCircle,
  Eye,
  ArrowRight,
  AlertCircle,
  ZoomIn,
  Maximize2,
  BellRing,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { DocumentInspectorModal, getEraDocumentTheme } from './DocumentInspectorModal';
import { DiscoveryRevealModal } from './DiscoveryRevealModal';
import { soundEngine } from '../../utils/investigationAudio';

export const DossierInvestigationView: React.FC = () => {
  const {
    selectedCase,
    allNodes,
    state,
    setActiveStep,
    setActiveTab,
    selectCase,
    getCasePlayProgress,
    getCaseXpBreakdown,
    areCaseConnectionsUnlocked,
    extractClue,
    attemptConnection,
    submitStructuredHypothesis,
    submitSimulationDecision,
  } = useInvestigation();

  const progress = getCasePlayProgress(selectedCase.id);
  const xpBreakdown = getCaseXpBreakdown(selectedCase.id);
  const mapConnectionsUnlocked = areCaseConnectionsUnlocked(selectedCase.id);

  const documents = selectedCase.documents || [];
  const challenges = selectedCase.connectionChallenges || [];
  const theses = selectedCase.hypothesisTheses || [];
  const simChoices = selectedCase.simulationChoices || [];

  // Estado local da Etapa 1 (Documento aberto na lupa + Zoom Modal + Alertas)
  const [activeDocId, setActiveDocId] = useState<string>(documents[0]?.id || '');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [examinedDocIds, setExaminedDocIds] = useState<string[]>(
    documents[0]?.id ? [documents[0].id] : []
  );
  const [contradictionAlert, setContradictionAlert] = useState<string | null>(null);
  const [discoveryModal, setDiscoveryModal] = useState<{
    open: boolean;
    title: string;
    conclusion: string;
  } | null>(null);

  // Estado local da Etapa 2 (Desafio selecionado e 2 pistas marcadas na Mesa)
  const [activeChallengeId, setActiveChallengeId] = useState<string>(challenges[0]?.id || '');
  const [boardSelectedClues, setBoardSelectedClues] = useState<string[]>([]);
  const [connectionFeedback, setConnectionFeedback] = useState<{
    type: 'success' | 'error';
    title?: string;
    message: string;
    unlockedMap?: boolean;
  } | null>(null);

  // Estado local da Etapa 3 (Construção da Hipótese)
  const [chosenThesisId, setChosenThesisId] = useState<string>(
    progress.selectedThesisId || theses[0]?.id || ''
  );
  const [hypothesisClues, setHypothesisClues] = useState<string[]>(
    progress.attachedClueIds || []
  );
  const [reasoningText, setReasoningText] = useState<string>(
    progress.hypothesisReasoning || state.personalNotes[selectedCase.id] || ''
  );
  const [hypothesisResult, setHypothesisResult] = useState<{
    score: 'forte' | 'parcial' | 'fraca';
    feedback: string;
    xpAwarded: number;
  } | null>(null);

  useEffect(() => {
    const firstId = selectedCase.documents?.[0]?.id || '';
    setActiveDocId(firstId);
    setExaminedDocIds(firstId ? [firstId] : []);
    setContradictionAlert(null);
    setIsInspectorOpen(false);
    setActiveChallengeId(selectedCase.connectionChallenges?.[0]?.id || '');
    setBoardSelectedClues([]);
    setConnectionFeedback(null);
    const p = getCasePlayProgress(selectedCase.id);
    setChosenThesisId(p.selectedThesisId || selectedCase.hypothesisTheses?.[0]?.id || '');
    setHypothesisClues(p.attachedClueIds || []);
    setReasoningText(p.hypothesisReasoning || state.personalNotes[selectedCase.id] || '');
    setHypothesisResult(null);
  }, [selectedCase.id]);

  // Lista plana de todas as pistas do caso
  const allCaseClues = documents.flatMap(doc =>
    doc.clues.map(clue => ({ ...clue, docCode: doc.code, docTitle: doc.title }))
  );
  const extractedCluesList = allCaseClues.filter(c =>
    progress.extractedClueIds.includes(c.id)
  );
  const ignoredCluesList = allCaseClues.filter(
    c => !progress.extractedClueIds.includes(c.id)
  );

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];
  const eraTheme = getEraDocumentTheme(selectedCase.id);
  const activeChallenge =
    challenges.find(c => c.id === activeChallengeId) || challenges[0];

  const handleSelectDoc = (docId: string) => {
    setActiveDocId(docId);
    setExaminedDocIds(prev => (prev.includes(docId) ? prev : [...prev, docId]));
    soundEngine.playDocumentOpen();
  };

  const handleOpenInspector = () => {
    if (activeDoc) {
      setExaminedDocIds(prev =>
        prev.includes(activeDoc.id) ? prev : [...prev, activeDoc.id]
      );
    }
    soundEngine.playDocumentOpen();
    setIsInspectorOpen(true);
  };

  const handleExtractClueWithFeedback = (
    clueId: string,
    xpReward: number,
    isContradiction?: boolean,
    clueTitle?: string
  ) => {
    const alreadySaved = progress.extractedClueIds.includes(clueId);
    extractClue(selectedCase.id, clueId, xpReward);
    if (!alreadySaved) {
      if (isContradiction) {
        soundEngine.playContradictionAlert();
        setContradictionAlert(
          `Inconsistência documental registrada: "${clueTitle || 'Evidência crítica'}" contradiz a versão oficial do episódio.`
        );
      } else {
        soundEngine.playClueSaved();
      }
    }
  };

  const toggleBoardClue = (clueId: string) => {
    setConnectionFeedback(null);
    setBoardSelectedClues(prev => {
      if (prev.includes(clueId)) return prev.filter(id => id !== clueId);
      if (prev.length >= 2) return [prev[1], clueId];
      return [...prev, clueId];
    });
  };

  const handleValidateConnection = () => {
    if (!activeChallenge || boardSelectedClues.length !== 2) return;
    const wasAlreadySolved = progress.solvedConnectionIds.includes(activeChallenge.id);
    const res = attemptConnection(selectedCase.id, activeChallenge.id, [
      boardSelectedClues[0],
      boardSelectedClues[1],
    ]);
    setConnectionFeedback({
      type: res.success ? 'success' : 'error',
      title: res.title,
      message: res.message,
      unlockedMap: res.unlockedMap,
    });
    if (res.success) {
      if (!wasAlreadySolved) {
        soundEngine.playDiscoveryReveal();
        setDiscoveryModal({
          open: true,
          title: res.title || activeChallenge.successTitle,
          conclusion: res.message,
        });
      } else {
        soundEngine.playClueSaved();
      }
      setBoardSelectedClues([]);
      const nextUnsolved = challenges.find(
        c => c.id !== activeChallenge.id && !progress.solvedConnectionIds.includes(c.id)
      );
      if (nextUnsolved) {
        setTimeout(() => {
          setActiveChallengeId(nextUnsolved.id);
        }, 1200);
      }
    } else {
      soundEngine.playErrorPulse();
    }
  };

  const toggleHypothesisClue = (clueId: string) => {
    setHypothesisClues(prev => {
      if (prev.includes(clueId)) return prev.filter(id => id !== clueId);
      if (prev.length >= 3) return [...prev.slice(1), clueId];
      return [...prev, clueId];
    });
  };

  const handleSubmitHypothesis = () => {
    if (!chosenThesisId) return;
    const res = submitStructuredHypothesis(
      selectedCase.id,
      chosenThesisId,
      hypothesisClues,
      reasoningText
    );
    setHypothesisResult(res);
    soundEngine.playClueSaved();
  };

  const handleSelectSimulationDecision = (choiceId: string) => {
    submitSimulationDecision(selectedCase.id, choiceId);
    soundEngine.playCaseConclusion();
    setActiveStep(5);
  };

  const steps: { num: 1 | 2 | 3 | 4 | 5; short: string; full: string; done: boolean }[] = [
    {
      num: 1,
      short: '1. Observar',
      full: '1. Observar Evidências',
      done: progress.extractedClueIds.length > 0,
    },
    {
      num: 2,
      short: '2. Conectar',
      full: '2. Mesa de Conexões',
      done:
        challenges.length > 0 &&
        progress.solvedConnectionIds.length >= challenges.length,
    },
    {
      num: 3,
      short: '3. Hipótese',
      full: '3. Formular Hipótese',
      done: Boolean(progress.selectedThesisId),
    },
    {
      num: 4,
      short: '4. Decidir',
      full: '4. Tomar Decisão',
      done: Boolean(progress.selectedDecisionId),
    },
    {
      num: 5,
      short: '5. Resultado',
      full: '5. Consequências',
      done: progress.completed,
    },
  ];

  const volumeOneCases = allNodes.filter(n => n.isVolumeOne);

  // Dados para o Relatório Final (Etapa 5)
  const registeredThesis = theses.find(t => t.id === progress.selectedThesisId);
  const usedEvidenceObjects = allCaseClues.filter(c =>
    progress.attachedClueIds.includes(c.id)
  );
  const validatedChallenges = challenges.filter(ch =>
    progress.solvedConnectionIds.includes(ch.id)
  );
  const unprovenChallenges = challenges.filter(
    ch => !progress.solvedConnectionIds.includes(ch.id)
  );

  return (
    <div className="space-y-6 mt-2">
      
      {/* 1. CABEÇALHO DA MISSÃO & SELETOR DE CASO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <button
              onClick={() => setActiveTab('mapa')}
              className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Mapa Mundial
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              {selectedCase.missionCode || 'DOSSIÊ ATIVO'} — {selectedCase.missionTitle || selectedCase.title}
            </span>
          </div>

          <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-white uppercase">
            {selectedCase.fullName}{' '}
            <span className="text-amber-400 font-normal text-base sm:text-xl">
              ({selectedCase.year})
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5 max-w-3xl">
            {selectedCase.shortDescription}
          </p>
        </div>

        {/* Telemetria Rápida da Partida + Troca de Caso */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2 min-w-0 max-w-full">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0B1320] border border-amber-500/30 font-mono text-xs text-amber-300">
              Arquivo Pessoal: <strong>{progress.extractedClueIds.length}/{allCaseClues.length} Pistas</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs text-cyan-300">
              +{progress.xpEarned} XP no Caso
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {volumeOneCases.map(c => {
              const active = c.id === selectedCase.id;
              const done = state.completedNodes.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => selectCase(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                    active
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                      : 'bg-[#0B1320]/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{c.name}</span>
                  {done && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. BARRA DO CICLO DE INVESTIGAÇÃO (5 ETAPAS) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#0B1320]/95 border border-amber-500/25 shadow-lg">
        {steps.map(st => {
          const isCurrent = state.activeStep === st.num;
          return (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`py-2.5 px-3 rounded-xl font-mono text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isCurrent
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : st.done
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {st.done && !isCurrent ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : null}
              <span className="truncate">
                <span className="sm:hidden">{st.short}</span>
                <span className="hidden sm:inline">{st.full}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* REAÇÃO DO TERMINAL À INVESTIGAÇÃO (AMBIENTE VIVO) */}
      {(extractedCluesList.length > 0 || progress.solvedConnectionIds.length > 0) && (
        <div className="px-3.5 py-2.5 rounded-xl bg-[#080F1E] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300 min-w-0">
            <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="uppercase tracking-wider font-bold shrink-0">Estado do Terminal:</span>
            <span className="text-slate-300 truncate">
              {mapConnectionsUnlocked
                ? 'Ressonância intertemporal ativa — Novos arcos liberados no Mapa Mundial'
                : extractedCluesList.some(c => c.isContradiction)
                ? 'Divergência histórica catalogada — Pronta para cruzamento na Etapa 2'
                : `${extractedCluesList.length} evidência(s) indexada(s) no Arquivo Pessoal`}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
              Docs examinados: {examinedDocIds.length}/{documents.length}
            </span>
            {mapConnectionsUnlocked && (
              <button
                onClick={() => setActiveTab('mapa')}
                className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer"
              >
                Ver Arco no Mapa →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ALERTA CONTEXTUAL DE AUDITORIA (QUANDO CONTRADIÇÃO É DESCOBERTA) */}
      {contradictionAlert && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-4 animate-in fade-in duration-200 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                ALERTA DE AUDITORIA // CONTRADIÇÃO DOCUMENTAL DETECTADA
              </div>
              <p className="text-xs sm:text-sm font-sans text-slate-200 mt-0.5">
                {contradictionAlert}
              </p>
            </div>
          </div>
          <button
            onClick={() => setContradictionAlert(null)}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 shrink-0 cursor-pointer"
          >
            Ciente
          </button>
        </div>
      )}

      {/* =====================================================================
          ETAPA 1 — OBSERVAR (EXAMINAR DOCUMENTOS E EXTRAIR PISTAS)
         ===================================================================== */}
      {state.activeStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Coluna Esquerda (4 cols): Lista de Documentos e Fontes do Caso */}
          <div className="lg:col-span-4 min-w-0 space-y-3 rounded-2xl bg-[#0B1320]/95 border border-amber-500/25 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                  Peças Documentais ({documents.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Selecione para abrir
              </span>
            </div>

            <div className="space-y-2.5">
              {documents.map(doc => {
                const isSelected = activeDoc?.id === doc.id;
                const extractedInDoc = doc.clues.filter(c =>
                  progress.extractedClueIds.includes(c.id)
                ).length;
                const allExtracted = extractedInDoc === doc.clues.length;

                return (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-[#060A12]/80 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                        {doc.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          allExtracted
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {extractedInDoc}/{doc.clues.length} pistas
                      </span>
                    </div>
                    <div className="font-sans text-sm font-bold text-white">
                      {doc.title}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>
                    {examinedDocIds.includes(doc.id) && (
                      <div className="pt-1 flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                        <Check className="w-3 h-3" /> [Camada Desclassificada]
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna Central (5 cols): Mesa de Leitura e Inspeção do Documento Ativo */}
          {activeDoc && (
            <div className="lg:col-span-5 min-w-0 space-y-4 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                    {activeDoc.typeLabel} // {activeDoc.dateLabel}
                  </span>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-white mt-0.5">
                    {activeDoc.title}
                  </h3>
                </div>
                <button
                  onClick={handleOpenInspector}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-sans font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  title="Inspecionar Documento com Zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Ampliar / Zoom</span>
                </button>
              </div>

              {/* Miniatura Visual do Registro com Identificação de Reconstrução & Lupa */}
              <div
                onClick={handleOpenInspector}
                className="relative h-32 rounded-xl overflow-hidden border border-amber-500/25 bg-[#060A12] group cursor-pointer"
              >
                <img
                  src={selectedCase.dossierCover || selectedCase.image}
                  alt={activeDoc.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                  style={{ filter: eraTheme.imgFilter }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060A12] via-[#060A12]/35 to-transparent" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#060A12]/90 border border-amber-500/35 text-[9px] sm:text-[10px] font-mono text-amber-300 uppercase tracking-wider">
                  [Reconstrução Visual] // {activeDoc.code}
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-sans font-semibold flex items-center gap-1.5 backdrop-blur-sm group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" /> Inspecionar com Zoom & Lupa
                </div>
              </div>

              {/* Suporte Documental Individualizado por Período Histórico */}
              <div className={`p-4 rounded-xl ${eraTheme.paperBg} border ${eraTheme.paperBorder} space-y-3 shadow-inner`}>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 border-b border-white/10 pb-1.5 flex flex-wrap items-center justify-between gap-1">
                  <span className="truncate">{eraTheme.eraStamp}</span>
                  <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3" /> FONTE CATALOGADA
                  </span>
                </div>
                <p className={`text-sm sm:text-base ${eraTheme.textStyle} leading-relaxed`}>
                  "{activeDoc.fullText}"
                </p>
                <div className="pt-1.5 border-t border-white/5 text-[11px] font-mono text-slate-400">
                  {eraTheme.materialLabel}
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Toque nos trechos abaixo para extrair ao seu Arquivo Pessoal:</span>
                </div>

                {activeDoc.clues.map(clue => {
                  const isSaved = progress.extractedClueIds.includes(clue.id);
                  return (
                    <div
                      key={clue.id}
                      onClick={() =>
                        handleExtractClueWithFeedback(
                          clue.id,
                          clue.xpReward,
                          clue.isContradiction,
                          clue.title
                        )
                      }
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSaved
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-[#060A12]/90 border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {clue.isContradiction && (
                            <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                              Inconsistência
                            </span>
                          )}
                          {clue.isOptional && (
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold uppercase">
                              Pista Opcional
                            </span>
                          )}
                          <span className="text-xs font-bold text-white">
                            {clue.title}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold shrink-0 ${
                            isSaved
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500 text-slate-950'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5" /> Guardada (+{clue.xpReward} XP)
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5" /> Guardar Pista
                            </>
                          )}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed font-sans">
                        {clue.excerpt}
                      </p>

                      {isSaved && (
                        <div className="text-xs font-mono text-cyan-300 pt-1.5 border-t border-white/10 leading-relaxed">
                          Nota de Análise: {clue.analysisNote}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coluna Direita (3 cols): Arquivo Pessoal do Investigador */}
          <div className="lg:col-span-3 min-w-0 space-y-4 rounded-2xl bg-[#0B1320]/95 border border-cyan-500/30 p-4 sm:p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Meu Arquivo Pessoal
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {extractedCluesList.length}/{allCaseClues.length}
                </span>
              </div>

              {extractedCluesList.length === 0 ? (
                <div className="p-5 rounded-xl bg-[#060A12]/60 border border-dashed border-slate-700 text-center space-y-2">
                  <BookmarkPlus className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Nenhuma pista guardada ainda. Abra os documentos ao lado e clique em <strong>Guardar Pista</strong> nos registros relevantes.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                  {extractedCluesList.map(c => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-[#060A12]/90 border border-emerald-500/30 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                        <span>{c.docCode}</span>
                        <span>+{c.xpReward} XP</span>
                      </div>
                      <div className="text-xs font-bold text-white leading-snug">
                        {c.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setActiveStep(2)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
              >
                <span>Ir para Mesa de Conexões</span>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
              {extractedCluesList.length < allCaseClues.length && (
                <p className="text-[11px] font-mono text-slate-400 text-center">
                  Você pode avançar agora ou continuar inspecionando os demais documentos.
                </p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          ETAPA 2 — CONECTAR (MESA DE INVESTIGAÇÃO E CRUZAMENTO DE EVIDÊNCIAS)
         ===================================================================== */}
      {state.activeStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Esquerda (5 cols): Perguntas de Cruzamento e Relações a Estabelecer */}
          <div className="lg:col-span-5 min-w-0 space-y-4 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 p-5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                  Relações da Investigação ({progress.solvedConnectionIds.length}/{challenges.length} Comprovadas)
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Selecione um vínculo abaixo e marque na mesa as <strong>2 evidências do seu arquivo</strong> que comprovam a relação. Se avançar sem validar um vínculo, ele será registrado como <strong>não comprovado</strong>.
            </p>

            <div className="space-y-3">
              {challenges.map(ch => {
                const isSolved = progress.solvedConnectionIds.includes(ch.id);
                const hasFailedAttempt = (progress.failedConnectionIds || []).includes(ch.id);
                const isCurrent = activeChallenge?.id === ch.id;

                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setActiveChallengeId(ch.id);
                      setConnectionFeedback(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : isSolved
                        ? 'bg-emerald-950/25 border-emerald-500/40'
                        : 'bg-[#060A12]/80 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                        Vínculo #{ch.stepNumber} {ch.unlocksMapConnections ? '// Elo Intertemporal' : ''}
                      </span>
                      {isSolved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Comprovada (+{ch.xpReward} XP)
                        </span>
                      ) : hasFailedAttempt ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-300 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30">
                          Não comprovada (Tente novamente)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          Não comprovada
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-white leading-snug">
                      {ch.question}
                    </div>

                    {isSolved ? (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                        <strong className="block text-emerald-300 mb-0.5">{ch.successTitle}:</strong>
                        {ch.successConclusion}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Dica: {ch.promptHint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direita (7 cols): Mesa de Investigação Interativa */}
          <div className="lg:col-span-7 min-w-0 space-y-5 rounded-2xl bg-[#0B1320]/95 border border-cyan-500/30 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                  MESA DE CRUZAMENTO ANALÍTICO
                </span>
                <h3 className="font-sans text-base sm:text-lg font-bold text-white mt-0.5">
                  {activeChallenge?.question}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 shrink-0">
                {boardSelectedClues.length}/2 selecionadas
              </span>
            </div>

            {extractedCluesList.length < 2 ? (
              <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto" />
                <p className="text-sm text-amber-100 leading-relaxed">
                  Você extraiu apenas {extractedCluesList.length} pista(s) até o momento. Para validar conexões na mesa são necessárias pelo menos 2 pistas no seu Arquivo Pessoal.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-sans font-bold text-sm cursor-pointer"
                  >
                    ← Voltar e Examinar Documentos
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-sans font-bold text-sm cursor-pointer"
                  >
                    Avançar sem comprovar vínculos →
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {extractedCluesList.map(clue => {
                    const isPicked = boardSelectedClues.includes(clue.id);
                    return (
                      <div
                        key={clue.id}
                        onClick={() => toggleBoardClue(clue.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isPicked
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.3)] scale-[1.01]'
                            : 'bg-[#060A12]/90 border-slate-800 hover:border-cyan-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400">{clue.docCode}</span>
                          {isPicked && (
                            <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold">
                              Na Mesa
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {clue.title}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {clue.excerpt}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Botão de Validação da Conexão */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-mono text-slate-400">
                    Selecione 2 pistas que sustentem a resposta e clique em Validar Conexão.
                  </div>
                  <button
                    onClick={handleValidateConnection}
                    disabled={boardSelectedClues.length !== 2}
                    className={`px-5 py-3 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-all shrink-0 ${
                      boardSelectedClues.length === 2
                        ? 'bg-gradient-to-r from-cyan-500 to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Validar Conexão na Mesa
                  </button>
                </div>

                {/* Feedback Analítico do Sistema */}
                {connectionFeedback && (
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-300 ${
                      connectionFeedback.type === 'success'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                        : 'bg-red-950/40 border-red-500/50 text-red-100'
                    }`}
                  >
                    {connectionFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 text-sm leading-relaxed">
                      {connectionFeedback.title && (
                        <div className="font-bold text-white">
                          {connectionFeedback.title}
                        </div>
                      )}
                      <p>{connectionFeedback.message}</p>
                      {connectionFeedback.type === 'error' && (
                        <p className="text-xs font-mono text-amber-300 pt-1">
                          Você pode selecionar outro par de pistas para tentar novamente ou avançar com este vínculo registrado como não comprovado.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs sm:text-sm font-mono text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Examinar mais documentos
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                  >
                    <span>
                      {progress.solvedConnectionIds.length < challenges.length
                        ? `Avançar para Etapa 3 (${challenges.length - progress.solvedConnectionIds.length} vínculo não comprovado)`
                        : 'Avançar para Etapa 3: Formular Hipótese'}
                    </span>
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* =====================================================================
          ETAPA 3 — FORMULAR UMA HIPÓTESE (TESE + EVIDÊNCIAS DE SUSTENTAÇÃO)
         ===================================================================== */}
      {state.activeStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Passo 3A (6 cols): Escolha da Tese Interpretativa */}
          <div className="lg:col-span-6 min-w-0 space-y-4 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 p-5">
            <div className="border-b border-amber-500/20 pb-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                PASSO 1 DA HIPÓTESE
              </span>
              <h3 className="font-sans text-base sm:text-lg font-bold text-white">
                Qual interpretação explica melhor o caso investigado?
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Não existe apenas uma resposta aceitável: uma hipótese alternativa também receberá avaliação de <strong>Alta Consistência</strong> se você anexar as evidências corretas que a fundamentam.
            </p>

            <div className="space-y-3">
              {theses.map(th => {
                const isSelected = chosenThesisId === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => setChosenThesisId(th.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#060A12]/80 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold">
                        {th.tag}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Selecionada
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-sm sm:text-base font-bold text-white">
                      {th.title}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      {th.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passo 3B e 3C (6 cols): Anexar Evidências que Sustentam a Conclusão + Raciocínio */}
          <div className="lg:col-span-6 min-w-0 space-y-4 rounded-2xl bg-[#0B1320]/95 border border-cyan-500/30 p-5">
            <div className="border-b border-cyan-500/20 pb-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                PASSO 2 & 3 DA HIPÓTESE
              </span>
              <h3 className="font-sans text-base sm:text-lg font-bold text-white">
                Vincule as Evidências de Sustentação e Registre sua Dedução
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block">
                Marque 2 ou 3 evidências do seu Arquivo Pessoal que provam sua tese ({hypothesisClues.length} anexadas):
              </label>

              {extractedCluesList.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                  Você ainda não extraiu pistas na Etapa 1. Sem evidências anexadas, sua hipótese será registrada com <strong>Baixa Consistência</strong>.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {extractedCluesList.map(clue => {
                    const checked = hypothesisClues.includes(clue.id);
                    return (
                      <div
                        key={clue.id}
                        onClick={() => toggleHypothesisClue(clue.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          checked
                            ? 'bg-cyan-500/15 border-cyan-400 text-white'
                            : 'bg-[#060A12]/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                            checked
                              ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="text-xs sm:text-sm leading-snug">
                          <strong className="text-amber-300 font-mono text-[11px] mr-1.5">
                            [{clue.docCode}]
                          </strong>
                          <span className="font-semibold">{clue.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-mono text-slate-300 block">
                Explique brevemente o seu raciocínio no Caderno de Investigação (opcional):
              </label>
              <textarea
                rows={3}
                value={reasoningText}
                onChange={e => setReasoningText(e.target.value)}
                placeholder="Descreva por que essas evidências sustentam sua interpretação..."
                className="w-full p-3 rounded-xl bg-[#060A12] border border-slate-700/80 text-sm text-slate-100 leading-relaxed focus:outline-none focus:border-amber-400 custom-scrollbar"
              />
            </div>

            <button
              onClick={handleSubmitHypothesis}
              disabled={!chosenThesisId}
              className={`w-full py-3.5 px-5 rounded-xl font-sans font-bold text-sm sm:text-base uppercase tracking-wider transition-all ${
                chosenThesisId
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Validar e Registrar Hipótese no Compêndio
            </button>

            {hypothesisResult && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono uppercase text-emerald-400 font-bold">
                    Grau de Consistência:{' '}
                    {hypothesisResult.score === 'forte'
                      ? 'Alta (Bem Fundamentada)'
                      : hypothesisResult.score === 'parcial'
                      ? 'Parcial'
                      : 'Baixa (Sem Sustentação Direta)'}
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-amber-300 font-bold">
                    +{hypothesisResult.xpAwarded} XP
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {hypothesisResult.feedback}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveStep(4)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all"
                  >
                    <span>Avançar para Etapa 4: Tomar Decisão</span>
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =====================================================================
          ETAPA 4 — DECIDIR (SITUAÇÃO SIMULADA E TENDÊNCIA DO JOGADOR)
         ===================================================================== */}
      {state.activeStep === 4 && (
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#0B1320]/95 border border-amber-500/35 p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="border-b border-amber-500/20 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              <Scale className="w-4 h-4" />
              <span>ETAPA 4 // SIMULAÇÃO DE TOMADA DE DECISÃO</span>
            </div>
            <h3 className="font-sans text-lg sm:text-2xl font-bold text-white">
              Diante do padrão identificado, qual caminho você escolheria?
            </h3>
            <p className="text-sm sm:text-base text-amber-100/95 leading-relaxed mt-2 p-4 rounded-xl bg-[#060A12]/90 border border-amber-500/30">
              {selectedCase.simulationPrompt}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {simChoices.map(choice => {
              const isSelected = progress.selectedDecisionId === choice.id;
              return (
                <div
                  key={choice.id}
                  onClick={() => handleSelectSimulationDecision(choice.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                      : 'bg-[#060A12]/85 border-slate-800 hover:border-amber-500/50 hover:bg-[#060A12]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center font-sans font-bold text-sm text-amber-300">
                        {choice.tag}
                      </span>
                      <span className="font-sans text-base sm:text-lg font-bold text-white">
                        {choice.title}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-cyan-300">
                      {choice.subtitle}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed pt-1">
                      {choice.description}
                    </p>
                  </div>

                  <button className="px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-sans font-bold text-sm shrink-0 transition-all cursor-pointer">
                    Escolher Caminho {choice.tag} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          ETAPA 5 — DESCOBRIR CONSEQUÊNCIAS (RELATÓRIO DE AUDITORIA DO CASO)
         ===================================================================== */}
      {state.activeStep === 5 && (
        <div className="space-y-6">
          
          {/* Banner Superior de Conclusão e Mérito */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1320] via-amber-950/25 to-[#0B1320] border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                <Award className="w-4 h-4" />
                <span>RELATÓRIO DE AUDITORIA // {selectedCase.missionCode}</span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white">
                Resultado da Investigação & Consequências
              </h3>
              <p className="text-sm text-slate-300">
                Conferência analítica das pistas extraídas, vínculos demonstrados, consistência da hipótese e elos revelados.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-[#060A12] border border-amber-500/40 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400">Mérito no Caso</div>
                <div className="text-lg font-mono font-bold text-amber-400">+{xpBreakdown.totalCaseXp} XP</div>
              </div>
              <button
                onClick={() => setActiveTab('mapa')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-sans font-bold text-sm uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>Voltar ao Mapa Mundial</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* COLUNA 1 (4 cols): HIPÓTESE REGISTRADA, EVIDÊNCIAS DE FUNDAMENTAÇÃO E GRAU DE CONSISTÊNCIA */}
            <div className="lg:col-span-4 min-w-0 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-white/10 pb-2">
                  1. Hipótese & Fundamentação
                </div>

                {/* Indicador 1: Hipótese Registrada */}
                <div className="p-3.5 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Hipótese Registrada:
                  </span>
                  {registeredThesis ? (
                    <>
                      <div className="text-sm font-sans font-bold text-white">
                        {registeredThesis.tag} — {registeredThesis.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {registeredThesis.subtitle}
                      </p>
                      {progress.hypothesisReasoning && (
                        <p className="text-xs text-amber-200/90 italic pt-1 border-t border-white/5 mt-1">
                          Raciocínio: "{progress.hypothesisReasoning}"
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-red-300 font-mono">
                      Nenhuma hipótese foi submetida na Etapa 3.
                    </div>
                  )}
                </div>

                {/* Indicador 2: Grau de Consistência da Hipótese */}
                <div className="p-3.5 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Grau de Consistência:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                        progress.hypothesisScore === 'forte'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : progress.hypothesisScore === 'parcial'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {progress.hypothesisScore === 'forte'
                        ? 'Alta Consistência (+100 XP)'
                        : progress.hypothesisScore === 'parcial'
                        ? 'Consistência Parcial (+60 XP)'
                        : progress.selectedThesisId
                        ? 'Baixa Consistência (+25 XP)'
                        : 'Não Avaliada (0 XP)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {progress.hypothesisScore === 'forte'
                      ? registeredThesis?.feedbackStrong
                      : progress.hypothesisScore === 'parcial'
                      ? registeredThesis?.feedbackPartial
                      : 'Para elevar o grau de consistência na Etapa 3, anexe pelo menos 2 pistas que comprovem diretamente a tese escolhida.'}
                  </p>
                </div>

                {/* Indicador 3: Evidências Utilizadas para Fundamentação */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Evidências Utilizadas na Hipótese:</span>
                    <span className="text-cyan-400 font-bold">{usedEvidenceObjects.length} anexadas</span>
                  </div>
                  {usedEvidenceObjects.length === 0 ? (
                    <div className="p-3 rounded-lg bg-[#060A12]/60 border border-slate-800 text-xs text-slate-400">
                      Nenhuma evidência do arquivo foi anexada à hipótese.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {usedEvidenceObjects.map(ev => (
                        <div
                          key={ev.id}
                          className="p-2.5 rounded-lg bg-[#060A12]/80 border border-cyan-500/30 text-xs text-slate-200 flex items-center justify-between gap-2"
                        >
                          <span className="truncate">
                            <strong className="text-amber-300 font-mono mr-1">[{ev.docCode}]</strong>
                            {ev.title}
                          </span>
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pistas Extraídas vs. Pistas Ignoradas */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Pistas Extraídas na Etapa 1:</span>
                  <span className="text-emerald-400 font-bold">
                    {extractedCluesList.length}/{allCaseClues.length} (+{xpBreakdown.cluesXp} XP)
                  </span>
                </div>
                {ignoredCluesList.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-2">
                    <span>{ignoredCluesList.length} pista(s) ignorada(s) nos documentos.</span>
                    <button
                      onClick={() => setActiveStep(1)}
                      className="underline font-mono text-amber-300 hover:text-white shrink-0 cursor-pointer"
                    >
                      Examinar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* COLUNA 2 (4 cols): CONEXÕES EFETIVAMENTE VALIDADAS vs. CONEXÕES AINDA NÃO DEMONSTRADAS */}
            <div className="lg:col-span-4 min-w-0 rounded-2xl bg-[#0B1320]/95 border border-cyan-500/30 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                    2. Auditoria de Conexões
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    +{xpBreakdown.connectionsXp} XP
                  </span>
                </div>

                {/* Indicador 4: Conexões Efetivamente Validadas */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conexões Efetivamente Validadas ({validatedChallenges.length}/{challenges.length})</span>
                  </div>

                  {validatedChallenges.length === 0 ? (
                    <div className="p-3 rounded-xl bg-[#060A12]/70 border border-slate-800 text-xs text-slate-400">
                      Nenhuma conexão foi comprovada na Mesa de Investigação.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {validatedChallenges.map(ch => (
                        <div
                          key={ch.id}
                          className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/40 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 font-bold">
                            <span>Vínculo #{ch.stepNumber} — {ch.successTitle}</span>
                            <span>+{ch.xpReward} XP</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {ch.successConclusion}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Indicador 5: Conexões Ainda Não Demonstradas */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Conexões Ainda Não Demonstradas ({unprovenChallenges.length})</span>
                  </div>

                  {unprovenChallenges.length === 0 ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                      Todos os vínculos deste caso foram demonstrados com sucesso!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {unprovenChallenges.map(ch => (
                        <div
                          key={ch.id}
                          className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-red-300 font-bold">
                            <span>Vínculo #{ch.stepNumber}</span>
                            <span>NÃO COMPROVADA (0 XP)</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-snug">
                            {ch.question}
                          </p>
                        </div>
                      ))}
                      <button
                        onClick={() => setActiveStep(2)}
                        className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold cursor-pointer transition-all"
                      >
                        ← Retornar à Etapa 2 para Demonstrar Vínculos
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Interpretações Alternativas */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Interpretações Alternativas do Caso:
                </span>
                {(selectedCase.alternativeInterpretations || []).slice(0, 2).map((alt, i) => (
                  <p key={i} className="text-xs text-slate-300 leading-relaxed">
                    • {alt}
                  </p>
                ))}
              </div>
            </div>

            {/* COLUNA 3 (4 cols): SEPARAÇÃO ENTRE ELOS DESCOBERTOS NO MAPA E CASOS DISPONÍVEIS + PERFIL */}
            <div className="lg:col-span-4 min-w-0 rounded-2xl bg-[#0B1320]/95 border border-emerald-500/30 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300 border-b border-white/10 pb-2">
                  3. Elos no Mapa & Casos Disponíveis
                </div>

                {/* Estado 1: Conexões Históricas Comprovadas pelo Jogador no Mapa */}
                <div
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    mapConnectionsUnlocked
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-slate-900/80 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
                    <span className={mapConnectionsUnlocked ? 'text-emerald-300' : 'text-amber-300'}>
                      Elos Intertemporais no Mapa Mundial:
                    </span>
                    <span>{mapConnectionsUnlocked ? 'COMPROVADOS' : 'NÃO DEMONSTRADOS'}</span>
                  </div>

                  {mapConnectionsUnlocked ? (
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      Você comprovou o vínculo intertemporal na Etapa 2! Os arcos de conexão histórica deste caso agora estão acesos no Mapa Mundial.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Como o vínculo intertemporal não foi validado na Etapa 2, os arcos de conexão deste caso permanecem ocultos no Mapa Mundial.
                    </p>
                  )}
                </div>

                {/* Estado 2: Casos Disponíveis para Investigação (Progressão Narrativa) */}
                <div className="p-3.5 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-2.5">
                  <div className="text-xs font-mono uppercase text-amber-300 font-bold">
                    Casos Disponíveis para Investigação:
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    Independentemente dos elos comprovados no mapa, os seguintes dossiês do Volume I estão abertos para investigação:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {volumeOneCases
                      .filter(c => c.id !== selectedCase.id)
                      .map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            selectCase(c.id);
                            setActiveStep(1);
                          }}
                          className="px-3 py-2 rounded-lg bg-[#0B1320] hover:bg-amber-500/20 border border-amber-500/40 text-xs font-mono text-amber-200 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <span>
                            {c.name} ({c.year})
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                  </div>
                </div>

                {/* Tendências Atualizadas do Investigador */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-400">
                    Tendências do Investigador (Atualizadas):
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-[#060A12] border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Analítico:</span>
                      <span className="text-amber-300 font-bold">{state.decisionProfile.analitico}%</span>
                    </div>
                    <div className="p-2 rounded bg-[#060A12] border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Estratégico:</span>
                      <span className="text-cyan-300 font-bold">{state.decisionProfile.estrategico}%</span>
                    </div>
                    <div className="p-2 rounded bg-[#060A12] border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Humanista:</span>
                      <span className="text-emerald-300 font-bold">{state.decisionProfile.humanista}%</span>
                    </div>
                    <div className="p-2 rounded bg-[#060A12] border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Exploratório:</span>
                      <span className="text-purple-300 font-bold">{state.decisionProfile.exploratorio}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('perfil')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-sans font-bold text-sm cursor-pointer transition-all"
              >
                Abrir Perfil Completo do Investigador →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE INSPEÇÃO DE DOCUMENTO COM ZOOM (FASE 1) */}
      {activeDoc && (
        <DocumentInspectorModal
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          document={activeDoc}
          caseId={selectedCase.id}
          caseImage={selectedCase.dossierCover || selectedCase.image}
          locationSubtitle={`${selectedCase.location} (${selectedCase.year})`}
          extractedClueIds={progress.extractedClueIds}
          onExtractClue={(clueId, xpReward, isContradiction) => {
            const clueObj = activeDoc.clues.find(c => c.id === clueId);
            handleExtractClueWithFeedback(
              clueId,
              xpReward,
              isContradiction,
              clueObj?.title
            );
          }}
        />
      )}

      {/* MODAL DE REVELAÇÃO DE DESCOBERTA / ELO HISTÓRICO (FASE 1) */}
      {discoveryModal && (
        <DiscoveryRevealModal
          isOpen={discoveryModal.open}
          onClose={() => setDiscoveryModal(null)}
          title={discoveryModal.title}
          conclusion={discoveryModal.conclusion}
          sourceName={selectedCase.name}
          sourceYear={selectedCase.year}
          targetNames={selectedCase.connectedTo
            .map(id => allNodes.find(n => n.id === id)?.name)
            .filter((n): n is string => Boolean(n))}
          onInspectMap={() => {
            setDiscoveryModal(null);
            setActiveTab('mapa');
          }}
        />
      )}

    </div>
  );
};
