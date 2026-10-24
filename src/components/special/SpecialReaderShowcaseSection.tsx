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
  const [fontSize, setFontSize] = useState<number>(15);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(true);

  // Exibe toast temporário de confirmação de toque
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
      highlight: "bg-[#c9a962]/25 text-[#f6d88e] px-1 py-0.5 rounded border-b border-gold/50 shadow-[0_0_15px_rgba(201,169,98,0.25)]",
      meta: "text-sky-400",
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
      highlight: "bg-[#d8a342]/30 text-[#1f1406] px-1 py-0.5 rounded border-b border-[#b58327] font-semibold",
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
      highlight: "bg-amber-100 text-[#78350f] px-1 py-0.5 rounded border-b border-amber-300 font-medium",
      meta: "text-sky-600",
      accent: "#f59e0b"
    }
  };

  const currentTheme = themeStyles[theme];

  const handleDecreaseFont = () => {
    const next = Math.max(13, fontSize - 1);
    setFontSize(next);
    triggerToast(`Fonte reduzida para ${next}px`);
  };

  const handleIncreaseFont = () => {
    const next = Math.min(19, fontSize + 1);
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

  const handleToggleHighlight = () => {
    setIsHighlighted(!isHighlighted);
    triggerToast(!isHighlighted ? "Trecho grifado em dourado!" : "Grifo removido");
  };

  // Trava o scroll do body quando o modal estiver aberto no mobile
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
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-visible bg-[#050811]/80 border-y border-white/10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-4 py-1.5 rounded-full border border-gold/30 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(201,169,98,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            TECNOLOGIA EXCLUSIVA // NADA DE PDF COMUM
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Uma plataforma desenhada para prender a sua atenção.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Esqueça arquivos soltos de PDF que quebram no celular. Você acessa um leitor digital nativo, construído com foco obsessivo em tipografia, contraste e imersão total.
          </p>
        </div>

        {/* ======================================================== */}
        {/* PRINT 3 RESOLVIDO: BANNER DE ALTO CONTRASTE E DESTAQUE   */}
        {/* ======================================================== */}
        <motion.div 
          className="w-full max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0e172e] via-[#142347] to-[#0a1020] border-2 border-gold shadow-[0_0_45px_rgba(201,169,98,0.45)] space-y-3.5 overflow-hidden">
            {/* Feixe sutil de luz no topo */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gold/20 blur-2xl rounded-full pointer-events-none" />

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-gold via-amber-300 to-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-md animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                SIMULADOR INTERATIVO AO VIVO
              </span>
            </div>

            <h3 className="font-sans text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
              TOQUE NOS BOTÕES DO CELULAR ABAIXO PARA TESTAR:
            </h3>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-xl mx-auto">
              Alterne entre os modos <strong className="text-gold bg-gold/20 px-2 py-0.5 rounded-lg border border-gold/40">🌙 Escuro</strong>, <strong className="text-amber-200 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-300/40">📜 Sépia</strong> ou <strong className="text-white bg-white/20 px-2 py-0.5 rounded-lg border border-white/40">☀️ Claro</strong> e ajuste a letra em tempo real. Veja a tela mudar na hora!
            </p>

            {/* Botão de Destaque para abrir em Tela Cheia no Celular (Ideal para tráfego do Instagram) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#c9a962] via-[#e8cd8a] to-[#c9a962] hover:from-[#dcb86f] hover:to-[#dcb86f] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(201,169,98,0.5)] active:scale-95 transition-all cursor-pointer group"
              >
                <Smartphone className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>Abrir Simulador em Tela Cheia no Celular</span>
                <Maximize2 className="w-3.5 h-3.5 text-slate-950 opacity-80" />
              </button>
            </div>
          </div>
        </motion.div>

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
                O Rubicão & A Faria Lima
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light mb-3">
                Fragmento tático comparando a decisão de Júlio César com o modelo de liquidez da Strata em 2026.
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] text-slate-300 flex items-center justify-between">
                <span>COORD: 44.0833° N</span>
                <span className="text-emerald-400 font-bold">DESCLASSIFICADO</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1325]/80 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Sincronização na nuvem com progresso gravado por linha.</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MOCKUP DO CELULAR ULTRA-REALISTA (ESTILO IPHONE 16 PRO)  */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <motion.div 
              className="relative w-full max-w-[380px] sm:max-w-[400px]"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              
              {/* Moldura Externa de Titânio do Celular */}
              <div className="relative rounded-[48px] sm:rounded-[52px] p-2.5 sm:p-3 bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 border-2 border-slate-500/50 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(201,169,98,0.25)]">
                
                {/* Botões Físicos Laterais do Smartphone */}
                {/* Botão de volume + */}
                <div className="absolute -left-[5px] top-28 w-[4px] h-10 bg-slate-500 rounded-l-md border-y border-l border-slate-400/60" />
                {/* Botão de volume - */}
                <div className="absolute -left-[5px] top-42 w-[4px] h-10 bg-slate-500 rounded-l-md border-y border-l border-slate-400/60" />
                {/* Botão lateral de energia / ação */}
                <div className="absolute -right-[5px] top-32 w-[4px] h-16 bg-slate-500 rounded-r-md border-y border-r border-slate-400/60" />

                {/* Tela do Celular */}
                <div className={`relative rounded-[40px] sm:rounded-[44px] overflow-hidden ${currentTheme.cardBg} border ${currentTheme.borderColor} transition-colors duration-300 flex flex-col shadow-inner select-none`}>
                  
                  {/* Reflexo de Vidro Físico Angulado */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent z-20" />

                  {/* Toast Flutuante de Confirmação Tátil */}
                  <AnimatePresence>
                    {toastMessage && (
                      <motion.div 
                        className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-slate-950/90 text-white border border-gold/60 text-[11px] font-sans font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap"
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

                  {/* BARRA SUPERIOR DO CELULAR: Dynamic Island + Status iOS */}
                  <div className={`px-4 pt-3 pb-2 ${currentTheme.headerBg} transition-colors duration-300`}>
                    
                    {/* Status Bar (Hora + Dynamic Island + Bateria) */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
                      <span className="w-10 pl-1">03:42</span>

                      {/* DYNAMIC ISLAND */}
                      <div className="w-24 sm:w-28 h-5 sm:h-5.5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-md">
                        {/* Lente da Câmera com reflexo sutil */}
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-blue-950" />
                        </div>
                        {/* Sensor */}
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      </div>

                      <div className="flex items-center gap-1.5 w-10 justify-end pr-1 text-slate-300">
                        <Wifi className="w-3 h-3" />
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>

                    {/* Barra de Progresso Real do Leitor */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleToggleBookmark}
                          className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-gold font-bold uppercase hover:opacity-80 transition-opacity cursor-pointer"
                          title="Clique para testar o marcador inteligente"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-gold text-gold" : "text-gold"}`} />
                          <span>14% LIDO // PÁG. 18</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold/15 hover:bg-gold/25 border border-gold/30 text-[10px] font-mono text-gold transition-colors cursor-pointer"
                        title="Abrir leitor em tela cheia"
                      >
                        <Maximize2 className="w-2.5 h-2.5" />
                        <span>EXPANDIR</span>
                      </button>
                    </div>

                    {/* Linha Fina da Barra de Progresso Dourada */}
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold to-amber-300 w-[14%]" />
                    </div>

                    {/* ======================================================== */}
                    {/* CONTROLES REAIS DO E-READER (NADA DE IMAGEM ESTÁTICA)   */}
                    {/* ======================================================== */}
                    <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 mt-2">
                      
                      {/* Seletor de Tema (3 Botões Grandes e Táteis) */}
                      <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-xl border border-white/10 relative">
                        {/* Indicador animado inicial de toque para o visitante não passar batido */}
                        {!hasInteracted && (
                          <div className="absolute -top-7 left-3 flex items-center gap-1 text-[10px] font-sans font-black text-gold bg-slate-950 px-2 py-0.5 rounded-full border border-gold/60 shadow-lg animate-bounce pointer-events-none whitespace-nowrap z-30">
                            <Pointer className="w-3 h-3 text-gold" />
                            <span>Toque para testar</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleThemeChange("dark")}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            theme === "dark" 
                              ? "bg-slate-800 text-gold shadow-md border border-gold/50" 
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
                              ? "bg-[#e2d4b5] text-[#3d2b15] shadow-md border border-[#9b7941]" 
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
                              ? "bg-white text-slate-900 shadow-md border border-slate-300" 
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Sun className="w-3 h-3 text-amber-500" />
                          <span>Claro</span>
                        </button>
                      </div>

                      {/* Ajuste de Fonte (A- / 15px / A+) */}
                      <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={handleDecreaseFont}
                          className="w-7 h-7 rounded-lg text-xs font-black text-slate-200 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center active:scale-95"
                          title="Diminuir tamanho da fonte"
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
                          title="Aumentar tamanho da fonte"
                        >
                          A+
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* ÁREA DE LEITURA REAL DA OBRA (COM PARÁGRAFOS ESPAÇADOS E TRECHO GRIFADO) */}
                  <div className="p-5 sm:p-6 space-y-4 min-h-[340px] flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className={`text-[11px] font-mono tracking-widest uppercase font-semibold ${currentTheme.meta}`}>
                        SÃO PAULO — FARIA LIMA // 03h42
                      </p>

                      <h4 className={`font-sans font-bold text-lg leading-snug ${currentTheme.textColor}`}>
                        O Teste Proibido
                      </h4>

                      <p 
                        className={`leading-relaxed ${currentTheme.textColor} transition-all duration-200 font-serif`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        O prédio estava quase vazio. No décimo sexto andar, apenas algumas luzes permaneciam acesas, e o ruído constante da ventilação preenchia o silêncio da sala de auditoria.
                      </p>

                      <p 
                        className={`leading-relaxed ${currentTheme.textColor} transition-all duration-200 font-serif`}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        Caio Avelar estava sentado diante de dois monitores, revisando um lote de operações bancárias que não deveriam conter nada além de rotina contábil...
                      </p>

                      {/* Frase Grifada Interativa (Toque para testar) */}
                      <div className="pt-1.5 cursor-pointer" onClick={handleToggleHighlight}>
                        <span 
                          className={`leading-relaxed text-sm block transition-all font-serif ${
                            isHighlighted ? currentTheme.highlight : `${currentTheme.textColor} opacity-90`
                          }`}
                        >
                          "E foi no silêncio da sala de operações da Faria Lima que Caio percebeu que uma pergunta podia ser mais perigosa do que uma resposta."
                        </span>
                        <span className={`block text-[10px] font-mono mt-1 ${currentTheme.subColor}`}>
                          👆 Toque no trecho acima para testar o marcador dourado
                        </span>
                      </div>
                    </div>

                    {/* Rodapé da Tela do Celular */}
                    <div className={`pt-3 border-t ${theme === 'dark' ? 'border-white/10' : theme === 'sepia' ? 'border-[#cfbfa0]' : 'border-slate-200'} flex items-center justify-between text-[10px] font-mono ${currentTheme.subColor}`}>
                      <span>Capítulo 01 // ~12 min</span>
                      <span className="flex items-center gap-1 text-gold font-bold">
                        <Sparkles className="w-3 h-3" /> Modo Imersivo
                      </span>
                    </div>

                  </div>

                  {/* Barra Home Inferior do iPhone */}
                  <div className="pb-2 pt-1 flex justify-center">
                    <div className="w-28 sm:w-32 h-1 bg-slate-400/40 rounded-full" />
                  </div>

                </div>

              </div>

            </motion.div>

            {/* 3 Diferenciais Claros Logo Abaixo do Mockup */}
            <div className="w-full max-w-md grid grid-cols-3 gap-2 text-center mt-5">
              <div className="p-2.5 rounded-xl bg-card/40 border border-white/5">
                <Moon className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="block text-[10px] sm:text-xs font-bold text-white">Zero Cansaço</span>
                <span className="text-[9px] text-slate-400">Modo noturno</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card/40 border border-white/5">
                <Smartphone className="w-4 h-4 text-cyan mx-auto mb-1" />
                <span className="block text-[10px] sm:text-xs font-bold text-white">App PWA</span>
                <span className="text-[9px] text-slate-400">Sem baixar nada</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card/40 border border-white/5">
                <Bookmark className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="block text-[10px] sm:text-xs font-bold text-white">Nuvem Real</span>
                <span className="text-[9px] text-slate-400">Salva onde parou</span>
              </div>
            </div>

          </div>

          {/* Tela Lateral Direita (Desktop): A Corrente de Leitores */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-[#090f1e] border border-cyan/30 shadow-xl relative overflow-hidden group hover:border-cyan/60 transition-all">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan mb-3">
                <Users className="w-4 h-4 text-cyan" />
                <span>REDE FECHADA // LIVRO II</span>
              </div>
              <h4 className="font-sans font-bold text-sm text-white mb-1.5">
                A Corrente de Leitores
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light mb-3">
                Seu link pessoal de indicação fica salvo no painel do e-reader. Cada leitor trazido destrava vantagens exclusivas para o próximo volume.
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[10px] text-cyan flex items-center justify-between">
                <span>PASSE PRIORITÁRIO</span>
                <span className="text-emerald-400 font-bold">ATIVADO</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1325]/80 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Instalação instantânea como PWA no Android e iPhone.</span>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL EM TELA CHEIA PARA CELULAR / INSTAGRAM ADS         */}
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
            {/* Topo do Modal: Fechar + Título + CTA Rápido */}
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
                  PRÉVIA DO E-READER
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Capítulo 01 // 14% Concluído
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

            {/* Barra de Ferramentas Fixa no Modal */}
            <div className="p-3 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Temas */}
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

              {/* Tamanho da Fonte */}
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

            {/* Conteúdo de Leitura Scrollável em Tela Cheia */}
            <div className={`flex-1 overflow-y-auto p-6 sm:p-10 ${currentTheme.cardBg} transition-colors duration-300`}>
              <div className="max-w-2xl mx-auto space-y-6">
                
                <div className="space-y-1">
                  <p className={`text-xs font-mono tracking-widest uppercase font-semibold ${currentTheme.meta}`}>
                    PRÓLOGO // FARIA LIMA, SÃO PAULO — 03h42
                  </p>
                  <h2 className={`font-sans font-bold text-2xl sm:text-3xl ${currentTheme.textColor}`}>
                    O Teste Proibido
                  </h2>
                </div>

                <div 
                  className={`space-y-5 leading-relaxed font-serif ${currentTheme.textColor}`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p>
                    O prédio estava quase vazio. No décimo sexto andar, apenas algumas luzes permaneciam acesas, e o ruído constante da ventilação preenchia o silêncio da sala de auditoria.
                  </p>

                  <p>
                    Caio Avelar estava sentado diante de dois monitores, revisando um lote de operações bancárias que não deveriam conter nada além de rotina contábil. Mas quando cruzou as séries temporais com registros históricos restritos, uma correlação gráfica impossível se formou.
                  </p>

                  {/* Frase Grifada no Modal */}
                  <div className="p-4 rounded-xl border border-gold/40 bg-gold/15 my-4">
                    <p className={`font-semibold ${currentTheme.textColor}`}>
                      "Não eram coincidências estatísticas. Eram as mesmas assinaturas comportamentais de líderes que derrubaram impérios há três mil anos sendo replicadas com precisão milimétrica nos gabinetes de hoje."
                    </p>
                  </div>

                  <p>
                    Ele recostou-se na cadeira de couro preto. As mãos começavam a suar frio. Havia dez decisões registradas na História que nunca foram compreendidas pelos livros didáticos tradicionais. E todas elas convergiam para o mesmo ponto cego.
                  </p>

                  <p>
                    Foi nesse momento que o telefone sobre a mesa vibrou uma única vez. Uma mensagem de número criptografado: <em className="font-semibold">"Você não deveria ter cruzado os vetores."</em>
                  </p>
                </div>

                <div className="pt-8 pb-4 text-center">
                  <span className={`text-xs font-mono ${currentTheme.subColor}`}>
                    ★ Fim da demonstração do leitor nativo
                  </span>
                </div>

              </div>
            </div>

            {/* Rodapé Fixo do Modal com Ação de Compra */}
            <div className="p-4 bg-[#0a1020] border-t border-white/10 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
              <div className="text-center sm:text-left">
                <span className="text-white font-bold text-sm block">
                  Gostou da experiência de leitura fluida?
                </span>
                <span className="text-slate-400 text-xs">
                  Desbloqueie os 22 capítulos completos + Dossiês por apenas R$ 29,90.
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
                <span>Desbloquear Obra Completa</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
