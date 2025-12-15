import AnimatedSection from "./AnimatedSection";
import KineticText from "./KineticText";

const SynopsisSection = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto space-y-32">
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
          <p className="text-3xl md:text-5xl font-display text-gradient-gold glow-gold">
            <KineticText variant="scale" delay={0.5}>
              quem observava
            </KineticText>
          </p>
        </AnimatedSection>

        {/* Historical figures */}
        <AnimatedSection>
          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl text-muted-foreground">
              <KineticText variant="slide">
                Desde os tempos de Salomão, passando por
              </KineticText>
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {["Alexandre", "Cleópatra", "Da Vinci", "Napoleão", "Mandela", "Jobs", "Musk"].map((name, i) => (
                <AnimatedSection key={name} delay={0.2 + i * 0.15}>
                  <span className="px-4 py-2 border border-gold/30 rounded-full text-gold text-sm md:text-base font-display tracking-wider hover:bg-gold/10 transition-colors duration-300">
                    {name}
                  </span>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* What they sought */}
        <AnimatedSection className="text-center space-y-8">
          <p className="text-xl md:text-2xl text-muted-foreground">
            <KineticText variant="fade">
              Eles não buscavam poder.
            </KineticText>
          </p>
          <p className="text-3xl md:text-5xl font-display text-foreground">
            <KineticText variant="blur" delay={0.3}>
              Buscavam padrões.
            </KineticText>
          </p>
          <div className="space-y-4 pt-8">
            {["Padrões de comportamento.", "Padrões psicológicos.", "Padrões invisíveis."].map((text, i) => (
              <AnimatedSection key={i} delay={0.5 + i * 0.2}>
                <p className="text-lg md:text-xl text-cyan glow-cyan font-light">
                  {text}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* The patterns */}
        <AnimatedSection className="bg-secondary/30 rounded-2xl p-8 md:p-12 border border-gold/10">
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed text-center">
            <KineticText variant="fade">
              A mesma ambição que moveu Alexandre. O mesmo conflito moral que atormentou Salomão. O mesmo perfeccionismo que consumiu Jobs. A mesma ruptura que define Musk.
            </KineticText>
          </p>
        </AnimatedSection>

        {/* The threat */}
        <AnimatedSection className="text-center space-y-8">
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            <KineticText variant="slide">
              Com o avanço da inteligência artificial e da capacidade de decifrar padrões em escala inédita,
            </KineticText>
          </p>
          <p className="text-2xl md:text-4xl font-display text-foreground leading-tight">
            <KineticText variant="scale" delay={0.3}>
              os segredos estão prestes a ser revelados — não como sabedoria, mas como ameaça.
            </KineticText>
          </p>
        </AnimatedSection>

        {/* The truth */}
        <AnimatedSection className="text-center py-16">
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            <KineticText variant="fade">
              Porque o verdadeiro segredo nunca foi sobre eles.
            </KineticText>
          </p>
          <p className="text-4xl md:text-6xl font-display text-gradient-gold glow-gold">
            <KineticText variant="scale" delay={0.4} splitBy="chars">
              Sempre foi sobre nós.
            </KineticText>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SynopsisSection;
