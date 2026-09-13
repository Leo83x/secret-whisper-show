import { motion } from "framer-motion";

const IntroBridgeSection = () => {
    const texts = [
        "Por milênios, alguém observou as grandes decisões históricas.",
        "Uma verdade permaneceu escondida entre guerras, impérios, descobertas, revoluções e quedas.",
        "Até agora."
    ];

    return (
        <section className="relative flex flex-col bg-background">
            {/* Background elements - fixed to viewport to maintain atmosphere */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-background" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
            </div>

            {/* Content Blocks - Z-10 to sit above background */}
            <div className="relative z-10 w-full">
                {texts.map((text, i) => (
                    <motion.div
                        key={i}
                        className="min-h-[100dvh] w-full flex items-center justify-center p-6 snap-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        viewport={{ amount: 0.3, margin: "0px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="max-w-4xl text-2xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold/50 via-gold to-gold/50 text-center tracking-wide leading-tight">
                            {text}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Scroll indicator - Visible on first screen only */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-20 flex flex-col justify-end pb-24 items-center">
                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0, duration: 1 }}
                >
                    <span className="font-sans text-gold/80 text-sm tracking-[0.2em] font-light uppercase animate-pulse">
                        Role para descobrir
                    </span>
                </motion.div>
            </div>
        </section>
    );
};

export default IntroBridgeSection;
