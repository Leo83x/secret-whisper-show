import ParticleBackground from "@/components/ParticleBackground";
import FooterSection from "@/components/FooterSection";

import { SpecialHeroSection } from "@/components/special/SpecialHeroSection";
import { SpecialPlotManifestoSection } from "@/components/special/SpecialPlotManifestoSection";
import { SpecialReaderShowcaseSection } from "@/components/special/SpecialReaderShowcaseSection";
import { SpecialVisualArchiveSection } from "@/components/special/SpecialVisualArchiveSection";
import { SpecialDossiersSection } from "@/components/special/SpecialDossiersSection";
import { SpecialSocialProofSection } from "@/components/special/SpecialSocialProofSection";
import { SpecialCheckoutSection } from "@/components/special/SpecialCheckoutSection";
import { SpecialStickyCta } from "@/components/special/SpecialStickyCta";
import { SpecialAmbientAudio } from "@/components/special/SpecialAmbientAudio";

const SpecialEditionLanding = () => {
  const scrollToCheckout = () => {
    const el = document.getElementById("checkout-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticleBackground />
      <SpecialAmbientAudio />

      <div className="relative z-10">
        <SpecialHeroSection onCtaClick={scrollToCheckout} />
        <SpecialPlotManifestoSection />
        <SpecialReaderShowcaseSection onCtaClick={scrollToCheckout} />
        <SpecialVisualArchiveSection />
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
