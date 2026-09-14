import AnimatedSection from "./AnimatedSection";
import KineticText from "./KineticText";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  { name: "Steve Jobs", image: jobs, era: "1955" },
];

const CharacterCard = ({ name, image, era, index }: { name: string; image: string; era: string; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: 0.1 * index,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.div
        className="relative w-28 h-28 md:w-40 md:h-40 mb-4"
        whileHover={{ scale: 1.1, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gold/30 blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
        />

        {/* Image container */}
        <div className="relative w-full h-full rounded-full border-2 border-gold/50 overflow-hidden group-hover:border-gold transition-colors duration-300">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
        </div>
      </motion.div>

      <span className="text-gold text-sm md:text-base font-display tracking-wider text-center">
        {name}
      </span>
      <span className="text-muted-foreground/60 text-xs">
        {era}
      </span>
    </motion.div>
  );
};

const SynopsisSection = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto space-y-40">
        {/* A REVELAÇÃO */}
        <AnimatedSection className="text-center space-y-8">
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed">
            <KineticText variant="fade">
              Durante milênios, reis decidiram guerras.
            </KineticText>
          </p>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed">
            <KineticText variant="fade" delay={0.2}>
              Impérios nasceram e desapareceram.
            </KineticText>
          </p>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed">
            <KineticText variant="fade" delay={0.4}>
              Homens e mulheres mudaram o destino de milhões.
            </KineticText>
          </p>
        </AnimatedSection>

        <AnimatedSection className="text-center space-y-6">
          <p className="text-2xl md:text-4xl font-display text-foreground/90">
            A História registrou seus nomes.
          </p>
          <div className="space-y-3 text-lg md:text-2xl text-muted-foreground">
            <p>Registrou suas vitórias.</p>
            <p>Seus erros.</p>
            <p>Suas escolhas.</p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="text-center space-y-10">
          <p className="text-xl md:text-2xl text-muted-foreground italic">
            Mas quase ninguém perguntou:
          </p>
          <motion.p
            className="text-3xl md:text-5xl font-display text-gold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            o que havia por trás dessas decisões?
          </motion.p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Porque, quando colocamos acontecimentos separados por séculos lado a lado,
            algo começa a aparecer.
          </p>
          <motion.p
            className="text-4xl md:text-6xl font-display text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Padrões.
          </motion.p>
        </AnimatedSection>

        {/* O PADRÃO */}
        <AnimatedSection className="text-center space-y-10">
          <p className="text-2xl md:text-4xl font-display text-foreground/90 leading-relaxed">
            <KineticText variant="fade">
              A História muda. O ser humano, nem tanto.
            </KineticText>
          </p>
          <div className="space-y-3 text-lg md:text-2xl text-muted-foreground">
            <p>Civilizações diferentes.</p>
            <p>Séculos diferentes.</p>
            <p>Contextos completamente diferentes.</p>
          </div>
          <p className="text-xl md:text-2xl text-foreground/80">
            E, ainda assim, determinadas escolhas continuam se repetindo.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xl md:text-3xl font-display">
            {["Ambição.", "Medo.", "Poder.", "Vaidade.", "Convicção.", "Obediência.", "Ruptura.", "Desejo de controle."].map((word, i) => (
              <motion.span
                key={word}
                className="text-cyan glow-cyan"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="text-center mt-16 space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground">
              Não são os acontecimentos que se repetem.
            </p>
            <p className="text-2xl md:text-4xl font-display text-gold">
              São os mecanismos humanos por trás deles.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* O OBSERVADOR */}
        <AnimatedSection className="text-center space-y-10">
          <p className="text-2xl md:text-4xl font-display text-foreground/90">
            <KineticText variant="fade">
              Alguém percebeu isso muito antes de nós.
            </KineticText>
          </p>
          <div className="space-y-4 text-lg md:text-2xl text-muted-foreground">
            <p>Durante gerações, registros foram reunidos.</p>
            <p>Decisões foram comparadas.</p>
            <p>Comportamentos foram catalogados.</p>
            <p>Conexões foram anotadas onde ninguém procurava por elas.</p>
          </div>
        </AnimatedSection>

        {/* Character grid */}
        <AnimatedSection>
          <div className="space-y-12 text-center">
            <p className="text-lg md:text-xl text-muted-foreground">
              Séculos separam estas decisões. Algo nelas se repete.
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
              {characters.map((char, i) => (
                <CharacterCard key={char.name} {...char} index={i} />
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="bg-secondary/30 rounded-3xl p-10 md:p-16 border border-gold/10 relative overflow-visible">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan/10 rounded-full blur-3xl" />

          <div className="relative text-center space-y-6">
            <p className="text-lg md:text-2xl text-muted-foreground">
              Não era uma coleção de histórias.
            </p>
            <p className="text-2xl md:text-4xl font-display text-gold">
              Era uma investigação.
            </p>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              E, quanto mais peças eram reunidas, mais inquietante se tornava a descoberta:
              talvez algumas das maiores decisões da humanidade nunca tenham sido tão
              imprevisíveis quanto imaginamos.
            </p>
          </div>
        </AnimatedSection>

        {/* A CONEXÃO COM O PRESENTE */}
        <AnimatedSection className="text-center space-y-10">
          <p className="text-2xl md:text-4xl font-display text-foreground/90">
            Então algo mudou.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Pela primeira vez, a humanidade possui ferramentas capazes de comparar milhões de
            informações, reconhecer padrões e encontrar relações que nenhum indivíduo
            conseguiria perceber sozinho.
          </p>
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-muted-foreground">
              A inteligência artificial não criou esses padrões.
            </p>
            <p className="text-xl md:text-3xl font-display text-cyan glow-cyan">
              Ela apenas tornou possível enxergá-los em uma escala inédita.
            </p>
          </div>
          <motion.p
            className="text-2xl md:text-4xl font-display text-foreground leading-tight max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Se conseguimos reconhecer os padrões que antecederam algumas das maiores decisões
            da História... podemos reconhecê-los antes que uma nova decisão seja tomada?
          </motion.p>
        </AnimatedSection>

        {/* O PERIGO */}
        <AnimatedSection className="text-center space-y-10">
          <p className="text-xl md:text-2xl text-muted-foreground">
            Mas existe uma pergunta ainda mais assustadora.
          </p>
          <div className="space-y-6">
            <motion.p
              className="text-2xl md:text-4xl font-display text-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Se os padrões podem ser identificados... eles também podem ser previstos?
            </motion.p>
            <motion.p
              className="text-2xl md:text-4xl font-display text-destructive/90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              E se podem ser previstos... podem ser influenciados?
            </motion.p>
          </div>
          <div className="space-y-4 pt-6 text-lg md:text-2xl text-muted-foreground">
            <p>Talvez o maior segredo da humanidade nunca tenha sido descobrir por que o passado aconteceu.</p>
            <p className="text-gold">Talvez seja descobrir o que está prestes a acontecer.</p>
          </div>
        </AnimatedSection>

        {/* A FRASE DE IMPACTO */}
        <AnimatedSection className="text-center py-20 space-y-8">
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            O verdadeiro segredo nunca foi sobre eles.
          </motion.p>

          <motion.p
            className="text-5xl md:text-7xl font-display text-gold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Foi sobre nós.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Sobre aquilo que fazemos quando acreditamos estar escolhendo livremente.
          </motion.p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SynopsisSection;
