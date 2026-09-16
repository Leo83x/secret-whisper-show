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
  { name: "Salomão", image: salomao, era: "970 a.C." },
  { name: "Alexandre", image: alexandre, era: "356 a.C." },
  { name: "Júlio César", image: julioCesar, era: "100 a.C." },
  { name: "Cleópatra", image: cleopatra, era: "69 a.C." },
  { name: "Joana d'Arc", image: joanaDarc, era: "1412" },
  { name: "Leonardo da Vinci", image: daVinci, era: "1452" },
  { name: "Napoleão", image: napoleao, era: "1769" },
  { name: "Alan Turing", image: turing, era: "1912" },
  { name: "Nelson Mandela", image: mandela, era: "1918" },
  { name: "Steve Jobs", image: jobs, era: "1955" }
];

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

const CharacterCard = ({ name, image, era, index }: { name: string; image: string; era: string; index: number }) => (
  <motion.div
    className="group flex flex-col items-center space-y-3 cursor-pointer"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
  >
    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold transition-colors duration-500 shadow-lg group-hover:shadow-gold/20">
      <img src={image} alt={name} className="w-full h-full object-cover object-top rounded-full bg-[#0b1120]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="text-center">
      <p className="font-serif font-bold text-sm md:text-base text-foreground group-hover:text-gold transition-colors">
        {name}
      </p>
      <p className="text-xs text-muted-foreground font-sans">{era}</p>
    </div>
  </motion.div>
);

const SynopsisSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-visible touch-pan-y">
      <div className="max-w-4xl mx-auto space-y-28">

        {/* PARTE A: O PADRÃO OCULTO (REDUZIDO E DIRETO) */}
        <AnimatedSection className="text-center space-y-6">
          <div className="space-y-4 text-lg md:text-2xl text-muted-foreground font-light leading-relaxed">
            <p>Reis, imperadores e mentes brilhantes moldaram o destino de milhões.</p>
            <p>A História registrou suas vitórias e seus erros.</p>
          </div>
          <p className="text-xl md:text-3xl text-gold font-serif pt-4">
            Mas quase ninguém perguntou: o que realmente guiou suas escolhas?
          </p>
        </AnimatedSection>

        {/* PARTE B: OS MECANISMOS HUMANOS (CONDENSADO COM DESTAQUES EM CYAN) */}
        <AnimatedSection className="text-center space-y-8">
          <p className="text-xl md:text-2xl text-muted-foreground">
            Separadas por séculos, escolhas idênticas continuam se repetindo.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xl md:text-3xl font-display">
            {["Ambição.", "Medo.", "Poder.", "Vaidade.", "Convicção.", "Obediência.", "Ruptura.", "Desejo de controle."].map((word, i) => (
              <motion.span
                key={word}
                className="text-cyan glow-cyan"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <div className="text-center pt-4 space-y-2">
            <p className="text-lg md:text-2xl text-muted-foreground">
              Não são os eventos que se repetem —
            </p>
            <p className="text-2xl md:text-4xl font-display text-gold">
              são os mecanismos humanos por trás deles.
            </p>
          </div>
        </AnimatedSection>

        {/* PARTE C: GALERIA DE PERSONAGENS (INTATA) */}
        <AnimatedSection>
          <div className="space-y-12 text-center">
            <p className="text-lg md:text-xl text-muted-foreground font-light">
              Séculos separam estas decisões. Algo nelas se repete.
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
              {characters.map((char, i) => (
                <CharacterCard key={char.name} {...char} index={i} />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* PARTE D: MISTÉRIO E CONEXÃO COM O FUTURO (MISTERIOSO E DIRETO) */}
        <AnimatedSection className="bg-secondary/30 rounded-3xl p-8 md:p-14 border border-gold/10 relative overflow-visible">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center space-y-6">
            <p className="text-xl md:text-2xl text-muted-foreground">
              Pela primeira vez, temos a tecnologia para enxergar esses padrões em tempo real.
            </p>
            <p className="text-2xl md:text-4xl font-display text-gold">
              E se o passado puder ser mapeado... o futuro pode ser previsto?
            </p>
            <p className="text-lg md:text-xl text-cyan glow-cyan font-serif pt-2">
              E se puder ser previsto... quem está no controle?
            </p>
          </div>
        </AnimatedSection>

        {/* PARTE E: FRASE DE IMPACTO FINAL */}
        <AnimatedSection className="text-center py-12 space-y-8">
          <p className="text-xl md:text-2xl text-muted-foreground">
            O verdadeiro segredo nunca foi sobre eles.
          </p>

          <motion.p
            className="text-5xl md:text-7xl font-display text-gold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Foi sobre nós.
          </motion.p>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Sobre aquilo que fazemos quando acreditamos estar escolhendo livremente.
          </p>
        </AnimatedSection>

      </div>
    </section>
  );
};

export default SynopsisSection;
