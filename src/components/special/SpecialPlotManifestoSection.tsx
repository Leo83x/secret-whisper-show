import { motion } from "framer-motion";

import salomao from "@/assets/characters/salomao.webp";
import alexandre from "@/assets/characters/alexandre.webp";
import cleopatra from "@/assets/characters/cleopatra.webp";
import joanaDarc from "@/assets/characters/joana_darc.webp";
import daVinci from "@/assets/characters/da_vinci.webp";
import julioCesar from "@/assets/characters/julio_cesar.webp";
import napoleao from "@/assets/characters/napoleao.webp";
import turing from "@/assets/characters/turing.webp";
import mandela from "@/assets/characters/mandela.webp";
import jobs from "@/assets/characters/jobs.webp";

const characters = [
  { name: "Salomão", image: salomao, era: "970 a.C.", role: "Sabedoria" },
  { name: "Alexandre", image: alexandre, era: "326 a.C.", role: "Expansão" },
  { name: "Júlio César", image: julioCesar, era: "49 a.C.", role: "Ruptura" },
  { name: "Cleópatra", image: cleopatra, era: "30 a.C.", role: "Sobrevivência" },
  { name: "Joana d'Arc", image: joanaDarc, era: "1431", role: "Convicção" },
  { name: "Da Vinci", image: daVinci, era: "1500", role: "Visão" },
  { name: "Napoleão", image: napoleao, era: "1815", role: "Hesitação" },
  { name: "Alan Turing", image: turing, era: "1941", role: "Decodificação" },
  { name: "Mandela", image: mandela, era: "1994", role: "Paciência" },
  { name: "Steve Jobs", image: jobs, era: "2007", role: "Controle" }
];

export const SpecialPlotManifestoSection = () => {
  return (
    <section className="relative py-16 sm:py-22 px-4 sm:px-6 overflow-visible">
      <div className="max-w-5xl mx-auto space-y-14 relative z-10">

        {/* PARTE A: O MANIFESTO DA TRAMA DIRETO E ENVOLVENTE */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <span className="text-xs font-mono tracking-[0.25em] text-cyan uppercase bg-cyan/10 px-3.5 py-1.5 rounded-full border border-cyan/25 inline-block">
            A PREMISSA // SÃO PAULO, 2026
          </span>

          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            Em uma sala espelhada da Faria Lima, algo não fecha na conta da História.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Caio Avelar era pago para enxergar riscos financeiros antes de todo mundo. Mas quando cruzou relatórios de liquidez recente com arquivos históricos restritos, encontrou uma simetria perturbadora: os sinais de uma crise contemporânea seguiam o exato roteiro de momentos decisivos do passado.
          </p>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f172a]/95 border border-gold/40 shadow-xl text-left sm:text-center">
            <p className="text-base sm:text-lg text-slate-100 font-sans font-medium leading-relaxed">
              "Não são os acontecimentos que se repetem. São os <strong className="text-gold font-bold">mecanismos humanos</strong> por trás deles: <span className="text-amber-200 font-semibold">Ambição, Medo, Vaidade, Convicção</span> e o eterno desejo de controle."
            </p>
          </div>
        </div>

        {/* PARTE B: OS 10 PROTAGONISTAS EM GRADE COMPACTA (SEM FADIGA DE SCROLL) */}
        <div className="space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-tight">
              3 Mil Anos. 10 Decisões. Um Mesmo Padrão Oculto.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-xl mx-auto">
              Cada capítulo mergulha na mente de um líder histórico no instante exato em que tudo estava em jogo:
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2.5 sm:gap-5">
            {characters.map((char) => (
              <div
                key={char.name}
                className="group flex flex-col items-center text-center space-y-1.5 p-2 sm:p-3 rounded-xl bg-card/30 border border-white/5 hover:border-gold/40 transition-all duration-300"
              >
                <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gold/30 group-hover:border-gold transition-colors shadow-md">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover object-top rounded-full bg-[#0b1120]"
                    loading="lazy"
                    width="80"
                    height="80"
                  />
                </div>

                <div>
                  <h4 className="font-sans font-bold text-[11px] sm:text-sm text-foreground leading-tight line-clamp-1">
                    {char.name}
                  </h4>
                  <span className="text-[9px] sm:text-[11px] font-mono text-cyan block">{char.era}</span>
                  <p className="hidden sm:block text-[11px] text-muted-foreground line-clamp-1">{char.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
