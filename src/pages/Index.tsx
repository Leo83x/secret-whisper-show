import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import SynopsisSection from "@/components/SynopsisSection";
import BookRevealSection from "@/components/BookRevealSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        <HeroSection />
        <SynopsisSection />
        <BookRevealSection />
        <FooterSection />
      </div>
    </main>
  );
};

export default Index;
