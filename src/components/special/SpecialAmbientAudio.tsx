import { useState, useRef, useEffect } from "react";
import { Volume2, Music } from "lucide-react";

export const SpecialAmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = "XYKUeZQbMF0";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&enablejsapi=1&playsinline=1`;

  const command = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  };

  const toggleMusic = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      command("pauseVideo");
      setIsPlaying(false);
    } else {
      command("playVideo");
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const checkModal = () => {
      if (typeof document === "undefined") return;
      const modalOpen = 
        document.body.getAttribute("data-reader-modal") === "true" ||
        document.body.style.overflow === "hidden";
      setIsModalOpen(modalOpen);
    };

    window.addEventListener("readerModalChange", checkModal);
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-reader-modal", "style"] });

    return () => {
      window.removeEventListener("readerModalChange", checkModal);
      observer.disconnect();
    };
  }, []);

  // Se o leitor estiver aberto, esconde o botão para não sobrepor o botão Fechar
  if (isModalOpen) return null;

  return (
    <>
      {/* YouTube player ONLY mounted on explicit user click - ZERO initial network overhead */}
      {hasStarted && (
        <div
          aria-hidden
          className="fixed -z-50 opacity-0 pointer-events-none w-px h-px overflow-hidden"
        >
          <iframe
            ref={iframeRef}
            width="560"
            height="315"
            src={embedUrl}
            title="Trilha sonora"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {/* Botão flutuante compacto e discreto no topo */}
      <div className="fixed top-4 right-4 z-30 hidden sm:block animate-in fade-in">
        <button
          type="button"
          onClick={toggleMusic}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider transition-colors duration-200 shadow-lg cursor-pointer ${
            isPlaying
              ? "bg-[#0b172a]/95 border-emerald-400/60 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
              : "bg-[#070c18]/85 backdrop-blur-md border-gold/30 text-gold hover:border-gold hover:bg-[#0b1222]"
          }`}
          title={isPlaying ? "Pausar trilha sonora" : "Ativar trilha sonora"}
        >
          {isPlaying ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRILHA ATIVA</span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5 text-gold" />
              <span>🔊 ATIVAR TRILHA</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
