import React, { useState, useEffect } from "react";
import { useInvestigation } from "../../context/InvestigationContext";
import { soundEngine, AudioAndMotionSettings } from "../../utils/investigationAudio";
import { GameButton, InteractionAudio } from "./GameInteractionSystem";
import { getCasePresentationMeta } from "../../utils/casePresentationData";
import {
  Volume2,
  VolumeX,
  Settings,
  LogOut,
  FolderOpen,
  Globe,
  Award,
  User,
  Eye,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
} from "lucide-react";

interface CaseMissionHubProps {
  onStartInvestigation: () => void;
  onOpenSettings?: () => void;
  onOpenArchive?: () => void;
  onExit?: () => void;
}

// ============================================================================
// ÍCONE DE ROSA DOS VENTOS / BÚSSOLA NÁUTICA EM LATÃO ENVELHECIDO
// ============================================================================
export const BrassCompassRoseIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6 sm:w-7 sm:h-7",
}) => (
  <svg
    viewBox="0 0 36 36"
    className={`shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] ${className}`}
    fill="none"
    aria-hidden="true"
  >
    {/* Anel exterior de latão chanfrado sob bronze escuro */}
    <circle cx="18" cy="18" r="16" stroke="url(#brassCompassRing)" strokeWidth="2" fill="rgba(24, 18, 9, 0.7)" />
    <circle cx="18" cy="18" r="13.5" stroke="#d5be8a" strokeWidth="0.5" opacity="0.6" />
    <circle cx="18" cy="18" r="11" stroke="#2a1c06" strokeWidth="0.75" opacity="0.85" />
    
    {/* Rosa dos Ventos de 8 pontas em relevo */}
    <polygon points="18,3 20.5,15 18,18" fill="url(#brassLightPoint)" />
    <polygon points="18,3 15.5,15 18,18" fill="url(#brassDarkPoint)" />
    
    <polygon points="18,33 15.5,21 18,18" fill="url(#brassLightPoint)" />
    <polygon points="18,33 20.5,21 18,18" fill="url(#brassDarkPoint)" />
    
    <polygon points="33,18 21,20.5 18,18" fill="url(#brassLightPoint)" />
    <polygon points="33,18 21,15.5 18,18" fill="url(#brassDarkPoint)" />
    
    <polygon points="3,18 15,15.5 18,18" fill="url(#brassLightPoint)" />
    <polygon points="3,18 15,20.5 18,18" fill="url(#brassDarkPoint)" />

    <polygon points="28,8 20,16 18,18" fill="url(#brassLightPoint)" opacity="0.8" />
    <polygon points="8,28 16,20 18,18" fill="url(#brassLightPoint)" opacity="0.8" />
    <polygon points="28,28 20,20 18,18" fill="url(#brassLightPoint)" opacity="0.8" />
    <polygon points="8,8 16,16 18,18" fill="url(#brassLightPoint)" opacity="0.8" />

    {/* Núcleo central com rebite de latão */}
    <circle cx="18" cy="18" r="2.8" fill="url(#brassCoreGrad)" stroke="#3a2705" strokeWidth="0.8" />
    <circle cx="17.2" cy="17.2" r="0.8" fill="#fdfcf7" opacity="0.8" />

    <defs>
      <linearGradient id="brassCompassRing" x1="2" y1="2" x2="34" y2="34">
        <stop offset="0%" stopColor="#e2caa0" />
        <stop offset="35%" stopColor="#b38e4a" />
        <stop offset="70%" stopColor="#785920" />
        <stop offset="100%" stopColor="#3d2a0b" />
      </linearGradient>
      <linearGradient id="brassLightPoint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#faf6ee" />
        <stop offset="45%" stopColor="#d5bc84" />
        <stop offset="100%" stopColor="#96722d" />
      </linearGradient>
      <linearGradient id="brassDarkPoint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7a5a21" />
        <stop offset="60%" stopColor="#4c3611" />
        <stop offset="100%" stopColor="#241804" />
      </linearGradient>
      <linearGradient id="brassCoreGrad" x1="16" y1="16" x2="20" y2="20">
        <stop offset="0%" stopColor="#edd8b1" />
        <stop offset="60%" stopColor="#a37d36" />
        <stop offset="100%" stopColor="#4a350d" />
      </linearGradient>
    </defs>
  </svg>
);

