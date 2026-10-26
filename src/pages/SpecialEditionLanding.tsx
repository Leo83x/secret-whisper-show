import ParticleBackground from "@/components/ParticleBackground";
import FooterSection from "@/components/FooterSection";

import { SpecialHeroSection } from "@/components/special/SpecialHeroSection";
import { SpecialPlotManifestoSection } from "@/components/special/SpecialPlotManifestoSection";
import { SpecialReaderShowcaseSection } from "@/components/special/SpecialReaderShowcaseSection";
import { SpecialDossiersSection } from "@/components/special/SpecialDossiersSection";
import { SpecialSocialProofSection } from "@/components/special/SpecialSocialProofSection";
import { SpecialCheckoutSection } from "@/components/special/SpecialCheckoutSection";
import { SpecialStickyCta } from "@/components/special/SpecialStickyCta";
import { SpecialAmbientAudio } from "@/components/special/SpecialAmbientAudio";

export const triggerInitiateCheckoutOnce = () => {
  if (typeof window !== "undefined" && !(window as any).__ush_ic_fired) {
    (window as any).__ush_ic_fired = true;
    if (typeof (window as any).fbq === "function") {
      try {
        (window as any).fbq("track", "InitiateCheckout", {
          content_name: "Edicao Especial - Inicio de Finalizacao",
          currency: "BRL",
          value: 29.90
        });
      } catch (e) {}
    }
  }
};

const SpecialEditionLanding = () => {
  const scrollToCheckout = () => {
    triggerInitiateCheckoutOnce();
    const el = document.getElementById("checkout-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSimulator = () => {
    const el = document.getElementById("reader-simulator-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticleBackground />
      <SpecialAmbientAudio />

      <div className="relative z-10">
        <SpecialHeroSection
          onCtaClick={scrollToCheckout}
          onReadSampleClick={scrollToSimulator}
        />
        <SpecialPlotManifestoSection />
        <SpecialReaderShowcaseSection onCtaClick={scrollToCheckout} />
        <SpecialDossiersSection />
        <SpecialSocialProofSection />
        <SpecialCheckoutSection />
        <FooterSection />
      </div>

      <SpecialStickyCta onCtaClick={scrollToCheckout} />
    </main>
  );
};

export default SpecialEditionLanding;
