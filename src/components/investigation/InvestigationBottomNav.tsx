import React from "react";
import { useInvestigation } from "../../context/InvestigationContext";
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
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#04060d] via-[#080d19] to-[#0c1322] border-t border-[#4a3614]/60 shadow-[0_-6px_25px_rgba(0,0,0,0.95)] px-2 sm:px-6 py-2 sm:py-2.5 select-none"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-around gap-1 sm:gap-4">
        
        {/* MEDALHÃO 1: MEUS CASOS */}
        <button
          type="button"
          onClick={handleCaseSelectClick}
          className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
          title="Casos Históricos da Central"
        >
          <div
            className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full transition-all flex items-center justify-center ${
              state.activeTab === "dossies"
                ? "bg-gradient-to-b from-[#2d210b] via-[#1a1306] to-[#0a0702] border-2 border-[#d5be8a] shadow-[0_0_14px_rgba(180,140,70,0.35),inset_0_2px_4px_rgba(255,255,255,0.25)] text-[#faf6ee] scale-105"
                : "bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white"
            }`}
          >
            <Eye className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif uppercase tracking-wider ${
              state.activeTab === "dossies"
                ? "font-black text-[#d5be8a] drop-shadow-[0_0_6px_rgba(180,140,70,0.4)]"
                : "font-bold text-[#a89263] group-hover:text-[#cfb885]"
            }`}
          >
            MEUS CASOS
          </span>
        </button>

        {/* MEDALHÃO 2: MEU ARQUIVO (SEMPRE AÇÃO DIRETA COM BADGE DE PISTAS) */}
        <button
          type="button"
          onClick={handleArchiveClick}
          className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
          title="Abrir Gaveta de Pistas Catalogadas"
        >
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white transition-all">
            <FolderOpen className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            
            {/* Badge circular vermelho de notificações/pistas */}
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gradient-to-b from-red-600 to-red-800 border border-[#e2caa0] shadow-[0_2px_5px_rgba(0,0,0,0.9)] text-white text-[9px] font-mono font-bold flex items-center justify-center">
              {extractedCount}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#a89263] group-hover:text-[#cfb885]">
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
          title="Ver Perfil do Investigador"
        >
          <div
            className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full transition-all flex items-center justify-center ${
              state.activeTab === "perfil"
                ? "bg-gradient-to-b from-[#2d210b] via-[#1a1306] to-[#0a0702] border-2 border-[#d5be8a] shadow-[0_0_14px_rgba(180,140,70,0.35),inset_0_2px_4px_rgba(255,255,255,0.25)] text-[#faf6ee] scale-105"
                : "bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white"
            }`}
          >
            <User className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif uppercase tracking-wider ${
              state.activeTab === "perfil"
                ? "font-black text-[#d5be8a] drop-shadow-[0_0_6px_rgba(180,140,70,0.4)]"
                : "font-bold text-[#a89263] group-hover:text-[#cfb885]"
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
          title="Abrir Mapa Mundial Geopolítico"
        >
          <div
            className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full transition-all flex items-center justify-center ${
              state.activeTab === "mapa"
                ? "bg-gradient-to-b from-[#2d210b] via-[#1a1306] to-[#0a0702] border-2 border-[#d5be8a] shadow-[0_0_14px_rgba(180,140,70,0.35),inset_0_2px_4px_rgba(255,255,255,0.25)] text-[#faf6ee] scale-105"
                : "bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white"
            }`}
          >
            <Globe className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif uppercase tracking-wider ${
              state.activeTab === "mapa"
                ? "font-black text-[#d5be8a] drop-shadow-[0_0_6px_rgba(180,140,70,0.4)]"
                : "font-bold text-[#a89263] group-hover:text-[#cfb885]"
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
          title="Ver Missões e Conquistas"
        >
          <div
            className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full transition-all flex items-center justify-center ${
              state.activeTab === "missoes"
                ? "bg-gradient-to-b from-[#2d210b] via-[#1a1306] to-[#0a0702] border-2 border-[#d5be8a] shadow-[0_0_14px_rgba(180,140,70,0.35),inset_0_2px_4px_rgba(255,255,255,0.25)] text-[#faf6ee] scale-105"
                : "bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white"
            }`}
          >
            <Award className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-serif uppercase tracking-wider ${
              state.activeTab === "missoes"
                ? "font-black text-[#d5be8a] drop-shadow-[0_0_6px_rgba(180,140,70,0.4)]"
                : "font-bold text-[#a89263] group-hover:text-[#cfb885]"
            }`}
          >
            CONQUISTAS
          </span>
        </button>
      </div>
    </nav>
  );
};
