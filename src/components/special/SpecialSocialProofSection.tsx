import { motion } from "framer-motion";
import { Star, Quote, BookOpen, CheckCircle } from "lucide-react";

export const SpecialSocialProofSection = () => {
  const testimonials = [
    {
      name: "Marcus V.",
      role: "Leitor Beta",
      text: "Achei sensacional poder aumentar o tamanho da fonte e colocar no modo escuro pra ler na cama. Muito melhor do que ficar brigando com PDF que desconfigura no celular.",
      rating: 5
    },
    {
      name: "Helena R.",
      role: "Leitora Beta",
      text: "Fiquei tão intrigada com a conexão entre o César e a Faria Lima que fechei o capítulo e fui direto pro Google pesquisar se aquilo era real. A história te pega muito rápido.",
      rating: 5
    },
    {
      name: "Rodrigo M.",
      role: "Leitor Beta",
      text: "Abri pra ver como era e quando percebi já tinha devorado vários capítulos direto no celular. O leitor salva a linha onde parei na hora, é muito prático.",
      rating: 5
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-visible bg-[#060b17]/60 border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-14">
        
        {/* Cabeçalho com Contador ao Vivo */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Badge Pulsante de Leitores Ativos */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>64 LEITORES DESBLOQUEARAM O ACESSO ESTA SEMANA</span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            O que estão achando da experiência
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Mensagens reais e diretas de quem já testou a história e o leitor digital no celular:
          </p>
        </div>

        {/* Grade de 3 Depoimentos Informais e Curtos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.name}
              className="p-6 rounded-2xl bg-[#0b1325] border border-gold/25 hover:border-gold/50 transition-all duration-300 space-y-4 relative flex flex-col justify-between shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-slate-600" />
                </div>

                <p className="text-sm text-slate-100 font-sans font-normal leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </h5>
                  <span className="text-[11px] font-mono text-slate-400 block">{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Amostra da Escrita com Quebra de Linha Suave */}
        <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0c1424] via-[#111c33] to-[#0c1424] border border-gold/40 shadow-2xl relative overflow-hidden text-center space-y-5">
          <div className="flex items-center justify-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
            <BookOpen className="w-4 h-4 text-gold" />
            <span>AMOSTRA DE ESCRITA // PRÓLOGO OFICIAL</span>
          </div>

          <blockquote className="max-w-3xl mx-auto font-sans text-base sm:text-lg md:text-xl text-slate-100 font-medium leading-relaxed tracking-normal space-y-3">
            <p>
              "A humanidade sempre precisou acreditar no caos. Talvez porque o acaso seja a única explicação que nos isenta de culpa."
            </p>
            <p>
              "Mas quando os mesmos erros e os mesmos medos se repetem a cada três séculos com precisão matemática, o acaso deixa de ser acidente — <span className="text-gold font-bold">e passa a ser uma assinatura</span>."
            </p>
          </blockquote>

          <span className="text-xs font-mono text-slate-400 font-medium block pt-2">
            — Trecho de <em>O Observador</em>, Prólogo de <strong>O Último Segredo da Humanidade</strong>
          </span>
        </div>

      </div>
    </section>
  );
};
