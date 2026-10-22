import ParticleBackground from "@/components/ParticleBackground";
import BackgroundMusic from "@/components/BackgroundMusic";
import FooterSection from "@/components/FooterSection";

import { SpecialHeroSection } from "@/components/special/SpecialHeroSection";
import { SpecialPlotManifestoSection } from "@/components/special/SpecialPlotManifestoSection";
import { SpecialReaderShowcaseSection } from "@/components/special/SpecialReaderShowcaseSection";
import { SpecialVisualArchiveSection } from "@/components/special/SpecialVisualArchiveSection";
import { SpecialDossiersSection } from "@/components/special/SpecialDossiersSection";
import { SpecialCheckoutSection } from "@/components/special/SpecialCheckoutSection";

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
      <BackgroundMusic />

      <div className="relative z-10">
        <SpecialHeroSection onCtaClick={scrollToCheckout} />
        <SpecialPlotManifestoSection />
        <SpecialReaderShowcaseSection />
        <SpecialVisualArchiveSection />
        <SpecialDossiersSection />
        <SpecialCheckoutSection />
        <FooterSection />
      </div>
    </main>
  );
};

export default SpecialEditionLanding;
