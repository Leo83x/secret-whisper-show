import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const IntroBridgeSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const texts = [
        "Nas sombras da história...",
        "Uma verdade aguarda...",
        "O momento chegou."
    ];

    // Map scroll progress to opacity for each text
    // 0-33%: Text 1
    // 33-66%: Text 2
    // 66-90%: Text 3
    // 90-100%: Fade out all

    // Helper to create fade in/out transform
    // Optimized ranges to cover the full scroll height without empty spaces
    const useTextOpacity = (index: number) => {
        // Divide scroll into 3 segments with slight overlap
        const segmentDuration = 1 / texts.length; // 0.33
        const start = index * segmentDuration;
        const end = start + segmentDuration;

        // Overlap factor to ensure seamless transition
        const overlap = 0.05;

        // Ranges:
        // Text 0: 0.00 -> 0.33 (Fade IN: 0-0.1, Stay: 0.1-0.28, Fade OUT: 0.28-0.38)
        // Text 1: 0.33 -> 0.66 (Fade IN: 0.28-0.38, ...)

        const fadeInStart = start;
        const fadeInEnd = start + 0.1;
        const fadeOutStart = end - 0.05;
        const fadeOutEnd = end + 0.05;

        return useTransform(
            scrollYProgress,
            [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
            [0, 1, 1, 0]
        );
    };

    return (
        <section ref={containerRef} className="relative h-[250vh]">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-background z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center justify-center min-h-[120px] w-full max-w-4xl px-4">
                    {texts.map((text, i) => (
                        <motion.p
                            key={i}
                            style={{ opacity: useTextOpacity(i) }}
                            className="text-2xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold/50 via-gold to-gold/50 text-center tracking-widest absolute leading-tight"
                        >
                            {text}
                        </motion.p>
                    ))}
                </div>

                {/* Persistent Scroll indicator - fades out at the very end */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0.8, 0.9], [1, 0]) }}
                    className="absolute bottom-10 flex flex-col items-center gap-3"
                >
                    <span className="text-gold/50 text-sm tracking-[0.2em] font-light uppercase">
                        Continue descendo
                    </span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold/50">
                            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default IntroBridgeSection;
