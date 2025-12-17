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
                className="absolute bottom-10 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 15, duration: 2 }}
            >
                <span className="text-muted-foreground/60 text-sm tracking-[0.2em] font-light uppercase">
                    Role para descobrir
                </span>
                <motion.div
                    className="w-0.5 h-16 bg-gradient-to-b from-transparent via-gold/50 to-transparent"
                    animate={{ height: ["0%", "100%", "0%"], top: ["0%", "50%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold/50">
                        <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default IntroBridgeSection;
