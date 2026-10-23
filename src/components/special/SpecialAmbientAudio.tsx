import { useState, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export const SpecialAmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = "XYKUeZQbMF0"; // Trilha épica cinematográfica
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&enablejsapi=1&playsinline=1`;

  const command = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  };

  const toggleMusic = () => {
    if (isPlaying) {
      command("mute");
      command("pauseVideo");
      setIsPlaying(false);
    } else {
      command("unMute");
      command("playVideo");
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden YouTube player */}
      <div
        aria-hidden
        className="fixed -z-50 opacity-0 pointer-events-none w-px h-px overflow-hidden"
      >
        <iframe
          ref={iframeRef}
          width="560"
          height="315"
          src={embedUrl}
          title="Trilha sonora de imersão"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Floating Pill Button no canto superior direito ou inferior direito */}
      <div className="fixed top-5 right-5 z-40 hidden sm:block animate-in fade-in">
        <button
          type="button"
          onClick={toggleMusic}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono tracking-wider transition-all duration-300 shadow-xl cursor-pointer ${
            isPlaying
              ? "bg-[#0b172a]/95 border-emerald-400/60 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-pulse"
              : "bg-[#070c18]/80 backdrop-blur-md border-gold/30 text-gold hover:border-gold hover:bg-[#0b1222]"
          }`}
          title={isPlaying ? "Pausar trilha de imersão" : "Ativar trilha de imersão cinematográfica"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>TRILHA ATIVA</span>
            </>
          ) : (
            <>
              <Music className="w-4 h-4 text-gold" />
              <span>🔊 ATIVAR TRILHA DE IMERSÃO</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
