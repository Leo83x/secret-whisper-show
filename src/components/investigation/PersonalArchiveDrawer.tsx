import React from "react";
import { useInvestigation } from "../../context/InvestigationContext";
import { FolderOpen, X, Sparkles, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { soundEngine } from "../../utils/investigationAudio";

interface PersonalArchiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalArchiveDrawer: React.FC<PersonalArchiveDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedCase, getCasePlayProgress, state, savePersonalNote } = useInvestigation();

  if (!isOpen) return null;

  const progress = getCasePlayProgress(selectedCase.id);
  const documents = selectedCase.documents || [];
  const allClues = documents.flatMap(d => d.clues);
  const extractedClues = allClues.filter(c => progress.extractedClueIds.includes(c.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md sm:max-w-lg h-full bg-gradient-to-b from-[#101828] via-[#090d18] to-[#050810] border-l-2 border-amber-500/50 shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div className="space-y-4 sm:space-y-5">
          {/* Cabeçalho do Arquivo */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#090d18] border border-amber-400/60 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  Arquivo Pessoal
                </h3>
                <span className="text-xs font-mono text-amber-300">
                  {extractedClues.length} de {allClues.length} pistas catalogadas
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEngine.playMechanicalClick();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-amber-400 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Pistas Extraídas */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Evidências & Pistas Catalogadas
            </h4>

            {extractedClues.length === 0 ? (
              <div className="p-5 rounded-2xl bg-[#0a0f1d]/80 border border-slate-800 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  Nenhuma pista catalogada ainda. Abra os documentos do arquivo para extrair evidências fundamentais.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
                {extractedClues.map(clue => (
                  <div
                    key={clue.id}
                    className="p-3.5 rounded-xl bg-[#0b1120] border border-amber-500/35 space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-serif font-bold text-amber-200">
                        {clue.title}
                      </span>
                      {clue.isContradiction && (
                        <span className="px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/50 text-[10px] font-mono font-bold text-red-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Contradição
                        </span>
                      )}
                    </div>
                    <blockquote className="text-xs italic text-slate-300 border-l-2 border-amber-400/50 pl-2">
                      {clue.excerpt}
                    </blockquote>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {clue.analysisNote}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bloco de Anotações Pessoais de Campo */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block">
              Caderno de Campo do Investigador
            </label>
            <textarea
              rows={4}
              value={state.personalNotes[selectedCase.id] || ""}
              onChange={e => savePersonalNote(selectedCase.id, e.target.value)}
              placeholder="Registre suas hipóteses preliminares, inconsistências cronológicas e anotações confidenciais..."
              className="w-full rounded-xl bg-[#080c16] border border-slate-700 focus:border-amber-400 p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none transition-all resize-none shadow-inner"
            />
          </div>
        </div>

        {/* Rodapé da Gaveta */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+{progress.xpEarned} XP Obtidos</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-200 font-bold transition-all cursor-pointer"
          >
            Concluir Inspeção
          </button>
        </div>
      </div>
    </div>
  );
};
