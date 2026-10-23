import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, MapPin, Eye, Crosshair, Sparkles } from "lucide-react";

const DecryptingYear = ({ targetYear }: { targetYear: string }) => {
  const [displayText, setDisplayText] = useState(targetYear);
  const [hasAnimated, setHasAnimated] = useState(false);

  const startScramble = () => {
    if (hasAnimated) return;
    setHasAnimated(true);
    const chars = "0123456789ABCDEF$#@%";
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetYear
          .split("")
          .map((char, index) => {
            if (char === " " || char === "." || index < iterations) {
              return targetYear[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iterations += 1;
      if (iterations > targetYear.length + 3) {
        clearInterval(interval);
        setDisplayText(targetYear);
      }
    }, 45);
  };

  return (
    <motion.span
      onViewportEnter={startScramble}
      viewport={{ once: true, amount: 0.6 }}
      className="text-xs sm:text-sm font-mono font-bold text-gold uppercase tracking-wider inline-block drop-shadow-[0_0_8px_rgba(201,169,98,0.5)]"
    >
      {displayText}
    </motion.span>
  );
};

export const SpecialVisualArchiveSection = () => {
  const timelineMilestones = [
    { 
      year: "970 A.C.", 
      location: "Jerusalém", 
      title: "O Arquivo Fundacional", 
      desc: "A primeira codificação de governança e controle dinástico sob o reinado de Salomão.",
      bgImage: "/reader/assets/chapters/ch21_salomao.jpg"
    },
    { 
      year: "326 A.C.", 
      location: "Rio Hífasis, Índia", 
      title: "A Recusa do Exército", 
      desc: "Alexandre o Grande para suas tropas após 8 anos de marcha ininterrupta.",
      bgImage: "/reader/assets/chapters/ch07_alexandre.jpg"
    },
    { 
      year: "49 A.C.", 
      location: "Rio Rubicão, Gália", 
      title: "A Sorte Está Lançada", 
      desc: "Júlio César ultrapassa a fronteira proibida e desafia o Senado romano.",
      bgImage: "/reader/assets/chapters/ch02_julio_cesar.jpg"
    },
    { 
      year: "1815", 
      location: "Waterloo, Bélgica", 
      title: "A Névoa e o Erro", 
      desc: "Napoleão hesita no avanço matinal e o mapa da Europa é redesenhado em 8 horas.",
      bgImage: "/reader/assets/chapters/ch11_napoleao.jpg"
    },
    { 
      year: "1941", 
      location: "Bletchley Park, UK", 
      title: "A Quebra do Código Enigma", 
      desc: "Alan Turing concebe os fundamentos algorítmicos para antecipar movimentos inimigos.",
      bgImage: "/reader/assets/chapters/ch13_turing.jpg"
    },
    { 
      year: "2007", 
      location: "São Francisco // Califórnia", 
      title: "A Convergência de Silício", 
      desc: "Steve Jobs apresenta a interface capacitiva que unificou o comportamento de bilhões de usuários.",
      bgImage: "/reader/assets/chapters/ch03_steve_jobs.jpg"
    },
    { 
      year: "2026", 
      location: "São Paulo // Faria Lima", 
      title: "O Colapso do Mercúrio", 
      desc: "Caio e Marina descobrem o mesmo padrão repetido nos relatórios de liquidez da Strata Intelligence.",
      bgImage: "/reader/assets/chapters/ch04_marina.jpg"
    }
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-visible">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.25em] text-cyan uppercase bg-cyan/10 px-3.5 py-1.5 rounded-full border border-cyan/25 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan" />
            ACERVO DOCUMENTAL // 3.000 ANOS DE PADRÃO
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Mais do que ficção: uma investigação rica em arquivos e mapas.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Cada capítulo da obra é sustentado por fatos documentados, relatórios de época e análises estratégicas. Você não apenas lê uma história: você investiga um acervo confidencial.
          </p>
        </div>

        {/* Linha do Tempo com Fio de Ouro Iluminado */}
        <div className="relative border-l-2 border-gold/40 ml-4 sm:ml-8 md:ml-12 space-y-8 pl-6 sm:pl-10">
          
          {/* Efeito Fio de Ouro - Linha Brilhante com Gradiente */}
          <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gold to-emerald-400 shadow-[0_0_12px_rgba(201,169,98,0.7)] pointer-events-none" />

          {timelineMilestones.map((item, idx) => (
            <motion.div
              key={item.year}
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              {/* Ponto Dourado Pulsante na Linha do Tempo */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-4 w-4 h-4 rounded-full bg-[#070b14] border-2 border-gold group-hover:scale-135 group-hover:bg-gold transition-all duration-300 shadow-[0_0_15px_rgba(201,169,98,0.8)]" />

              {/* Card com Imagem Histórica como Watermark */}
              <div className="relative p-5 sm:p-6 rounded-2xl bg-[#090f1e]/90 border border-gold/20 hover:border-gold/50 transition-all duration-300 space-y-2 overflow-hidden shadow-xl">
                
                {/* Watermark de Fundo (20% Opacidade) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
                  style={{ backgroundImage: `url(${item.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090f1e] via-[#090f1e]/90 to-transparent pointer-events-none" />

                {/* Conteúdo do Card */}
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <DecryptingYear targetYear={item.year} />
                    
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan/95 bg-cyan/15 border border-cyan/30 px-2.5 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3 text-cyan" /> {item.location}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-gold transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-2xl">
                    {item.desc}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Cards de Prévia dos Relatórios Desclassificados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="p-6 rounded-2xl bg-black/50 border border-red-500/30 relative overflow-hidden space-y-3 group hover:border-red-500/60 transition-colors">
            <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-red-400 border border-red-500/40 px-2 py-0.5 rounded tracking-widest uppercase">
              CONFIDENCIAL // NÍVEL 4
            </div>
            <FileText className="w-8 h-8 text-red-400 mb-1" />
            <h4 className="font-display font-bold text-base text-white">Dossiê Bletchley 1941</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Transcrição de gabinetes britânicos e a primeira modelagem de probabilidades sobre comportamento humano de massa concebida por Turing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/50 border border-gold/30 relative overflow-hidden space-y-3 group hover:border-gold/60 transition-colors">
            <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-gold border border-gold/40 px-2 py-0.5 rounded tracking-widest uppercase">
              DESCLASSIFICADO
            </div>
            <Crosshair className="w-8 h-8 text-gold mb-1" />
            <h4 className="font-display font-bold text-base text-white">Cartografia do Rubicão</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Esquemas táticos das legiões de César e o cálculo milimétrico do ponto sem retorno político que moldou a transição de Roma.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/50 border border-cyan/30 relative overflow-hidden space-y-3 group hover:border-cyan/60 transition-colors">
            <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-cyan border border-cyan/40 px-2 py-0.5 rounded tracking-widest uppercase">
              REGISTRO FARIA LIMA
            </div>
            <Eye className="w-8 h-8 text-cyan mb-1" />
            <h4 className="font-display font-bold text-base text-white">Log do Banco Mercúrio</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Registros eletrônicos de operações na Faria Lima minutos antes de uma das maiores transferências secretas de liquidez da década.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
