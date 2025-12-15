import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PreLaunchForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Reserva confirmada!",
      description: "Sua cópia está reservada. Entraremos em contato em breve!",
    });
  };

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="text-center mb-12">
          <motion.p
            className="text-sm tracking-[0.3em] uppercase text-cyan mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Reserve sua cópia
          </motion.p>
          <motion.h2
            className="font-display text-3xl md:text-5xl text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Garanta seu{" "}
            <span className="text-gradient-gold">exemplar</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Reserve agora e seja um dos primeiros a desvendar os segredos que moldaram 
            reis, gênios e visionários ao longo da história.
          </motion.p>
        </div>

        {!isSubmitted ? (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-6 py-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gold/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor email"
                  required
                  className="w-full px-6 py-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gold/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-background font-display text-lg tracking-wider rounded-xl flex items-center justify-center gap-3 mx-auto disabled:opacity-70"
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(201, 169, 98, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
              <>
                <Send className="w-5 h-5" />
                Reservar Meu Livro
              </>
              )}
            </motion.button>

            <p className="text-center text-sm text-muted-foreground">
              Ao reservar, você garante prioridade na aquisição do livro assim que for lançado.
            </p>
          </motion.form>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-10 h-10 text-gold" />
            </motion.div>
            <h3 className="font-display text-2xl text-foreground mb-4">
              Reserva Confirmada!
            </h3>
            <p className="text-muted-foreground">
              Seu exemplar está reservado. Você receberá um email com os próximos passos para aquisição.
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default PreLaunchForm;
