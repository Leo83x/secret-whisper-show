import { useState } from "react";
import { motion } from "framer-motion";
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
  Pointer
} from "lucide-react";

export const SpecialReaderShowcaseSection = () => {
  const [theme, setTheme] = useState<"dark" | "sepia" | "light">("dark");
  const [fontSize, setFontSize] = useState<number>(15);

  const themeStyles = {
    dark: {
      cardBg: "bg-[#080d1a]",
      textColor: "text-[#e2e8f0]",
      subColor: "text-slate-400",
      borderColor: "border-gold/30",
      headerBg: "bg-[#0d1527] border-b border-white/10",
      highlight: "bg-[#c9a962]/20 text-[#f6d88e] px-1 py-0.5 rounded border-b border-gold/40",
      meta: "text-sky-400"
    },
    sepia: {
      cardBg: "bg-[#f5ecda]",
      textColor: "text-[#2e2417]",
      subColor: "text-[#6b583e]",
      borderColor: "border-[#d4c3a3]",
      headerBg: "bg-[#e8dcbf] border-b border-[#cfbfa0]",
      highlight: "bg-[#d8a342]/25 text-[#221708] px-1 py-0.5 rounded border-b border-[#b58327]",
      meta: "text-[#8a5d1b]"
    },
    light: {
      cardBg: "bg-[#ffffff]",
      textColor: "text-[#0f172a]",
      subColor: "text-[#64748b]",
      borderColor: "border-slate-300",
      headerBg: "bg-[#f1f5f9] border-b border-slate-200",
      highlight: "bg-amber-200 text-[#78350f] px-1 py-0.5 rounded border-b border-amber-400",
      meta: "text-sky-600"
    }
  };

  const currentTheme = themeStyles[theme];

  const handleDecreaseFont = () => {
    setFontSize((prev) => Math.max(13, prev - 1));
  };

  const handleIncreaseFont = () => {
    setFontSize((prev) => Math.min(19, prev + 1));
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-visible bg-[#050811]/70 border-y border-white/5">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/25 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            TECNOLOGIA EXCLUSIVA // NADA DE PDF COMUM
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            Uma plataforma desenhada para prender a sua atenção.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Esqueça arquivos soltos de PDF que quebram no celular. Você acessa um leitor digital nativo, construído com foco obsessivo em tipografia, contraste e imersão total.
          </p>
        </div>

        {/* Grade: Widget Interativo Central + Telas de Apoio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Tela Lateral Esquerda (Desktop): Prévia do Dossiê 01 */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-[#090f1e] border border-gold/25 shadow-xl relative overflow-hidden group hover:border-gold/50 transition-all">
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
                <span className="text-emerald-400">DESCLASSIFICADO</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1325]/60 border border-white/5 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Sincronização na nuvem com progresso gravado por linha.</span>
            </div>
          </div>

          {/* Widget Interativo Central (O Celular com controles reais) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* CHAMADA DE TESTE EM DESTAQUE (BEM VISÍVEL EM CIMA DO MOCKUP) */}
            <motion.div 
              className="w-full max-w-md mx-auto mb-5 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-gold/30 to-amber-500/20 border-2 border-gold/70 shadow-[0_0_30px_rgba(201,169,98,0.4)] space-y-1.5">
                <div className="flex items-center justify-center gap-2 text-gold font-bold text-sm sm:text-base tracking-wide uppercase">
                  <Pointer className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>TESTE O LEITOR AQUI EM TEMPO REAL:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 font-medium leading-snug">
                  Toque nos botões <strong className="text-gold underline">[Escuro]</strong>, <strong className="text-amber-200 underline">[Sépia]</strong> ou <strong className="text-white underline">[Claro]</strong> e <strong className="text-gold">[A-]</strong> <strong className="text-gold">[A+]</strong> para ver a tela do celular mudar na hora!
                </p>
              </div>
            </motion.div>

            {/* Smartphone Mockup */}
            <motion.div 
              className="w-full max-w-md rounded-[34px] p-3 sm:p-3.5 bg-gradient-to-b from-slate-700 via-slate-900 to-black border border-gold/40 shadow-[0_0_60px_rgba(0,0,0,0.9)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Carcaça Interna */}
              <div className={`rounded-[26px] overflow-hidden ${currentTheme.cardBg} border ${currentTheme.borderColor} transition-colors duration-300 flex flex-col shadow-inner`}>
                
                {/* Barra do Celular (Notch e Controles do E-Reader - 100% responsivos) */}
                <div className={`px-3.5 sm:px-4 py-3.5 ${currentTheme.headerBg} transition-colors duration-300 space-y-2.5`}>
                  
                  {/* Top: Notch + Progresso */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-gold font-bold uppercase flex items-center gap-1.5">
                      <Bookmark className="w-3 h-3 text-gold" />
                      14% LIDO // PÁG. 18
                    </span>
                    <div className="w-12 sm:w-14 h-2.5 bg-slate-800 rounded-full opacity-60" />
                    <span className={`text-[10px] font-mono ${currentTheme.subColor}`}>
                      Farol de Leitura
                    </span>
                  </div>

                  {/* Barra de Progresso Real */}
                  <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
                    <div className="w-[14%] h-full bg-gold rounded-full" />
                  </div>

                  {/* Controles Reais: Temas e Tipografia (Ajustados para caber perfeitamente no Mobile) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                    
                    {/* Botões de Tema */}
                    <div className="grid grid-cols-3 gap-1 w-full sm:w-auto bg-black/40 p-1 rounded-xl border border-white/10 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          theme === "dark" 
                            ? "bg-gold text-slate-950 font-black shadow-md" 
                            : "text-slate-300 hover:text-white"
                        }`}
                        title="Modo Noturno sem reflexos"
                      >
                        <Moon className="w-3 h-3 shrink-0" />
                        <span>Escuro</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme("sepia")}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          theme === "sepia" 
                            ? "bg-[#d4be92] text-slate-950 font-black shadow-md" 
                            : "text-slate-300 hover:text-white"
                        }`}
                        title="Modo Sépia de papel envelhecido"
                      >
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span>Sépia</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          theme === "light" 
                            ? "bg-white text-slate-950 font-black shadow-md" 
                            : "text-slate-300 hover:text-white"
                        }`}
                        title="Modo Claro clássico"
                      >
                        <Sun className="w-3 h-3 shrink-0" />
                        <span>Claro</span>
                      </button>
                    </div>

                    {/* Botões de Fonte (Agora com espaço amplo no mobile) */}
                    <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-black/40 py-1 px-3 rounded-xl border border-white/10 shadow-inner">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-0.5">Fonte:</span>
                      <button
                        type="button"
                        onClick={handleDecreaseFont}
                        className="w-7 h-7 rounded-lg text-xs font-black text-slate-200 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center"
                        title="Diminuir tamanho da fonte"
                      >
                        A-
                      </button>
                      <span className="text-xs font-mono text-gold font-bold px-1 min-w-[28px] text-center">{fontSize}px</span>
                      <button
                        type="button"
                        onClick={handleIncreaseFont}
                        className="w-7 h-7 rounded-lg text-xs font-black text-slate-200 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center"
                        title="Aumentar tamanho da fonte"
                      >
                        A+
                      </button>
                    </div>

                  </div>

                </div>

                {/* Área de Leitura Real (Texto Real do Livro) */}
                <div className="p-5 sm:p-6 space-y-4 select-none min-h-[320px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className={`text-[11px] font-mono tracking-widest uppercase ${currentTheme.meta}`}>
                      SÃO PAULO — FARIA LIMA // 03h42
                    </p>

                    <h3 className={`font-sans font-bold text-lg leading-snug ${currentTheme.textColor}`}>
                      O Teste Proibido
                    </h3>

                    <p 
                      className={`leading-relaxed ${currentTheme.textColor} transition-all duration-200`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      O prédio estava quase vazio. No décimo sexto andar, apenas algumas luzes permaneciam acesas, e o ruído constante da ventilação preenchia o silêncio da sala de auditoria.
                    </p>

                    <p 
                      className={`leading-relaxed ${currentTheme.textColor} transition-all duration-200`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      Caio Avelar estava sentado diante de dois monitores, revisando um lote de operações bancárias...
                    </p>

                    {/* Frase Grifada em Destaque */}
                    <div className="pt-1">
                      <span className={`leading-relaxed text-sm block ${currentTheme.highlight}`}>
                        "E foi no silêncio da sala de operações da Faria Lima que Caio percebeu que uma pergunta podia ser mais perigosa do que uma resposta."
                      </span>
                    </div>
                  </div>

                  {/* Rodapé da Tela do Celular */}
                  <div className={`pt-3 border-t ${theme === 'dark' ? 'border-white/10' : theme === 'sepia' ? 'border-[#cfbfa0]' : 'border-slate-200'} flex items-center justify-between text-[10px] font-mono ${currentTheme.subColor}`}>
                    <span>Capítulo 01</span>
                    <span>Modo Imersivo Ativo</span>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>

          {/* Tela Lateral Direita (Desktop): A Corrente de Leitores */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-[#090f1e] border border-cyan/25 shadow-xl relative overflow-hidden group hover:border-cyan/50 transition-all">
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
                <span className="text-emerald-400">ATIVADO</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1325]/60 border border-white/5 text-xs text-slate-400 flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Instalação instantânea como PWA no Android e iPhone.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
