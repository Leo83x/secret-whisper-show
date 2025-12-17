import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import SynopsisSection from "@/components/SynopsisSection";
import BookRevealSection from "@/components/BookRevealSection";
import PreLaunchForm from "@/components/PreLaunchForm";
import FooterSection from "@/components/FooterSection";
import BackgroundMusic from "@/components/BackgroundMusic";
import IntroBridgeSection from "@/components/IntroBridgeSection";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden overflow-y-auto">
      <ParticleBackground />
      <BackgroundMusic />

      <div className="relative z-10">
        <IntroBridgeSection />
        <HeroSection />
        <SynopsisSection />
        <BookRevealSection />
        <PreLaunchForm />
        <FooterSection />
      </div>
    </main>
  );
};

export default Index;
