import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  FileSearch,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookmarkPlus,
  BookmarkCheck,
  GitCommit,
  Sparkles,
  Scale,
  Award,
  Check,
  XCircle,
  ArrowRight,
  AlertCircle,
  ZoomIn,
  Maximize2,
  BellRing,
  ShieldCheck,
  FolderOpen,
  Info,
  Link2,
  X,
  FileText,
} from 'lucide-react';
import { DocumentInspectorModal, getEraDocumentTheme } from './DocumentInspectorModal';
import { ArchiveRoom3DStage } from './ArchiveRoom3DStage';
import { CrossExamination3DStage, ExtractedClueItem } from './CrossExamination3DStage';
import { ForensicAnalysis3DStage } from './ForensicAnalysis3DStage';
import { FieldSimulation3DStage } from './FieldSimulation3DStage';
import { AuditReport3DStage } from './AuditReport3DStage';
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
    markDocumentExamined,
  } = useInvestigation();

  const progress = getCasePlayProgress(selectedCase.id);
  const xpBreakdown = getCaseXpBreakdown(selectedCase.id);
  const mapConnectionsUnlocked = areCaseConnectionsUnlocked(selectedCase.id);

  const documents = selectedCase.documents || [];
  const challenges = selectedCase.connectionChallenges || [];
  const theses = selectedCase.hypothesisTheses || [];
  const simChoices = selectedCase.simulationChoices || [];

  // Subníveis Retráteis + Modo Cenário 3D Realista para as 5 Etapas
  const [is3DStageOne, setIs3DStageOne] = useState<boolean>(true);
  const [is3DStageTwo, setIs3DStageTwo] = useState<boolean>(true);
  const [is3DStageThree, setIs3DStageThree] = useState<boolean>(true);
  const [is3DStageFour, setIs3DStageFour] = useState<boolean>(true);
  const [is3DStageFive, setIs3DStageFive] = useState<boolean>(true);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);
  const [isArchiveDrawerOpen, setIsArchiveDrawerOpen] = useState<boolean>(false);

  // Etapa 1: Documento ativo + Abas internas (Transcrição vs Pistas)
  const [activeDocId, setActiveDocId] = useState<string>(
    progress.activeDocId || documents[0]?.id || ''
  );
  const [docSubTab, setDocSubTab] = useState<'transcricao' | 'pistas'>('transcricao');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [contradictionAlert, setContradictionAlert] = useState<string | null>(null);
  const [discoveryModal, setDiscoveryModal] = useState<{
    open: boolean;
    title: string;
    conclusion: string;
  } | null>(null);

  const examinedDocIds =
    progress.examinedDocumentIds && progress.examinedDocumentIds.length > 0
      ? progress.examinedDocumentIds
      : documents[0]?.id
      ? [documents[0].id]
      : [];

  // Etapa 2: Desafio ativo + 2 pistas selecionadas + Expansão opcional de citação
  const [activeChallengeId, setActiveChallengeId] = useState<string>(challenges[0]?.id || '');
  const [boardSelectedClues, setBoardSelectedClues] = useState<string[]>([]);
  const [expandedBoardClueId, setExpandedBoardClueId] = useState<string | null>(null);
  const [connectionFeedback, setConnectionFeedback] = useState<{
    type: 'success' | 'error';
    title?: string;
    message: string;
    unlockedMap?: boolean;
  } | null>(null);

  // Etapa 3: Hipótese + Acordeão de detalhes da tese + Subnível de anotação
  const [chosenThesisId, setChosenThesisId] = useState<string>(
    progress.selectedThesisId || theses[0]?.id || ''
  );
  const [expandedThesisId, setExpandedThesisId] = useState<string | null>(null);
  const [hypothesisClues, setHypothesisClues] = useState<string[]>(
    progress.attachedClueIds || []
  );
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [reasoningText, setReasoningText] = useState<string>(
    progress.hypothesisReasoning || state.personalNotes[selectedCase.id] || ''
  );
  const [hypothesisResult, setHypothesisResult] = useState<{
    score: 'forte' | 'parcial' | 'fraca';
    feedback: string;
    xpAwarded: number;
  } | null>(null);

  // Etapa 4: Subnível de detalhes estratégicos
  const [expandedChoiceId, setExpandedChoiceId] = useState<string | null>(null);

  // Etapa 5: Subnível de auditoria detalhada
  const [showDetailedAudit, setShowDetailedAudit] = useState<boolean>(false);

  useEffect(() => {
    const p = getCasePlayProgress(selectedCase.id);
    const firstId = p.activeDocId || selectedCase.documents?.[0]?.id || '';
    setActiveDocId(firstId);
    setDocSubTab('transcricao');
    if (firstId) {
      markDocumentExamined(selectedCase.id, firstId);
    }
    setContradictionAlert(null);
    setIsInspectorOpen(false);
    setIsBriefingOpen(false);
    setActiveChallengeId(selectedCase.connectionChallenges?.[0]?.id || '');
    setBoardSelectedClues([]);
    setExpandedBoardClueId(null);
    setConnectionFeedback(null);
    setChosenThesisId(p.selectedThesisId || selectedCase.hypothesisTheses?.[0]?.id || '');
    setHypothesisClues(p.attachedClueIds || []);
    setReasoningText(p.hypothesisReasoning || state.personalNotes[selectedCase.id] || '');
    setHypothesisResult(null);
  }, [selectedCase.id]);

  // Fechar Drawer do Arquivo Pessoal com ESC
  useEffect(() => {
    if (!isArchiveDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsArchiveDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isArchiveDrawerOpen]);

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
    setDocSubTab('transcricao');
    markDocumentExamined(selectedCase.id, docId);
    soundEngine.playDocumentOpen();
  };

  const handleOpenInspector = () => {
    if (activeDoc) {
      markDocumentExamined(selectedCase.id, activeDoc.id);
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

  // Pistas selecionadas atualmente nos slots A e B da Mesa (Etapa 2)
  const slotAClue = extractedCluesList.find(c => c.id === boardSelectedClues[0]);
  const slotBClue = extractedCluesList.find(c => c.id === boardSelectedClues[1]);
  const isActiveChallengeSolved =
    activeChallenge && progress.solvedConnectionIds.includes(activeChallenge.id);

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      
      {/* =====================================================================
          1. BARRA DE CONTEXTO ENXUTA + SUBNÍVEL RETRÁTIL DE BRIEFING + ARQUIVO PESSOAL
         ===================================================================== */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          
          {/* Esquerda: Título da Missão + Botão Discreto [ i Ver Briefing da Missão ] */}
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              {selectedCase.missionCode || 'OPERAÇÃO'} — {selectedCase.missionTitle || selectedCase.title}
            </span>
            <button
              type="button"
              onClick={() => setIsBriefingOpen(o => !o)}
              className={`px-3 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                isBriefingOpen
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                  : 'bg-[#0B1320] border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBriefingOpen ? 'Ocultar Briefing' : 'Ver Briefing da Missão'}</span>
              {isBriefingOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Direita: Alternador 3D/2D Dinâmico + Arquivo Pessoal + Ações */}
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playDocumentOpen();
                if (state.activeStep === 1) setIs3DStageOne(v => !v);
                if (state.activeStep === 2) setIs3DStageTwo(v => !v);
                if (state.activeStep === 3) setIs3DStageThree(v => !v);
                if (state.activeStep === 4) setIs3DStageFour(v => !v);
                if (state.activeStep === 5) setIs3DStageFive(v => !v);
              }}
              className="px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm bg-[#0B1320] border-cyan-500/40 text-cyan-300 hover:border-amber-400 hover:text-white"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {((state.activeStep === 1 && is3DStageOne) ||
                  (state.activeStep === 2 && is3DStageTwo) ||
                  (state.activeStep === 3 && is3DStageThree) ||
                  (state.activeStep === 4 && is3DStageFour) ||
                  (state.activeStep === 5 && is3DStageFive))
                  ? '[ Alternar para Modo 2D ]'
                  : '[ Entrar no Cenário 3D ]'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsArchiveDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Arquivo ({extractedCluesList.length}/{allCaseClues.length})
              </span>
            </button>
          </div>
        </div>

        {/* Subnível Retrátil: Briefing da Missão (Oculto por padrão para liberar 200px verticais) */}
        {isBriefingOpen && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 text-sm text-slate-200 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200 flex items-start justify-between gap-4">
            <div className="space-y-1 max-w-4xl">
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                CONTEXTO OPERACIONAL DO DOSSIÊ
              </div>
              <p>{selectedCase.shortDescription}</p>
            </div>
            <button
              onClick={() => setIsBriefingOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer shrink-0"
              title="Fechar briefing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

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
          ETAPA 1 — OBSERVAR (CENÁRIO 3D REALISTA: ARQUIVO HISTÓRICO + MODO 2D)
         ===================================================================== */}
      {state.activeStep === 1 && is3DStageOne && (
        <ArchiveRoom3DStage
          selectedCase={selectedCase}
          documents={documents}
          extractedClueIds={progress.extractedClueIds}
          examinedDocIds={examinedDocIds}
          activeStep={state.activeStep}
          onSelectStep={step => setActiveStep(step)}
          onInspectDocument={doc => {
            setActiveDocId(doc.id);
            markDocumentExamined(selectedCase.id, doc.id);
            setIsInspectorOpen(true);
          }}
          onOpenArchiveDrawer={() => setIsArchiveDrawerOpen(true)}
          onSwitchTo2D={() => {
            soundEngine.playDocumentOpen();
            setIs3DStageOne(false);
          }}
          onRequestExit={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
          }}
        />
      )}

      {state.activeStep === 1 && !is3DStageOne && (
        <div className="space-y-5 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* Seletor Horizontal Compacto de Documentos no Mobile (< lg) para exibir a Imagem imediatamente no topo */}
          <div className="lg:hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300 px-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-amber-400" />
                Peças Documentais ({documents.length})
              </span>
              <span className="text-[11px] text-slate-400">Deslize para alternar</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5">
              {documents.map((doc, idx) => {
                const isSelected = activeDoc?.id === doc.id;
                const extractedInDoc = doc.clues.filter(c =>
                  progress.extractedClueIds.includes(c.id)
                ).length;
                const allExtracted = extractedInDoc === doc.clues.length;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelectDoc(doc.id)}
                    className={`px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#0B1320]/90 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-amber-400">
                      DOC-0{idx + 1}
                    </span>
                    <span className="text-xs font-sans font-semibold max-w-[150px] truncate">
                      {doc.title}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        allExtracted
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {extractedInDoc}/{doc.clues.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna Esquerda Desktop (4 cols): Lista de Documentos Limpa (Sem parágrafos de resumo!) */}
          <div className="hidden lg:block lg:col-span-4 min-w-0 space-y-3 rounded-2xl bg-[#0B1320]/90 border border-slate-800/90 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                  Peças Documentais ({documents.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Toque para abrir
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
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                        : 'bg-[#060A12]/85 border-slate-800/90 hover:border-amber-500/40'
                    }`}
                  >
                    {/* Miniatura Visual da Peça Documental */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-amber-500/30 bg-black shrink-0">
                      <img
                        src={selectedCase.dossierCover || selectedCase.image}
                        alt=""
                        className="w-full h-full object-cover opacity-80"
                        style={{ filter: eraTheme.imgFilter }}
                      />
                      {allExtracted && (
                        <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                      )}
                    </div>

                    {/* Código, Título Curto e Badge de Pistas (Sem texto longo de resumo!) */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
                          {doc.code.split('//')[0].trim()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                            allExtracted
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                              : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {extractedInDoc}/{doc.clues.length} pistas
                        </span>
                      </div>
                      <div className="font-sans text-sm font-bold text-white leading-snug line-clamp-2">
                        {doc.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área Principal (8 cols): Protagonismo Visual da Evidência + Subníveis Limpos */}
          {activeDoc && (
            <div className="lg:col-span-8 min-w-0 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 overflow-hidden shadow-2xl">
              
              {/* Imagem Grande em Destaque (h-64 a h-80 com moldura fina dourada) */}
              <div
                onClick={handleOpenInspector}
                className="relative h-64 sm:h-80 w-full overflow-hidden border-b border-amber-500/35 bg-[#050811] group cursor-pointer"
              >
                <img
                  src={selectedCase.dossierCover || selectedCase.image}
                  alt={activeDoc.title}
                  className="w-full h-full object-cover object-center opacity-85 group-hover:scale-[1.03] group-hover:opacity-100 transition-all duration-500"
                  style={{ filter: eraTheme.imgFilter }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/25 to-transparent" />

                {/* Selo Superior Esquerdo */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#060A12]/90 border border-amber-500/40 text-[10px] sm:text-xs font-mono text-amber-300 uppercase tracking-wider backdrop-blur-md">
                  {activeDoc.code} • [Reconstrução Visual]
                </div>

                {/* Botão Superior Direito: Zoom & Lupa 2.5x */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenInspector();
                  }}
                  className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-[#060A12]/90 hover:bg-amber-500 text-amber-200 hover:text-slate-950 border border-amber-400/60 text-xs font-sans font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>Ampliar / Lupa 2.5x</span>
                </button>

                {/* Título do Documento Sobreposto na Base da Imagem */}
                <div className="absolute bottom-4 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300 block">
                      {activeDoc.typeLabel} // {activeDoc.dateLabel}
                    </span>
                    <h2 className="font-sans text-lg sm:text-2xl font-bold text-white mt-0.5 drop-shadow">
                      {activeDoc.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Abas de Subnível do Documento: [ Ler Transcrição ] vs [ Inspecionar Pistas (X) ] */}
              <div className="px-6 sm:px-8 pt-5 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-[#080E1A]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDocSubTab('transcricao')}
                    className={`px-4 py-2.5 rounded-t-xl font-sans text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      docSubTab === 'transcricao'
                        ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Ler Transcrição</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocSubTab('pistas')}
                    className={`px-4 py-2.5 rounded-t-xl font-sans text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                      docSubTab === 'pistas'
                        ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      Inspecionar Pistas ({activeDoc.clues.filter(c => progress.extractedClueIds.includes(c.id)).length}/{activeDoc.clues.length})
                    </span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 hidden sm:flex items-center gap-1 pb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fonte Catalogada
                </span>
              </div>

              {/* Conteúdo Espaçado do Subnível Ativo (p-6 a p-8 para amplo respiro) */}
              <div className="p-6 sm:p-8">
                {docSubTab === 'transcricao' ? (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl ${eraTheme.paperBg} border ${eraTheme.paperBorder} space-y-4 shadow-inner`}>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 border-b border-white/10 pb-2 flex items-center justify-between">
                        <span>{eraTheme.eraStamp}</span>
                        <span>REGISTRO INTEGRAL</span>
                      </div>
                      <p className={`text-base sm:text-lg ${eraTheme.textStyle} leading-relaxed`}>
                        "{activeDoc.fullText}"
                      </p>
                      <div className="pt-2 border-t border-white/5 text-xs font-mono text-slate-400">
                        {eraTheme.materialLabel}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono text-slate-400">
                        Encontrou uma evidência relevante neste registro?
                      </span>
                      <button
                        type="button"
                        onClick={() => setDocSubTab('pistas')}
                        className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-400/50 font-sans font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Inspecionar Pistas deste Documento ({activeDoc.clues.length})</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Selecione os fragmentos abaixo para guardar em seu Arquivo Pessoal:
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
                          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                            isSaved
                              ? 'bg-emerald-950/25 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                              : 'bg-[#060A12]/90 border-amber-500/40 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {clue.isContradiction && (
                                <span className="px-2.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                                  Inconsistência
                                </span>
                              )}
                              <span className="text-sm sm:text-base font-bold text-white">
                                {clue.title}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 ${
                                isSaved
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500 text-slate-950 shadow-sm'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <BookmarkCheck className="w-4 h-4" /> Guardada (+{clue.xpReward} XP)
                                </>
                              ) : (
                                <>
                                  <BookmarkPlus className="w-4 h-4" /> Guardar Pista
                                </>
                              )}
                            </span>
                          </div>

                          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans bg-white/[0.02] p-3.5 rounded-xl border-l-2 border-amber-400">
                            "{clue.excerpt}"
                          </p>

                          {isSaved && (
                            <div className="text-xs sm:text-sm font-mono text-cyan-300 pt-2 border-t border-white/10 leading-relaxed">
                              <strong>Nota de Análise:</strong> {clue.analysisNote}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* =====================================================================
          ETAPA 2 — CONECTAR (CENÁRIO 3D: MESA DE CRUZAMENTO TÁTIL + MODO 2D)
         ===================================================================== */}
      {state.activeStep === 2 && is3DStageTwo && (
        <CrossExamination3DStage
          selectedCase={selectedCase}
          challenges={challenges}
          activeChallenge={activeChallenge}
          solvedConnectionIds={progress.solvedConnectionIds}
          extractedCluesList={extractedCluesList}
          allCaseClues={allCaseClues}
          boardSelectedClues={boardSelectedClues}
          connectionFeedback={connectionFeedback}
          activeStep={state.activeStep}
          onSelectStep={step => setActiveStep(step)}
          onSelectChallenge={chId => {
            setActiveChallengeId(chId);
            setConnectionFeedback(null);
          }}
          onToggleBoardClue={clueId => toggleBoardClue(clueId)}
          onValidateConnection={handleValidateConnection}
          onOpenArchiveDrawer={() => setIsArchiveDrawerOpen(true)}
          onSwitchTo2D={() => {
            soundEngine.playDocumentOpen();
            setIs3DStageTwo(false);
          }}
          onRequestExit={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
          }}
        />
      )}

      {state.activeStep === 2 && !is3DStageTwo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Coluna Esquerda Compacta (4 cols): Apenas título da pergunta e badge (Comprovada / Em aberto) */}
          <div className="lg:col-span-4 min-w-0 space-y-4 rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 p-5">
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                  Vínculos ({progress.solvedConnectionIds.length}/{challenges.length})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Selecione uma questão e conecte as 2 pistas correspondentes na mesa.
              </p>
            </div>

            <div className="space-y-2.5">
              {challenges.map(ch => {
                const isSolved = progress.solvedConnectionIds.includes(ch.id);
                const isCurrent = activeChallenge?.id === ch.id;

                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setActiveChallengeId(ch.id);
                      setConnectionFeedback(null);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.18)]'
                        : isSolved
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-[#060A12]/80 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                        Vínculo #{ch.stepNumber}
                      </span>
                      {isSolved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Comprovada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
                          Em aberto
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-white leading-snug">
                      {ch.question}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direita (8 cols): Mesa Visual de Investigação (Perspectiva Topográfica 3D Inclinada) */}
          <div
            className="lg:col-span-8 min-w-0"
            style={{ perspective: is3DTableStageTwo ? '1100px' : 'none' }}
          >
          <div
            style={{
              transform: is3DTableStageTwo ? 'rotateX(6deg)' : 'none',
              transformOrigin: 'center top',
            }}
            className="space-y-6 rounded-2xl bg-gradient-to-b from-[#0E1726] to-[#080D18] border-2 border-amber-500/35 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-transform duration-500"
          >
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                QUESTÃO EM ANÁLISE NA MESA
              </span>
              <h3 className="font-sans text-lg sm:text-xl font-bold text-white mt-1">
                {activeChallenge?.question}
              </h3>
            </div>

            {/* Recompensa Visual na Mesa Direita quando o Vínculo está Comprovado */}
            {isActiveChallengeSolved && activeChallenge && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Vínculo Comprovado (+{activeChallenge.xpReward} XP)
                  </span>
                </div>
                <div className="text-base font-bold text-white">
                  {activeChallenge.successTitle}
                </div>
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  {activeChallenge.successConclusion}
                </p>
              </div>
            )}

            {extractedCluesList.length < 2 ? (
              <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm sm:text-base text-amber-100 leading-relaxed max-w-lg mx-auto">
                  Você possui {extractedCluesList.length} pista(s) no seu Arquivo Pessoal. Extraia pelo menos 2 pistas na Etapa 1 para conectá-las na mesa.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-sans font-bold text-sm cursor-pointer"
                  >
                    ← Voltar aos Documentos
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-sans font-bold text-sm cursor-pointer"
                  >
                    Avançar sem comprovar →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Diagrama Visual de Conexão: [ Pista A ] ─── 🔗 ─── [ Pista B ] */}
                <div className="p-5 rounded-2xl bg-[#060A12]/90 border border-amber-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    
                    {/* Slot Pista A */}
                    <div
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all ${
                        slotAClue
                          ? 'bg-amber-500/15 border-amber-400 text-white'
                          : 'bg-[#0B1320]/60 border-dashed border-slate-700 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase text-amber-400 mb-0.5">
                        {slotAClue ? slotAClue.docCode.split('//')[0] : 'SLOT DE EVIDÊNCIA A'}
                      </div>
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {slotAClue ? slotAClue.title : 'Selecione a 1ª pista abaixo'}
                      </div>
                    </div>

                    {/* Conector Pontilhado Dourado */}
                    <div className="flex items-center justify-center gap-2 px-2 shrink-0">
                      <div className="hidden sm:block w-8 border-t-2 border-dashed border-amber-400/60" />
                      <div
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                          boardSelectedClues.length === 2
                            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                            : 'bg-[#0B1320] border-slate-700 text-amber-400'
                        }`}
                      >
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div className="hidden sm:block w-8 border-t-2 border-dashed border-amber-400/60" />
                    </div>

                    {/* Slot Pista B */}
                    <div
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all ${
                        slotBClue
                          ? 'bg-cyan-500/15 border-cyan-400 text-white'
                          : 'bg-[#0B1320]/60 border-dashed border-slate-700 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase text-cyan-400 mb-0.5">
                        {slotBClue ? slotBClue.docCode.split('//')[0] : 'SLOT DE EVIDÊNCIA B'}
                      </div>
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {slotBClue ? slotBClue.title : 'Selecione a 2ª pista abaixo'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-1">
                    <button
                      onClick={handleValidateConnection}
                      disabled={boardSelectedClues.length !== 2}
                      className={`px-6 py-3 rounded-xl font-sans font-bold text-xs sm:text-sm uppercase tracking-wider transition-all ${
                        boardSelectedClues.length === 2
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer'
                          : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Validar Conexão na Mesa
                    </button>
                  </div>
                </div>

                {/* Feedback Analítico de Tentativa */}
                {connectionFeedback && (
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-200 ${
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
                    </div>
                  </div>
                )}

                {/* Fichas Visuais das Pistas do Arquivo Pessoal (Texto longo oculto em subnível!) */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Fichas no seu Arquivo Pessoal (Toque em 2 fichas para conectar):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {extractedCluesList.map(clue => {
                      const isPicked = boardSelectedClues.includes(clue.id);
                      const isExpanded = expandedBoardClueId === clue.id;

                      return (
                        <div
                          key={clue.id}
                          onClick={() => toggleBoardClue(clue.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                            isPicked
                              ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.25)]'
                              : 'bg-[#060A12]/90 border-slate-800 hover:border-cyan-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/30 shrink-0">
                                <img
                                  src={selectedCase.dossierCover || selectedCase.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  style={{ filter: eraTheme.imgFilter }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-amber-400 uppercase truncate">
                                {clue.docCode.split('//')[0]}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setExpandedBoardClueId(isExpanded ? null : clue.id);
                                }}
                                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 cursor-pointer"
                              >
                                {isExpanded ? 'Ocultar trecho' : 'Ver trecho'}
                              </button>
                              {isPicked && (
                                <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 text-[10px] font-mono font-bold">
                                  Na Mesa
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-sm font-bold text-white leading-snug">
                            {clue.title}
                          </div>

                          {isExpanded && (
                            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                              "{clue.excerpt}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Voltar aos documentos
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <span>Avançar para Etapa 3: Hipótese</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </>
            )}
          </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          ETAPA 3 — FORMULAR HIPÓTESE (CENÁRIO 3D: SALA DE ANÁLISE + MODO 2D)
         ===================================================================== */}
      {state.activeStep === 3 && is3DStageThree && (
        <ForensicAnalysis3DStage
          selectedCase={selectedCase}
          theses={theses}
          chosenThesisId={chosenThesisId}
          expandedThesisId={expandedThesisId}
          hypothesisClues={hypothesisClues}
          reasoningText={reasoningText}
          isNotesOpen={isNotesOpen}
          hypothesisResult={hypothesisResult}
          extractedCluesList={extractedCluesList}
          allCaseClues={allCaseClues}
          allCaseCluesCount={allCaseClues.length}
          onSelectThesis={thId => {
            setChosenThesisId(thId);
            // Auto-persist immediately so thesis is never lost
            submitStructuredHypothesis(selectedCase.id, thId, hypothesisClues, reasoningText);
          }}
          onToggleExpandThesis={thId => setExpandedThesisId(id => (id === thId ? null : thId))}
          onToggleHypothesisClue={clueId => toggleHypothesisClue(clueId)}
          onUpdateReasoningText={text => setReasoningText(text)}
          onToggleNotesOpen={() => setIsNotesOpen(o => !o)}
          onSubmitHypothesis={handleSubmitHypothesis}
          onSelectStep={step => {
            if (chosenThesisId) {
              submitStructuredHypothesis(selectedCase.id, chosenThesisId, hypothesisClues, reasoningText);
            }
            setActiveStep(step);
          }}
          onOpenArchiveDrawer={() => setIsArchiveDrawerOpen(true)}
          onSwitchTo2D={() => {
            soundEngine.playDocumentOpen();
            setIs3DStageThree(false);
          }}
        />
      )}

      {state.activeStep === 3 && !is3DStageThree && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-2xl bg-[#0B1320]/95 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                ETAPA 3 // FORMULAÇÃO DE HIPÓTESE
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mt-1">
                Qual interpretação explica melhor o caso investigado?
              </h3>
            </div>

            {/* 1. Escolha da Tese com Detalhes em Subnível Acordeão */}
            <div className="space-y-3">
              {theses.map(th => {
                const isSelected = chosenThesisId === th.id;
                const isExpanded = expandedThesisId === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => setChosenThesisId(th.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                        : 'bg-[#060A12]/85 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold shrink-0">
                          {th.tag}
                        </span>
                        <span className="font-sans text-base font-bold text-white truncate">
                          {th.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setExpandedThesisId(isExpanded ? null : th.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 cursor-pointer"
                        >
                          {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes da tese'}
                        </button>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-mono text-cyan-300">{th.subtitle}</p>

                    {isExpanded && (
                      <p className="text-sm text-slate-200 leading-relaxed pt-2 border-t border-slate-800/80">
                        {th.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2. Vincular Evidências de Sustentação */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Vincule 2 ou 3 pistas que provam sua tese ({hypothesisClues.length} anexadas):
                </span>
              </div>

              {extractedCluesList.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                  Nenhuma pista extraída na Etapa 1. Sem evidências anexadas, a hipótese terá Baixa Consistência.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {extractedCluesList.map(clue => {
                    const checked = hypothesisClues.includes(clue.id);
                    return (
                      <button
                        key={clue.id}
                        type="button"
                        onClick={() => toggleHypothesisClue(clue.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          checked
                            ? 'bg-cyan-500/15 border-cyan-400 text-white'
                            : 'bg-[#060A12]/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                            checked
                              ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold truncate">
                          {clue.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subnível Opcional: Caderno de Anotação */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsNotesOpen(o => !o)}
                className="text-xs font-mono text-slate-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
              >
                {isNotesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{isNotesOpen ? 'Ocultar anotação pessoal' : '+ Adicionar raciocínio no caderno (opcional)'}</span>
              </button>

              {isNotesOpen && (
                <textarea
                  rows={2}
                  value={reasoningText}
                  onChange={e => setReasoningText(e.target.value)}
                  placeholder="Descreva brevemente sua dedução..."
                  className="mt-2 w-full p-3 rounded-xl bg-[#060A12] border border-slate-700/80 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              )}
            </div>

            <button
              onClick={handleSubmitHypothesis}
              disabled={!chosenThesisId}
              className={`w-full py-3.5 px-5 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-all ${
                chosenThesisId
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Validar e Registrar Hipótese
            </button>

            {hypothesisResult && (
              <div className="p-5 rounded-2xl bg-emerald-950/35 border border-emerald-500/40 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                    Grau de Consistência:{' '}
                    {hypothesisResult.score === 'forte'
                      ? 'Alta (Bem Fundamentada)'
                      : hypothesisResult.score === 'parcial'
                      ? 'Parcial'
                      : 'Baixa'}
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    +{hypothesisResult.xpAwarded} XP
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {hypothesisResult.feedback}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveStep(4)}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <span>Avançar para Etapa 4: Tomar Decisão</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          ETAPA 4 — DECIDIR (CENÁRIO 3D: SIMULAÇÃO DE CAMPO HISTÓRICA + MODO 2D)
         ===================================================================== */}
      {state.activeStep === 4 && is3DStageFour && (
        <FieldSimulation3DStage
          selectedCase={selectedCase}
          choices={simChoices}
          selectedDecisionId={progress.selectedDecisionId}
          expandedChoiceId={expandedChoiceId}
          onToggleExpandChoice={chId => setExpandedChoiceId(id => (id === chId ? null : chId))}
          onSelectDecision={choiceId => handleSelectSimulationDecision(choiceId)}
          onSelectStep={step => setActiveStep(step)}
          onOpenArchiveDrawer={() => setIsArchiveDrawerOpen(true)}
          onSwitchTo2D={() => {
            soundEngine.playDocumentOpen();
            setIs3DStageFour(false);
          }}
        />
      )}

      {state.activeStep === 4 && !is3DStageFour && (
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#0B1320]/95 border border-amber-500/35 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400">
              <Scale className="w-4 h-4" />
              <span>ETAPA 4 // TOMADA DE DECISÃO</span>
            </div>
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-white">
              Diante do padrão identificado, qual posição você assume?
            </h3>
            <p className="text-sm text-amber-100/90 leading-relaxed">
              {selectedCase.simulationPrompt}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {simChoices.map(choice => {
              const isSelected = progress.selectedDecisionId === choice.id;
              const isExpanded = expandedChoiceId === choice.id;
              return (
                <div
                  key={choice.id}
                  onClick={() => handleSelectSimulationDecision(choice.id)}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                      : 'bg-[#060A12]/90 border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center font-sans font-bold text-sm text-amber-300 shrink-0">
                        {choice.tag}
                      </span>
                      <div>
                        <span className="font-sans text-base sm:text-lg font-bold text-white block">
                          {choice.title}
                        </span>
                        <span className="text-xs font-mono text-cyan-300">
                          {choice.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setExpandedChoiceId(isExpanded ? null : choice.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                      >
                        {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs sm:text-sm cursor-pointer"
                      >
                        Escolher {choice.tag} →
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <p className="text-sm text-slate-200 leading-relaxed pt-3 border-t border-slate-800/80">
                      {choice.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          ETAPA 5 — CONSEQUÊNCIAS (CENÁRIO 3D: CÂMARA DE AUDITORIA & LAUDO + MODO 2D)
         ===================================================================== */}
      {state.activeStep === 5 && is3DStageFive && (
        <AuditReport3DStage
          selectedCase={selectedCase}
          documents={documents}
          challenges={challenges}
          theses={theses}
          simChoices={simChoices}
          extractedCluesList={extractedCluesList}
          allCaseClues={allCaseClues}
          solvedConnectionIds={progress.solvedConnectionIds}
          selectedThesisId={progress.selectedThesisId || chosenThesisId}
          hypothesisScore={progress.hypothesisScore}
          hypothesisReasoning={progress.hypothesisReasoning || reasoningText}
          selectedDecisionId={progress.selectedDecisionId}
          mapConnectionsUnlocked={mapConnectionsUnlocked}
          xpBreakdown={xpBreakdown}
          onReturnToMap={() => {
            soundEngine.playCaseConclusion();
            setActiveTab('mapa');
          }}
          onOpenArchiveDrawer={() => setIsArchiveDrawerOpen(true)}
          onSelectStep={step => setActiveStep(step)}
        />
      )}

      {state.activeStep === 5 && !is3DStageFive && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-2xl bg-[#0B1320]/95 border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Cabeçalho do Relatório */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>RELATÓRIO DE CONSEQUÊNCIAS // {selectedCase.missionCode}</span>
                </div>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mt-1">
                  Síntese da Investigação: {selectedCase.fullName}
                </h3>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-[#060A12] border border-amber-500/40 text-center shrink-0">
                <div className="text-[10px] font-mono uppercase text-slate-400">Mérito no Caso</div>
                <div className="text-lg font-mono font-bold text-amber-400">+{xpBreakdown.totalCaseXp} XP</div>
              </div>
            </div>

            {/* 4 Indicadores Principais em Cards Limpos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Pistas Extraídas</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {extractedCluesList.length}/{allCaseClues.length}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Conexões Comprovadas</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">
                  {validatedChallenges.length}/{challenges.length}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Consistência</div>
                <div className="text-sm font-bold text-amber-300 mt-1.5 uppercase">
                  {progress.hypothesisScore === 'forte'
                    ? 'Alta (+100 XP)'
                    : progress.hypothesisScore === 'parcial'
                    ? 'Parcial (+60 XP)'
                    : 'Baixa (+25 XP)'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A12] border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400">Elos no Mapa</div>
                <div className="text-sm font-bold text-white mt-1.5">
                  {mapConnectionsUnlocked ? 'Comprovados' : 'Não Demonstrados'}
                </div>
              </div>
            </div>

            {/* Hipótese Registrada */}
            <div className="p-5 rounded-2xl bg-[#060A12]/90 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-amber-400">
                Hipótese Registrada pelo Investigador:
              </div>
              <div className="text-base font-bold text-white">
                {registeredThesis
                  ? `${registeredThesis.tag} — ${registeredThesis.title}`
                  : 'Nenhuma hipótese registrada'}
              </div>
              {registeredThesis && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {registeredThesis.subtitle}
                </p>
              )}
            </div>

            {/* Subnível Retrátil: Detalhes Técnicos da Auditoria (Evidências, Vínculos Pendentes e Tendências) */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetailedAudit(o => !o)}
                className="w-full py-3 px-4 rounded-xl bg-[#060A12] hover:bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between cursor-pointer"
              >
                <span>
                  {showDetailedAudit
                    ? 'Ocultar Detalhamento Técnico da Auditoria'
                    : 'Ver Detalhamento de Evidências, Conexões e Tendências'}
                </span>
                {showDetailedAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetailedAudit && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-2">
                    <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
                      Conexões Validadas ({validatedChallenges.length}) & Pendentes ({unprovenChallenges.length})
                    </div>
                    {validatedChallenges.map(ch => (
                      <div key={ch.id} className="text-xs text-emerald-200">
                        ✓ {ch.successTitle}
                      </div>
                    ))}
                    {unprovenChallenges.map(ch => (
                      <div key={ch.id} className="text-xs text-red-300">
                        • Não comprovada: {ch.question}
                      </div>
                    ))}
                    {ignoredCluesList.length > 0 && (
                      <div className="pt-2 text-xs text-amber-300">
                        {ignoredCluesList.length} pista(s) não extraída(s) na Etapa 1.
                      </div>
                    )}
                    {usedEvidenceObjects.length > 0 && (
                      <div className="pt-2 text-xs text-slate-400">
                        Evidências anexadas à hipótese: {usedEvidenceObjects.length}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#060A12]/90 border border-slate-800 space-y-2">
                    <div className="text-xs font-mono uppercase text-amber-300 font-bold">
                      Tendências do Investigador & Próximos Dossiês
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>Analítico: <strong className="text-amber-300">{state.decisionProfile.analitico}%</strong></div>
                      <div>Estratégico: <strong className="text-cyan-300">{state.decisionProfile.estrategico}%</strong></div>
                      <div>Humanista: <strong className="text-emerald-300">{state.decisionProfile.humanista}%</strong></div>
                      <div>Exploratório: <strong className="text-purple-300">{state.decisionProfile.exploratorio}%</strong></div>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {volumeOneCases
                        .filter(c => c.id !== selectedCase.id)
                        .map(c => (
                          <button
                            key={c.id}
                            onClick={() => {
                              selectCase(c.id);
                              setActiveStep(1);
                            }}
                            className="px-2.5 py-1 rounded bg-[#0B1320] border border-amber-500/30 text-[11px] font-mono text-amber-200 cursor-pointer"
                          >
                            Abrir {c.name} →
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Encerramento */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('perfil')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
              >
                Ver Perfil Completo do Investigador
              </button>

              <button
                onClick={() => setActiveTab('mapa')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>Voltar ao Mapa Mundial</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          GAVETA / MODAL SUBNÍVEL: MEU ARQUIVO PESSOAL (PISTAS EXTRAÍDAS)
         ===================================================================== */}
      {isArchiveDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          data-immersive-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
          onClick={() => setIsArchiveDrawerOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md h-full bg-[#0B1320] border-l border-cyan-500/35 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="font-sans text-base font-bold text-white">
                      Meu Arquivo Pessoal
                    </h3>
                    <span className="text-[11px] font-mono text-cyan-400">
                      {extractedCluesList.length} de {allCaseClues.length} pistas catalogadas neste dossiê
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsArchiveDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {extractedCluesList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#060A12] border border-dashed border-slate-800 text-center space-y-2">
                  <BookmarkPlus className="w-7 h-7 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Nenhuma pista guardada ainda. Na Etapa 1, clique na aba <strong>Inspecionar Pistas</strong> para salvar evidências relevantes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {extractedCluesList.map(c => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-[#060A12] border border-emerald-500/30 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                        <span>{c.docCode.split('//')[0]}</span>
                        <span>+{c.xpReward} XP</span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        {c.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {c.analysisNote}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsArchiveDrawerOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 cursor-pointer"
              >
                Fechar [Esc]
              </button>
              {state.activeStep === 1 && (
                <button
                  onClick={() => {
                    setIsArchiveDrawerOpen(false);
                    setActiveStep(2);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Ir para Mesa de Conexões →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE INSPEÇÃO DE DOCUMENTO COM ZOOM E LUPA (FASE 1) */}
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
