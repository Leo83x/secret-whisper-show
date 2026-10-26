import { useState, useEffect } from "react";
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
  Pointer,
  Maximize2,
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
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setHasInteracted(true);
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
      figureBg: "bg-[#0d1527] border-gold/30",
      dividerLine: "border-gold/30",
      dividerBadge: "bg-[#0f192f] text-gold border-gold/40",
      meta: "text-gold",
      accent: "#c9a962"
    },
    sepia: {
      id: "sepia",
      name: "Sépia",
      cardBg: "bg-[#f5ecda]",
      textColor: "text-[#2b2114]",
      subColor: "text-[#6b583e]",
      borderColor: "border-[#d4c3a3]",
      headerBg: "bg-[#e8dcbf] border-b border-[#cfbfa0]",
      figureBg: "bg-[#e8dcbf] border-[#c5b28f]",
      dividerLine: "border-[#b59e7a]",
      dividerBadge: "bg-[#e5d6b8] text-[#6b4814] border-[#b59e7a]",
      meta: "text-[#8a5d1b]",
      accent: "#d8a342"
    },
    light: {
      id: "light",
      name: "Claro",
      cardBg: "bg-[#ffffff]",
      textColor: "text-[#0f172a]",
      subColor: "text-[#64748b]",
      borderColor: "border-slate-300",
      headerBg: "bg-[#f1f5f9] border-b border-slate-200",
      figureBg: "bg-[#f8fafc] border-slate-300",
      dividerLine: "border-slate-300",
      dividerBadge: "bg-slate-100 text-amber-800 border-amber-400/60",
      meta: "text-amber-700",
      accent: "#f59e0b"
    }
  };

  const currentTheme = themeStyles[theme];

  const handleDecreaseFont = () => {
    const next = Math.max(14, fontSize - 1);
    setFontSize(next);
    triggerToast(`Fonte reduzida para ${next}px`);
  };

  const handleIncreaseFont = () => {
    const next = Math.min(22, fontSize + 1);
    setFontSize(next);
    triggerToast(`Fonte aumentada para ${next}px`);
  };

  const handleThemeChange = (newTheme: "dark" | "sepia" | "light") => {
    setTheme(newTheme);
    triggerToast(`Tema ${themeStyles[newTheme].name} ativado!`);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    triggerToast(!isBookmarked ? "Página salva na nuvem!" : "Marcador removido");
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Conteúdo unificado de "Corte Duplo Cinematográfico" (Passado: Rubicão ➔ Presente: Caio)
  const renderReadingContent = (isFullModal: boolean) => (
    <div className="space-y-4 text-left">
      {/* Card Ilustrado Oficial do E-Reader (Júlio César no Rubicão) */}
      <div className={`rounded-2xl overflow-hidden border ${currentTheme.figureBg} shadow-lg`}>
        <div className="px-3.5 py-1.5 flex items-center justify-between border-b border-white/10 bg-black/20">
          <span className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest ${currentTheme.meta}`}>
            49 A.C. — MARGENS DO RIO RUBICÃO
          </span>
          <span className={`text-[10px] font-mono ${currentTheme.subColor}`}>
            Arquivo 02
          </span>
        </div>
        <div className={`relative w-full ${isFullModal ? "h-52 sm:h-64" : "h-44 sm:h-48"} overflow-hidden bg-black`}>
          <img
            src="/reader/assets/chapters/ch02_julio_cesar.webp"
            alt="Júlio César às margens do Rubicão"
            className="w-full h-full object-cover object-center"
            loading="lazy"
            width="640"
            height="400"
          />
        </div>
        <div className="px-3.5 py-2 flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-sans font-bold ${currentTheme.textColor}`}>
            JÚLIO CÉSAR
          </span>
          <span className={`text-[11px] font-mono ${currentTheme.subColor}`}>
            A travessia do Rubicão // Roma
          </span>
        </div>
      </div>

      {/* PARTE 1: O PASSADO (O GANCHO HISTÓRICO) */}
      <h4 className={`font-sans font-bold ${isFullModal ? "text-2xl sm:text-3xl" : "text-xl"} leading-snug pt-1 ${currentTheme.textColor}`}>
        A Travessia sem Volta
      </h4>

      <div
        className={`space-y-4 leading-relaxed font-sans transition-all duration-200 ${currentTheme.textColor}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        <p>
          O frio de janeiro ainda pesava no ar quando a vanguarda de César chegou às margens do Rubicão. Do outro lado começava o território da Itália, onde a lei do Senado proibia qualquer comandante de entrar em armas.
        </p>

        <p>
          Sob o toldo da tenda, o intendente-chefe conferia as tábuas de cera à luz de uma lamparina: restavam rações de trigo para apenas nove dias, soldos atrasados desde o outono e carroças retidas pelo gelo nos passos do norte. César não tinha semanas para negociar. Tinha horas.
        </p>

        <p>
          — E deixar Pompeu escolher o terreno, a data e o tamanho da corda enquanto esperamos na lama? Preparem os homens. Para atravessar.
        </p>

        {/* DIVISOR VISUAL DE TRANSIÇÃO TEMPORAL: PASSADO ➔ PRESENTE */}
        <div className="py-2 flex items-center gap-3">
          <div className={`flex-1 border-t ${currentTheme.dividerLine}`} />
          <span className={`px-3 py-1 rounded-full border text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest ${currentTheme.dividerBadge}`}>
            • • • DIAS ATUAIS — SÃO PAULO • • •
          </span>
          <div className={`flex-1 border-t ${currentTheme.dividerLine}`} />
        </div>

        {/* PARTE 2: A QUEBRA PARA O PRESENTE (A INVESTIGAÇÃO DE CAIO + CLIFFHANGER) */}
        <p>
          Dois mil anos depois, o brilho frio de três monitores iluminava o rosto de Caio na madrugada silenciosa. Na tela central, o relatório logístico do Rubicão acabava de ser cruzado com os registros de Waterloo em 1815, de Bletchley Park em 1941 e de uma sala de conselho em São Francisco em 2007.
        </p>

        <p>
          Caio recuou na cadeira, sentindo um frio percorrer a espinha. Não era coincidência. Os mesmos números, o mesmo estrangulamento de tempo e a mesma sequência de cinco movimentos estavam lá — como se alguém não apenas observasse as grandes rupturas da humanidade por milênios, mas soubesse exatamente quando a próxima iria acontecer.
        </p>

        <p className="font-semibold">
          Foi quando o alerta de segurança do seu terminal disparou. Ele não era o único olhando para aqueles arquivos...
        </p>
      </div>

      {/* CARD DE FECHAMENTO (DENTRO DO SCROLL, NO FINAL DA LEITURA) */}
      <div className="pt-3 pb-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0e1830] to-[#080d1a] border border-gold/50 text-center space-y-3 shadow-xl">
          <span className="inline-block text-xs sm:text-sm font-mono font-bold text-gold uppercase tracking-wider">
            🔒 FIM DA AMOSTRA // O QUE CAIO DESCOBRIU?
          </span>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            Continue a leitura agora mesmo. Desbloqueie os <strong className="text-white">21 capítulos ilustrados + Prólogo & Epílogo + 4 Dossiês Confidenciais</strong> por apenas R$ 29,90.
          </p>
          <button
            type="button"
            onClick={() => {
              if (isFullModal) setIsModalOpen(false);
              if (onCtaClick) onCtaClick();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(201,169,98,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>Destravar Livro Completo + 4 Dossiês • R$ 29,90</span>
          </button>
        </div>
      </div>
    </div>
  );

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
            Esqueça arquivos de PDF que quebram no celular. Leia abaixo um trecho conectando <strong className="text-gold">Júlio César em 49 a.C.</strong> à investigação nos dias atuais diretamente no simulador:
          </p>
        </div>

        {/* Instrução Direta e Limpa */}
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#0e172e] via-[#142347] to-[#0a1020] border border-gold/70 shadow-[0_0_25px_rgba(201,169,98,0.3)] space-y-1.5">
            <h3 className="font-sans text-sm sm:text-base font-bold text-white tracking-tight uppercase">
              TOQUE NOS BOTÕES DO CELULAR PARA TESTAR:
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
              Alterne entre <strong className="text-gold">🌙 Escuro</strong>, <strong className="text-amber-200">📜 Sépia</strong> ou <strong className="text-white">☀️ Claro</strong> e ajuste o tamanho da letra (<strong className="text-gold">A- / A+</strong>) em tempo real.
            </p>
          </div>
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
          {/* MOCKUP DO CELULAR COM CORTE DUPLO (PASSADO ➔ PRESENTE)   */}
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

                    {/* Barra de Progresso + Botão Expandir */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleToggleBookmark}
                        className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-gold font-bold uppercase hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-gold text-gold" : "text-gold"}`} />
                        <span>CAP. 02 • JÚLIO CÉSAR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(201,169,98,0.45)] active:scale-95 transition-all cursor-pointer hover:brightness-110"
                      >
                        <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>EXPANDIR LEITOR</span>
                      </button>
                    </div>

                    {/* Linha Fina da Barra de Progresso Dourada */}
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold to-amber-300 w-[18%]" />
                    </div>

                    {/* CONTROLES ESSENCIAIS DO LEITOR (TEMA + TAMANHO DA FONTE) */}
                    <div className="pt-2.5 flex items-center justify-between gap-2 mt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-xl border border-white/10 relative">
                        {!hasInteracted && (
                          <div className="absolute -top-7 left-2 flex items-center gap-1 text-[10px] font-sans font-black text-gold bg-slate-950 px-2 py-0.5 rounded-full border border-gold/60 shadow-lg animate-bounce pointer-events-none whitespace-nowrap z-30">
                            <Pointer className="w-3 h-3 text-gold" />
                            <span>Toque para testar</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleThemeChange("dark")}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            theme === "dark" 
                              ? "bg-slate-800 text-gold shadow border border-gold/50" 
                              : "text-slate-400 hover:text-white"
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
                              : "text-slate-400 hover:text-white"
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
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Sun className="w-3 h-3 text-amber-500" />
                          <span>Claro</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={handleDecreaseFont}
                          className="w-7 h-7 rounded-lg text-xs font-black text-slate-200 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center active:scale-95"
                        >
                          A-
                        </button>
                        <span className="text-xs font-mono text-gold font-bold px-1 min-w-[30px] text-center">
                          {fontSize}px
                        </span>
                        <button
                          type="button"
                          onClick={handleIncreaseFont}
                          className="w-7 h-7 rounded-lg text-xs font-black text-slate-200 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center active:scale-95"
                        >
                          A+
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* ÁREA DE LEITURA DO MOCKUP */}
                  <div className="p-4 sm:p-6 space-y-4 flex flex-col justify-between">
                    {renderReadingContent(false)}

                    {/* Rodapé da Tela do Celular */}
                    <div className={`pt-2.5 border-t ${theme === 'dark' ? 'border-white/10' : theme === 'sepia' ? 'border-[#cfbfa0]' : 'border-slate-200'} flex items-center justify-between text-[11px] font-mono ${currentTheme.subColor}`}>
                      <span>21 Capítulos Ilustrados + 4 Dossiês</span>
                      <span className="flex items-center gap-1 text-gold font-bold">
                        <Sparkles className="w-3 h-3" /> Modo Imersivo
                      </span>
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
      {/* MODAL EM TELA CHEIA OTIMIZADO (85% DE ÁREA LIVRE + Z-[100] SEM COLISÃO) */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#060a14] flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Topo Compacto Unificado (~82px total): Linha 1 fina (44px) + Linha 2 controles */}
            <div className="bg-[#0a1020] border-b border-white/10 shrink-0">
              {/* Barra 1: Apenas Fechar + Título curto em 1 única linha */}
              <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Fechar</span>
                </button>

                <span className="text-xs font-mono text-gold font-bold uppercase tracking-wider truncate">
                  Cap. 02 • Júlio César (49 a.C.)
                </span>

                <div className="w-14 shrink-0" />
              </div>

              {/* Barra 2: Seletores de Tema e Fonte super compactos */}
              <div className="px-3 py-1.5 bg-black/50 flex items-center justify-between gap-2 max-w-2xl mx-auto">
                <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      theme === "dark" ? "bg-slate-800 text-gold shadow border border-gold/40" : "text-slate-400"
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Escuro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("sepia")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      theme === "sepia" ? "bg-[#e2d4b5] text-[#3d2b15] shadow border border-[#9b7941]" : "text-slate-400"
                    }`}
                  >
                    <BookOpen className="w-3 h-3 text-amber-700" />
                    <span>Sépia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
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
                    className="w-7 h-7 rounded-md text-xs font-black text-white bg-white/10 flex items-center justify-center active:scale-95"
                  >
                    A-
                  </button>
                  <span className="text-xs font-mono text-gold font-bold px-1 min-w-[32px] text-center">
                    {fontSize}px
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseFont}
                    className="w-7 h-7 rounded-md text-xs font-black text-white bg-white/10 flex items-center justify-center active:scale-95"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Área de Leitura Livre (85% da tela útil, sem rodapé fixo roubando espaço) */}
            <div className={`flex-1 overflow-y-auto px-5 py-6 sm:p-10 ${currentTheme.cardBg} transition-colors duration-300`}>
              <div className="max-w-2xl mx-auto pb-8">
                {renderReadingContent(true)}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
