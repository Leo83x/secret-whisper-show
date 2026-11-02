import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Moon, 
  Sun, 
  BookOpen, 
  Bookmark, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Users, 
  FileText,
  X,
  Smartphone,
  Zap,
  Wifi,
  BatteryCharging,
  CheckCircle2
} from "lucide-react";

interface SpecialReaderShowcaseProps {
  onCtaClick?: () => void;
}

export const SpecialReaderShowcaseSection = ({ onCtaClick }: SpecialReaderShowcaseProps) => {
  const [theme, setTheme] = useState<"dark" | "sepia" | "light">("dark");
  const [fontSize, setFontSize] = useState<number>(16);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs para trava única de eventos do Meta Pixel por sessão
  const hasTrackedAdjust = useRef<boolean>(false);
  const hasTrackedFullscreen = useRef<boolean>(false);
  const hasTrackedCompleteRead = useRef<boolean>(false);
  const endOfSampleRef = useRef<HTMLDivElement | null>(null);

  // Helper seguro para eventos personalizados do Meta Pixel
  const fireCustomPixel = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      try {
        if (params) {
          (window as any).fbq("trackCustom", eventName, params);
        } else {
          (window as any).fbq("trackCustom", eventName);
        }
      } catch (e) {}
    }
  };

  const trackReaderAdjustOnce = () => {
    if (!hasTrackedAdjust.current) {
      hasTrackedAdjust.current = true;
      fireCustomPixel("EngajouSimulador", { acao: "ajustou_leitor" });
    }
  };

  const openFullscreenModal = () => {
    setIsModalOpen(true);
    if (!hasTrackedFullscreen.current) {
      hasTrackedFullscreen.current = true;
      fireCustomPixel("EngajouSimulador", { acao: "abriu_tela_cheia" });
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 1900);
  };

  const themeStyles = {
    dark: {
      id: "dark",
      name: "Modo Escuro",
      cardBg: "bg-[#080d1a]",
      textColor: "text-[#e2e8f0]",
      subColor: "text-slate-400",
      borderColor: "border-gold/30",
      headerBg: "bg-[#0d1527] border-b border-white/10",
      controlsBg: "bg-black/50 border-white/10",
      controlBtnInactive: "text-slate-400 hover:text-white",
      fontStepperBg: "bg-white/10 text-white hover:bg-white/20",
      fontStepperText: "text-gold font-bold",
      figureBg: "bg-[#0d1527] border-gold/30",
      figureHeaderBg: "bg-black/40 border-white/10",
      dividerLine: "border-gold/30",
      dividerBadge: "bg-[#0f192f] text-gold border-gold/40",
      fadeGradient: "from-transparent via-[#080d1a]/95 to-[#080d1a]",
      meta: "text-gold",
      accent: "#c9a962",
      accentText: "text-gold font-bold",
      // Caixas de Citações do Avô
      quoteBox: "bg-gold/10 border-gold/60 text-gold",
      // Pílula das datas (49 a.C...)
      datePill: "bg-black/60 border-white/10 text-gold",
      // Cena histórica de César
      historicalBorder: "border-gold/50",
      historicalText: "text-slate-200",
      historicalDialogue: "text-white font-bold",
      // Painel de Variáveis da Strata
      variablesBox: "bg-[#0d1527] border-gold/30",
      variablesHeader: "text-gold",
      variablesBullet: "text-gold",
      variablesText: "text-slate-200",
      // Terminal Strata 2007
      terminalBox: "bg-black/80 border-white/10",
      terminalHeader: "text-slate-400",
      terminalTitle: "text-white",
      terminalEvent: "text-gold",
      terminalText: "text-slate-300",
      // Cliffhanger antes do card final
      cliffhangerText: "text-slate-100 font-semibold"
    },
    sepia: {
      id: "sepia",
      name: "Sépia",
      cardBg: "bg-[#f5ecda]",
      textColor: "text-[#2b2114]",
      subColor: "text-[#6b583e]",
      borderColor: "border-[#d4c3a3]",
      headerBg: "bg-[#e8dcbf] border-b border-[#cfbfa0]",
      controlsBg: "bg-[#e0d2b4] border-[#cfbfa0]",
      controlBtnInactive: "text-[#7a6448] hover:text-[#2b2114]",
      fontStepperBg: "bg-[#ebdcb9] text-[#3d2508] hover:bg-[#dfceaa] border border-[#c5b28f]",
      fontStepperText: "text-[#78490e] font-bold",
      figureBg: "bg-[#ebdcb9] border-[#c5b28f]",
      figureHeaderBg: "bg-[#e2d2ad] border-[#cfbfa0]",
      dividerLine: "border-[#b59e7a]",
      dividerBadge: "bg-[#e5d6b8] text-[#5c3a0d] border-[#b59e7a]",
      fadeGradient: "from-transparent via-[#f5ecda]/95 to-[#f5ecda]",
      meta: "text-[#78490e]",
      accent: "#d8a342",
      accentText: "text-[#78490e] font-bold",
      // Caixas de Citações do Avô
      quoteBox: "bg-[#ebdcb9] border-[#9b7941] text-[#3d2508]",
      // Pílula das datas (49 a.C...)
      datePill: "bg-[#ebdcb9] border-[#c5b28f] text-[#5c3a0d]",
      // Cena histórica de César
      historicalBorder: "border-[#9b7941]",
      historicalText: "text-[#2e2315]",
      historicalDialogue: "text-[#1a1208] font-bold",
      // Painel de Variáveis da Strata
      variablesBox: "bg-[#ebdcb9] border-[#c5b28f]",
      variablesHeader: "text-[#78490e]",
      variablesBullet: "text-[#78490e]",
      variablesText: "text-[#2b2114]",
      // Terminal Strata 2007
      terminalBox: "bg-[#ebdcb9] border-[#c5b28f]",
      terminalHeader: "text-[#6b583e]",
      terminalTitle: "text-[#1a1208]",
      terminalEvent: "text-[#78490e]",
      terminalText: "text-[#4a3922]",
      // Cliffhanger antes do card final
      cliffhangerText: "text-[#1a1208] font-bold"
    },
    light: {
      id: "light",
      name: "Claro",
      cardBg: "bg-[#ffffff]",
      textColor: "text-[#0f172a]",
      subColor: "text-[#475569]",
      borderColor: "border-slate-300",
      headerBg: "bg-[#f1f5f9] border-b border-slate-200",
      controlsBg: "bg-slate-200/90 border-slate-300",
      controlBtnInactive: "text-slate-600 hover:text-slate-950",
      fontStepperBg: "bg-white text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-sm",
      fontStepperText: "text-amber-800 font-bold",
      figureBg: "bg-[#f8fafc] border-slate-300",
      figureHeaderBg: "bg-slate-100 border-slate-200",
      dividerLine: "border-slate-300",
      dividerBadge: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
      fadeGradient: "from-transparent via-white/95 to-white",
      meta: "text-amber-800",
      accent: "#d97706",
      accentText: "text-amber-800 font-bold",
      // Caixas de Citações do Avô
      quoteBox: "bg-amber-50/90 border-amber-600 text-amber-950",
      // Pílula das datas (49 a.C...)
      datePill: "bg-amber-50 border-amber-300 text-amber-950",
      // Cena histórica de César
      historicalBorder: "border-amber-600",
      historicalText: "text-slate-900",
      historicalDialogue: "text-slate-950 font-bold",
      // Painel de Variáveis da Strata
      variablesBox: "bg-slate-50 border-slate-300",
      variablesHeader: "text-amber-800",
      variablesBullet: "text-amber-800",
      variablesText: "text-slate-900",
      // Terminal Strata 2007
      terminalBox: "bg-slate-100 border-slate-300",
      terminalHeader: "text-slate-600",
      terminalTitle: "text-slate-950",
      terminalEvent: "text-amber-800",
      terminalText: "text-slate-700",
      // Cliffhanger antes do card final
      cliffhangerText: "text-slate-950 font-bold"
    }
  };

  const currentTheme = themeStyles[theme];

  const handleDecreaseFont = () => {
    const next = Math.max(14, fontSize - 1);
    setFontSize(next);
    trackReaderAdjustOnce();
    triggerToast(`Fonte reduzida para ${next}px`);
  };

  const handleIncreaseFont = () => {
    const next = Math.min(22, fontSize + 1);
    setFontSize(next);
    trackReaderAdjustOnce();
    triggerToast(`Fonte aumentada para ${next}px`);
  };

  const handleThemeChange = (newTheme: "dark" | "sepia" | "light") => {
    setTheme(newTheme);
    trackReaderAdjustOnce();
    triggerToast(`Tema ${themeStyles[newTheme].name} ativado!`);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    trackReaderAdjustOnce();
    triggerToast(!isBookmarked ? "Página salva na nuvem!" : "Marcador removido");
  };

  // Gerenciamento de estado modal: bloqueia scroll, oculta sticky cta/áudio e adiciona ESC shortcut
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-reader-modal", "true");
      window.dispatchEvent(new CustomEvent("readerModalChange"));
    } else {
      document.body.style.overflow = "unset";
      document.body.removeAttribute("data-reader-modal");
      window.dispatchEvent(new CustomEvent("readerModalChange"));
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.body.removeAttribute("data-reader-modal");
      window.dispatchEvent(new CustomEvent("readerModalChange"));
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isModalOpen]);

  // IntersectionObserver para disparar LeuAmostraCompleta quando o leitor chega ao final da amostra
  useEffect(() => {
    if (!isModalOpen || !endOfSampleRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedCompleteRead.current) {
            hasTrackedCompleteRead.current = true;
            fireCustomPixel("LeuAmostraCompleta");
          }
        });
      },
      { threshold: 0.55 }
    );

    observer.observe(endOfSampleRef.current);
    return () => observer.disconnect();
  }, [isModalOpen]);

  return (
    <section id="reader-simulator-section" className="relative py-20 sm:py-26 px-4 sm:px-6 overflow-visible bg-[#050811]/80 border-y border-white/10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-4 py-1.5 rounded-full border border-gold/30 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(201,169,98,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            TECNOLOGIA EXCLUSIVA // LEITOR DIGITAL INTERATIVO
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Uma experiência de leitura imersiva, feita para você.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Esqueça arquivos de PDF que quebram no celular. Teste os modos de leitura: alterne entre <strong className="text-gold">🌙 Escuro</strong>, <strong className="text-amber-200">📜 Sépia</strong> ou <strong className="text-white">☀️ Claro</strong>, ajuste o tamanho da letra (<strong className="text-gold">A- / A+</strong>) e leia abaixo um trecho da obra:
          </p>
        </div>

        {/* Grade: Widget Interativo Central + Telas de Apoio Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Tela Lateral Esquerda (Desktop): Prévia do Dossiê 01 */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-[#090f1e] border border-gold/30 shadow-xl relative overflow-hidden group hover:border-gold/60 transition-all">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono uppercase tracking-widest rounded rotate-3">
                CONFIDENCIAL
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-gold mb-3">
                <FileText className="w-4 h-4 text-gold" />
                <span>DOSSIÊ 01 // 49 A.C.</span>
              </div>
              <h4 className="font-sans font-bold text-sm text-white mb-1.5">
                O Rubicão & O Vale do Silício
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal mb-3">
                Paralelo completo entre a travessia sem volta de Júlio César em 49 a.C. e a jogada decisiva de Steve Jobs em 2007.
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] text-slate-300 flex items-center justify-between">
                <span>COORD: 44.0833° N</span>
                <span className="text-emerald-400 font-bold">INCLUSO</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1325]/80 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Sincronização automática na nuvem: salva exatamente a linha onde você parou.</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MOCKUP DO CELULAR COM PRÉVIA IMEDIATA + GATILHO DE LEITURA */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="relative w-full max-w-[405px] sm:max-w-[435px]">
              
              {/* Moldura Externa de Titânio do Celular */}
              <div className="relative rounded-[44px] sm:rounded-[50px] p-2 sm:p-3 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 border-2 border-slate-500/50 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(201,169,98,0.25)]">
                
                {/* Botões Físicos Laterais */}
                <div className="absolute -left-[5px] top-28 w-[4px] h-10 bg-slate-500 rounded-l-md border-y border-l border-slate-400/60" />
                <div className="absolute -left-[5px] top-42 w-[4px] h-10 bg-slate-500 rounded-l-md border-y border-l border-slate-400/60" />
                <div className="absolute -right-[5px] top-32 w-[4px] h-16 bg-slate-500 rounded-r-md border-y border-r border-slate-400/60" />

                {/* Tela do Celular */}
                <div className={`relative rounded-[38px] sm:rounded-[42px] overflow-hidden ${currentTheme.cardBg} border ${currentTheme.borderColor} transition-colors duration-300 flex flex-col shadow-inner select-none`}>
                  
                  {/* Toast Flutuante de Confirmação Tátil */}
                  <AnimatePresence>
                    {toastMessage && (
                      <motion.div 
                        className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-slate-950/95 text-white border border-gold/60 text-[11px] font-sans font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap"
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{toastMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BARRA SUPERIOR DO CELULAR */}
                  <div className={`px-4 pt-3 pb-2.5 ${currentTheme.headerBg} transition-colors duration-300`}>
                    
                    {/* Status Bar (Hora + Dynamic Island + Bateria) */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                      <span className="w-10 pl-1">09:41</span>
                      <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-md">
                        <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      </div>
                      <div className="flex items-center gap-1.5 w-10 justify-end pr-1">
                        <Wifi className="w-3 h-3" />
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>

                    {/* CONTROLES ESSENCIAIS DO LEITOR (TEMA + TAMANHO DA FONTE) */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <div className={`flex items-center gap-1 p-0.5 rounded-xl border ${currentTheme.controlsBg}`}>
                        <button
                          type="button"
                          onClick={() => handleThemeChange("dark")}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            theme === "dark" 
                              ? "bg-slate-800 text-gold shadow border border-gold/50" 
                              : currentTheme.controlBtnInactive
                          }`}
                        >
                          <Moon className="w-3 h-3" />
                          <span>Escuro</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleThemeChange("sepia")}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            theme === "sepia" 
                              ? "bg-[#e2d4b5] text-[#3d2b15] shadow border border-[#9b7941]" 
                              : currentTheme.controlBtnInactive
                          }`}
                        >
                          <BookOpen className="w-3 h-3 text-amber-700" />
                          <span>Sépia</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleThemeChange("light")}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            theme === "light" 
                              ? "bg-white text-slate-900 shadow border border-slate-300" 
                              : currentTheme.controlBtnInactive
                          }`}
                        >
                          <Sun className="w-3 h-3 text-amber-500" />
                          <span>Claro</span>
                        </button>
                      </div>

                      <div className={`flex items-center gap-1 p-0.5 rounded-xl border ${currentTheme.controlsBg}`}>
                        <button
                          type="button"
                          onClick={handleDecreaseFont}
                          className={`w-7 h-7 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center justify-center active:scale-95 ${currentTheme.fontStepperBg}`}
                        >
                          A-
                        </button>
                        <span className={`text-xs font-mono px-1 min-w-[30px] text-center ${currentTheme.fontStepperText}`}>
                          {fontSize}px
                        </span>
                        <button
                          type="button"
                          onClick={handleIncreaseFont}
                          className={`w-7 h-7 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center justify-center active:scale-95 ${currentTheme.fontStepperBg}`}
                        >
                          A+
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* ÁREA DE LEITURA VISÍVEL NO MOCKUP: INVESTIGAÇÃO CONTEMPORÂNEA COM RITMO REFINADO */}
                  <div className="p-4 sm:p-5 space-y-3.5 flex flex-col justify-between text-left">
                    <div className="space-y-3 text-left relative">
                      {/* Badge de Localização e Horário */}
                      <div className={`rounded-xl px-3.5 py-1.5 border ${currentTheme.figureBg} flex items-center justify-between shadow-md`}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${currentTheme.meta}`}>
                            SÃO PAULO — FARIA LIMA / 03h42
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono ${currentTheme.subColor}`}>
                          Capítulo 01
                        </span>
                      </div>

                      <h4 className={`font-sans font-bold text-lg sm:text-xl leading-snug pt-0.5 ${currentTheme.textColor}`}>
                        O Teste Proibido
                      </h4>

                      <div
                        className={`space-y-3 leading-relaxed font-sans transition-all duration-200 ${currentTheme.textColor}`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        <p>
                          O prédio estava quase vazio. No décimo sexto andar, apenas algumas luzes permaneciam acesas, e o ruído constante da ventilação preenchia o silêncio da sala de auditoria. Caio Avelar estava sentado diante de dois monitores, revisando um lote de operações que analisava havia quase meia hora.
                        </p>

                        <p>
                          Naquela semana, três instituições financeiras de médio porte tinham reduzido seus limites de crédito corporativo. Nos painéis principais, os registros de risco continuavam estáveis, mas o custo de financiamento começava a subir nas pontas mais curtas.
                        </p>

                        <p>
                          O que chamava sua atenção era a diferença entre o que os comunicados oficiais diziam e a pressa silenciosa com que aquelas tesourarias estavam recolhendo dinheiro.
                        </p>

                        <p>
                          Foi esse incômodo que o fez lembrar do caderno do avô. João Avelar trabalhou durante décadas no Banco Central. Numa folha antiga de agosto de 1989, uma frase destacada em caneta preta parecia descrever o mesmo movimento:
                        </p>

                        {/* Citação Isolada do Caderno do Avô Adaptável ao Tema */}
                        <div className={`p-3 rounded-xl border-l-4 font-sans font-semibold text-xs sm:text-sm my-1.5 shadow-sm ${currentTheme.quoteBox}`}>
                          "Procurar o que mudou antes da decisão."
                        </div>

                        {/* Início do trecho da Strata com Fade-Out suave */}
                        <div className="relative pt-1">
                          <p className="opacity-55 select-none">
                            Caio abriu o ambiente de testes da Strata. A empresa mantinha um acervo histórico gigantesco para calibrar modelos de risco. Ele digitou a relação empírica que João anotou, combinando quatro variáveis: pressão, restrição, informação disponível e decisão. Queria ver se aquela estrutura resistia numa escala global...
                          </p>

                          {/* Sombreado (Fade-out) + Botão Centralizado de Continuar Lendo */}
                          <div className={`absolute inset-x-0 bottom-0 pt-12 pb-1 bg-gradient-to-b ${currentTheme.fadeGradient} flex flex-col items-center justify-end`}>
                            <button
                              type="button"
                              onClick={openFullscreenModal}
                              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(201,169,98,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              <BookOpen className="w-4 h-4 stroke-[2.5] text-slate-950 shrink-0" />
                              <span>Continuar lendo amostra em Tela Cheia</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Barra Home Inferior do iPhone */}
                  <div className="pb-2 pt-1 flex justify-center">
                    <div className="w-28 h-1 bg-slate-400/40 rounded-full" />
                  </div>

                </div>

              </div>

            </div>

            {/* 3 Diferenciais Claros Logo Abaixo do Mockup */}
            <div className="w-full max-w-md grid grid-cols-3 gap-2 text-center mt-5">
              <div className="p-2.5 rounded-xl bg-card/40 border border-white/5">
                <Moon className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="block text-[10px] sm:text-xs font-bold text-white">Zero Cansaço</span>
                <span className="text-[10px] text-slate-400">3 Temas Visuais</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card/40 border border-white/5">
                <Smartphone className="w-4 h-4 text-cyan mx-auto mb-1" />
                <span className="block text-[10px] sm:text-xs font-bold text-white">Sem PDF</span>
                <span className="text-[10px] text-slate-400">Leitura Fluida</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card/40 border border-white/5">
                <Bookmark className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="block text-[10px] sm:text-xs font-bold text-white">Nuvem Real</span>
                <span className="text-[10px] text-slate-400">Salva onde parou</span>
              </div>
            </div>

          </div>

          {/* Tela Lateral Direita (Desktop): A Corrente de Leitores */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-[#090f1e] border border-cyan/30 shadow-xl relative overflow-hidden group hover:border-cyan/60 transition-all">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan mb-3">
                <Users className="w-4 h-4 text-cyan" />
                <span>EXPANSÃO // LIVRO II</span>
              </div>
              <h4 className="font-sans font-bold text-sm text-white mb-1.5">
                A Corrente de Leitores
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal mb-3">
                Desbloqueie conteúdos complementares de acordo com seu perfil e condições exclusivas para o Livro II.
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] text-cyan flex items-center justify-between">
                <span>PASSE PRIORITÁRIO</span>
                <span className="text-emerald-400 font-bold">ATIVADO</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1325]/80 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Acesso imediato no Android, iPhone, Tablet e Computador.</span>
            </div>
          </div>

        </div>

      </div>

      {/* ===================================================================== */}
      {/* MODAL EM TELA CHEIA VIA PORTAL (z-[99999]): IMERSÃO TOTAL SEM RUÍDO   */}
      {/* ===================================================================== */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              className="fixed inset-0 z-[99999] bg-[#060a14] flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Topo Compacto e Fixo no Topo do Modal */}
              <div className="bg-[#0a1020] border-b border-white/10 shrink-0 shadow-xl z-50">
                {/* Barra 1: Título na esquerda + Botão FECHAR DOURADO na DIREITA */}
                <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 border-b border-white/5">
                  <span className="text-xs sm:text-sm font-mono text-gold font-bold uppercase tracking-wider truncate">
                    Capítulo 01 • O Teste Proibido (Amostra Oficial)
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold via-amber-300 to-gold hover:from-[#dfb76c] hover:to-[#dfb76c] text-slate-950 font-black text-xs sm:text-sm transition-all cursor-pointer shrink-0 ml-auto shadow-[0_0_15px_rgba(201,169,98,0.4)] active:scale-95"
                    title="Fechar amostra (Esc)"
                  >
                    <span>FECHAR</span>
                    <X className="w-4 h-4 stroke-[3] text-slate-950" />
                  </button>
                </div>

                {/* Barra 2: Seletores de Tema e Fonte */}
                <div className="px-4 py-1.5 bg-[#080d1a] border-b border-white/5 flex items-center justify-between gap-2 max-w-4xl mx-auto">
                  <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleThemeChange("dark")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        theme === "dark" ? "bg-slate-800 text-gold shadow border border-gold/40" : "text-slate-400"
                      }`}
                    >
                      <Moon className="w-3 h-3" />
                      <span>Escuro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThemeChange("sepia")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        theme === "sepia" ? "bg-[#e2d4b5] text-[#3d2b15] shadow border border-[#9b7941]" : "text-slate-400"
                      }`}
                    >
                      <BookOpen className="w-3 h-3 text-amber-700" />
                      <span>Sépia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThemeChange("light")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        theme === "light" ? "bg-white text-slate-900 shadow border border-slate-300" : "text-slate-400"
                      }`}
                    >
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>Claro</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={handleDecreaseFont}
                      className="w-7 h-7 rounded-md text-xs font-black text-white bg-white/10 flex items-center justify-center active:scale-95 cursor-pointer"
                    >
                      A-
                    </button>
                    <span className="text-xs font-mono text-gold font-bold px-1 min-w-[32px] text-center">
                      {fontSize}px
                    </span>
                    <button
                      type="button"
                      onClick={handleIncreaseFont}
                      className="w-7 h-7 rounded-md text-xs font-black text-white bg-white/10 flex items-center justify-center active:scale-95 cursor-pointer"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              {/* Área de Leitura Livre */}
              <div className={`flex-1 overflow-y-auto px-5 py-6 sm:p-10 ${currentTheme.cardBg} transition-colors duration-300`}>
                <div className="max-w-2xl mx-auto pb-14 space-y-4 text-left">
                  
                  {/* PARTE 1: NARRATIVA CONTEMPORÂNEA (SÃO PAULO, FARIA LIMA / 03h42) */}
                  <div className={`rounded-xl px-4 py-2 border ${currentTheme.figureBg} flex items-center justify-between shadow-md`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${currentTheme.meta}`}>
                        SÃO PAULO — FARIA LIMA / 03h42
                      </span>
                    </div>
                    <span className={`text-xs font-mono ${currentTheme.subColor}`}>
                      Capítulo 01 // Sala de Auditoria
                    </span>
                  </div>

                  <h2 className={`font-sans font-bold text-2xl sm:text-3xl leading-snug pt-1 ${currentTheme.textColor}`}>
                    O Teste Proibido
                  </h2>

                  <div
                    className={`space-y-4 leading-relaxed font-sans transition-all duration-200 ${currentTheme.textColor}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <p>
                      O prédio estava quase vazio. No décimo sexto andar, apenas algumas luzes permaneciam acesas, e o ruído constante da ventilação preenchia o silêncio da sala de auditoria. Caio Avelar estava sentado diante de dois monitores, revisando um lote de operações que analisava havia quase meia hora.
                    </p>

                    <p>
                      Naquela semana, três instituições financeiras de médio porte tinham reduzido seus limites de crédito corporativo. Nos painéis principais, os registros de risco continuavam estáveis, mas o custo de financiamento começava a subir nas pontas mais curtas.
                    </p>

                    <p>
                      O que chamava sua atenção era a diferença entre o que os comunicados oficiais diziam e a pressa silenciosa com que aquelas tesourarias estavam recolhendo dinheiro.
                    </p>

                    <p>
                      Foi esse incômodo que o fez lembrar do caderno do avô. João Avelar trabalhou durante décadas no Banco Central. Numa folha antiga de agosto de 1989, uma frase destacada em caneta preta parecia descrever o mesmo movimento:
                    </p>

                    {/* Frase do avô isolada com respiro adaptável ao tema */}
                    <div className={`p-4 rounded-xl border-l-4 font-sans font-semibold text-sm sm:text-base my-2 shadow-sm ${currentTheme.quoteBox}`}>
                      "Procurar o que mudou antes da decisão."
                    </div>

                    <p>
                      Caio abriu o ambiente de testes da Strata. A empresa mantinha um acervo histórico gigantesco para calibrar modelos de risco. Ele digitou a relação empírica que João anotou, combinando quatro variáveis: pressão, restrição, informação disponível e decisão. Queria ver se aquela estrutura resistia numa escala global.
                    </p>

                    <p>
                      A barra de leitura avançou na tela. Segundos depois, a primeira correspondência apareceu no topo do terminal: <strong className={`font-mono ${currentTheme.accentText}`}>326 a.C.</strong> E, logo abaixo, surgiram outras datas em ordem cronológica:
                    </p>

                    {/* Datas cronológicas isoladas com contraste adaptável */}
                    <div className={`p-3 rounded-xl font-mono text-center text-xs sm:text-sm tracking-widest my-2 font-bold shadow-sm ${currentTheme.datePill}`}>
                      49 a.C. • 1431 • 1815 • 2007
                    </div>

                    <p>
                      Caio franziu a testa. Ele reconheceu a data romana de cabeça: 49 a.C., a crise da República e a travessia do Rubicão. Para testar se os números faziam sentido fora da tela, Caio desceu ao arquivo físico da Strata para examinar o compêndio de registros de época.
                    </p>

                    {/* DIVISOR DE TRANSIÇÃO: PRESENTE ➔ ARQUIVO HISTÓRICO */}
                    <div className="py-5 flex items-center gap-3">
                      <div className={`flex-1 border-t ${currentTheme.dividerLine}`} />
                      <span className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${currentTheme.dividerBadge}`}>
                        • • ARQUIVO HISTÓRICO // ROMA, 49 a.C. • •
                      </span>
                      <div className={`flex-1 border-t ${currentTheme.dividerLine}`} />
                    </div>

                    {/* Card Ilustrado do Arquivo Histórico (Cena do Senado em Roma) */}
                    <div className={`rounded-2xl overflow-hidden border ${currentTheme.figureBg} shadow-xl my-4`}>
                      <div className={`px-3.5 py-2 flex items-center justify-between gap-2 border-b ${currentTheme.figureHeaderBg}`}>
                        <span className={`text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider truncate ${currentTheme.meta}`}>
                          49 A.C. — RIO RUBICÃO
                        </span>
                        <span className={`text-[10px] sm:text-xs font-mono shrink-0 ${currentTheme.subColor}`}>
                          Arquivo 02 // Intendência
                        </span>
                      </div>
                      <div className="relative w-full h-52 sm:h-64 overflow-hidden bg-black">
                        <img
                          src="/reader/assets/chapters/ch02_julio_cesar.webp"
                          alt="49 A.C. — O Senado em Roma // Júlio César"
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                          width="640"
                          height="400"
                        />
                      </div>
                      <div className={`px-3.5 py-2 flex items-center justify-between gap-2 ${currentTheme.figureHeaderBg}`}>
                        <span className={`text-sm font-sans font-bold ${currentTheme.textColor}`}>
                          JÚLIO CÉSAR
                        </span>
                        <span className={`text-[11px] sm:text-xs font-mono shrink-0 ${currentTheme.subColor}`}>
                          A travessia do Rubicão // Roma
                        </span>
                      </div>
                    </div>

                    {/* PARTE 2: A CENA HISTÓRICA DO ARQUIVO EM ITÁLICO COM ALTO CONTRASTE */}
                    <div className={`border-l-2 ${currentTheme.historicalBorder} pl-4 py-2 space-y-3.5 italic ${currentTheme.historicalText}`}>
                      <p>
                        O frio de janeiro ainda pesava no ar quando a vanguarda de César chegou às margens do Rubicão. Do outro lado começava o território da Itália, onde a lei do Senado proibia qualquer comandante de entrar em armas.
                      </p>

                      <p>
                        Sob o toldo da tenda, o intendente-chefe conferia as tábuas de cera à luz de uma lamparina: restavam rações de trigo para apenas nove dias, soldos atrasados desde o outono e carroças retidas pelo gelo nos passos do norte. César não tinha semanas para negociar. Tinha horas.
                      </p>

                      <p>
                        Os emissários do Senado haviam bloqueado o crédito e os grãos. Na entrada da tenda, o escrivão de serviço registrava a chegada dos mensageiros esgotados: ninguém sabia o número real das tropas de Pompeu em Roma, mas todos sabiam que o inverno consumiria o acampamento antes de qualquer acordo.
                      </p>

                      <p>
                        Um dos legados mais velhos aproximou-se de César e sugeriu recuar até Ravena para enviar uma última embaixada diplomática. César olhou para a escuridão da outra margem:
                      </p>

                      <p className={`not-italic py-1 text-base sm:text-lg ${currentTheme.historicalDialogue}`}>
                        — E deixar Pompeu escolher o terreno, a data e o tamanho da corda enquanto esperamos na lama? Preparem os homens. Para atravessar.
                      </p>

                      <p>
                        César caminhou até a beira do barranco e entrou na água gelada. As primeiras fileiras desceram logo atrás. Para quem fechava o livro de suprimentos na retaguarda, as alternativas tinham encolhido até sobrar uma única direção irreversível.
                      </p>
                    </div>

                    {/* DIVISOR DE TRANSIÇÃO: RETORNO AO PRESENTE */}
                    <div className="py-5 flex items-center gap-3">
                      <div className={`flex-1 border-t ${currentTheme.dividerLine}`} />
                      <span className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${currentTheme.dividerBadge}`}>
                        • • SÃO PAULO — FARIA LIMA // 05h18 • •
                      </span>
                      <div className={`flex-1 border-t ${currentTheme.dividerLine}`} />
                    </div>

                    {/* PARTE 3: O RETORNO A CAIO E O SISTEMA DA STRATA */}
                    <p>
                      Caio fechou o livro. Durante alguns segundos, ficou olhando para a capa escura sobre a mesa.
                    </p>

                    <p>
                      Depois puxou o celular e voltou para a tela do sistema. A ocorrência de 49 a.C. continuava aberta, listando as variáveis extraídas pelo modelo:
                    </p>

                    {/* Estrutura das 5 Variáveis Extraídas pelo Modelo */}
                    <div className={`p-4 rounded-xl border ${currentTheme.variablesBox} my-3 space-y-2 font-mono text-xs sm:text-sm shadow-md`}>
                      <div className={`font-bold mb-1 tracking-wider uppercase text-[11px] ${currentTheme.variablesHeader}`}>
                        VARIÁVEIS DO MODELO // ESTRANGULAMENTO DECISÓRIO:
                      </div>
                      <div className={`flex items-center gap-2 ${currentTheme.variablesText}`}><span className={currentTheme.variablesBullet}>●</span> <span className="font-semibold">PRESSÃO</span></div>
                      <div className={`flex items-center gap-2 ${currentTheme.variablesText}`}><span className={currentTheme.variablesBullet}>●</span> <span className="font-semibold">INFORMAÇÃO INCOMPLETA</span></div>
                      <div className={`flex items-center gap-2 ${currentTheme.variablesText}`}><span className={currentTheme.variablesBullet}>●</span> <span className="font-semibold">ALTERNATIVAS REDUZIDAS</span></div>
                      <div className={`flex items-center gap-2 ${currentTheme.variablesText}`}><span className={currentTheme.variablesBullet}>●</span> <span className="font-semibold">DECISÃO</span></div>
                      <div className={`flex items-center gap-2 ${currentTheme.variablesText}`}><span className={currentTheme.variablesBullet}>●</span> <span className="font-semibold">CONSEQUÊNCIA</span></div>
                    </div>

                    <p>
                      A estrutura inteira estava ali. O que chamava a atenção de Caio era o ponto de vista daquela catalogação. A máquina deixava de lado o mérito político de César e se concentrava nas condições práticas que alguém na retaguarda — um intendente, um escrivão, um observador de ofício — anotou antes da travessia.
                    </p>

                    <p>
                      Depois que César atravessou o rio, tudo parecia um plano genial e inevitável. Antes da travessia, na lama fria de janeiro, era apenas um homem cercado por informações quebradas e prazos vencidos.
                    </p>

                    <p>
                      Caio abriu o caderno do avô e escreveu com firmeza:
                    </p>

                    {/* Citação reflexiva do avô isolada adaptável */}
                    <div className={`p-4 rounded-xl border-l-4 font-sans font-semibold text-sm sm:text-base my-2 shadow-sm ${currentTheme.quoteBox}`}>
                      "A História tem uma crueldade particular. Depois que tudo termina, ela transforma incerteza em sequência."
                    </div>

                    <p>
                      O celular vibrou sobre a mesa com uma atualização do servidor da Strata. A compilação completa da ocorrência de 2007 terminou de carregar:
                    </p>

                    {/* Terminal Strata: Ocorrência 2007 Adaptável */}
                    <div className={`p-4 rounded-xl font-mono text-xs space-y-1 my-3 shadow-md border ${currentTheme.terminalBox}`}>
                      <div className={`text-[10px] uppercase tracking-wider ${currentTheme.terminalHeader}`}>SERVIDOR STRATA // OCORRÊNCIA COMPILADA</div>
                      <div className={`font-bold text-sm ${currentTheme.terminalTitle}`}>09.01.2007 — SÃO FRANCISCO</div>
                      <div className={`font-semibold ${currentTheme.terminalEvent}`}>EVENTO PÚBLICO // DEPENDÊNCIAS OPERACIONAIS</div>
                      <div className={currentTheme.terminalText}>REDE / DISPOSITIVO / OPERADORA / DEMONSTRAÇÃO</div>
                    </div>

                    <p>
                      Abriu o sumário do primeiro documento e viu o nome de Steve Jobs. Assim como no arquivo romano, o relatório passava longe do discurso feito no palco. O foco estava nas anotações técnicas de engenharia e nos contratos de rede — o registro de quem estava atrás da cortina medindo o risco de tudo falhar ao vivo.
                    </p>

                    <p>
                      Caio olhou para o livro de Roma e depois para o telefone. Duas épocas separadas por vinte séculos apresentavam o mesmo estrangulamento antes da escolha.
                    </p>

                    <p className={currentTheme.cliffhangerText}>
                      Fechou o caderno, pegou o volume de capa dura e saiu da sala de arquivos em direção ao elevador. Na tela do computador, o dossiê de 2007 já estava esperando.
                    </p>
                  </div>

                  {/* CARD DE FECHAMENTO OBSERVADO PELO INTERSECTION OBSERVER (LeuAmostraCompleta) */}
                  <div ref={endOfSampleRef} className="pt-6 pb-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0e1830] to-[#080d1a] border border-gold/50 text-center space-y-4 shadow-2xl">
                      <span className="inline-block text-xs sm:text-sm font-mono font-bold text-gold uppercase tracking-wider">
                        🔒 FIM DA DEGUSTAÇÃO // CONTINUE A INVESTIGAÇÃO
                      </span>
                      <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal max-w-lg mx-auto">
                        Descubra como Caio avança pelos bastidores de Júlio César, Napoleão, Alan Turing e Steve Jobs. Desbloqueie o romance completo agora mesmo:
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          if (onCtaClick) onCtaClick();
                        }}
                        className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(201,169,98,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
                        <span>Destravar Livro Completo + 4 Dossiês • R$ 29,90</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
};
