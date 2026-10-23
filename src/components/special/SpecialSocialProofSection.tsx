import { motion } from "framer-motion";
import { Star, Quote, BookOpen, CheckCircle } from "lucide-react";

export const SpecialSocialProofSection = () => {
  const testimonials = [
    {
      name: "Marcus V.",
      role: "Auditor de Risco & Leitor Beta",
      text: "Comecei achando que seria só mais um suspense financeiro, mas quando o capítulo de César no Rubicão conectou com a tela de risco do Caio, li até as 2 da manhã direto pelo celular. O modo escuro do leitor é perfeito.",
      rating: 5
    },
    {
      name: "Helena R.",
      role: "Engenheira de Sistemas & Leitora Beta",
      text: "A transição entre a Faria Lima e os bastidores de Turing em Bletchley Park é genial. A sensação de folhear os dossiês e ver os documentos históricos direto no app é outro nível de imersão literária.",
      rating: 5
    },
    {
      name: "Rodrigo M.",
      role: "Analista de Mercado & Transmissor da Corrente",
      text: "Paguei no PIX e em menos de 5 segundos o leitor abriu no celular sem precisar baixar nada em lojas de app. A profundidade histórica te faz questionar qualquer notícia política no dia seguinte.",
      rating: 5
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-visible bg-[#060b17]/60 border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Cabeçalho com Contador ao Vivo */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          
          {/* Badge Pulsante de Leitores Ativos */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>64 LEITORES DESBLOQUEARAM O ACESSO ESTA SEMANA</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Primeiras reações de quem já mergulhou no padrão.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Sem filtros e sem clichês. Veja como a experiência no e-reader nativo prendeu a atenção dos primeiros leitores beta:
          </p>
        </div>

        {/* Grade de 3 Depoimentos de Leitores Beta */}
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
                  <Quote className="w-5 h-5 text-slate-600" />
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

        {/* Amostra da Escrita (Box de Citação Cinematográfica - Fonte Sans Clara) */}
        <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0c1424] via-[#111c33] to-[#0c1424] border border-gold/40 shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gold font-mono text-xs uppercase tracking-widest font-bold">
            <BookOpen className="w-4 h-4 text-gold" />
            <span>AMOSTRA DE ESCRITA // PRÓLOGO OFICIAL</span>
          </div>

          <blockquote className="max-w-3xl mx-auto font-sans text-base sm:text-lg md:text-xl text-slate-100 font-medium leading-relaxed tracking-normal">
            "A humanidade sempre precisou acreditar no caos. Talvez porque o acaso seja a única explicação que nos isenta de culpa. Mas quando os mesmos erros e os mesmos medos se repetem a cada três séculos com precisão matemática, o acaso deixa de ser acidente — e passa a ser uma assinatura."
          </blockquote>

          <span className="text-xs font-mono text-gold/90 font-medium block pt-1">
            — Trecho de <em>O Observador</em>, Abertura de <strong>O Último Segredo da Humanidade</strong>
          </span>
        </div>

      </div>
    </section>
  );
};
