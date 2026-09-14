import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import bookCover from "@/assets/book-cover.png";

const BookRevealSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-visible touch-pan-y">
      {/* Glow effect behind book */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl opacity-50" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Book Image */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-background/80 blur-xl rounded-full" />
              <img
                src={bookCover}
                alt="O Último Segredo da Humanidade - Capa do livro"
                className="relative z-10 w-full h-auto rounded-lg shadow-2xl"
                style={{ boxShadow: "0 25px 80px rgba(201, 169, 98, 0.3), 0 10px 30px rgba(0, 0, 0, 0.5)" }}
              />
            </div>
          </motion.div>

          {/* CTA Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="font-sans text-sm tracking-widest uppercase text-gold mb-4">
              O livro
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 leading-tight">
              O Último Segredo da <span className="text-gradient-gold">Humanidade</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-lg">
              Uma investigação sobre os padrões ocultos por trás das grandes decisões da
              História — e sobre o que acontece quando esses padrões deixam de pertencer
              apenas ao passado.
            </p>
            <div className="text-muted-foreground/90 mb-10 space-y-1">
              <p>Uma história sobre poder.</p>
              <p>Comportamento.</p>
              <p>Escolhas.</p>
              <p>E o futuro.</p>
            </div>

            <motion.a
              href="#reserva"
              className="group relative inline-block px-8 py-4 bg-gold text-background font-display text-lg tracking-wider rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg"
              style={{ boxShadow: "0 0 30px rgba(201, 169, 98, 0.3)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Conheça o livro</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookRevealSection;
