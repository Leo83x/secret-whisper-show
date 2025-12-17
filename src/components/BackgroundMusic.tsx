import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  // "Heart of Courage" by Two Steps From Hell (Epic Cinematic)
  // URL: https://www.youtube.com/watch?v=XYKUeZQbMF0
  // Embed URL needs: autoplay=1&loop=1&playlist=VIDEO_ID (for looping)
  const videoId = "XYKUeZQbMF0";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0`;

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    setShowPrompt(false);
  };

  return (
    <>
      {/* 
        Hidden YouTube Iframe 
        We render it only when isPlaying is true.
        This automatically starts playback (autoplay=1) when mounted.
        Unmounting stops it.
      */}
      {isPlaying && (
        <div className="hidden">
          <iframe
            width="560"
            height="315"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Initial prompt to enable sound */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.div
              className="text-center p-8 max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold/50 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(201, 169, 98, 0.2)",
                    "0 0 40px rgba(201, 169, 98, 0.4)",
                    "0 0 20px rgba(201, 169, 98, 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Volume2 className="w-10 h-10 text-gold" />
              </motion.div>

              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
                Experiência Épica
              </h2>
              <p className="text-muted-foreground mb-8">
                Para uma jornada cinematográfica através da história, recomendamos ativar a trilha sonora épica.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={toggleMusic}
                  className="px-8 py-3 bg-gold text-background font-display tracking-wider rounded-full"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(201, 169, 98, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ativar Som
                </motion.button>
                <motion.button
                  onClick={() => setShowPrompt(false)}
                  className="px-8 py-3 border border-muted-foreground/30 text-muted-foreground font-display tracking-wider rounded-full"
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continuar sem Som
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating music control */}
      {!showPrompt && (
        <motion.button
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-secondary/80 backdrop-blur border border-gold/30 flex items-center justify-center"
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(201, 169, 98, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-gold" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>
      )}
    </>
  );
};

export default BackgroundMusic;
