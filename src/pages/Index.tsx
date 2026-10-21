import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import SynopsisSection from "@/components/SynopsisSection";
import BookRevealSection from "@/components/BookRevealSection";
import FooterSection from "@/components/FooterSection";
import BackgroundMusic from "@/components/BackgroundMusic";
import IntroBridgeSection from "@/components/IntroBridgeSection";
import { RegistrationModal } from "@/components/RegistrationModal";

const Index = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticleBackground />
      <BackgroundMusic />

      <div className="relative z-10">
        <IntroBridgeSection />
        <HeroSection onOpenRegister={() => setIsRegisterOpen(true)} />
        <SynopsisSection onOpenRegister={() => setIsRegisterOpen(true)} />
        <BookRevealSection onOpenRegister={() => setIsRegisterOpen(true)} />
        <FooterSection />
      </div>

      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </main>
  );
};

export default Index;
