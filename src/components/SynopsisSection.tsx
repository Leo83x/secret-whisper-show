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
import mandela from "@/assets/characters/mandela.png";
import jobs from "@/assets/characters/jobs.png";
import musk from "@/assets/characters/musk.png";

const characters = [
  { name: "Salomão", image: salomao, era: "970 a.C." },
  { name: "Alexandre", image: alexandre, era: "356 a.C." },
  { name: "Júlio César", image: julioCesar, era: "100 a.C." },
  { name: "Cleópatra", image: cleopatra, era: "69 a.C." },
  { name: "Joana d'Arc", image: joanaDarc, era: "1412" },
  { name: "Da Vinci", image: daVinci, era: "1452" },
  { name: "Napoleão", image: napoleao, era: "1769" },
  { name: "Mandela", image: mandela, era: "1918" },
  { name: "Jobs", image: jobs, era: "1955" },
  { name: "Musk", image: musk, era: "1971" },
];

const CharacterCard = ({ name, image, era, index }: { name: string; image: string; era: string; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: 0.15 * index,
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
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          {/* Overlay */}
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
        {/* Opening */}
        <AnimatedSection className="text-center">
          <p className="text-2xl md:text-4xl font-display text-foreground/90 leading-relaxed">
            <KineticText variant="blur" delay={0.2}>
              Durante milênios, os grandes acontecimentos da história foram contados sob a ótica do poder, da fé, das guerras e das conquistas.
            </KineticText>
          </p>
        </AnimatedSection>

        {/* The Question */}
        <AnimatedSection className="text-center">
          <p className="text-xl md:text-3xl text-muted-foreground italic leading-relaxed mb-8">
            <KineticText variant="fade">
              Mas o que nunca foi revelado é que
            </KineticText>
          </p>
          <motion.p
            className="text-4xl md:text-6xl font-display text-gold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            existe um código oculto.
          </motion.p>
        </AnimatedSection>

        {/* Historical figures with images */}
        <AnimatedSection>
          <div className="space-y-10 text-center">
            <p className="text-lg md:text-xl text-muted-foreground">
              <KineticText variant="slide">
                Séculos separam estas mentes. Mas um segredo as une.
              </KineticText>
            </p>

            {/* Character grid with images */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
              {characters.map((char, i) => (
                <CharacterCard key={char.name} {...char} index={i} />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* What they sought */}
        <AnimatedSection className="text-center space-y-10">
          <motion.p
            className="text-2xl md:text-3xl text-muted-foreground"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Uma <span className="text-gold font-display">Sociedade Silenciosa</span> decifrou esse código.
          </motion.p>

          <motion.p
            className="text-4xl md:text-6xl font-display text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Eles encontraram <span className="text-gold">padrões</span>.
          </motion.p>

          <div className="space-y-6 pt-10">
            {["Padrões de comportamento.", "Padrões psicológicos.", "Padrões invisíveis."].map((text, i) => (
              <motion.p
                key={i}
                className="text-xl md:text-2xl text-cyan glow-cyan font-light"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.2 }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </AnimatedSection>

        {/* The patterns */}
        <AnimatedSection className="bg-secondary/30 rounded-3xl p-10 md:p-16 border border-gold/10 relative overflow-visible">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan/10 rounded-full blur-3xl" />

          <div className="relative text-lg md:text-2xl text-foreground/80 leading-relaxed text-center italic space-y-4">
            <p><KineticText variant="fade">A mesma ambição que moveu Alexandre.</KineticText></p>
            <p><KineticText variant="fade" delay={0.2}>O mesmo conflito moral que atormentou Salomão.</KineticText></p>
            <p><KineticText variant="fade" delay={0.4}>O mesmo perfeccionismo que consumiu Jobs.</KineticText></p>
            <p><KineticText variant="fade" delay={0.6}>A mesma ruptura que define Musk.</KineticText></p>
          </div>
        </AnimatedSection>

        {/* The threat */}
        <AnimatedSection className="text-center space-y-10">
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Com o avanço da inteligência artificial e da capacidade de decifrar padrões em escala inédita,
          </motion.p>

          <motion.p
            className="text-2xl md:text-4xl font-display text-foreground leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            os segredos estão prestes a ser revelados —
            <span className="block mt-4 text-destructive/90">não como sabedoria, mas como ameaça.</span>
          </motion.p>
        </AnimatedSection>

        {/* The truth - FIXED SPACING */}
        <AnimatedSection className="text-center py-20">
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Porque o verdadeiro segredo nunca foi sobre eles.
          </motion.p>

          <motion.p
            className="text-5xl md:text-7xl font-display text-gold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Sempre foi sobre nós.
          </motion.p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SynopsisSection;
