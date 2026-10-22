import { motion } from "framer-motion";
import { FileText, MapPin, Eye, Lock, Crosshair } from "lucide-react";

export const SpecialVisualArchiveSection = () => {
  const timelineMilestones = [
    { year: "970 a.C.", location: "Jerusalém", title: "O Arquivo Fundacional", desc: "A primeira codificação de governança e controle dinástico sob o reinado de Salomão." },
    { year: "326 a.C.", location: "Rio Hífasis, Índia", title: "A Recusa do Exército", desc: "Alexandre o Grande para suas tropas após 8 anos de marcha ininterrupta." },
    { year: "49 a.C.", location: "Rio Rubicão, Gália", title: "A Sorte Está Lançada", desc: "Júlio César ultrapassa a fronteira proibida e desafia o Senado romano." },
    { year: "1815", location: "Waterloo, Bélgica", title: "A Névoa e o Erro", desc: "Napoleão hesita no avanço matinal e o mapa da Europa é redesenhado em 8 horas." },
    { year: "1941", location: "Bletchley Park, UK", title: "A Quebra do Código Enigma", desc: "Alan Turing concebe os fundamentos algorítmicos para antecipar movimentos inimigos." },
    { year: "2026", location: "São Paulo // Londres", title: "O Colapso do Mercúrio", desc: "O sistema financeiro moderno executa as mesmas regras em microssegundos." }
  ];

  return (
    <section className="relative py-28 px-6 overflow-visible">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.25em] text-cyan uppercase bg-cyan/10 px-3.5 py-1 rounded-full border border-cyan/25">
            ACERVO DOCUMENTAL // 3.000 ANOS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Mais do que ficção: uma investigação rica em arquivos e mapas.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Cada capítulo da obra é sustentado por fatos documentados, relatórios de época e análises estratégicas. Você não apenas lê uma história: você investiga um acervo confidencial.
          </p>
        </div>

        {/* Linha do Tempo Estilizada */}
        <div className="relative border-l-2 border-gold/30 ml-4 sm:ml-8 md:ml-12 space-y-10 pl-6 sm:pl-10">
          {timelineMilestones.map((item, idx) => (
            <motion.div
              key={item.year}
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              {/* Ponto na timeline */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#070b14] border-2 border-gold group-hover:scale-125 group-hover:bg-gold transition-all shadow-[0_0_15px_rgba(201,169,98,0.5)]" />

              <div className="p-5 sm:p-6 rounded-2xl bg-[#0b1222] border border-white/5 hover:border-gold/30 transition-all space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-mono font-bold text-gold uppercase tracking-wider">
                    {item.year}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan/90 bg-cyan/10 px-2.5 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </span>
                </div>
                <h4 className="font-display font-bold text-base sm:text-lg text-white">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cards de Prévia dos Relatórios Desclassificados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-black/40 border border-red-500/30 relative overflow-hidden space-y-3">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-red-400 border border-red-500/40 px-2 py-0.5 rounded tracking-widest uppercase">
              CONFIDENCIAL // NÍVEL 4
            </div>
            <FileText className="w-8 h-8 text-red-400/80 mb-2" />
            <h4 className="font-display font-bold text-base text-white">Dossiê Bletchley 1941</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Transcrição de gabinetes britânicos e a primeira modelagem de probabilidades sobre comportamento humano de massa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-gold/30 relative overflow-hidden space-y-3">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-gold border border-gold/40 px-2 py-0.5 rounded tracking-widest uppercase">
              DESCLASSIFICADO
            </div>
            <Crosshair className="w-8 h-8 text-gold/80 mb-2" />
            <h4 className="font-display font-bold text-base text-white">Cartografia do Rubicão</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Esquemas táticos das legiões de César e o cálculo milimétrico do ponto sem retorno político que moldou Roma.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-cyan/30 relative overflow-hidden space-y-3">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-cyan border border-cyan/40 px-2 py-0.5 rounded tracking-widest uppercase">
              REGISTRO 2026
            </div>
            <Eye className="w-8 h-8 text-cyan/80 mb-2" />
            <h4 className="font-display font-bold text-base text-white">Log do Banco Mercúrio</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Registros eletrônicos de transações na Faria Lima minutos antes de uma das maiores transferências secretas da década.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
