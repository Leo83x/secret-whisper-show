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
  Layers,
  X,
} from "lucide-react";

interface CaseMissionHubProps {
  onStartInvestigation: () => void;
  onOpenSettings?: () => void;
  onOpenArchive?: () => void;
  onExit?: () => void;
}

// ============================================================================
// ÍCONE DE ROSA DOS VENTOS / BÚSSOLA NÁUTICA EM LATÃO EM RELEVO
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
    {/* Anel exterior de latão chanfrado */}
    <circle cx="18" cy="18" r="16" stroke="url(#brassCompassRing)" strokeWidth="2.2" fill="rgba(38, 26, 6, 0.6)" />
    <circle cx="18" cy="18" r="13.5" stroke="#fef08a" strokeWidth="0.6" opacity="0.65" />
    <circle cx="18" cy="18" r="11" stroke="#362404" strokeWidth="0.8" opacity="0.8" />
    
    {/* Rosa dos Ventos de 8 pontas em relevo */}
    {/* Ponta Norte */}
    <polygon points="18,3 20.5,15 18,18" fill="url(#brassLightPoint)" />
    <polygon points="18,3 15.5,15 18,18" fill="url(#brassDarkPoint)" />
    
    {/* Ponta Sul */}
    <polygon points="18,33 15.5,21 18,18" fill="url(#brassLightPoint)" />
    <polygon points="18,33 20.5,21 18,18" fill="url(#brassDarkPoint)" />
    
    {/* Ponta Leste */}
    <polygon points="33,18 21,20.5 18,18" fill="url(#brassLightPoint)" />
    <polygon points="33,18 21,15.5 18,18" fill="url(#brassDarkPoint)" />
    
    {/* Ponta Oeste */}
    <polygon points="3,18 15,15.5 18,18" fill="url(#brassLightPoint)" />
    <polygon points="3,18 15,20.5 18,18" fill="url(#brassDarkPoint)" />

    {/* Pontas diagonais intermediárias */}
    <polygon points="28,8 20,16 18,18" fill="url(#brassLightPoint)" opacity="0.85" />
    <polygon points="8,28 16,20 18,18" fill="url(#brassLightPoint)" opacity="0.85" />
    <polygon points="28,28 20,20 18,18" fill="url(#brassLightPoint)" opacity="0.85" />
    <polygon points="8,8 16,16 18,18" fill="url(#brassLightPoint)" opacity="0.85" />

    {/* Núcleo central com rebite de ouro */}
    <circle cx="18" cy="18" r="2.8" fill="url(#brassCoreGrad)" stroke="#452e04" strokeWidth="0.8" />
    <circle cx="17.2" cy="17.2" r="0.9" fill="#fffbeb" opacity="0.9" />

    <defs>
      <linearGradient id="brassCompassRing" x1="2" y1="2" x2="34" y2="34">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="30%" stopColor="#d4af37" />
        <stop offset="70%" stopColor="#8a6521" />
        <stop offset="100%" stopColor="#452e04" />
      </linearGradient>
      <linearGradient id="brassLightPoint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="40%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#c59b27" />
      </linearGradient>
      <linearGradient id="brassDarkPoint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8a6521" />
        <stop offset="60%" stopColor="#573e0e" />
        <stop offset="100%" stopColor="#2b1a01" />
      </linearGradient>
      <linearGradient id="brassCoreGrad" x1="16" y1="16" x2="20" y2="20">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#573e0e" />
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

  // Cálculo de nível e XP do jogador para a barra superior
  const currentLevel = Math.max(1, state.investigator.level || Math.floor(state.totalXp / 400) + 1);
  const currentXp = (state.totalXp % 1000) + 380;
  const maxXp = 1000;
  const xpPercent = Math.min(100, Math.max(10, (currentXp / maxXp) * 100));

  const handleToggleSound = () => {
    InteractionAudio.secondaryClick();
    soundEngine.toggleMuteAll();
  };

  const handleStart = () => {
    InteractionAudio.primaryPress();
    onStartInvestigation();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#070b13] text-slate-100 overflow-x-hidden select-none">
      
      {/* =======================================================================
          FUNDO CINEMATOGRÁFICO DE ÉPOCA COM VINHETA PROFUNDA
         ======================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Imagem de Fundo / Cenário Histórico */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-[0.78] contrast-[1.12]"
          style={{
            backgroundImage: `url(${meta.backdropDesktop || "/dossiers/waterloo_hero_desktop.jpg"})`,
          }}
        />

        {/* Gradiente de iluminação dramática quente e vinheta em obsidiana */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060b] via-[#050811]/75 to-[#060a14]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.14)_0%,rgba(0,0,0,0.6)_65%,rgba(0,0,0,0.95)_100%)]" />
        
        {/* Glow dourado suave sob a área da missão */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[90px] rounded-full" />
      </div>

      {/* =======================================================================
          1. ÁREA 1: IDENTIDADE DO JOGADOR — TOPO
         ======================================================================= */}
      <header className="relative z-20 w-full px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-amber-500/25 bg-[#050811]/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Esquerda: Insígnia da Central USH */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Brasão circular de louros com monograma em alto-relevo */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-[#241a06] via-[#120e05] to-[#080602] shadow-[0_0_16px_rgba(212,175,55,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center p-1 relative group cursor-pointer">
              <span className="text-amber-300 font-serif font-black text-sm sm:text-base tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                USH
              </span>
              <div className="absolute inset-0 rounded-full border border-amber-300/40 opacity-70 pointer-events-none" />
            </div>

            <div className="hidden min-[380px]:block leading-tight">
              <div className="text-[11px] sm:text-xs font-serif font-extrabold uppercase tracking-[0.2em] text-amber-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                CENTRAL DE INVESTIGAÇÃO
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                Protocolo Histórico Sigiloso
              </div>
            </div>
          </div>

          {/* Centro: Nível e Progresso de XP */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xs sm:max-w-sm justify-center">
            {/* Ícone de nível metálico em losango */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rotate-45 rounded-sm bg-gradient-to-br from-[#8a6521] via-[#d4af37] to-[#4c3c13] border border-amber-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center shrink-0">
              <span className="-rotate-45 text-[10px] sm:text-xs font-mono font-black text-[#1a1202]">
                {currentLevel}
              </span>
            </div>

            <div className="flex-1 min-w-[90px] space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold">
                <span className="text-amber-300 uppercase tracking-wider">Nível {currentLevel}</span>
                <span className="text-slate-300/90">{currentXp} / {maxXp} XP</span>
              </div>
              {/* Barra de progresso dourada física */}
              <div className="w-full h-2 rounded-full bg-[#0a0f1d] border border-amber-600/40 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.7)] transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Direita: Três botões redondos de latão (Áudio, Configurações, Sair) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botão de Áudio */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={audioSettings.mutedAll ? "Ativar Áudio Tático" : "Silenciar Áudio"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#241a06] via-[#120e05] to-[#080602] border border-amber-500/60 shadow-[0_2px_8px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center text-amber-300 hover:text-amber-100 hover:border-amber-300 active:scale-95 transition-all cursor-pointer"
            >
              {audioSettings.mutedAll ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>

            {/* Botão de Configurações */}
            <button
              type="button"
              onClick={onOpenSettings}
              title="Configurações e Acessibilidade"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#241a06] via-[#120e05] to-[#080602] border border-amber-500/60 shadow-[0_2px_8px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center text-amber-300 hover:text-amber-100 hover:border-amber-300 active:scale-95 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Botão de Sair / Menu */}
            <button
              type="button"
              onClick={onExit}
              title="Encerrar Sessão da Central"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#2a0e0e] via-[#180707] to-[#090202] border border-red-500/60 shadow-[0_2px_8px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center text-red-300 hover:text-red-100 hover:border-red-400 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* =======================================================================
          2. ÁREA 2 & 3: PERSONAGEM, MISSÃO E AÇÃO PRINCIPAL (CENTRAL)
         ======================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto w-full text-center">
        
        {/* RETRATO DO PERSONAGEM (COMPOSIÇÃO HEROICA) */}
        <div className="relative mb-5 sm:mb-7 group">
          {/* Moldura de metal envelhecido com sombra projetada */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-2xl overflow-hidden border-[3px] border-amber-400/80 shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.3)] bg-[#0b101c]">
            <img
              src={selectedCase.image}
              alt={selectedCase.name}
              className="w-full h-full object-cover object-top select-none filter contrast-[1.08] brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
            />
            {/* Brilho de filete no vidro */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Selo comemorativo de era histórica no canto inferior direito */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#8a6521] via-[#d4af37] to-[#8a6521] border border-amber-200/70 shadow-[0_4px_12px_rgba(0,0,0,0.9)] text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-widest text-[#1a1202] whitespace-nowrap">
            {selectedCase.year}
          </div>
        </div>

        {/* METADADOS DO CASO & MISSÃO */}
        <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
          
          {/* Placa chanfrada: NÚMERO DO CASO */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-md bg-gradient-to-r from-[#2a1e08]/90 via-[#3a2c0c]/90 to-[#2a1e08]/90 border border-amber-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
            <span className="font-serif font-extrabold uppercase tracking-[0.25em] text-amber-300 text-xs sm:text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
              {meta.code || selectedCase.missionCode || "CASO HISTÓRICO"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
          </div>

          {/* TÍTULO DA INVESTIGAÇÃO EM TIPOGRAFIA NOBRE SERIFADA */}
          <h1 className="font-serif font-black uppercase text-2xl sm:text-4xl md:text-5xl text-white tracking-[0.08em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95),0_0_25px_rgba(212,175,55,0.25)] leading-tight">
            {meta.heroTitle || selectedCase.missionTitle || selectedCase.title}
          </h1>

          {/* PERSONAGEM E PERÍODO */}
          <p className="font-serif italic text-base sm:text-xl text-amber-300/95 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {meta.heroSubtitle || `${selectedCase.name} • ${selectedCase.year}`}
          </p>

          {/* DIVISOR DOURADO COM FLOR-DE-LIS */}
          <div className="flex items-center justify-center gap-3 py-1 opacity-80">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="text-amber-400 font-serif text-sm">✦</span>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>

          {/* FRASE CURTA DE APRESENTAÇÃO */}
          <p className="text-xs sm:text-base font-sans text-slate-300 leading-relaxed max-w-lg mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {meta.punchline || selectedCase.shortDescription}
          </p>
        </div>

        {/* =======================================================================
            3. ÁREA 3: AÇÃO PRINCIPAL — BOTÃO ÚNICO DOMINANTE DE PEÇA DE ENGENHARIA
           ======================================================================= */}
        <div className="mt-6 sm:mt-8 w-full max-w-md mx-auto">
          <GameButton
            onClick={handleStart}
            size="lg"
            icon={<BrassCompassRoseIcon className="w-7 h-7 sm:w-8 sm:h-8" />}
            className="w-full text-sm sm:text-base tracking-[0.18em]"
          >
            INICIAR INVESTIGAÇÃO
          </GameButton>

          {/* Sublegenda de orientação tátil */}
          <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-mono text-amber-300/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mesa de Evidências Forenses 3D • Resposta Tátil</span>
          </div>
        </div>
      </main>

      {/* =======================================================================
          4. ÁREA 4: NAVEGAÇÃO INFERIOR — OS 5 MEDALHÕES METÁLICOS DE BRONZE E OURO
         ======================================================================= */}
      <footer className="relative z-20 w-full bg-gradient-to-t from-[#050811] via-[#090e1c] to-[#0d1424] border-t-2 border-amber-500/40 shadow-[0_-8px_30px_rgba(0,0,0,0.9)] px-2 sm:px-6 py-2.5 sm:py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-around gap-1 sm:gap-4">
          
          {/* MEDALHÃO 1: MEUS CASOS */}
          <button
            type="button"
            onClick={() => setCaseDrawerOpen(true)}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-2 border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100 transition-all">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider text-amber-300/90 group-hover:text-amber-200">
              MEUS CASOS
            </span>
          </button>

          {/* MEDALHÃO 2: MEU ARQUIVO (ATIVO COM GLOW RADIANTE + BADGE VERMELHO) */}
          <button
            type="button"
            onClick={onOpenArchive}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#3d2c0b] via-[#221806] to-[#0a0702] border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.65),0_4px_16px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center text-amber-200 transition-all scale-105">
              <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" />
              
              {/* Badge vermelho de pistas coletadas */}
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-amber-200 shadow-[0_2px_6px_rgba(0,0,0,0.8)] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                {extractedCount}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-black uppercase tracking-wider text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
              MEU ARQUIVO
            </span>
          </button>

          {/* MEDALHÃO 3: PERFIL */}
          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-2 border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100 transition-all">
              <User className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider text-amber-300/90 group-hover:text-amber-200">
              PERFIL
            </span>
          </button>

          {/* MEDALHÃO 4: MAPA MUNDIAL */}
          <button
            type="button"
            onClick={() => setActiveTab("mapa")}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-2 border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100 transition-all">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider text-amber-300/90 group-hover:text-amber-200">
              MAPA MUNDIAL
            </span>
          </button>

          {/* MEDALHÃO 5: CONQUISTAS */}
          <button
            type="button"
            onClick={() => setActiveTab("missoes")}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#2a1e08] via-[#140f04] to-[#080602] border-2 border-amber-500/70 shadow-[0_4px_14px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.25)] flex items-center justify-center text-amber-300 group-hover:border-amber-300 group-hover:text-amber-100 transition-all">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <span className="text-[10px] sm:text-xs font-serif font-extrabold uppercase tracking-wider text-amber-300/90 group-hover:text-amber-200">
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
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-gradient-to-b from-[#131b2e] via-[#0b101c] to-[#060a12] border-2 border-amber-400/70 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.25)] flex flex-col overflow-hidden">
            
            {/* Cabeçalho da Gaveta de Casos */}
            <div className="px-5 py-4 border-b border-amber-500/30 flex items-center justify-between bg-[#0a0f1c]/90">
              <div className="flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-white uppercase tracking-wider">
                  ARQUIVOS DE INVESTIGAÇÃO DISPONÍVEIS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCaseDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-amber-400 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista dos 10 Casos Históricos */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 divide-y divide-slate-800/60">
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
                    className={`pt-2.5 first:pt-0 flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        : "bg-[#090d18] border-slate-800/90 hover:border-amber-500/40 hover:bg-[#0c1324]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-400/50 shrink-0 bg-[#060a12]">
                        <img
                          src={node.image}
                          alt={node.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                            {nodeMeta.code}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">• {node.year}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                          {nodeMeta.heroTitle}
                        </h4>
                        <p className="text-xs text-slate-300 truncate">
                          {node.name} — {node.location}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {nodeProg.completed && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Concluído</span>
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-amber-400" />
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
