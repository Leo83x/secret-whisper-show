import AnimatedSection from "./AnimatedSection";
import KineticText from "./KineticText";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const characters = [
  { name: "Salomão", image: "https://upload.wikimedia.org/wikipedia/commons/5/51/King_Solomon_in_Old_Age_%281Kings_4%29.jpg", era: "970 a.C." },
  { name: "Alexandre", image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Alexander_the_Great_mosaic_%28cropped%29.jpg", era: "356 a.C." },
  { name: "Cleópatra", image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Cleopatra_-_John_William_Waterhouse.jpg", era: "69 a.C." },
  { name: "Joana d'Arc", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Joan_of_Arc_miniature_graded.jpg", era: "1412" },
  { name: "Da Vinci", image: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Leonardo_self.jpg", era: "1452" },
  { name: "Júlio César", image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Bust_of_Julius_Caesar_from_History_of_the_World_%281902%29.png", era: "100 a.C." },
  { name: "Napoleão", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg", era: "1769" },
  { name: "Mandela", image: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nelson_Mandela_1994.jpg", era: "1918" },
  { name: "Jobs", image: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg", era: "1955" },
  { name: "Musk", image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg", era: "1971" },
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
        className="relative w-20 h-20 md:w-24 md:h-24 mb-3"
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
              Mas o que nunca foi revelado é
            </KineticText>
          </p>
          <motion.p 
            className="text-4xl md:text-6xl font-display text-gradient-gold glow-gold"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            quem observava
          </motion.p>
        </AnimatedSection>

        {/* Historical figures with images */}
        <AnimatedSection>
          <div className="space-y-10 text-center">
            <p className="text-lg md:text-xl text-muted-foreground">
              <KineticText variant="slide">
                Desde os tempos de Salomão, passando por
              </KineticText>
            </p>
            
            {/* Character grid with images */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6 md:gap-8 justify-items-center">
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
            Eles não buscavam poder.
          </motion.p>
          
          <motion.p 
            className="text-4xl md:text-6xl font-display text-foreground"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(15px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Buscavam <span className="text-gradient-gold glow-gold">padrões</span>.
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
        <AnimatedSection className="bg-secondary/30 rounded-3xl p-10 md:p-16 border border-gold/10 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan/10 rounded-full blur-3xl" />
          
          <p className="relative text-lg md:text-2xl text-foreground/80 leading-relaxed text-center italic">
            <KineticText variant="fade">
              A mesma ambição que moveu Alexandre. O mesmo conflito moral que atormentou Salomão. O mesmo perfeccionismo que consumiu Jobs. A mesma ruptura que define Musk.
            </KineticText>
          </p>
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
            className="text-5xl md:text-7xl font-display text-gradient-gold glow-gold"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Sempre foi sobre nós.
          </motion.p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SynopsisSection;
