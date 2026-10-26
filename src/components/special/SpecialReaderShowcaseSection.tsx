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
      highlight: "bg-[#c9a962]/20 text-[#f6d88e] px-3 py-2 rounded-xl border-l-2 border-gold block my-2.5 font-medium",
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
      highlight: "bg-[#d8a342]/25 text-[#1f1406] px-3 py-2 rounded-xl border-l-2 border-[#8a5d1b] block my-2.5 font-semibold",
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
      highlight: "bg-amber-100/90 text-[#78350f] px-3 py-2 rounded-xl border-l-2 border-amber-500 block my-2.5 font-medium",
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
            Esqueça arquivos de PDF que quebram no celular. Experimente abaixo um trecho real do capítulo de <strong className="text-gold">Júlio César no Rubicão</strong> diretamente no simulador do leitor:
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
          {/* MOCKUP DO CELULAR LIMPO, DIRETO E IMERSIVO               */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="relative w-full max-w-[400px] sm:max-w-[430px]">
              
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
                        <span>CAPÍTULO 02 // ROMA, 49 A.C.</span>
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

                  {/* ÁREA DE LEITURA PROFUNDA E CONTÍNUA: JÚLIO CÉSAR NO RUBICÃO */}
                  <div className="p-5 sm:p-6 space-y-4 min-h-[380px] flex flex-col justify-between">
                    <div className="space-y-3.5 text-left">
                      <p className={`text-xs font-mono tracking-widest uppercase font-bold ${currentTheme.meta}`}>
                        ARQUIVO 02 // RIO RUBICÃO, ROMA — 49 A.C.
                      </p>

                      <h4 className={`font-sans font-bold text-xl leading-snug ${currentTheme.textColor}`}>
                        Júlio César: A Travessia sem Volta
                      </h4>

                      <p 
                        className={`leading-relaxed ${currentTheme.textColor} transition-all duration-200 font-sans`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        O frio de janeiro ainda pesava no ar quando a vanguarda de César chegou às margens do Rubicão. Do outro lado daquele curso d'água começava o território administrativo da Itália, onde a lei do Senado proibia qualquer general de entrar em armas.
                      </p>

                      <p 
                        className={`leading-relaxed ${currentTheme.textColor} transition-all duration-200 font-sans`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        A poucos passos do comandante, sob o toldo de uma tenda de campanha, o intendente-chefe conferia as tábuas de cera à luz de uma lamparina: restavam rações de trigo para apenas nove dias, soldos atrasados desde o outono na Gália e carroças retidas pelo gelo nos passos do norte.
                      </p>

                      <p 
                        className={`leading-relaxed ${currentTheme.textColor} transition-all duration-200 font-sans`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        O escrivão de serviço via o que os discursos posteriores esconderiam: o homem prestes a mudar a história do mundo estava decidindo às cegas, cercado por relatos desencontrados e prazos que se fechavam hora a hora.
                      </p>

                      <div 
                        className={`leading-relaxed transition-all duration-200 font-sans ${currentTheme.highlight}`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        — E deixar Pompeu escolher o terreno, a data e o tamanho da corda enquanto esperamos na lama? Preparem os homens. Para atravessar.
                      </div>

                      {/* FECHAMENTO NARRATIVO + BOTÃO DE DESBLOQUEIO */}
                      <div className="pt-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0c1428] to-[#070b16] border border-gold/50 text-center space-y-2.5 shadow-xl">
                          <span className="inline-block text-[10px] font-mono font-bold text-gold uppercase tracking-widest">
                            ⚡ O MESMO PADRÃO ATRAVÉS DOS SÉCULOS
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            Séculos depois, esse mesmo cerco invisível de pressão e risco se repetiria na lama de <strong className="text-white">Waterloo (1815)</strong>, nas máquinas de <strong className="text-white">Alan Turing (1941)</strong> e nos bastidores de <strong className="text-white">Steve Jobs (2007)</strong>.
                          </p>
                          <button
                            type="button"
                            onClick={onCtaClick}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(201,169,98,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Destravar Obra Completa • R$ 29,90</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Rodapé da Tela do Celular */}
                    <div className={`pt-2.5 border-t ${theme === 'dark' ? 'border-white/10' : theme === 'sepia' ? 'border-[#cfbfa0]' : 'border-slate-200'} flex items-center justify-between text-[10px] font-mono ${currentTheme.subColor}`}>
                      <span>21 Capítulos + 4 Dossiês</span>
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

      {/* ======================================================== */}
      {/* MODAL EM TELA CHEIA LIMPO E PROFUNDO                     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-[#060a14] flex flex-col justify-between overflow-hidden"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Topo do Modal */}
            <div className="p-3 sm:p-4 bg-[#0a1020] border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Fechar</span>
              </button>

              <div className="text-center">
                <span className="block text-xs font-mono text-gold font-bold uppercase tracking-wider">
                  AMOSTRA DO LEITOR // TELA CHEIA
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Capítulo 02 // Júlio César (49 a.C.)
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCtaClick) onCtaClick();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>R$ 29,90</span>
              </button>
            </div>

            {/* Barra de Ferramentas Limpa no Modal */}
            <div className="p-3 bg-black/70 border-b border-white/10 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-2 max-w-2xl mx-auto">
                <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      theme === "dark" ? "bg-slate-800 text-gold shadow border border-gold/40" : "text-slate-400"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Escuro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("sepia")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      theme === "sepia" ? "bg-[#e2d4b5] text-[#3d2b15] shadow border border-[#9b7941]" : "text-slate-400"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>Sépia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      theme === "light" ? "bg-white text-slate-900 shadow border border-slate-300" : "text-slate-400"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Claro</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 p-0.5 bg-slate-900 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={handleDecreaseFont}
                    className="w-8 h-8 rounded-lg text-xs font-black text-white bg-white/10 flex items-center justify-center active:scale-95"
                  >
                    A-
                  </button>
                  <span className="text-xs font-mono text-gold font-bold px-1.5 min-w-[32px] text-center">
                    {fontSize}px
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseFont}
                    className="w-8 h-8 rounded-lg text-xs font-black text-white bg-white/10 flex items-center justify-center active:scale-95"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo de Leitura Scrollável em Tela Cheia */}
            <div className={`flex-1 overflow-y-auto p-6 sm:p-10 ${currentTheme.cardBg} transition-colors duration-300`}>
              <div className="max-w-2xl mx-auto space-y-5 text-left">
                
                <div className="space-y-1">
                  <p className={`text-xs font-mono tracking-widest uppercase font-semibold ${currentTheme.meta}`}>
                    ARQUIVO 02 // RIO RUBICÃO, ROMA — 49 A.C.
                  </p>
                  <h2 className={`font-sans font-bold text-2xl sm:text-3xl ${currentTheme.textColor}`}>
                    Júlio César: A Travessia sem Volta
                  </h2>
                </div>

                <div 
                  className={`space-y-4 leading-relaxed font-sans ${currentTheme.textColor}`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p>
                    O frio de janeiro ainda pesava no ar quando a vanguarda de César chegou às margens do Rubicão. O rio era estreito e raso, pequeno demais para carregar a fronteira que passaria a representar nos séculos seguintes. Do outro lado daquele curso d'água começava o território administrativo da Itália, onde a lei do Senado proibia qualquer comandante de entrar em armas.
                  </p>
                  <p>
                    A poucos passos do general, protegido sob o toldo de uma tenda de campanha, o intendente-chefe do exército conferia as tábuas de cera à luz de uma lamparina de azeite. Enquanto os comandantes olhavam para Roma, o trabalho daquele funcionário era medir o que sustentava os homens de pé: rações de trigo para apenas nove dias, soldos atrasados desde o outono na Gália e carroças de suprimento retidas pelo gelo nos passos do norte.
                  </p>
                  <p>
                    Os emissários do Senado haviam bloqueado a liberação de crédito e grãos para as legiões da fronteira. Se César aguardasse parado na margem esperando uma saída política, o inverno consumiria as reservas antes de qualquer resposta.
                  </p>
                  <p>
                    Na entrada da tenda de intendência, o escrivão de serviço baixou o estilete sobre a cera e registrou o horário da chegada do cavaleiro e a divergência dos relatos. Ele via o que os discursos posteriores esconderiam: o comandante de um exército prestes a mudar a história do mundo estava decidindo às cegas, cercado por números desencontrados e prazos que se fechavam hora a hora.
                  </p>
                  <div className={currentTheme.highlight}>
                    — E deixar Pompeu escolher o terreno, a data e o tamanho da corda enquanto esperamos na lama? Preparem os homens. Para atravessar.
                  </div>
                  <p>
                    César caminhou até a beira do barranco e entrou na água gelada. As primeiras fileiras de soldados desceram logo atrás, levantando espuma e barro na correnteza rasa. Para quem fechava o livro de suprimentos na retaguarda, as alternativas tinham encolhido até sobrar uma única direção irreversível.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a1122] border border-gold/50 text-center space-y-2.5 mt-6">
                  <span className="text-xs font-mono text-gold font-bold uppercase tracking-widest block">
                    ⚡ O FIO INVISÍVEL DA OBRA
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Depois que César atravessou o rio, tudo pareceu um plano genial. Antes da travessia, era o mesmo cerco invisível de pressão que séculos depois cercaria Napoleão em Waterloo, Alan Turing em Bletchley Park e Steve Jobs em São Francisco.
                  </p>
                </div>

              </div>
            </div>

            {/* Rodapé Fixo do Modal com Ação de Compra */}
            <div className="p-4 bg-[#0a1020] border-t border-white/10 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
              <div className="text-center sm:text-left">
                <span className="text-white font-bold text-sm block">
                  Gostou da experiência de leitura imersiva?
                </span>
                <span className="text-slate-400 text-xs">
                  Desbloqueie os 21 capítulos + 4 Dossiês Ilustrados por apenas R$ 29,90.
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCtaClick) onCtaClick();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(201,169,98,0.5)] active:scale-95 transition-transform cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Desbloquear Obra Completa • R$ 29,90</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
