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
  { name: "Salomão", image: salomao, era: "970 a.C.", role: "O Limite da Sabedoria" },
  { name: "Alexandre", image: alexandre, era: "326 a.C.", role: "A Fronteira do Mundo" },
  { name: "Júlio César", image: julioCesar, era: "49 a.C.", role: "A Travessia Irreversível" },
  { name: "Cleópatra", image: cleopatra, era: "30 a.C.", role: "O Jogo da Sobrevivência" },
  { name: "Joana d'Arc", image: joanaDarc, era: "1431", role: "A Certeza Absoluta" },
  { name: "Leonardo da Vinci", image: daVinci, era: "1500", role: "O Olhar Anatômico" },
  { name: "Napoleão", image: napoleao, era: "1815", role: "A Lama do Destino" },
  { name: "Alan Turing", image: turing, era: "1941", role: "A Máquina e a Mente" },
  { name: "Nelson Mandela", image: mandela, era: "1994", role: "A Paciência Estratégica" },
  { name: "Steve Jobs", image: jobs, era: "2007", role: "O Controle da Experiência" }
];

export const SpecialPlotManifestoSection = () => {
  return (
    <section className="relative py-20 sm:py-26 px-4 sm:px-6 overflow-visible">
      <div className="max-w-6xl mx-auto space-y-20 relative z-10">

        {/* PARTE A: NARRATIVA FLUIDA E MAGNÉTICA (SEM ASPECTO DE ESTUDO CORPORATIVO) */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono tracking-[0.25em] text-cyan uppercase bg-cyan/10 px-3.5 py-1.5 rounded-full border border-cyan/25 inline-block">
            O FIO INVISÍVEL // 3.000 ANOS DE HISTÓRIA
          </span>

          <h2 className="font-sans text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            E se a História não fosse tão imprevisível quanto parece?
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed text-left sm:text-center">
            <p>
              Depois que um império cai ou uma revolução vence, os livros oficiais transformam tudo em destino ou genialidade. Mas nos registros silenciosos de quem estava na retaguarda — o intendente contando o trigo de <strong className="text-white">Júlio César no Rubicão</strong>, o oficial anotando os despachos na lama de <strong className="text-white">Waterloo</strong>, o engenheiro atrás da cortina com <strong className="text-white">Steve Jobs</strong> — outra história aparece.
            </p>
            <p>
              Século após século, antes de cada grande ruptura, a mesma engrenagem invisível se fecha: <span className="text-slate-100 font-medium">a pressão acumulada nos bastidores, os relatos desencontrados que chegam tarde demais e o instante solitário em que todas as saídas encolhem até sobrar uma única direção sem volta.</span>
            </p>
          </div>

          <div className="p-5 sm:p-7 rounded-2xl bg-[#0f172a]/95 border border-gold/40 shadow-xl text-left sm:text-center">
            <p className="text-base sm:text-lg text-slate-100 font-sans font-medium leading-relaxed">
              "Não são os acontecimentos que se repetem. São os <strong className="text-gold font-bold">mecanismos humanos</strong> por trás deles: <span className="text-amber-200 font-semibold">Ambição, Medo, Vaidade, Convicção</span> e o eterno desejo de controle."
            </p>
          </div>
        </div>

        {/* PARTE B: OS 10 PROTAGONISTAS COM PRESENÇA VISUAL FORTE */}
        <div className="space-y-10">
          <div className="text-center space-y-2.5">
            <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              3 Mil Anos. 10 Decisões. Os Bastidores Reais Revelados na Obra.
            </h3>
            <p className="text-sm sm:text-base text-slate-400 font-normal max-w-2xl mx-auto">
              Cada capítulo mergulha na mente e nas circunstâncias ocultas de um líder no instante exato em que tudo estava em jogo:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 sm:gap-7">
            {characters.map((char, index) => (
              <motion.div
                key={char.name}
                className="group flex flex-col items-center text-center space-y-3 p-3.5 rounded-2xl bg-card/30 border border-white/5 hover:border-gold/40 hover:bg-card/60 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold transition-colors duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(201,169,98,0.25)]">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover object-top rounded-full bg-[#0b1120]"
                    loading="lazy"
                    width="96"
                    height="96"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-foreground group-hover:text-gold transition-colors">
                    {char.name}
                  </h4>
                  <span className="text-[11px] font-mono text-cyan block">{char.era}</span>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{char.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
