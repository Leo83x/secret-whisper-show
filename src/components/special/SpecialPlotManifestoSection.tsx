import { motion } from "framer-motion";

import salomao from "@/assets/characters/salomao.png";
import alexandre from "@/assets/characters/alexandre.png";
import cleopatra from "@/assets/characters/cleopatra.png";
import joanaDarc from "@/assets/characters/joana_darc.png";
import daVinci from "@/assets/characters/da_vinci.png";
import julioCesar from "@/assets/characters/julio_cesar.png";
import napoleao from "@/assets/characters/napoleao.png";
import turing from "@/assets/characters/turing.png";
import mandela from "@/assets/characters/mandela.png";
import jobs from "@/assets/characters/jobs.png";

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
    <section className="relative py-28 px-6 overflow-visible">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-24 relative z-10">

        {/* PARTE A: O MANIFESTO DA TRAMA */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-xs font-mono tracking-[0.25em] text-cyan uppercase bg-cyan/10 px-3.5 py-1 rounded-full border border-cyan/25">
            O MANIFESTO // FARIA LIMA, SÃO PAULO
          </span>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Em uma sala espelhada da Faria Lima, algo não fecha na conta da História.
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            <p>
              Caio era pago para enxergar riscos financeiros antes de todo mundo. Mas quando cruzou os registros de colapsos bancários recentes com documentos históricos restritos, encontrou uma simetria matemática assustadora.
            </p>
            <p>
              As mesmas oscilações comportamentais que derrubaram impérios na Antiguidade estavam sendo executadas, linha por linha, nos gabinetes e terminais financeiros do presente.
            </p>
          </div>

          <div className="pt-4 p-5 rounded-2xl bg-[#0f172a]/80 border border-gold/30 text-left sm:text-center">
            <p className="text-sm sm:text-base text-gold font-serif italic">
              "Não são os acontecimentos que se repetem. São os mecanismos humanos por trás deles: Ambição, Medo, Vaidade, Convicção e o eterno desejo de controle."
            </p>
          </div>
        </div>

        {/* PARTE B: GALERIA DOS 10 PROTAGONISTAS ATRAVÉS DAS ERAS */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              3 Mil Anos. 10 Decisões. Uma Única Equação.
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground font-light max-w-2xl mx-auto">
              Cada capítulo histórico desmonta o instante exato em que a mente de um líder foi testada até o limite:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
            {characters.map((char, index) => (
              <motion.div
                key={char.name}
                className="group flex flex-col items-center text-center space-y-3 p-3 rounded-2xl bg-card/30 border border-white/5 hover:border-gold/40 hover:bg-card/60 transition-all duration-300"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gold/25 group-hover:border-gold transition-colors duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(201,169,98,0.25)]">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover object-top rounded-full bg-[#0b1120]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-foreground group-hover:text-gold transition-colors">
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