export const CaseMissionHub: React.FC<CaseMissionHubProps> = ({
  onStartInvestigation,
  onOpenSettings,
  onOpenArchive,
  onExit,
}) => {
  const { selectedCase, allNodes, state, selectCase, getCasePlayProgress, setActiveTab } =
    useInvestigation();

  const [audioSettings, setAudioSettings] = useState<AudioAndMotionSettings>(() =>
    soundEngine.getSettings()
  );
  const [caseDrawerOpen, setCaseDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    return soundEngine.subscribe(next => setAudioSettings(next));
  }, []);

  const meta = getCasePresentationMeta(selectedCase.id);
  const progress = getCasePlayProgress(selectedCase.id);
  const extractedCount = progress.extractedClueIds.length;

  // Cálculo de nível e progresso do jogador
  const currentLevel = Math.max(1, state.investigator.level || Math.floor(state.totalXp / 400) + 1);
  const currentXp = (state.totalXp % 1000) + 380;
  const maxXp = 1000;
  const xpPercent = Math.min(100, Math.max(10, (currentXp / maxXp) * 100));

  const handleToggleSound = () => {
    InteractionAudio.secondaryClick();
    soundEngine.toggleMuteAll();
  };

  const isCaseLocked = selectedCase.status === "bloqueado";

  const handleStart = () => {
    if (isCaseLocked) {
      soundEngine.playMechanicalClick();
      setIsAuthModalOpen(true);
      return;
    }
    InteractionAudio.primaryPress();
    onStartInvestigation();
  };

  return (
    <div className="relative h-[100dvh] w-full flex flex-col justify-between bg-[#060911] text-slate-100 overflow-hidden select-none font-sans">
      
      {/* =======================================================================
          FUNDO CINEMATOGRÁFICO SÓBRIO COM VINHETA PROFUNDA DE OBSIDIANA
         ======================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-[0.88] contrast-[1.06] saturate-[0.98]"
          style={{
            backgroundImage: `url(${meta.backdropDesktop || "/dossiers/napoleon_stage1_3d_clean.webp"})`,
          }}
        />

        {/* Vinheta periférica elegante que preserva a visão do cenário 3D com contraste para os textos */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,8,17,0.30)_0%,rgba(5,8,17,0.70)_70%,rgba(3,5,10,0.92)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060c] via-transparent to-[#070c18]/80" />
      </div>

      {/* =======================================================================
          1. ÁREA 1: IDENTIDADE DO JOGADOR — TOPO
         ======================================================================= */}
      <header className="relative z-20 w-full px-3 sm:px-6 py-2 sm:py-2.5 border-b border-[#3d2e14]/50 bg-[#050811]/85 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.85)] shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Esquerda: Logo oficial do projeto (/reader/icons/icon-192.png) + Marca */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#96732f]/60 bg-[#060a12] shadow-[0_2px_10px_rgba(0,0,0,0.85)] flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/reader/icons/icon-192.png"
                alt="O Último Segredo"
                className="w-full h-full object-cover rounded-lg select-none"
              />
            </div>

            <div className="hidden min-[380px]:block leading-tight">
              <div className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-[0.18em] text-[#d6c5a0] drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                CENTRAL DE INVESTIGAÇÃO
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                O Último Segredo // Arquivo de Campo
              </div>
            </div>
          </div>

          {/* Centro: Nível e Progresso de XP (Sóbrio, bronze e ouro envelhecido) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xs sm:max-w-sm justify-center">
            {/* Insígnia de nível */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rotate-45 rounded-sm bg-gradient-to-br from-[#6b501c] via-[#9e7930] to-[#3a2a0a] border border-[#cfb885]/40 shadow-[0_2px_6px_rgba(0,0,0,0.8)] flex items-center justify-center shrink-0">
              <span className="-rotate-45 text-[10px] sm:text-[11px] font-mono font-bold text-[#faf6ee]">
                {currentLevel}
              </span>
            </div>

            <div className="flex-1 min-w-[80px] space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                <span className="text-[#cfb885] font-semibold uppercase tracking-wider">Nível {currentLevel}</span>
                <span className="text-slate-400">{currentXp} / {maxXp} XP</span>
              </div>
              {/* Barra de progresso de bronze polido */}
              <div className="w-full h-1.5 sm:h-2 rounded-full bg-[#080d19] border border-[#523d16]/50 overflow-hidden shadow-inner p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7a581e] via-[#b58c3f] to-[#cfad63] transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Direita: Três botões circulares metálicos de bronze (Áudio, Configurações, Sair) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Áudio */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={audioSettings.mutedAll ? "Ativar Áudio Tático" : "Silenciar Áudio"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#1f1709] via-[#100c04] to-[#060401] border border-[#785924]/60 shadow-[0_2px_6px_rgba(0,0,0,0.85)] flex items-center justify-center text-[#d5be8a] hover:text-white hover:border-[#b58c3f] active:scale-95 transition-all cursor-pointer"
            >
              {audioSettings.mutedAll ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#d5be8a]" />}
            </button>

            {/* Configurações */}
            <button
              type="button"
              onClick={onOpenSettings}
              title="Configurações e Acessibilidade"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#1f1709] via-[#100c04] to-[#060401] border border-[#785924]/60 shadow-[0_2px_6px_rgba(0,0,0,0.85)] flex items-center justify-center text-[#d5be8a] hover:text-white hover:border-[#b58c3f] active:scale-95 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Sair */}
            <button
              type="button"
              onClick={onExit}
              title="Encerrar Sessão da Central"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#220c0c] via-[#140606] to-[#070202] border border-red-700/50 shadow-[0_2px_6px_rgba(0,0,0,0.85)] flex items-center justify-center text-red-300 hover:text-white hover:border-red-500 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* =======================================================================
          2. ÁREA 2 & 3: PERSONAGEM, MISSÃO E AÇÃO PRINCIPAL (AJUSTADA AO VIEWPORT)
         ======================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-2 sm:py-4 max-w-4xl mx-auto w-full text-center overflow-hidden min-h-0">
        
        {/* RETRATO DO PERSONAGEM (ENQUADRAMENTO EQUILIBRADO) */}
        <div className="relative mb-2 sm:mb-3 md:mb-4 group shrink-0">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 mx-auto rounded-2xl overflow-hidden border-2 border-[#a37f37]/70 shadow-[0_12px_40px_rgba(0,0,0,0.95)] bg-[#090d16]">
            <img
              src={selectedCase.image}
              alt={selectedCase.name}
              className="w-full h-full object-cover object-top select-none filter contrast-[1.06] brightness-[0.96] transition-transform duration-700 group-hover:scale-105"
            />
            {/* Filete de luz na borda */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>

          {/* Selo do ano na base do retrato */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#594014] via-[#876527] to-[#594014] border border-[#cfb885]/50 shadow-[0_3px_8px_rgba(0,0,0,0.9)] text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#faf6ee] whitespace-nowrap">
            {selectedCase.year}
          </div>
        </div>

        {/* METADADOS DA MISSÃO */}
        <div className="space-y-1 sm:space-y-2 max-w-xl mx-auto shrink-0">
          
          {/* Placa chanfrada: CÓDIGO DO CASO */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-gradient-to-r from-[#1c1407]/90 via-[#2d210b]/90 to-[#1c1407]/90 border border-[#785924]/60 shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
            <span className="font-serif font-bold uppercase tracking-[0.2em] text-[#d5be8a] text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
              {meta.code || selectedCase.missionCode || "CASO HISTÓRICO"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
          </div>

          {/* TÍTULO DA INVESTIGAÇÃO EM TIPOGRAFIA SERIFADA MARFIM */}
          <h1 className="font-serif font-extrabold uppercase text-xl sm:text-3xl md:text-4xl text-[#f3eee5] tracking-[0.06em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight">
            {meta.heroTitle || selectedCase.missionTitle || selectedCase.title}
          </h1>

          {/* PERSONAGEM E DATA */}
          <p className="font-serif italic text-sm sm:text-lg text-[#cfb885] tracking-wide">
            {meta.heroSubtitle || `${selectedCase.name} • ${selectedCase.year}`}
          </p>

          {/* DIVISOR CLÁSSICO DISCRETO */}
          <div className="flex items-center justify-center gap-3 py-0.5 opacity-60">
            <div className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#b38e4a] to-transparent" />
            <span className="text-[#b38e4a] font-serif text-xs">✦</span>
            <div className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#b38e4a] to-transparent" />
          </div>

          {/* FRASE DE IMPACTO EDITORIAL */}
          <p className="text-xs sm:text-sm font-sans text-stone-300 leading-relaxed max-w-md mx-auto line-clamp-2">
            {meta.punchline || selectedCase.shortDescription}
          </p>
        </div>

        {/* =======================================================================
            3. ÁREA 3: AÇÃO PRINCIPAL — BOTÃO DOMINANTE DE PEÇA DE ENGENHARIA
           ======================================================================= */}
        <div className="mt-3 sm:mt-5 w-full max-w-sm sm:max-w-md mx-auto shrink-0">
          <GameButton
            onClick={handleStart}
            size="lg"
            variant={isCaseLocked ? "brass-dark" : "brass"}
            icon={isCaseLocked ? <Lock className="w-5 h-5 text-[#d5be8a]" /> : <BrassCompassRoseIcon className="w-6 h-6 sm:w-7 sm:h-7" />}
            className="w-full text-xs sm:text-sm md:text-base tracking-wider"
          >
            {isCaseLocked ? "DESBLOQUEAR CASO 0" : "INVESTIGAR CASO"}
          </GameButton>

          <div className="mt-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-sans font-medium text-[#cfb885]">
            {isCaseLocked ? (
              <span className="font-semibold text-[#d5be8a]">
                🔒 Requer 3 Casos Concluídos, 1.000 XP ou Código do Livro
              </span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#d5be8a]" />
                <span>Mesa Forense 3D • Resposta Tátil</span>
              </>
            )}
          </div>
        </div>
      </main>

      {/* =======================================================================
          4. ÁREA 4: NAVEGAÇÃO INFERIOR — 5 MEDALHÕES METÁLICOS DE BRONZE
         ======================================================================= */}
      <footer className="relative z-20 w-full bg-gradient-to-t from-[#04060d] via-[#080d19] to-[#0c1322] border-t border-[#4a3614]/60 shadow-[0_-6px_25px_rgba(0,0,0,0.95)] px-2 sm:px-6 py-2 sm:py-2.5 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-around gap-1 sm:gap-4">
          
          {/* MEDALHÃO 1: MEUS CASOS (ATIVO NO HUB DE CASO COM ARO ILUMINADO SUTIL) */}
          <button
            type="button"
            onClick={() => setCaseDrawerOpen(true)}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
            title="Explorar os 10 Casos da Central"
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-b from-[#2d210b] via-[#1a1306] to-[#0a0702] border-2 border-[#d5be8a] shadow-[0_0_16px_rgba(180,140,70,0.4),inset_0_2px_4px_rgba(255,255,255,0.25)] flex items-center justify-center text-[#faf6ee] transition-all scale-105">
              <Eye className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-black uppercase tracking-wider text-[#d5be8a] drop-shadow-[0_0_6px_rgba(180,140,70,0.5)]">
              MEUS CASOS
            </span>
          </button>

          {/* MEDALHÃO 2: MEU ARQUIVO (SECUNDÁRIO COM BADGE VERMELHO DE PISTAS) */}
          <button
            type="button"
            onClick={onOpenArchive}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
            title="Abrir Gaveta de Pistas Catalogadas"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white transition-all">
              <FolderOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              
              {/* Badge vermelho de pistas coletadas */}
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
            onClick={() => setActiveTab("perfil")}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
            title="Ver Perfil do Investigador"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white transition-all">
              <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#a89263] group-hover:text-[#cfb885]">
              PERFIL
            </span>
          </button>

          {/* MEDALHÃO 4: MAPA MUNDIAL */}
          <button
            type="button"
            onClick={() => setActiveTab("mapa")}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
            title="Abrir Mapa Mundial Geopolítico"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white transition-all">
              <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#a89263] group-hover:text-[#cfb885]">
              MAPA MUNDIAL
            </span>
          </button>

          {/* MEDALHÃO 5: CONQUISTAS */}
          <button
            type="button"
            onClick={() => setActiveTab("missoes")}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
            title="Ver Missões e Conquistas"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#1c1407] via-[#100b03] to-[#050301] border border-[#6b4e1c]/70 shadow-[0_3px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c2ab79] group-hover:border-[#a37f37] group-hover:text-white transition-all">
              <Award className="w-4.5 h-4.5 sm:w-5 sm:h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-[#a89263] group-hover:text-[#cfb885]">
              CONQUISTAS
            </span>
          </button>
        </div>
      </footer>

      {/* =======================================================================
          MODAL / GAVETA DE SELEÇÃO RÁPIDA DE CASOS HISTÓRICOS
         ======================================================================= */}
      {caseDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#04060c]/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-gradient-to-b from-[#121929] via-[#090e1a] to-[#050811] border-2 border-[#96732f]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
            
            <div className="px-5 py-3.5 border-b border-[#4a3614]/60 flex items-center justify-between bg-[#080d19]/90">
              <div className="flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-[#d5be8a]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#f3eee5] uppercase tracking-wider">
                  ARQUIVOS DE INVESTIGAÇÃO DA CENTRAL
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCaseDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-[#a37f37] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-2 divide-y divide-slate-800/60 custom-scrollbar">
              {allNodes.map(node => {
                const nodeMeta = getCasePresentationMeta(node.id);
                const isSelected = node.id === selectedCase.id;
                const nodeProg = getCasePlayProgress(node.id);

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      InteractionAudio.secondaryClick();
                      selectCase(node.id);
                      setCaseDrawerOpen(false);
                    }}
                    className={`pt-2 first:pt-0 flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#241a08]/90 border-[#c5a059] shadow-[0_0_12px_rgba(180,140,70,0.25)]"
                        : "bg-[#080c16] border-slate-800/80 hover:border-[#6b4e1c] hover:bg-[#0c1220]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#785924]/60 shrink-0 bg-[#060a12]">
                        <img
                          src={node.image}
                          alt={node.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#cfb885]">
                            {nodeMeta.code}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">• {node.year}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#f3eee5] truncate">
                          {nodeMeta.heroTitle}
                        </h4>
                        <p className="text-xs text-stone-300 truncate">
                          {node.name} — {node.location}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {node.status === "bloqueado" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#d5be8a] bg-[#221706] px-2 py-0.5 rounded border border-[#785924]/60">
                          <Lock className="w-3 h-3 text-[#cfb885]" />
                          <span>Restrito</span>
                        </span>
                      ) : nodeProg.completed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Concluído</span>
                        </span>
                      ) : null}
                      <ChevronRight className="w-4 h-4 text-[#cfb885]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
