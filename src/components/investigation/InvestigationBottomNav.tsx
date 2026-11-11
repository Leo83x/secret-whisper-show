import React from "react";
import { useInvestigation } from "../../context/InvestigationContext";
import { TabKey } from "../../types/investigation";
import { Eye, FolderOpen, User, Globe, Award } from "lucide-react";
import { InteractionAudio } from "./GameInteractionSystem";

interface InvestigationBottomNavProps {
  onOpenCaseSelector?: () => void;
  onOpenArchive?: () => void;
}

export const InvestigationBottomNav: React.FC<InvestigationBottomNavProps> = ({
  onOpenCaseSelector,
  onOpenArchive,
}) => {
  const { state, setActiveTab, selectedCase, getCasePlayProgress } = useInvestigation();
  const progress = getCasePlayProgress(selectedCase.id);
  const extractedCount = progress.extractedClueIds.length;

  const handleCaseSelectClick = () => {
    InteractionAudio.secondaryClick();
    if (onOpenCaseSelector) {
      onOpenCaseSelector();
    } else {
      setActiveTab("dossies");
    }
  };

  const handleArchiveClick = () => {
    InteractionAudio.secondaryClick();
    if (onOpenArchive) {
      onOpenArchive();
    } else {
      setActiveTab("dossies");
    }
  };

  return (
    <nav
      aria-label="Navegação Principal da Central"
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#040710] via-[#080d1a] to-[#0c1424] border-t-2 border-amber-500/40 shadow-[0_-8px_30px_rgba(0,0,0,0.95)] px-2 sm:px-6 py-2.5 sm:py-3.5 select-none"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-around gap-1 sm:gap-4">
        
        {/* MEDALHÃO 1: MEUS CASOS */}
        <button
          type="button"
          onClick={handleCaseSelectClick}
          className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
        >
          <div
            className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 transition-all flex items-center justify-center ${
              state.activeTab === "dossies"
                ? "bg-gradient-to-b from-[#3d2c0b] via-[#221806] to-[#0a0702] border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_2px_4px_rgba(255,255,255,0.35)] text-amber-200 scale-105"
                : "bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100"
            }`}
          >
            <Eye className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider ${
              state.activeTab === "dossies"
                ? "text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                : "text-amber-300/90 group-hover:text-amber-200"
            }`}
          >
            MEUS CASOS
          </span>
        </button>

        {/* MEDALHÃO 2: MEU ARQUIVO (COM BADGE VERMELHO DE PISTAS) */}
        <button
          type="button"
          onClick={handleArchiveClick}
          className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
        >
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-2 border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100 transition-all">
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            
            {/* Badge circular vermelho de notificações/pistas */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-amber-200 shadow-[0_2px_6px_rgba(0,0,0,0.85)] text-white text-[10px] font-mono font-bold flex items-center justify-center">
              {extractedCount}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider text-amber-300/90 group-hover:text-amber-200">
            MEU ARQUIVO
          </span>
        </button>

        {/* MEDALHÃO 3: PERFIL */}
        <button
          type="button"
          onClick={() => {
            InteractionAudio.secondaryClick();
            setActiveTab("perfil");
          }}
          className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
        >
          <div
            className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 transition-all flex items-center justify-center ${
              state.activeTab === "perfil"
                ? "bg-gradient-to-b from-[#3d2c0b] via-[#221806] to-[#0a0702] border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_2px_4px_rgba(255,255,255,0.35)] text-amber-200 scale-105"
                : "bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100"
            }`}
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider ${
              state.activeTab === "perfil"
                ? "text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                : "text-amber-300/90 group-hover:text-amber-200"
            }`}
          >
            PERFIL
          </span>
        </button>

        {/* MEDALHÃO 4: MAPA MUNDIAL */}
        <button
          type="button"
          onClick={() => {
            InteractionAudio.secondaryClick();
            setActiveTab("mapa");
          }}
          className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
        >
          <div
            className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 transition-all flex items-center justify-center ${
              state.activeTab === "mapa"
                ? "bg-gradient-to-b from-[#3d2c0b] via-[#221806] to-[#0a0702] border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_2px_4px_rgba(255,255,255,0.35)] text-amber-200 scale-105"
                : "bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100"
            }`}
          >
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider ${
              state.activeTab === "mapa"
                ? "text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                : "text-amber-300/90 group-hover:text-amber-200"
            }`}
          >
            MAPA MUNDIAL
          </span>
        </button>

        {/* MEDALHÃO 5: CONQUISTAS */}
        <button
          type="button"
          onClick={() => {
            InteractionAudio.secondaryClick();
            setActiveTab("missoes");
          }}
          className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
        >
          <div
            className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 transition-all flex items-center justify-center ${
              state.activeTab === "missoes"
                ? "bg-gradient-to-b from-[#3d2c0b] via-[#221806] to-[#0a0702] border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_2px_4px_rgba(255,255,255,0.35)] text-amber-200 scale-105"
                : "bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100"
            }`}
          >
            <Award className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider ${
              state.activeTab === "missoes"
                ? "text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                : "text-amber-300/90 group-hover:text-amber-200"
            }`}
          >
            CONQUISTAS
          </span>
        </button>
      </div>
    </nav>
  );
};
