import { motion } from "framer-motion";

const IntroBridgeSection = () => {
    const texts = [
        "Nas sombras da história...",
        "Uma verdade aguarda...",
        "O momento chegou."
    ];

    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-background z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-[120px]">
                {texts.map((text, i) => (
                    <motion.p
                        key={i}
                        className="text-2xl md:text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold/50 via-gold to-gold/50 text-center tracking-widest absolute"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                        animate={{
                            opacity: [0, 0, 1, 1, 0],
                            scale: [0.95, 0.95, 1, 1, 1.02],
                            filter: ["blur(8px)", "blur(8px)", "blur(0px)", "blur(0px)", "blur(4px)"]
                        }}
                        transition={{
                            duration: 4,
                            times: [0, 0.1, 0.25, 0.85, 1],
                            delay: 1 + (i * 4.5),
                            ease: "easeInOut"
                        }}
                    >
                        {text}
                    </motion.p>
                ))}
            </div>

            {/* Scroll indicator - appears after text sequence */}
            <motion.div
                className="absolute bottom-32 md:bottom-24 flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 15, duration: 1.5 }}
            >
                <span className="text-gold/70 text-base md:text-lg tracking-widest font-sans uppercase">
                    Deslize para baixo
                </span>
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold">
                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default IntroBridgeSection;
