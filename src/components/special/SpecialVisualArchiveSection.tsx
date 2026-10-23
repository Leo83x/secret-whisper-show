import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Sparkles, BookOpen } from "lucide-react";

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
      className="text-xs font-mono font-bold text-gold uppercase tracking-wider inline-block"
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
      title: "O Arquivo Fundacional // Salomão", 
      desc: "A primeira codificação de governança e controle dinástico sob as ordens do templo.",
      image: "/reader/assets/chapters/ch21_salomao.jpg"
    },
    { 
      year: "326 A.C.", 
      location: "Rio Hífasis, Índia", 
      title: "A Recusa do Exército // Alexandre", 
      desc: "O instante em que a maior expansão militar da Antiguidade encontrou seu limite psicológico.",
      image: "/reader/assets/chapters/ch07_alexandre.jpg"
    },
    { 
      year: "49 A.C.", 
      location: "Rio Rubicão, Gália", 
      title: "A Sorte Está Lançada // Júlio César", 
      desc: "A travessia proibida da fronteira que desafiou o Senado romano e redefiniu o poder imperial.",
      image: "/reader/assets/chapters/ch02_julio_cesar.jpg"
    },
    { 
      year: "1815", 
      location: "Waterloo, Bélgica", 
      title: "A Névoa e o Erro // Napoleão", 
      desc: "A hesitação matinal de 3 horas que colapsou a cavalaria francesa e reescreveu a Europa.",
      image: "/reader/assets/chapters/ch11_napoleao.jpg"
    },
    { 
      year: "1941", 
      location: "Bletchley Park, UK", 
      title: "A Máquina e a Mente // Alan Turing", 
      desc: "Os fundamentos da computação moderna concebidos para antecipar as decisões humanas de guerra.",
      image: "/reader/assets/chapters/ch13_turing.jpg"
    },
    { 
      year: "2026", 
      location: "São Paulo // Faria Lima", 
      title: "A Convergência Final // Caio & Marina", 
      desc: "A auditoria que revela a mesma equação milenar sendo executada nos terminais do mercado.",
      image: "/reader/assets/chapters/ch04_marina.jpg"
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-visible">
      <div className="max-w-6xl mx-auto space-y-14">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.25em] text-cyan uppercase bg-cyan/10 px-3.5 py-1.5 rounded-full border border-cyan/25 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan" />
            ACERVO DOCUMENTAL // 3.000 ANOS DE PADRÃO
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Mais do que ficção: uma investigação rica em arquivos e passagens históricas.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Cada capítulo da obra é sustentado por fatos documentados, arte histórica e análises estratégicas. Conheça os marcos que compõem o universo do livro:
          </p>
        </div>

        {/* Galeria Visual de Cards Verticais (Valorizando as Imagens do Reader) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {timelineMilestones.map((item, idx) => (
            <motion.div
              key={item.year}
              className="group relative rounded-2xl bg-[#090f1e] border border-gold/30 hover:border-gold/70 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              {/* Imagem em Destaque no Topo do Card */}
              <div className="relative w-full h-56 sm:h-60 overflow-hidden bg-black/80">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 contrast-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090f1e] via-[#090f1e]/20 to-transparent" />
                
                {/* Badge da Data em Cima da Imagem */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold/40 shadow-lg flex items-center gap-1.5">
                  <DecryptingYear targetYear={item.year} />
                </div>

                {/* Badge de Localização */}
                <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-[#090f1e]/90 backdrop-blur-md border border-cyan/30 text-[11px] font-mono text-cyan flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Informações Textuais Claras Abaixo da Imagem */}
              <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-lg text-white group-hover:text-gold transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-gold" />
                    <span>Passagem Ilustrada no E-Reader</span>
                  </span>
                  <span className="text-gold font-bold">Capítulo Oficial</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
